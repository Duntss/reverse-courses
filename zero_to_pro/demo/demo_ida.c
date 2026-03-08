/*
 *  demo_ida.c  -  Programme de démonstration pour IDA Pro
 *  =========================================================
 *
 *  RE Academy — Cours 1 : IDA Pro & Assembleur
 *
 *  Objectif : retrouver le mot de passe correct.
 *
 *  Compilation (Linux) :
 *      gcc -O0 -o demo_ida demo_ida.c
 *      gcc -O0 -g -o demo_ida_sym demo_ida.c   ← avec symboles (pour comparer)
 *
 *  Compilation (Windows, MSVC) :
 *      cl /Od /Fe:demo_ida.exe demo_ida.c
 *
 *  Points d'intérêt pour la démo IDA (voir cours) :
 *  ─────────────────────────────────────────────────
 *  [1] check_length   → cmp rax, 0Ah + jnz
 *  [2] decode_secret  → boucle XOR (obfuscation, strings ne voit rien)
 *  [3] check_sum      → imul / add / sub / cmp (arithmétique)
 *  [4] print_banner   → switch → table de sauts dans IDA
 *  [5] main           → flux de contrôle global, entrée strcmp
 */

#include <stdio.h>
#include <string.h>
#include <stdlib.h>

/* ─────────────────────────────────────────────────────────────
 * [1]  check_length
 *
 *  Ce que vous verrez dans IDA :
 *    call    _strlen           ; appel strlen
 *    cmp     rax, 0Ah          ; compare avec 10 (0xA)
 *    setz    al                ; met al=1 si égal, 0 sinon
 *
 *  Exercice : trouver la constante 0xA dans le graphe et
 *             identifier le bloc "succès" vs "échec".
 * ───────────────────────────────────────────────────────────── */
static int check_length(const char *s)
{
    return (strlen(s) == 10);
}

/* ─────────────────────────────────────────────────────────────
 * [2]  decode_secret
 *
 *  Le mot de passe réel est "ida_r0ck5!" mais il n'apparaît
 *  PAS en clair dans le binaire → `strings` ne le voit pas.
 *  Il est stocké XORé (clé = 0x42) et décodé à l'exécution.
 *
 *  Ce que vous verrez dans IDA :
 *    mov     ecx, 0Ah          ; compteur de boucle = 10
 *    xor     al, 42h           ; décodage octet par octet
 *    inc     rsi               ; avance dans le tableau
 *    loop    ...               ; ou jl / jb vers le début
 *
 *  Avec F5 (Hex-Rays) la logique devient immédiatement lisible :
 *    for (i = 0; i < 10; i++)
 *        out[i] = encoded[i] ^ 0x42;
 *
 *  Exercice : XORer chaque octet du tableau avec 0x42
 *             pour reconstruire le mot de passe sans exécuter.
 * ───────────────────────────────────────────────────────────── */
static void decode_secret(char *out)
{
    /* "ida_r0ck5!" XOR 0x42 */
    static const unsigned char encoded[] = {
        0x2B, 0x26, 0x23, 0x1D,   /* i  d  a  _  */
        0x30, 0x72, 0x21, 0x29,   /* r  0  c  k  */
        0x77, 0x63                 /* 5  !         */
    };
    int i;
    for (i = 0; i < 10; i++) {
        out[i] = (char)(encoded[i] ^ 0x42);
    }
    out[10] = '\0';
}

/* ─────────────────────────────────────────────────────────────
 * [3]  check_sum
 *
 *  Calcul arithmétique simple. Montre comment lire
 *  imul, add, sub et la conversion en if/else.
 *
 *  Ce que vous verrez dans IDA (syntaxe Intel) :
 *    imul    eax, edi, 3        ; a * 3
 *    imul    ecx, esi, 7        ; b * 7
 *    add     eax, ecx           ; + b*7
 *    sub     eax, 2Ah           ; - 42 (0x2A)
 *    cmp     eax, 64h           ; compare à 100 (0x64)
 *    setg    al                 ; 1 si > 100
 * ───────────────────────────────────────────────────────────── */
static int check_sum(int a, int b)
{
    int result = (a * 3) + (b * 7) - 42;
    return (result > 100) ? 1 : 0;
    /* check_sum(25, 14) → (75 + 98 - 42) = 131 > 100 → 1 */
}

/* ─────────────────────────────────────────────────────────────
 * [4]  print_banner
 *
 *  Switch avec 4 cas → IDA génère souvent une jump table.
 *  Comparer la vue Graph (blocs BB) avec la vue linéaire.
 *
 *  Dans IDA : chercher "jmp     ds:off_XXXXX[rax*8]"
 *  C'est la signature d'une table de sauts.
 *
 *  Exercice : identifier les 5 basic blocks (cas 1..4 + défaut).
 * ───────────────────────────────────────────────────────────── */
static void print_banner(int level)
{
    switch (level) {
        case 1:  puts("[*] Rang : Novice");    break;
        case 2:  puts("[*] Rang : Apprenti");  break;
        case 3:  puts("[*] Rang : Analyste");  break;
        case 4:  puts("[*] Rang : Expert");    break;
        default: puts("[!] Rang inconnu");     break;
    }
}

/* ─────────────────────────────────────────────────────────────
 * [5]  main — point d'entrée
 *
 *  Flux de contrôle global :
 *    fgets → check_length → decode_secret → strcmp → check_sum → print_banner
 *
 *  En IDA : commencer par main pour comprendre la logique,
 *  puis "Enter" sur chaque call pour plonger dans la fonction.
 *
 *  Chercher l'appel à strcmp : ses arguments (rdi=input, rsi=secret)
 *  se chargent juste avant le call → c'est là que se gagne le flag.
 * ───────────────────────────────────────────────────────────── */
int main(void)
{
    char  input[64];
    char  secret[11];

    puts("================================");
    puts("  RE Academy  --  Demo IDA Pro  ");
    puts("================================");
    printf("Mot de passe : ");
    fflush(stdout);

    if (!fgets(input, sizeof(input), stdin))
        return 1;

    /* supprimer le \n */
    input[strcspn(input, "\n")] = '\0';

    /* [1] vérification de longueur */
    if (!check_length(input)) {
        puts("[-] Longueur incorrecte.");
        return 1;
    }

    /* [2] décodage XOR du mot de passe attendu */
    decode_secret(secret);

    /* comparaison */
    if (strcmp(input, secret) != 0) {
        puts("[-] Mot de passe incorrect.");
        return 1;
    }

    puts("[+] Acces accorde !");

    /* [3] calcul du score */
    int score = check_sum(25, 14);
    int level = score ? 3 : 2;

    /* [4] affichage du rang */
    print_banner(level);

    printf("[*] Score interne : %d\n", score);
    return 0;
}
