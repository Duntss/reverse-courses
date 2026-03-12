; =============================================================================
;  shellcode_msgbox.asm  -  x64 Windows shellcode PEB-walk + MessageBoxA
; =============================================================================
;
;  Assemblage :
;      nasm -f bin -o shellcode_msgbox.bin shellcode_msgbox.asm
;
;  Ce shellcode est embarque XOR-chiffre dans crackme_isdbg.exe.
;  Il ne s'appuie sur aucun import : tout est resolu a la volee via le PEB.
;
;  Etapes :
;    1. Walk PEB -> InMemoryOrderModuleList -> kernel32.DllBase
;    2. Parse la table d'exports de kernel32 pour trouver GetProcAddress
;    3. GetProcAddress(kernel32, "LoadLibraryA")
;    4. LoadLibraryA("user32.dll")
;    5. GetProcAddress(user32, "MessageBoxA")
;    6. MessageBoxA(NULL, flag_msg, caption, MB_OK)
; =============================================================================

BITS 64

_start:
    ; ----- Prologue : sauvegarde non-volatile + espace shadow (0x28) -----
    push    rbx
    push    rsi
    push    rdi
    push    r12
    push    r13
    push    r14
    push    r15
    push    rbp
    sub     rsp, 0x28           ; shadow space (0x20) + alignement (0x08)

    ; ----- 1. kernel32 base via PEB -----
    ;  GS:[0x60]        = PEB
    ;  PEB + 0x18       = PEB.Ldr
    ;  Ldr + 0x20       = InMemoryOrderModuleList.Flink  -> exe
    ;  [Flink]          -> ntdll
    ;  [[Flink]]        -> kernel32
    ;  [InMemOrdLinks + 0x20] = DllBase
    mov     rax, gs:[0x60]      ; PEB
    mov     rax, [rax + 0x18]   ; PEB->Ldr
    mov     rax, [rax + 0x20]   ; InMemoryOrderModuleList.Flink (exe)
    mov     rax, [rax]          ; -> ntdll InMemoryOrderLinks
    mov     rax, [rax]          ; -> kernel32 InMemoryOrderLinks
    mov     r15, [rax + 0x20]   ; kernel32.DllBase
    ; r15 = kernel32 base

    ; ----- 2. Trouver GetProcAddress dans les exports de kernel32 -----
    mov     rdi, r15
    lea     rsi, [rel str_getprocaddr]
    call    find_export         ; rax = GetProcAddress
    mov     r12, rax            ; r12 = GetProcAddress

    ; ----- 3. Resoudre LoadLibraryA -----
    mov     rcx, r15            ; hModule = kernel32
    lea     rdx, [rel str_loadlib]
    call    r12                 ; GetProcAddress(kernel32, "LoadLibraryA")
    mov     r13, rax            ; r13 = LoadLibraryA

    ; ----- 4. Charger user32.dll -----
    lea     rcx, [rel str_user32]
    call    r13                 ; LoadLibraryA("user32.dll")
    mov     r14, rax            ; r14 = user32 base

    ; ----- 5. Trouver MessageBoxA -----
    mov     rdi, r14
    lea     rsi, [rel str_msgboxa]
    call    find_export         ; rax = MessageBoxA

    ; ----- 6. Appeler MessageBoxA(NULL, message, caption, MB_OK) -----
    ;  rcx = hWnd = NULL
    ;  rdx = lpText
    ;  r8  = lpCaption
    ;  r9  = uType = MB_OK = 0
    xor     ecx, ecx
    lea     rdx, [rel str_message]
    lea     r8,  [rel str_caption]
    xor     r9d, r9d
    call    rax

    ; ----- Epilogue -----
    add     rsp, 0x28
    pop     rbp
    pop     r15
    pop     r14
    pop     r13
    pop     r12
    pop     rdi
    pop     rsi
    pop     rbx
    ret

; =============================================================================
;  find_export(rdi = DllBase, rsi = nom_cible_ptr) -> rax = adresse fonction
;  Convention interne : clobbers rcx, rdx, r8, r9, r10, r11
; =============================================================================
find_export:
    ; Trouver le NT header
    mov     eax, [rdi + 0x3C]   ; e_lfanew
    add     rax, rdi            ; rax = NT headers

    ; Export Directory RVA a NT + 0x88 (x64 : Signature+FileHeader+OptionalHeader.DataDirectory[0])
    mov     edx, [rax + 0x88]
    add     rdx, rdi            ; rdx = IMAGE_EXPORT_DIRECTORY

    ; Lire les champs utiles
    mov     ecx,  [rdx + 0x18]  ; NumberOfNames
    mov     r8d,  [rdx + 0x20]
    add     r8,   rdi           ; AddressOfNames (tableau de RVA)
    mov     r9d,  [rdx + 0x24]
    add     r9,   rdi           ; AddressOfNameOrdinals
    mov     r10d, [rdx + 0x1C]
    add     r10,  rdi           ; AddressOfFunctions

    xor     r11,  r11           ; index i = 0

.loop:
    cmp     r11d, ecx
    jge     .notfound

    ; Obtenir le pointeur vers le nom[i]
    mov     eax,  [r8 + r11*4]
    add     rax,  rdi           ; rax = nom[i] (chaine ANSI)

    ; Comparer nom[i] avec rsi (strcmp maison)
    push    rcx
    push    rsi
    push    rdi
    mov     rcx, rax            ; rcx = nom courant
    mov     rdx, rsi            ; rdx = cible

.cmploop:
    mov     al,  [rcx]
    mov     ah,  [rdx]
    cmp     al,  ah
    jne     .cmpnext
    test    al,  al
    jz      .cmpmatch
    inc     rcx
    inc     rdx
    jmp     .cmploop

.cmpnext:
    pop     rdi
    pop     rsi
    pop     rcx
    inc     r11
    jmp     .loop

.cmpmatch:
    pop     rdi
    pop     rsi
    pop     rcx
    ; r11 = index trouve
    movzx   eax, word [r9 + r11*2]  ; ordinal
    mov     eax, [r10 + rax*4]      ; RVA de la fonction
    add     rax, rdi                 ; adresse absolue
    ret

.notfound:
    xor     eax, eax
    ret

; =============================================================================
;  Chaines de caracteres (adressage RIP-relatif via LEA)
; =============================================================================
str_getprocaddr: db "GetProcAddress",  0
str_loadlib:     db "LoadLibraryA",    0
str_user32:      db "user32.dll",      0
str_msgboxa:     db "MessageBoxA",     0
str_caption:     db "CTF - RE Academy", 0
str_message:     db "Flag: zero_to_pro{IsDbg_byp4ss_v4lloc!}", 0
