"""
build_challenge_valloc.py
=========================
Construit challenge_valloc.exe :
  1. Compile inner_flag.c -> inner_flag.exe
  2. Lit les octets de inner_flag.exe
  3. XOR-chiffre (cle 0x37)
  4. Genere challenge_valloc.c avec la PE chiffree embarquee
  5. Compile challenge_valloc.c -> challenge_valloc.exe

Usage :
    python build_challenge_valloc.py
"""

import os
import subprocess
import sys

DEMO_DIR  = os.path.dirname(os.path.abspath(__file__))
XOR_KEY   = 0x37

INNER_C   = os.path.join(DEMO_DIR, 'inner_flag.c')
INNER_EXE = os.path.join(DEMO_DIR, 'inner_flag.exe')
OUT_C     = os.path.join(DEMO_DIR, 'challenge_valloc.c')
OUT_EXE   = os.path.join(DEMO_DIR, 'challenge_valloc.exe')

# ── 1. Compiler inner_flag.exe ────────────────────────────────────────────────
print('[*] Compilation de inner_flag.c ...')
r = subprocess.run(
    ['gcc', '-O0', '-o', INNER_EXE, INNER_C],
    capture_output=True, text=True
)
if r.returncode != 0:
    print('[!] Erreur gcc :', r.stderr)
    sys.exit(1)
print(f'    -> {INNER_EXE} ({os.path.getsize(INNER_EXE)} octets)')

# ── 2. Lire + XOR-chiffrer ────────────────────────────────────────────────────
with open(INNER_EXE, 'rb') as f:
    payload = f.read()

encrypted = bytes(b ^ XOR_KEY for b in payload)
print(f'[*] Payload XOR-chiffre : {len(encrypted)} octets')

# ── 3. Generer le tableau C ───────────────────────────────────────────────────
cols     = 16
hex_rows = []
for i in range(0, len(encrypted), cols):
    row = encrypted[i:i+cols]
    hex_rows.append('    ' + ', '.join(f'0x{b:02x}' for b in row))
array_str = ',\n'.join(hex_rows)

