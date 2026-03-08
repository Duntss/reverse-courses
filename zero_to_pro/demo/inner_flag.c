/*
 *  inner_flag.c  -  Binaire interne du challenge_valloc
 *  =====================================================
 *
 *  Ce binaire est embarque XOR-chiffre dans challenge_valloc.exe.
 *  Il ne s'execute jamais directement : le mini PE loader du packer
 *  le mappe en memoire, resout ses imports, puis saute a son OEP.
 *
 *  Compilation (automatique via build_challenge_valloc.py) :
 *      gcc -O0 -o inner_flag.exe inner_flag.c
 */

#include <stdio.h>

int main(void)
{
    puts("FLAG{virtualalloc_unpacked}");
    return 0;
}
