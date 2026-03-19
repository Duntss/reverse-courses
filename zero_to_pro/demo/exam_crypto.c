/*
 * exam_crypto.c — Binaire d'examen, Cours 3
 *
 * Le programme ne produit aucune sortie et ne fait rien de visible.
 * Il contient une implementation complete de RC4, RC5 et une cle RSA.
 *
 * Compilation :
 *   gcc -O1 -s -o exam_crypto.exe exam_crypto.c
 *
 * Questions pour les etudiants (adresses statiques IDA, format 0x14000XXXX) :
 *   Q1 — Adresse de l'etape 1 RC4 (Init SBOX)
 *   Q2 — Adresse de l'etape 2 RC4 (KSA)
 *   Q3 — Adresse de l'etape 3 RC4 (PRGA)
 *   Q4 — Adresse de la constante P32 de RC5 (0xB7E15163) dans .rdata
 *   Q5 — Adresse de la cle publique RSA embarquee dans .rdata
 */

#include <stdint.h>
#include <string.h>

/* ================================================================
 * RC4
 * ================================================================ */

typedef struct {
    unsigned char S[256];
    int i, j;
} RC4_CTX;

__attribute__((noinline))
void rc4_init_sbox(RC4_CTX *ctx) {
    for (int n = 0; n < 256; n++)
        ctx->S[n] = (unsigned char)n;
    ctx->i = 0;
    ctx->j = 0;
}

__attribute__((noinline))
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

__attribute__((noinline))
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
 * RC5-32/12/16
 * Les constantes P32 et Q32 sont dans .rdata — adressables dans IDA
 * ================================================================ */

#define RC5_R  12
#define RC5_T  (2 * (RC5_R + 1))
#define ROL32(x,n) (((x) << ((n) & 31)) | ((x) >> (32 - ((n) & 31))))

/* Constantes dans .data — P32 = rc5_magic[0], Q32 = rc5_magic[1] */
uint32_t rc5_magic[2] = {
    0xB7E15163UL,   /* P32 = (e   - 2) * 2^32 */
    0x9E3779B9UL,   /* Q32 = (phi - 1) * 2^32 */
};

typedef struct { uint32_t S[RC5_T]; } RC5_CTX;

__attribute__((noinline))
void rc5_setup(RC5_CTX *ctx, const uint8_t *key, int len) {
    uint32_t L[4] = {0};
    int u = (len + 3) / 4;
    for (int i = len - 1; i >= 0; i--)
        L[i / 4] = (L[i / 4] << 8) + key[i];
    ctx->S[0] = rc5_magic[0];
    for (int i = 1; i < RC5_T; i++)
        ctx->S[i] = ctx->S[i - 1] + rc5_magic[1];
    uint32_t A = 0, B = 0;
    int ii = 0, jj = 0;
    for (int k = 0; k < 3 * RC5_T; k++) {
        A = ctx->S[ii] = ROL32(ctx->S[ii] + A + B, 3);
        B = L[jj]      = ROL32(L[jj]      + A + B, A + B);
        ii = (ii + 1) % RC5_T;
        jj = (jj + 1) % u;
    }
}

__attribute__((noinline))
void rc5_enc(RC5_CTX *ctx, uint32_t *A, uint32_t *B) {
    *A += ctx->S[0];
    *B += ctx->S[1];
    for (int i = 1; i <= RC5_R; i++) {
        *A = ROL32(*A ^ *B, *B) + ctx->S[2 * i];
        *B = ROL32(*B ^ *A, *A) + ctx->S[2 * i + 1];
    }
}

/* ================================================================
 * RSA — Cle publique embarquee au format PUBLICKEYBLOB
 *
 * Structure visible dans IDA section .rdata :
 *   +0x00  bType    = 0x06 (PUBLICKEYBLOB)
 *   +0x01  bVersion = 0x02
 *   +0x02  reserved = 0x0000
 *   +0x04  aiKeyAlg = 0x0000A400 (CALG_RSA_KEYX)
 *   +0x08  magic    = 0x31415352 ("RSA1" little-endian)
 *   +0x0C  bitlen   = 0x00000800 (2048)
 *   +0x10  pubexp   = 0x00010001 (65537)
 *   +0x14  modulus  = 256 octets (cle RSA-2048)
 * ================================================================ */
static const struct {
    uint8_t  bType;
    uint8_t  bVersion;
    uint16_t reserved;
    uint32_t aiKeyAlg;
    uint32_t magic;
    uint32_t bitlen;
    uint32_t pubexp;
    uint8_t  modulus[256];
} rsa_pubkey = {
    .bType    = 0x06,
    .bVersion = 0x02,
    .reserved = 0x0000,
    .aiKeyAlg = 0x0000A400,
    .magic    = 0x31415352,
    .bitlen   = 2048,
    .pubexp   = 0x00010001,
    .modulus  = {
        0xD1,0x4E,0x8A,0x3F, 0x92,0xB7,0x6C,0x11,
        0x5E,0xA9,0x03,0xFC, 0x7D,0x44,0x2B,0xE8,
        0x19,0xF5,0x60,0x9A, 0xCC,0x1B,0x84,0x77,
        0x32,0xDE,0x0F,0x5C, 0xA0,0x6E,0x3B,0xD9,
        0xF3,0x21,0xAB,0x56, 0x78,0x9C,0xD4,0x01,
        0x55,0xEE,0x7F,0xA3, 0x2E,0x41,0x8B,0xC0,
        0x64,0x97,0x13,0x5B, 0x8A,0xF0,0x2D,0xE7,
        0x49,0xBC,0x86,0x22, 0x17,0x63,0xDA,0x94,
        /* 192 octets restants a 0 */
    }
};

/* ================================================================
 * main — calcul silencieux, aucune sortie
 * ================================================================ */
int main(void) {
    const uint8_t key[8] = {
        0x2B, 0xD6, 0x45, 0x9F, 0x82, 0xC5, 0xB3, 0x00
    };
    unsigned char buf[64];

    /* Seed buf depuis la cle RSA embarquee */
    for (int i = 0; i < 64; i++)
        buf[i] = rsa_pubkey.modulus[i % 64];

    /* RC4 : 3 etapes */
    RC4_CTX rc4;
    rc4_init_sbox(&rc4);
    rc4_ksa(&rc4, key, 8);
    rc4_prga(&rc4, buf, 64);

    /* RC5 : key expand + chiffrement */
    RC5_CTX rc5;
    rc5_setup(&rc5, key, 8);
    uint32_t A = ((uint32_t)buf[0] << 24) | ((uint32_t)buf[1] << 16) |
                 ((uint32_t)buf[2] <<  8) |  (uint32_t)buf[3];
    uint32_t B = ((uint32_t)buf[4] << 24) | ((uint32_t)buf[5] << 16) |
                 ((uint32_t)buf[6] <<  8) |  (uint32_t)buf[7];
    rc5_enc(&rc5, &A, &B);

    /* Code de retour non-nul mais silencieux */
    return (int)((A ^ B) & 0xFF);
}