# ── 4. Template du packer ─────────────────────────────────────────────────────
template = r"""/*
 *  challenge_valloc.c  -  Custom packer avec mini PE loader
 *  =========================================================
 *
 *  RE Academy - Cours 2 : Packer
 *
 *  Ce binaire embarque une PE chiffree (XOR 0x37).
 *  A l'execution :
 *    1. VirtualAlloc (scratch)  -> alloue un buffer RW pour les octets bruts
 *    2. XOR-decrypt             -> restaure la PE interne en memoire
 *    3. VirtualAlloc (image)    -> alloue le buffer image final
 *    4. Map sections            -> copie header + sections
 *    5. Fix relocations         -> ajuste les adresses si base differente
 *    6. Resolve IAT             -> LoadLibrary + GetProcAddress par import
 *    7. VirtualProtect          -> applique les permissions par section
 *    8. JMP OEP                 <- etudiants arrivent ici, Scylla dump
 *
 *  Workflow x64dbg :
 *    bp VirtualAlloc -> F9 -> Ctrl+F9 (1ere fois = scratch)
 *    -> F9 -> Ctrl+F9 (2eme fois = image) -> steps -> JMP OEP
 *    -> Scylla : IAT Autosearch -> Get Imports -> Dump
 *
 *  Compilation :
 *    python build_challenge_valloc.py
 */

#include <windows.h>
#include <string.h>

#define XOR_KEY 0x37

/* ── Payload XOR-chiffre (genere par build_challenge_valloc.py) ── */
static const unsigned char encrypted_payload[] = {
ARRAY_PLACEHOLDER
};

static const DWORD payload_size = PAYLOAD_SIZE;

/* ── XOR decrypt helper ──────────────────────────────────────────── */
static void xor_decrypt(unsigned char *dst,
                        const unsigned char *src,
                        DWORD size)
{
    for (DWORD i = 0; i < size; i++)
        dst[i] = src[i] ^ XOR_KEY;
}

/* ── Entry point ─────────────────────────────────────────────────── */
int main(void)
{
    /* ── 1. Allouer scratch + dechiffrer la PE ─────────────────── */
    LPVOID scratch = VirtualAlloc(NULL, payload_size,
                                  MEM_COMMIT | MEM_RESERVE,
                                  PAGE_READWRITE);
    if (!scratch) return 1;

    xor_decrypt((unsigned char *)scratch, encrypted_payload, payload_size);

    /* ── 2. Parser les en-tetes PE ─────────────────────────────── */
    PIMAGE_DOS_HEADER dos = (PIMAGE_DOS_HEADER)scratch;
    if (dos->e_magic != IMAGE_DOS_SIGNATURE) return 2;

    PIMAGE_NT_HEADERS nt = (PIMAGE_NT_HEADERS)
        ((BYTE *)scratch + dos->e_lfanew);
    if (nt->Signature != IMAGE_NT_SIGNATURE) return 3;

    DWORD     img_size  = nt->OptionalHeader.SizeOfImage;
    DWORD_PTR pref_base = (DWORD_PTR)nt->OptionalHeader.ImageBase;
    DWORD     ep_rva    = nt->OptionalHeader.AddressOfEntryPoint;
    LONG      e_lfanew  = dos->e_lfanew;  /* sauvegarder avant free(scratch) */

    /* ── 3. Allouer le buffer image (base preferee ou libre) ────── */
    LPVOID img = VirtualAlloc((LPVOID)pref_base, img_size,
                               MEM_COMMIT | MEM_RESERVE,
                               PAGE_READWRITE);
    if (!img)
        img = VirtualAlloc(NULL, img_size,
                           MEM_COMMIT | MEM_RESERVE,
                           PAGE_READWRITE);
    if (!img) { VirtualFree(scratch, 0, MEM_RELEASE); return 4; }

    /* ── 4. Copier les en-tetes ─────────────────────────────────── */
    memcpy(img, scratch, nt->OptionalHeader.SizeOfHeaders);

    /* ── 5. Mapper les sections ──────────────────────────────────── */
    PIMAGE_SECTION_HEADER sec = IMAGE_FIRST_SECTION(nt);
    for (WORD i = 0; i < nt->FileHeader.NumberOfSections; i++, sec++) {
        if (sec->SizeOfRawData == 0) continue;
        memcpy((BYTE *)img + sec->VirtualAddress,
               (BYTE *)scratch + sec->PointerToRawData,
               sec->SizeOfRawData);
    }

    /* ── 6. Corriger les relocations si la base a change ─────────── */
    DWORD_PTR delta = (DWORD_PTR)img - pref_base;
    if (delta != 0) {
        PIMAGE_DATA_DIRECTORY reloc_dir =
            &nt->OptionalHeader.DataDirectory[IMAGE_DIRECTORY_ENTRY_BASERELOC];
        if (reloc_dir->VirtualAddress) {
            PIMAGE_BASE_RELOCATION blk =
                (PIMAGE_BASE_RELOCATION)
                ((BYTE *)img + reloc_dir->VirtualAddress);
            while (blk->VirtualAddress && blk->SizeOfBlock) {
                WORD  *entries = (WORD *)(blk + 1);
                DWORD  count   = (blk->SizeOfBlock
                                  - sizeof(IMAGE_BASE_RELOCATION))
                                 / sizeof(WORD);
                for (DWORD j = 0; j < count; j++) {
                    int   type = entries[j] >> 12;
                    DWORD off  = entries[j] & 0x0FFF;
                    BYTE *ea   = (BYTE *)img + blk->VirtualAddress + off;
#ifdef _WIN64
                    if (type == IMAGE_REL_BASED_DIR64)
                        *(DWORD_PTR *)ea += delta;
#else
                    if (type == IMAGE_REL_BASED_HIGHLOW)
                        *(DWORD *)ea += (DWORD)delta;
#endif
                }
                blk = (PIMAGE_BASE_RELOCATION)
                      ((BYTE *)blk + blk->SizeOfBlock);
            }
        }
    }

    /* ── 7. Resoudre les imports ─────────────────────────────────── */
    {
        PIMAGE_DATA_DIRECTORY imp_dir =
            &nt->OptionalHeader.DataDirectory[IMAGE_DIRECTORY_ENTRY_IMPORT];
        if (imp_dir->VirtualAddress) {
            PIMAGE_IMPORT_DESCRIPTOR imp =
                (PIMAGE_IMPORT_DESCRIPTOR)
                ((BYTE *)img + imp_dir->VirtualAddress);
            while (imp->Name) {
                LPCSTR dll_name = (LPCSTR)((BYTE *)img + imp->Name);
                HMODULE hDll    = LoadLibraryA(dll_name);

                /* Utiliser OriginalFirstThunk si dispo, sinon FirstThunk */
                PIMAGE_THUNK_DATA orig =
                    imp->OriginalFirstThunk
                    ? (PIMAGE_THUNK_DATA)((BYTE *)img + imp->OriginalFirstThunk)
                    : (PIMAGE_THUNK_DATA)((BYTE *)img + imp->FirstThunk);
                PIMAGE_THUNK_DATA iat =
                    (PIMAGE_THUNK_DATA)((BYTE *)img + imp->FirstThunk);

                while (iat->u1.AddressOfData) {
                    FARPROC fn;
                    if (IMAGE_SNAP_BY_ORDINAL(orig->u1.Ordinal)) {
                        fn = GetProcAddress(hDll,
                             (LPCSTR)(orig->u1.Ordinal & 0xFFFF));
                    } else {
                        PIMAGE_IMPORT_BY_NAME ibn =
                            (PIMAGE_IMPORT_BY_NAME)
                            ((BYTE *)img + orig->u1.AddressOfData);
                        fn = GetProcAddress(hDll, (LPCSTR)ibn->Name);
                    }
                    iat->u1.Function = (ULONGLONG)(ULONG_PTR)fn;
                    orig++;
                    iat++;
                }
                imp++;
            }
        }
    }

    /* ── 8. Liberer le scratch (plus utilise) ───────────────────── */
    VirtualFree(scratch, 0, MEM_RELEASE);

    /* ── 9. Appliquer les permissions par section ───────────────── */
    PIMAGE_NT_HEADERS nt2 =
        (PIMAGE_NT_HEADERS)((BYTE *)img + e_lfanew);  /* img, pas scratch */
    sec = IMAGE_FIRST_SECTION(nt2);
    for (WORD i = 0; i < nt2->FileHeader.NumberOfSections; i++, sec++) {
        DWORD chars = sec->Characteristics;
        DWORD prot;
        if ((chars & IMAGE_SCN_MEM_EXECUTE) && (chars & IMAGE_SCN_MEM_WRITE))
            prot = PAGE_EXECUTE_READWRITE;
        else if (chars & IMAGE_SCN_MEM_EXECUTE)
            prot = PAGE_EXECUTE_READ;
        else if (chars & IMAGE_SCN_MEM_WRITE)
            prot = PAGE_READWRITE;
        else
            prot = PAGE_READONLY;
        DWORD old;
        DWORD vsz = sec->Misc.VirtualSize
                    ? sec->Misc.VirtualSize
                    : sec->SizeOfRawData;
        VirtualProtect((BYTE *)img + sec->VirtualAddress, vsz, prot, &old);
    }

    /* ── 10. JMP vers l'OEP de la PE interne ───────────────────── */
    /*   Etudiants : arriver ici avec le BP sur JMP,                */
    /*   puis Scylla -> IAT Autosearch -> Get Imports -> Dump        */
    /*   (base = adresse de 'img', OEP = adresse courante)          */
    typedef int (*EP_t)(void);
    EP_t ep = (EP_t)((BYTE *)img + ep_rva);
    return ep();
}
"""

