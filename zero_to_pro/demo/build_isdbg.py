"""
build_isdbg.py
==============
Construit crackme_isdbg.exe :
  1. Assemble shellcode_msgbox.asm -> shellcode_msgbox.bin  (NASM)
  2. XOR-chiffre le shellcode (cle 0x59)
  3. Genere crackme_isdbg.c avec le shellcode chiffre embarque
  4. Compile crackme_isdbg.c -> crackme_isdbg.exe             (GCC)

Usage :
    python build_isdbg.py

Structure du crackme (IAT quasi-vide) :
  Fonctions visibles : GetModuleHandleA, GetProcAddress  (seulement)
  Tout le reste est resolu dynamiquement :
    - IsDebuggerPresent  : anti-debug avant allocation
    - VirtualAlloc       : alloc RW pour le shellcode dechiffre
    - VirtualProtect     : passage RW -> RX
    - ExitProcess        : sortie propre si debugger detecte

Workflow etudiant (x64dbg) :
  1. Ouvrir crackme_isdbg.exe
  2. Chercher le call IsDebuggerPresent resolu via GetProcAddress
  3. Patcher le retour (EAX = 0) ou poser un BP sur la branche
  4. Laisser tourner -> MessageBoxA apparait avec le flag
  5. Dumper le shellcode depuis la region VirtualAlloc (RX)
"""

import os
import subprocess
import sys

DEMO_DIR  = os.path.dirname(os.path.abspath(__file__))
XOR_KEY   = 0x59

ASM_FILE  = os.path.join(DEMO_DIR, 'shellcode_msgbox.asm')
BIN_FILE  = os.path.join(DEMO_DIR, 'shellcode_msgbox.bin')
OUT_C     = os.path.join(DEMO_DIR, 'crackme_isdbg.c')
OUT_EXE   = os.path.join(DEMO_DIR, 'crackme_isdbg.exe')

# ── 1. Assembler avec NASM ────────────────────────────────────────────────────
print('[*] Assemblage shellcode_msgbox.asm ...')
r = subprocess.run(
    ['nasm', '-f', 'bin', '-o', BIN_FILE, ASM_FILE],
    capture_output=True, text=True
)
if r.returncode != 0:
    print('[!] Erreur NASM :', r.stderr)
    sys.exit(1)
print(f'    -> {BIN_FILE} ({os.path.getsize(BIN_FILE)} octets)')

# ── 2. Lire + XOR-chiffrer ────────────────────────────────────────────────────
with open(BIN_FILE, 'rb') as f:
    raw = f.read()

encrypted = bytes(b ^ XOR_KEY for b in raw)
print(f'[*] Shellcode XOR-chiffre (cle 0x{XOR_KEY:02X}) : {len(encrypted)} octets')

# ── 3. Generer le tableau C ───────────────────────────────────────────────────
cols = 16
rows = []
for i in range(0, len(encrypted), cols):
    chunk = encrypted[i:i+cols]
    rows.append('    ' + ', '.join(f'0x{b:02x}' for b in chunk))
array_str = ',\n'.join(rows)

