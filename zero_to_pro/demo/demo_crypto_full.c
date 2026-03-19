/*
 * demo_crypto_full.c — Référence IDA pour le cours 3 "Algorithmes Cryptographiques"
 *
 * Ce binaire contient une implémentation de chaque algorithme du cours.
 * Il est conçu pour être analysé dans IDA Pro — chaque pattern est visible.
 *
 * Compilation (MinGW) :
 *   gcc -O1 -s -o demo_crypto_full.exe demo_crypto_full.c -ladvapi32
 *
 * Algorithmes présents :
 *   1. RC4    — manuel : rc4_init_sbox / rc4_ksa / rc4_prga
 *   2. RC5    — manuel : rc5_key_expand / rc5_encrypt_block
 *   3. Salsa20 — manuel : salsa20_block (quarter-round ADD+XOR+ROT)
 *   4. AES-256 — WinCrypt : CALG_AES_256 = 0x6610
 *   5. 3DES   — WinCrypt : CALG_3DES    = 0x6603
 *   6. RSA-2048 — WinCrypt : AT_KEYEXCHANGE = 0x1
 *
 * Dans IDA, cherchez :
 *   - RC4  : boucle "mov byte [rbp+rax], al" × 256 + swap + XOR indirect
 *   - RC5  : constantes 0xB7E15163 (P32) et 0x9E3779B9 (Q32) + ROL/ROR
 *   - Salsa20 : constante "expand 32-byte k" dans Strings + séquence ADD/XOR/ROT
 *   - AES/3DES/RSA : onglet Imports → CryptDeriveKey, CryptGenKey, constantes ALG_ID
 */

#include <windows.h>
#include <wincrypt.h>
#include <stdio.h>
#include <string.h>
#include <stdint.h>

/* ================================================================
 * 1. RC4 — Implémentation manuelle
 *    3 fonctions distinctes → 3 entrées dans la liste Functions IDA
 * ================================================================ */

typedef struct {
    unsigned char S[256];  /* SBOX — 256 octets sur la pile */
    int i, j;
} RC4_CTX;

/* Étape 1 : Init SBOX — pattern : for(i=0;i<256;i++) S[i]=i */
void rc4_init_sbox(RC4_CTX *ctx) {
    for (int i = 0; i < 256; i++)
        ctx->S[i] = (unsigned char)i;
    ctx->i = ctx->j = 0;
}

/* Étape 2 : KSA — pattern : swap S[i] ↔ S[j], j dépend de la clé */
void rc4_ksa(RC4_CTX *ctx, const unsigned char *key, int keylen) {
    int j = 0;
    unsigned char tmp;
    for (int i = 0; i < 256; i++) {
        j = (j + ctx->S[i] + key[i % keylen]) & 0xFF;
        tmp       = ctx->S[i];
        ctx->S[i] = ctx->S[j];
        ctx->S[j] = tmp;
    }
}

/* Étape 3 : PRGA — pattern : double swap + XOR indirect S[(S[i]+S[j])&FF] */
void rc4_prga(RC4_CTX *ctx, unsigned char *data, int datalen) {
    int i = ctx->i, j = ctx->j;
    unsigned char tmp;
    for (int k = 0; k < datalen; k++) {
        i = (i + 1) & 0xFF;
        j = (j + ctx->S[i]) & 0xFF;
        tmp       = ctx->S[i];
        ctx->S[i] = ctx->S[j];
        ctx->S[j] = tmp;
        data[k]  ^= ctx->S[(ctx->S[i] + ctx->S[j]) & 0xFF];
    }
    ctx->i = i;
    ctx->j = j;
}

/* ================================================================
 * 2. RC5-32/12/16 — Implémentation manuelle
 *    Constantes visibles : P32 = 0xB7E15163, Q32 = 0x9E3779B9
 *    Pattern : rotations ROL/ROR intenses dans le key schedule
 * ================================================================ */

#define RC5_ROUNDS 12
#define RC5_SUBKEYS (2 * (RC5_ROUNDS + 1))  /* 26 sous-clés */
#define P32  0xB7E15163UL   /* (e  - 2) * 2^32 — constante visible dans .text */
#define Q32  0x9E3779B9UL   /* (phi-1) * 2^32 — aussi dans AES key schedule! */
#define ROL32(x,n) (((x) << ((n)&31)) | ((x) >> (32-((n)&31))))
#define ROR32(x,n) (((x) >> ((n)&31)) | ((x) << (32-((n)&31))))