source = template.replace('ARRAY_PLACEHOLDER', array_str)
source = source.replace('PAYLOAD_SIZE',        str(len(encrypted)))

with open(OUT_C, 'w', encoding='utf-8') as f:
    f.write(source)
print(f'[*] Source genere : {OUT_C} ({os.path.getsize(OUT_C):,} octets)')

# ── 5. Compiler challenge_valloc.exe ─────────────────────────────────────────
print('[*] Compilation de challenge_valloc.c ...')
r = subprocess.run(
    ['gcc', '-O0', '-o', OUT_EXE, OUT_C, '-lkernel32'],
    capture_output=True, text=True
)
if r.returncode != 0:
    print('[!] Erreur gcc :', r.stderr)
    sys.exit(1)

print(f'[+] Termine : {OUT_EXE} ({os.path.getsize(OUT_EXE):,} octets)')
print()
print('Workflow etudiant (x64dbg) :')
print('  1. Ouvrir challenge_valloc.exe')
print('  2. Commande : bp VirtualAlloc')
print('  3. F9 -> Ctrl+F9  (1er appel = scratch buffer)')
print('  4. F9 -> Ctrl+F9  (2eme appel = image PE mappee)')
print('  5. F8 jusqu au JMP vers OEP -> F7 pour entrer')
print('  6. Scylla : IAT Autosearch -> Get Imports -> Dump')