# ── 4. Template du crackme ────────────────────────────────────────────────────
template = r"""/*
 *  crackme_isdbg.c  -  Crackme : anti-debug + shellcode PEB-walk
 *  ==============================================================
 *
 *  RE Academy - Cours packer
 *
 *  IAT visible : GetModuleHandleA, GetProcAddress   <- c'est tout
 *  Tout le reste est resolu dynamiquement.
 *
 *  Logique de protection :
 *    1. GetProcAddress(k32, "IsDebuggerPresent") -> anti-debug
 *       Si detecte  -> ExitProcess(0)   (pas de message, juste quitter)
 *    2. GetProcAddress(k32, "VirtualAlloc") -> alloue buffer RW
 *    3. XOR-dechiffre le shellcode dans ce buffer
 *    4. GetProcAddress(k32, "VirtualProtect") -> passe le buffer en RX
 *    5. Appel direct du shellcode (qui fait lui-meme un PEB-walk
 *       pour trouver MessageBoxA et afficher le flag)
 *
 *  Workflow etudiant (x64dbg) :
 *    - Poser un BP sur les call [GetProcAddress result]
 *    - Reperer l'appel a IsDebuggerPresent, patcher EAX=0
 *    - F9 -> MessageBoxA affiche le flag
 *    - Optionnel : dumper la region RX apres VirtualProtect pour
 *      analyser le shellcode (il ne figure pas dans le fichier en clair)
 *
 *  Compilation :
 *    python build_isdbg.py
 */

#include <windows.h>

/* ---- typedefs pour les fonctions resolues dynamiquement ---- */
typedef BOOL   (WINAPI *pfn_IDP)(void);
typedef LPVOID (WINAPI *pfn_VA)(LPVOID, SIZE_T, DWORD, DWORD);
typedef BOOL   (WINAPI *pfn_VP)(LPVOID, SIZE_T, DWORD, PDWORD);
typedef void   (WINAPI *pfn_EP)(UINT);

/* ---- shellcode XOR-chiffre (cle XORKEY) ---- */
static const unsigned char enc[] = {
ARRAY_PLACEHOLDER
};
static const DWORD sc_size = SC_SIZE;

int main(void)
{
    /* Seules fonctions visibles dans l'IAT */
    HMODULE k32 = GetModuleHandleA("kernel32.dll");

    /* Resolution dynamique : rien d'autre n'apparait dans l'IAT */
    pfn_IDP IsDbg  = (pfn_IDP) GetProcAddress(k32, "IsDebuggerPresent");
    pfn_VA  VAlloc = (pfn_VA)  GetProcAddress(k32, "VirtualAlloc");
    pfn_VP  VProt  = (pfn_VP)  GetProcAddress(k32, "VirtualProtect");
    pfn_EP  Exit   = (pfn_EP)  GetProcAddress(k32, "ExitProcess");

    /* ---- Anti-debug : sortie silencieuse si debugger detecte ---- */
    if (IsDbg()) {
        Exit(0);
    }

    /* ---- Allouer RW, dechiffrer, passer en RX ---- */
    LPVOID mem = VAlloc(NULL, sc_size,
                        MEM_COMMIT | MEM_RESERVE,
                        PAGE_READWRITE);
    if (!mem) Exit(1);

    unsigned char *p = (unsigned char *)mem;
    for (DWORD i = 0; i < sc_size; i++)
        p[i] = enc[i] ^ XORKEY;

    DWORD old;
    VProt(mem, sc_size, PAGE_EXECUTE_READ, &old);

    /* ---- Appel du shellcode ---- */
    ((void(*)())mem)();

    return 0;
}
"""

source = (template
          .replace('ARRAY_PLACEHOLDER', array_str)
          .replace('SC_SIZE', str(len(encrypted)))
          .replace('XORKEY', f'0x{XOR_KEY:02X}'))

with open(OUT_C, 'w', encoding='utf-8') as f:
    f.write(source)
print(f'[*] Source genere : {OUT_C} ({os.path.getsize(OUT_C):,} octets)')

# ── 5. Compiler crackme_isdbg.exe ─────────────────────────────────────────────
print('[*] Compilation ...')
r = subprocess.run(
    ['gcc', '-O0', '-o', OUT_EXE, OUT_C,
     '-lkernel32', '-luser32',
     '-Wl,--strip-all'],          # strip les symboles debug
    capture_output=True, text=True
)
if r.returncode != 0:
    print('[!] Erreur gcc :', r.stderr)
    sys.exit(1)

print(f'[+] Termine : {OUT_EXE} ({os.path.getsize(OUT_EXE):,} octets)')
print()
print('Verification rapide :')
print('  crackme_isdbg.exe  -> doit afficher le flag (pas de debugger)')
print()
print('Workflow etudiant (x64dbg) :')
print('  1. Ouvrir crackme_isdbg.exe dans x64dbg')
print('  2. Commande : bp GetProcAddress')
print('  3. F9 x4 (4 appels : IsDebuggerPresent, VirtualAlloc, VirtualProtect, ExitProcess)')
print('     Au 1er retour (IsDebuggerPresent) : forcer EAX = 0 dans les registres')
print('  4. F9 -> VirtualAlloc alloue le buffer')
print('  5. F9 -> VirtualProtect passe en RX')
print('  6. F8/F7 -> entrer dans le shellcode (PEB-walk visible)')
print('  7. MessageBoxA affiche le flag')