typedef struct { uint32_t S[RC5_SUBKEYS]; } RC5_CTX;

/* Key expansion — génère les sous-clés à partir de la clé (16 octets = 4 mots) */
void rc5_key_expand(RC5_CTX *ctx, const uint8_t *key, int keylen) {
    uint32_t L[4] = {0};
    int u = (keylen + 3) / 4;
    for (int i = keylen - 1; i >= 0; i--)
        L[i / 4] = (L[i / 4] << 8) + key[i];

    ctx->S[0] = P32;
    for (int i = 1; i < RC5_SUBKEYS; i++)
        ctx->S[i] = ctx->S[i-1] + Q32;  /* initialisation linéaire avec Q32 */

    uint32_t A = 0, B = 0;
    int i = 0, j = 0;
    for (int k = 0; k < 3 * RC5_SUBKEYS; k++) {
        A = ctx->S[i] = ROL32(ctx->S[i] + A + B, 3);
        B = L[j]      = ROL32(L[j] + A + B, A + B);
        i = (i + 1) % RC5_SUBKEYS;
        j = (j + 1) % u;
    }
}

/* Chiffrement d'un bloc 64 bits (2 × uint32) */
void rc5_encrypt_block(RC5_CTX *ctx, uint32_t *A, uint32_t *B) {
    *A += ctx->S[0];
    *B += ctx->S[1];
    for (int i = 1; i <= RC5_ROUNDS; i++) {
        *A = ROL32(*A ^ *B, *B) + ctx->S[2*i];
        *B = ROL32(*B ^ *A, *A) + ctx->S[2*i + 1];
    }
}

/* Déchiffrement d'un bloc */
void rc5_decrypt_block(RC5_CTX *ctx, uint32_t *A, uint32_t *B) {
    for (int i = RC5_ROUNDS; i >= 1; i--) {
        *B = ROR32(*B - ctx->S[2*i+1], *A) ^ *A;
        *A = ROR32(*A - ctx->S[2*i],   *B) ^ *B;
    }
    *B -= ctx->S[1];
    *A -= ctx->S[0];
}

/* ================================================================
 * 3. Salsa20 — Implémentation manuelle
 *    Pattern visible dans IDA :
 *      - Constante "expand 32-byte k" dans Strings (positions 0,5,10,15)
 *      - Quarter-round : séquence ADD + XOR + ROT répétée 4× par round
 *      - État de 16 uint32 = 64 octets (bloc de keystream)
 * ================================================================ */

#define ROTL(v, n) (((v) << (n)) | ((v) >> (32-(n))))

/* Quarter-round Salsa20 — identifiable par la séquence ADD+XOR+ROT */
#define QR(a, b, c, d)          \
    b ^= ROTL(a + d,  7);       \
    c ^= ROTL(b + a,  9);       \
    d ^= ROTL(c + b, 13);       \
    a ^= ROTL(d + c, 18);

/* Génère un bloc de 64 octets de keystream */
void salsa20_block(uint32_t out[16], const uint32_t in[16]) {
    uint32_t x[16];
    for (int i = 0; i < 16; i++) x[i] = in[i];

    /* 10 double-rounds (= Salsa20/20) */
    for (int i = 0; i < 10; i++) {
        /* Colonnes */
        QR(x[ 0], x[ 4], x[ 8], x[12]);
        QR(x[ 5], x[ 9], x[13], x[ 1]);
        QR(x[10], x[14], x[ 2], x[ 6]);
        QR(x[15], x[ 3], x[ 7], x[11]);
        /* Lignes */
        QR(x[ 0], x[ 1], x[ 2], x[ 3]);
        QR(x[ 5], x[ 6], x[ 7], x[ 4]);
        QR(x[10], x[11], x[ 8], x[ 9]);
        QR(x[15], x[12], x[13], x[14]);
    }
    for (int i = 0; i < 16; i++) out[i] = x[i] + in[i];
}

