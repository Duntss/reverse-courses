/*
 *  demo_packer.c  -  Exemple simple pour la session "Packer"
 *  ==========================================================
 *
 *  RE Academy — Cours packer
 *
 *  Objectif : montrer qu'un binaire packé masque les chaînes et
 *  que l'on peut récupérer le code en le décompressant/dumpant.
 *
 *  Compilation (Linux) :
 *      gcc -O0 -o demo_packer demo_packer.c
 *      upx --best --compress-resources=0 demo_packer
 *
 *  Le flag s'affiche à l'exécution, mais "strings" ne le voit pas
 *  tant que le binaire est compressé. Dépackez avec "upx -d" ou
 *  dump en mémoire pour le retrouver.
 */

#include <stdio.h>

int main(void)
{
    puts("FLAG{unpacked_success}");
    return 0;
}
