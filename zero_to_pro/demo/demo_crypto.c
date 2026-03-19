/*
 * demo_crypto.c — Demo pour le cours "Algorithmes Cryptographiques dans les Malwares"
 *
 * Ce binaire illustre deux approches typiques des malwares :
 *   1. RC4 implémenté manuellement  → détectable par le pattern SBOX 256 octets
 *   2. AES-256 et RSA-2048 via WinCrypt API → détectable par les imports/calls
 *
 * Compilation (MinGW) :
 *   gcc -O1 -s -o demo_crypto.exe demo_crypto.c -ladvapi32
 *
 * Objectif de l'exercice :
 *   Identifier l'algorithme RC4 dans IDA, retrouver la clé et déchiffrer le flag.
 */

#include <windows.h>
#include <wincrypt.h>
#include <stdio.h>
#include <string.h>
#include <stdlib.h>

/* ================================================================
 * RC4 — Implémentation manuelle
 * Les 3 étapes sont séparées en fonctions distinctes pour la pédagogie
 * ================================================================ */

typedef struct {
    unsigned char S[256];   /* SBOX — 256 octets, signature visible dans IDA */
    int i, j;
} RC4_CTX;

/* Étape 1 : Initialisation de la SBOX (identité 0..255) */
void rc4_init_sbox(RC4_CTX *ctx) {
    for (int i = 0; i < 256; i++) {
        ctx->S[i] = (unsigned char)i;
    }
    ctx->i = 0;
    ctx->j = 0;
}

/* Étape 2 : KSA — Key Scheduling Algorithm (mélange de la SBOX avec la clé) */
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

/* Étape 3 : PRGA — Pseudo-Random Generation Algorithm (chiffrement XOR) */
void rc4_prga(RC4_CTX *ctx, unsigned char *data, int datalen) {
    int i = ctx->i;
    int j = ctx->j;
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
 * AES-256 via WinCrypt API
 * Imports visibles : CryptAcquireContext, CryptCreateHash,
 *                    CryptHashData, CryptDeriveKey, CryptEncrypt
 * ================================================================ */
static void aes_demo(void) {
    HCRYPTPROV hProv = 0;
    HCRYPTKEY  hKey  = 0;
    HCRYPTHASH hHash = 0;
    const char *pass  = "Z2P_AES_Key_2024";
    BYTE        buf[64];
    DWORD       dwLen, dwBuf = 64;

    memcpy(buf, "Config: server=c2.evil:443", 26);
    dwLen = 26;

    if (!CryptAcquireContextA(&hProv, NULL, NULL, PROV_RSA_AES, CRYPT_VERIFYCONTEXT))
        return;
    if (!CryptCreateHash(hProv, CALG_SHA_256, 0, 0, &hHash))
        goto done;
    if (!CryptHashData(hHash, (BYTE *)pass, (DWORD)strlen(pass), 0))
        goto done;
    /* CALG_AES_256 = 0x6610 — constante visible dans le décompilateur */
    if (!CryptDeriveKey(hProv, CALG_AES_256, hHash, 0, &hKey))
        goto done;
    CryptEncrypt(hKey, 0, TRUE, 0, buf, &dwLen, dwBuf);
    printf("[WinCrypt] AES-256 : config chiffree (%lu octets)\n", dwLen);

done:
    if (hKey)  CryptDestroyKey(hKey);
    if (hHash) CryptDestroyHash(hHash);
    if (hProv) CryptReleaseContext(hProv, 0);
}

/* ================================================================
 * RSA-2048 via WinCrypt API
 * Imports visibles : CryptGenKey (AT_KEYEXCHANGE = 0xA400)
 * ================================================================ */
static void rsa_demo(void) {
    HCRYPTPROV hProv = 0;
    HCRYPTKEY  hKey  = 0;

    if (!CryptAcquireContextA(&hProv, NULL, NULL, PROV_RSA_FULL, CRYPT_VERIFYCONTEXT))
        return;
    /* AT_KEYEXCHANGE = 1 (key exchange / chiffrement asymétrique)
     * 2048 << 16 définit la taille de clé dans DWPARAM               */
    if (!CryptGenKey(hProv, AT_KEYEXCHANGE, (2048 << 16) | CRYPT_EXPORTABLE, &hKey))
        goto done;
    printf("[WinCrypt] RSA-2048 : paire de cles generee\n");

done:
    if (hKey)  CryptDestroyKey(hKey);
    if (hProv) CryptReleaseContext(hProv, 0);
}

/* ================================================================
 * Flag chiffré en RC4 (clé = "Z2P_K3Y")
 * L'étudiant doit : trouver la clé, identifier RC4, déchiffrer.
 * Plaintext : zero_to_pro{crypt0_4nalys15_m4st3r}
 * ================================================================ */
static const unsigned char encrypted_flag[] = {
    0x93, 0x8e, 0x14, 0x57, 0x64, 0xbd, 0xd3, 0x85,
    0xe4, 0xf3, 0x4a, 0xc1, 0x03, 0xfe, 0xac, 0x3c,
    0xe3, 0xd4, 0x19, 0x63, 0x02, 0x6b, 0x13, 0x09,
    0x87, 0x16, 0x9a, 0x42, 0x98, 0xcc, 0x2f, 0xb7,
    0xdb, 0xcf, 0x07
};

int main(void) {
    printf("=== Demo Cryptographie Malware ===\n\n");

    /* --- RC4 manuel --- */
    const unsigned char key[] = "Z2P_K3Y";
    int keylen  = (int)strlen((char *)key);
    int flaglen = (int)sizeof(encrypted_flag);

    unsigned char *buf = (unsigned char *)malloc(flaglen + 1);
    if (!buf) return 1;
    memcpy(buf, encrypted_flag, flaglen);
    buf[flaglen] = '\0';

    RC4_CTX ctx;
    rc4_init_sbox(&ctx);
    rc4_ksa(&ctx, key, keylen);
    rc4_prga(&ctx, buf, flaglen);

    printf("[RC4]     Flag : %s\n", buf);
    free(buf);

    /* --- AES via WinCrypt --- */
    aes_demo();

    /* --- RSA via WinCrypt --- */
    rsa_demo();

    printf("\nAnalyse terminee.\n");
    return 0;
}