/* Initialise l'état Salsa20 avec clé, nonce, et les constantes sigma */
void salsa20_init_state(uint32_t state[16], const uint8_t key[32],
                        const uint8_t nonce[8]) {
    /* "expand 32-byte k" — visible dans IDA Strings */
    state[ 0] = 0x61707865; /* "expa" */
    state[ 5] = 0x3320646e; /* "nd 3" */
    state[10] = 0x79622d32; /* "2-by" */
    state[15] = 0x6b206574; /* "te k" */

    /* Clé (256 bits = 8 mots de 32 bits) */
    for (int i = 0; i < 4; i++) {
        state[1+i] = ((uint32_t)key[4*i])   | ((uint32_t)key[4*i+1] << 8) |
                     ((uint32_t)key[4*i+2] << 16) | ((uint32_t)key[4*i+3] << 24);
        state[11+i] = ((uint32_t)key[16+4*i]) | ((uint32_t)key[16+4*i+1] << 8) |
                      ((uint32_t)key[16+4*i+2]<<16) | ((uint32_t)key[16+4*i+3]<<24);
    }

    /* Nonce (64 bits) + compteur (64 bits = 0) */
    state[ 6] = ((uint32_t)nonce[0]) | ((uint32_t)nonce[1]<<8) |
                ((uint32_t)nonce[2]<<16) | ((uint32_t)nonce[3]<<24);
    state[ 7] = ((uint32_t)nonce[4]) | ((uint32_t)nonce[5]<<8) |
                ((uint32_t)nonce[6]<<16) | ((uint32_t)nonce[7]<<24);
    state[ 8] = 0; /* compteur bas */
    state[ 9] = 0; /* compteur haut */
}

/* ================================================================
 * 4. AES-256 via WinCrypt (CALG_AES_256 = 0x6610)
 *    Visible dans IDA : import CryptDeriveKey + push 0x6610
 * ================================================================ */
static void demo_aes256_wincrypt(void) {
    HCRYPTPROV hProv = 0;
    HCRYPTKEY  hKey  = 0;
    HCRYPTHASH hHash = 0;
    const char *pass = "AES256_Demo_Pass";
    BYTE  buf[48];
    DWORD dwLen = 16, dwBuf = 48;

    memcpy(buf, "AAAAAAAAAAAAAAAA", 16);

    if (!CryptAcquireContextA(&hProv, NULL, NULL, PROV_RSA_AES, CRYPT_VERIFYCONTEXT))
        return;
    if (!CryptCreateHash(hProv, CALG_SHA_256, 0, 0, &hHash))
        goto done;
    if (!CryptHashData(hHash, (BYTE *)pass, (DWORD)strlen(pass), 0))
        goto done;
    /* CALG_AES_256 = 0x6610 — valeur visible dans le décompilateur IDA */
    if (!CryptDeriveKey(hProv, CALG_AES_256, hHash, 0, &hKey))
        goto done;
    CryptEncrypt(hKey, 0, TRUE, 0, buf, &dwLen, dwBuf);
    printf("[AES-256 WinCrypt] chiffré : %lu octets\n", dwLen);
done:
    if (hKey)  CryptDestroyKey(hKey);
    if (hHash) CryptDestroyHash(hHash);
    if (hProv) CryptReleaseContext(hProv, 0);
}

/* ================================================================
 * 5. 3DES via WinCrypt (CALG_3DES = 0x6603)
 *    Visible dans IDA : import CryptDeriveKey + push 0x6603
 * ================================================================ */
static void demo_3des_wincrypt(void) {
    HCRYPTPROV hProv = 0;
    HCRYPTKEY  hKey  = 0;
    HCRYPTHASH hHash = 0;
    const char *pass = "3DES_Demo_Pass";
    BYTE  buf[32];
    DWORD dwLen = 8, dwBuf = 32;

    memcpy(buf, "ABCDEFGH", 8);

    if (!CryptAcquireContextA(&hProv, NULL, NULL, PROV_RSA_FULL, CRYPT_VERIFYCONTEXT))
        return;
    if (!CryptCreateHash(hProv, CALG_MD5, 0, 0, &hHash))
        goto done;
    if (!CryptHashData(hHash, (BYTE *)pass, (DWORD)strlen(pass), 0))
        goto done;
    /* CALG_3DES = 0x6603 — valeur visible dans le décompilateur IDA */
    if (!CryptDeriveKey(hProv, CALG_3DES, hHash, 0, &hKey))
        goto done;
    CryptEncrypt(hKey, 0, TRUE, 0, buf, &dwLen, dwBuf);
    printf("[3DES WinCrypt]    chiffré : %lu octets\n", dwLen);
done:
    if (hKey)  CryptDestroyKey(hKey);
    if (hHash) CryptDestroyHash(hHash);
    if (hProv) CryptReleaseContext(hProv, 0);
}

/* ================================================================
 * 6. RSA-2048 via WinCrypt (AT_KEYEXCHANGE = 0x1)
 *    Visible dans IDA : import CryptGenKey + push 0x08000001
 *    (AT_KEYEXCHANGE=1 | taille clé 2048 dans les 16 bits hauts)
 * ================================================================ */
static void demo_rsa2048_wincrypt(void) {
    HCRYPTPROV hProv = 0;
    HCRYPTKEY  hKey  = 0;

    if (!CryptAcquireContextA(&hProv, NULL, NULL, PROV_RSA_FULL, CRYPT_VERIFYCONTEXT))
        return;
    /* AT_KEYEXCHANGE = 0x1, taille 2048 bits dans les 16 bits hauts du dwFlags */
    if (!CryptGenKey(hProv, AT_KEYEXCHANGE, (2048 << 16) | CRYPT_EXPORTABLE, &hKey))
        goto done;
    printf("[RSA-2048 WinCrypt] paire de clés générée\n");
done:
    if (hKey)  CryptDestroyKey(hKey);
    if (hProv) CryptReleaseContext(hProv, 0);
}

/* ================================================================
 * main — appelle toutes les démos dans l'ordre
 * ================================================================ */
int main(void) {
    printf("=== demo_crypto_full.exe — Cours 3 : Algorithmes Cryptographiques ===\n\n");

    /* ── 1. RC4 ─────────────────────────────────────────────────── */
    printf("--- RC4 (implementation manuelle) ---\n");
    unsigned char rc4_data[] = "Config C2 : 10.0.0.1:4444";
    int rc4_len = (int)strlen((char *)rc4_data);
    const unsigned char rc4_key[] = "RC4_Demo_Key";
    int rc4_klen = (int)strlen((char *)rc4_key);

    RC4_CTX rc4;
    rc4_init_sbox(&rc4);
    rc4_ksa(&rc4, rc4_key, rc4_klen);
    rc4_prga(&rc4, rc4_data, rc4_len);
    printf("Chiffré  : ");
    for (int i = 0; i < rc4_len; i++) printf("%02X ", rc4_data[i]);
    printf("\n");

    /* déchiffrement (RC4 est involutif — même opération) */
    rc4_init_sbox(&rc4);
    rc4_ksa(&rc4, rc4_key, rc4_klen);
    rc4_prga(&rc4, rc4_data, rc4_len);
    printf("Déchiffré: %s\n\n", (char *)rc4_data);

    /* ── 2. RC5 ─────────────────────────────────────────────────── */
    printf("--- RC5-32/12/16 (implementation manuelle) ---\n");
    RC5_CTX rc5;
    const uint8_t rc5_key[16] = {
        0x91,0x5f,0x46,0x19, 0xbe,0x41,0xb2,0x51,
        0x63,0x55,0xa5,0x01, 0x10,0xa9,0xce,0x91
    };
    rc5_key_expand(&rc5, rc5_key, 16);
    uint32_t A = 0xEEDBA521, B = 0x6D8F4B15;
    printf("Clair    : %08X %08X\n", A, B);
    rc5_encrypt_block(&rc5, &A, &B);
    printf("Chiffré  : %08X %08X\n", A, B);
    rc5_decrypt_block(&rc5, &A, &B);
    printf("Déchiffré: %08X %08X\n\n", A, B);

    /* ── 3. Salsa20 ─────────────────────────────────────────────── */
    printf("--- Salsa20 (implementation manuelle, quarter-round) ---\n");
    uint8_t s20_key[32] = {
        0x80,0x00,0x00,0x00, 0x00,0x00,0x00,0x00,
        0x00,0x00,0x00,0x00, 0x00,0x00,0x00,0x00,
        0x00,0x00,0x00,0x00, 0x00,0x00,0x00,0x00,
        0x00,0x00,0x00,0x00, 0x00,0x00,0x00,0x00
    };
    uint8_t s20_nonce[8] = {0};
    uint32_t s20_state[16], s20_out[16];
    salsa20_init_state(s20_state, s20_key, s20_nonce);
    salsa20_block(s20_out, s20_state);
    printf("Premier bloc keystream : %08X %08X %08X %08X ...\n\n",
           s20_out[0], s20_out[1], s20_out[2], s20_out[3]);

    /* ── 4-6. WinCrypt ──────────────────────────────────────────── */
    printf("--- WinCrypt API ---\n");
    demo_aes256_wincrypt();
    demo_3des_wincrypt();
    demo_rsa2048_wincrypt();

    printf("\nAnalyse terminee. Ouvrez ce binaire dans IDA Pro.\n");
    return 0;
}
