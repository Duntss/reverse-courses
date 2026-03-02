// Helper functions for building content blocks
const h2 = (text) => ({ type: 'h2', text })
const h3 = (text) => ({ type: 'h3', text })
const p = (html) => ({ type: 'p', html })
const code = (lang, text) => ({ type: 'code', lang, code: text })
const note = (variant, title, text) => ({ type: 'callout', variant, title, text })
const list = (items, ordered = false) => ({ type: 'list', items, ordered })
const table = (headers, rows) => ({ type: 'table', headers, rows })
const hr = () => ({ type: 'divider' })

// NOTE: Flag validation is done client-side for this demo.
// In production, move flag verification to a secure backend endpoint.

const courses = [
  // ─────────────────────────────────────────────────────────────
  // COURS 1
  // ─────────────────────────────────────────────────────────────
  {
    id: 1,
    title: 'IDA Pro & Assembleur — Les bases',
    subtitle: 'Prendre en main IDA et lire du code machine',
    releaseDate: '2026-01-21T17:00:00Z',
    duration: '60 min + démo live',
    difficulty: 'Débutant',
    tags: ['IDA Pro', 'assembleur', 'x86-64', 'décompilation'],
    content: [
      h2('Présentation d\'IDA Pro'),
      p("<strong>IDA Pro</strong> (Interactive DisAssembler) est le désassembleur/décompilateur de référence dans l'industrie. Développé par Hex-Rays, il est utilisé quotidiennement par les analystes malware, les chercheurs en vulnérabilités et les équipes de CTF."),
      table(
        ['Version', 'Prix', 'Ce qu\'elle inclut'],
        [
          ['<strong>IDA Free</strong>', 'Gratuit', 'Désassemblage x86-64 uniquement, pas de décompilateur'],
          ['<strong>IDA Pro</strong>', '~3 000 €', 'Toutes architectures, décompilateur Hex-Rays inclus'],
          ['<strong>IDA Home</strong>', '~400 €/an', 'Usage personnel, x86-64 + ARM, Hex-Rays inclus'],
        ]
      ),
      note('info', 'Alternatives gratuites', "Si vous n'avez pas IDA Pro, <strong>Ghidra</strong> (NSA, gratuit) ou <strong>Binary Ninja</strong> (trial gratuit) sont d'excellentes alternatives avec décompilateur intégré. Les raccourcis diffèrent mais les concepts sont identiques."),
      h2('Charger un binaire dans IDA'),
      list([
        'Lancer IDA → <strong>New</strong> (ou glisser-déposer le fichier)',
        'IDA détecte automatiquement le format (ELF, PE, Mach-O…) et l\'architecture',
        'Cliquer <strong>OK</strong> sur la fenêtre de détection — laisser les options par défaut',
        'IDA lance l\'<strong>auto-analyse</strong> : il identifie les fonctions, les chaînes, les imports. Attendre la fin (barre de progression en bas)',
        'La base de données IDA est sauvegardée en <code>.i64</code> (64-bit) ou <code>.idb</code> (32-bit) — votre travail (renommages, commentaires) y est stocké',
      ], true),
      note('warning', 'Toujours compiler avec -O0 pour apprendre', "En TP, compilez vos binaires avec <code>gcc -O0</code> (désactive les optimisations). Avec <code>-O2</code> ou <code>-O3</code>, le compilateur transforme radicalement le code (inlining, loop unrolling…) ce qui rend la lecture beaucoup plus difficile."),
      h2('L\'interface IDA — vue d\'ensemble'),
      note('success', 'DÉMO LIVE', "L'instructeur ouvre <code>demo_ida</code> dans IDA et présente chaque fenêtre en direct."),
      h3('Les fenêtres principales'),
      table(
        ['Fenêtre', 'Raccourci', 'Rôle'],
        [
          ['<strong>IDA View</strong> (désassemblage)', '<code>Ctrl+1</code>', 'Vue principale — code assembleur, graph ou linéaire'],
          ['<strong>Functions</strong>', '<code>Ctrl+5</code>', 'Liste toutes les fonctions identifiées'],
          ['<strong>Strings</strong>', '<code>Shift+F12</code>', 'Toutes les chaînes trouvées dans le binaire'],
          ['<strong>Imports</strong>', '<code>Ctrl+4</code>', 'Fonctions importées depuis les libs dynamiques'],
          ['<strong>Exports</strong>', '<code>Ctrl+3</code>', 'Fonctions exportées (utile pour les DLL)'],
          ['<strong>Pseudocode</strong> (Hex-Rays)', '<code>F5</code>', 'Décompilation C de la fonction courante'],
          ['<strong>Output</strong>', '<code>Ctrl+2</code>', 'Messages d\'IDA (log d\'analyse)'],
          ['<strong>Hex View</strong>', '<code>Ctrl+Alt+H</code>', 'Vue hexadécimale synchronisée'],
        ]
      ),
      h3('Les deux vues du désassemblage'),
      p("<strong>Graph view</strong> (vue par défaut) : chaque <em>basic block</em> est un nœud. Les arêtes vertes = saut pris (JE quand ZF=1), rouges = saut non pris, bleues = saut inconditionnel. Parfait pour visualiser les conditions et les boucles."),
      p("<strong>Linear view</strong> : vue séquentielle comme objdump. Utile pour voir le code dans l'ordre d'adresses, ou pour les grandes fonctions où le graph est illisible."),
      code('text', `Basculer entre les deux : touche Espace`),
      h2('Les raccourcis essentiels'),
      note('success', 'DÉMO LIVE', "L'instructeur montre chaque raccourci en direct sur demo_ida."),
      h3('Navigation'),
      table(
        ['Raccourci', 'Action'],
        [
          ['<code>Espace</code>', 'Basculer Graph ↔ Linear view'],
          ['<code>Entrée</code>', 'Suivre le curseur (entrer dans une fonction / suivre un XREF)'],
          ['<code>Échap</code> / <code>Alt+←</code>', 'Revenir en arrière (historique de navigation)'],
          ['<code>Alt+→</code>', 'Avancer dans l\'historique'],
          ['<code>G</code>', 'Aller à une adresse / nom de fonction (<em>Go to address</em>)'],
          ['<code>Ctrl+P</code>', 'Aller à une fonction par nom'],
          ['<code>Tab</code>', 'Basculer entre IDA View et Pseudocode (synchronisés)'],
        ]
      ),
      h3('Analyse et renommage'),
      table(
        ['Raccourci', 'Action'],
        [
          ['<code>F5</code>', '<strong>Décompiler</strong> la fonction courante (Hex-Rays) ← le plus utilisé'],
          ['<code>N</code>', '<strong>Renommer</strong> une variable, une fonction, un label'],
          ['<code>Y</code>', 'Changer le <strong>type</strong> d\'une variable (signature)'],
          ['<code>;</code>', 'Ajouter un <strong>commentaire</strong> sur la ligne courante'],
          ['<code>Shift+;</code>', 'Commentaire <strong>répétable</strong> (visible partout où l\'adresse est référencée)'],
          ['<code>X</code>', '<strong>Cross-références</strong> (XREF) : où est utilisée cette variable / fonction ?'],
          ['<code>Ctrl+X</code>', 'XREF vers l\'élément courant'],
        ]
      ),
      h3('Conversion de données'),
      table(
        ['Raccourci', 'Action'],
        [
          ['<code>D</code>', 'Interpréter comme <strong>donnée</strong> (byte/word/dword)'],
          ['<code>C</code>', 'Interpréter comme <strong>code</strong>'],
          ['<code>A</code>', 'Interpréter comme <strong>chaîne ASCII</strong>'],
          ['<code>U</code>', '<strong>Annuler</strong> la définition (undefine)'],
          ['<code>P</code>', 'Créer une <strong>fonction</strong> à partir de l\'adresse courante'],
          ['<code>Alt+Q</code>', 'Accéder à la définition d\'une <strong>structure</strong>'],
        ]
      ),
      h3('Recherche'),
      table(
        ['Raccourci', 'Action'],
        [
          ['<code>Alt+T</code>', 'Chercher du <strong>texte</strong> dans le désassemblage'],
          ['<code>Ctrl+F</code>', 'Chercher dans la vue courante'],
          ['<code>Alt+B</code>', 'Chercher une <strong>séquence d\'octets</strong> (hex)'],
          ['<code>Ctrl+S</code>', 'Aller à un <strong>segment</strong>'],
        ]
      ),
      h2('Workflow d\'analyse typique'),
      note('success', 'DÉMO LIVE', "L'instructeur applique ce workflow sur demo_ida de bout en bout."),
      list([
        "<strong>Fenêtre Strings</strong> (<code>Shift+F12</code>) : chercher des chaînes intéressantes (\"password\", \"error\", \"access\"). Double-clic → on arrive dans le code qui utilise la chaîne.",
        "<strong>Fenêtre Imports</strong> (<code>Ctrl+4</code>) : voir quelles fonctions sont appelées. <code>strcmp</code>, <code>fopen</code>, <code>socket</code>… révèlent le comportement du programme.",
        "<strong>Fenêtre Functions</strong> (<code>Ctrl+5</code>) : identifier <code>main</code> (si non strippé) ou les fonctions avec beaucoup de XREF.",
        "<strong>Entrer dans main</strong> : comprendre le flux de contrôle global. Renommer les fonctions au fur et à mesure (<code>N</code>).",
        "<strong>F5</strong> sur chaque fonction intéressante : le pseudo-C révèle la logique. Renommer les variables (<code>N</code>) pour clarifier.",
        "<strong>XREF</strong> (<code>X</code>) sur les chaînes et fonctions clés : trouver tous les endroits où elles sont utilisées.",
      ], true),
      h2('Lire le désassemblage : les patterns de base'),
      h3('Appel de fonction'),
      code('text', `; C : check_length(input)
mov     rdi, [rbp+var_48]   ; 1er argument → rdi
call    check_length         ; appel
test    eax, eax             ; eax = valeur de retour (0 ou 1)
jz      short loc_fail       ; si retour == 0, sauter vers "échec"`),
      h3('Comparaison et branchement'),
      code('text', `; C : if (strlen(s) == 10)
call    strlen
cmp     rax, 0Ah      ; compare rax à 10 (0xA en hex)
jnz     short loc_0   ; si ≠ 10 → branche "faux" (rouge dans graph)
                       ; sinon → branche "vrai" (vert dans graph)`),
      h3('Boucle for'),
      code('text', `; C : for (i = 0; i < 10; i++) { out[i] = encoded[i] ^ 0x42; }
    mov     [rbp+var_4], 0      ; i = 0
loc_loop:
    cmp     [rbp+var_4], 9      ; i <= 9 ?
    jg      short loc_end       ; non → sortir de la boucle
    ; ... corps de la boucle (xor al, 42h) ...
    add     [rbp+var_4], 1      ; i++
    jmp     short loc_loop      ; reboucler`),
      h3('Switch / Table de sauts'),
      code('text', `; C : switch(level) { case 1: ... case 2: ... }
cmp     [rbp+level], 4     ; compare à la valeur max du switch
ja      short loc_default   ; > 4 → default
mov     eax, [rbp+level]
jmp     ds:jpt_401200[rax*8]  ; ← table de sauts !
                               ;   chaque entrée pointe vers un case`),
      h2('Le décompilateur Hex-Rays (F5)'),
      p("Appuyer sur <strong>F5</strong> dans la vue désassemblage génère du pseudo-code C. C'est l'outil le plus puissant d'IDA — il peut transformer 50 lignes d'assembleur en 5 lignes de C lisible."),
      note('warning', 'Pseudo-C ≠ C réel', "Le code généré par Hex-Rays n'est <strong>pas du C valide</strong> : les types sont souvent <code>__int64</code> ou <code>_BYTE *</code>, les noms sont <code>v1, v2, v3...</code>. Votre travail : renommer les variables (<code>N</code>) et corriger les types (<code>Y</code>) pour rendre le code lisible."),
      code('c', `// Avant renommage (généré par Hex-Rays)
int __fastcall sub_401136(__int64 a1)
{
  if ( strlen((const char *)a1) != 10 )
    return 0;
  return 1;
}

// Après renommage (N sur a1 → "input", N sur sub_401136 → "check_length")
int check_length(const char *input)
{
  if ( strlen(input) != 10 )
    return 0;
  return 1;
}`),
      h2('Les Cross-Références (XREF)'),
      p("Quand IDA affiche <code>; CODE XREF: main+3A↑j</code>, cela signifie que cette adresse est référencée depuis <code>main</code>. La touche <strong>X</strong> ouvre une fenêtre avec <em>toutes</em> les références."),
      note('success', 'DÉMO LIVE', "Depuis la Strings window, double-clic sur \"Mot de passe\", puis X sur la chaîne pour remonter jusqu'à la fonction qui l'affiche."),
      code('text', `; Exemple XREF dans la vue linéaire
.rodata:0040200A aMotDePasse db 'Mot de passe : ',0
                  ; DATA XREF: main+45↑o   ← utilisée dans main, offset +0x45`),
      h2('IDAPython — Scripter IDA'),
      p("IDA intègre un interpréteur <strong>Python 3</strong> complet. Vous pouvez automatiser des tâches répétitives, écrire des analyses personnalisées, ou interroger/modifier la base de données IDA par programme. C'est un game-changer pour les analyses à grande échelle."),
      h3('Accéder à IDAPython'),
      table(
        ['Méthode', 'Raccourci / Accès'],
        [
          ['Console interactive', '<code>View → Scripting console</code> — REPL Python en temps réel'],
          ['Exécuter un script', '<code>Alt+F7</code> ou <code>File → Script file…</code>'],
          ['Script one-liner', 'Barre de commande IDA en bas — <code>python</code> puis votre code'],
          ['Plugin permanent', 'Copier un <code>.py</code> dans <code>%IDA_DIR%/plugins/</code>'],
        ]
      ),
      h3('Les modules clés'),
      table(
        ['Module', 'Rôle'],
        [
          ['<code>idc</code>', 'Fonctions historiques portées en Python (GetBytes, MakeName, SetComment…)'],
          ['<code>idaapi</code>', 'API bas niveau — accès direct aux structures internes d\'IDA'],
          ['<code>idautils</code>', 'Itérateurs pratiques : <code>Functions()</code>, <code>CodeRefsTo()</code>, <code>Heads()</code>…'],
          ['<code>ida_bytes</code>', 'Lecture/écriture d\'octets dans la base'],
          ['<code>ida_funcs</code>', 'Informations sur les fonctions (taille, flags, xrefs)'],
          ['<code>ida_name</code>', 'Lire/écrire les noms de symboles'],
        ]
      ),
      note('success', 'DÉMO LIVE', "L'instructeur ouvre la console IDAPython sur <code>demo_ida</code> et exécute les snippets ci-dessous en direct."),
      code('python', `# ── Lister toutes les fonctions du binaire ──────────────────
import idautils, idc
for func_ea in idautils.Functions():
    print(f"{hex(func_ea)}  {idc.get_func_name(func_ea)}")

# ── Lire les octets sous le curseur ─────────────────────────
ea = idc.get_screen_ea()
print(idc.get_bytes(ea, 16).hex())

# ── Renommer une fonction ────────────────────────────────────
idc.set_name(0x401136, "check_length", idc.SN_CHECK)

# ── Trouver tous les appels à strcmp ────────────────────────
import idautils, idc
strcmp_ea = idc.get_name_ea_simple("strcmp")
for xref in idautils.CodeRefsTo(strcmp_ea, True):
    print(f"  appel depuis : {hex(xref)}  ({idc.get_func_name(xref)})")

# ── Chercher une constante (ex: clé XOR 0x42) ───────────────
import idautils
for head in idautils.Heads():
    if idc.print_insn_mnem(head) == "xor":
        op = idc.print_operand(head, 1)
        if op == "42h":
            print(f"  xor 0x42 à : {hex(head)}")`),
      h2('Plugins IDA — L\'écosystème'),
      p("La puissance d'IDA vient aussi de son <strong>écosystème de plugins</strong>. La communauté reverse engineering a produit des centaines de plugins qui couvrent tous les besoins."),
      h3('Plugins incontournables'),
      table(
        ['Plugin', 'Usage'],
        [
          ['<strong>FLOSS</strong> (Mandiant)', 'Extraction avancée de chaînes : stackstrings, obfusquées, encodées — va bien au-delà de <code>strings</code>'],
          ['<strong>BinDiff</strong> (Google)', 'Comparaison de deux binaires (diff entre versions d\'un malware, avant/après patch)'],
          ['<strong>Keypatch</strong>', 'Patcher des instructions directement dans IDA avec la syntaxe assembleur Intel'],
          ['<strong>findcrypt</strong>', 'Identifier les constantes cryptographiques (tables AES, RC4, SHA…) dans le binaire'],
          ['<strong>ret-sync</strong>', 'Synchroniser IDA avec GDB / WinDbg / x64dbg — le curseur IDA suit l\'exécution live'],
          ['<strong>HexRaysPyTools</strong>', 'Améliore le décompilateur : struct reconstruction, propagation de types'],
          ['<strong>idat.py (FIDL)</strong>', 'Framework for IDA plugins en Python pur'],
        ]
      ),
      h3('Installer un plugin Python'),
      code('bash', `# La plupart des plugins Python s'installent de la même façon :
# 1. Copier le .py dans le dossier plugins d'IDA
#    Windows : C:\\Program Files\\IDA Pro XX\\plugins\\
#    Linux   : ~/.idapro/plugins/  (ou $IDA_DIR/plugins/)

# 2. (si requis) Installer les dépendances dans l'interpréteur Python d'IDA
#    Dans la console IDAPython :
import subprocess, sys
subprocess.run([sys.executable, "-m", "pip", "install", "nom_du_package"])`),
      h2('IDA-MCP — L\'IA directement dans IDA'),
      p("<strong>ida-mcp</strong>, développé par <strong>mrexodia</strong>, est un plugin qui expose IDA Pro comme un serveur <strong>MCP</strong> (Model Context Protocol). Cela permet à un assistant IA — comme <strong>Claude</strong> — d'interagir directement avec votre session IDA : poser des questions sur le binaire, renommer des fonctions, générer des annotations, comprendre des algorithmes complexes."),
      note('info', 'C\'est quoi MCP ?', "Le <strong>Model Context Protocol</strong> est un protocole ouvert développé par Anthropic. Il définit comment des outils externes (IDA, un terminal, une base de données…) peuvent exposer leurs fonctionnalités à un modèle d'IA de façon standardisée. IDA-MCP « branche » IDA sur ce protocole."),
      note('success', 'DÉMO LIVE', "L'instructeur montre ida-mcp en action : Claude reçoit le pseudo-code de <code>decode_secret</code> directement depuis IDA et explique l'algorithme XOR, puis renomme les variables automatiquement."),
      h3('Ce que Claude peut faire via ida-mcp'),
      list([
        "Expliquer ce que fait une fonction : <em>\"Analyse la fonction à 0x401180 et explique son algorithme\"</em>",
        "Renommer automatiquement : <em>\"Renomme toutes les variables de sub_401136 avec des noms lisibles\"</em>",
        "Identifier des patterns : <em>\"Y a-t-il des techniques anti-debug dans ce binaire ?\"</em>",
        "Générer des commentaires : <em>\"Ajoute des commentaires IDA sur chaque bloc de decode_secret\"</em>",
        "Analyser les imports : <em>\"Quelles fonctions réseau sont importées et où sont-elles appelées ?\"</em>",
      ]),
      h3('Installation ida-mcp'),
      code('bash', `# 1. Télécharger le plugin
#    https://github.com/mrexodia/ida-mcp
#    (ou : git clone https://github.com/mrexodia/ida-mcp)

# 2. Copier dans le dossier plugins d'IDA
#    Windows : copier ida_mcp.py dans C:\\Program Files\\IDA Pro XX\\plugins\\

# 3. Installer les dépendances MCP dans l'interpréteur Python d'IDA
#    Dans la console IDAPython (Alt+F7 ou Scripting console) :
import subprocess, sys
subprocess.run([sys.executable, "-m", "pip", "install", "mcp"])

# 4. Redémarrer IDA → le plugin se charge automatiquement
#    Vérifier dans Output window : "[ida-mcp] Server started on port XXXX"`),
      h3('Configurer le client MCP (Claude Desktop)'),
      code('json', `// Ajouter dans claude_desktop_config.json
// Windows : %APPDATA%\\Claude\\claude_desktop_config.json
{
  "mcpServers": {
    "ida": {
      "command": "python",
      "args": ["C:/chemin/vers/ida-mcp/client.py"],
      "env": {
        "IDA_MCP_HOST": "127.0.0.1",
        "IDA_MCP_PORT": "13337"
      }
    }
  }
}`),
      note('warning', 'Sécurité', "IDA-MCP expose une API réseau locale. Ne l'activez <strong>jamais</strong> sur un réseau non-trusté ou en analysant un malware actif. Le plugin tourne sur <code>localhost</code> uniquement par défaut."),
      h2('Le programme de démo'),
      p("Le fichier <code>demo/demo_ida.c</code> a été conçu pour illustrer les 5 patterns vus dans ce cours. Le compiler et l'ouvrir dans IDA :"),
      code('bash', `# Linux
gcc -O0 -o demo_ida demo_ida.c        # binaire strippé (réaliste)
gcc -O0 -g -o demo_ida_sym demo_ida.c # avec symboles  (pour comparer)

# Ouvrir les DEUX dans IDA et comparer :
# avec symboles  → noms de fonctions visibles  (check_length, decode_secret...)
# sans symboles  → sub_401136, sub_401180...    ← situation réelle`),
      p("Points à retrouver lors de la démo :"),
      list([
        "<strong>[1] check_length</strong> → chercher la constante <code>0Ah</code> dans le graph, identifier les blocs succès/échec",
        "<strong>[2] decode_secret</strong> → repérer la boucle, voir <code>xor al, 42h</code>, reconstruire le mot de passe",
        "<strong>[3] check_sum</strong> → lire <code>imul</code>, <code>sub 2Ah</code>, <code>cmp 64h</code> → retrouver les constantes 42 et 100",
        "<strong>[4] print_banner</strong> → identifier la <em>jump table</em> et les 5 basic blocks",
        "<strong>[5] main</strong> → suivre le flux de A à Z, trouver l'appel à <code>strcmp</code> et ses arguments",
      ]),
    ],
    exercise: {
      title: 'Cracker le programme de démo',
      type: 'flag',
      scenario: "Vous venez de suivre la démo live. Maintenant, à vous de jouer : ouvrez demo_ida.exe dans IDA (ou Ghidra) et retrouvez le mot de passe par vous-même sans regarder le code source C.",
      description: "Téléchargez le binaire <code>demo_ida.exe</code> ci-dessous et analysez-le avec IDA Pro ou Ghidra. Trouvez le mot de passe attendu par le programme. Le flag à soumettre est le mot de passe lui-même.",
      downloadFile: 'demo_ida.exe',
      downloadUrl: '/downloads/demo_ida.exe',
      hints: [
        "Ouvrez la <strong>Strings window</strong> (<code>Shift+F12</code> dans IDA). Le mot de passe n'apparaît <strong>pas en clair</strong> — il est obfusqué par XOR. Cherchez dans les imports la fonction <code>strcmp</code> et remontez depuis ses XREF jusqu'à la fonction de vérification.",
        "Dans IDA, repérez la fonction avec une <strong>boucle contenant <code>xor</code></strong> (back edge verte dans le graph). Relevez la clé XOR (une constante dans l'instruction <code>xor al, ??h</code>) et les octets du tableau. Utilisez ensuite <strong>CyberChef</strong> pour déchiffrer : allez sur <code>gchq.github.io/CyberChef</code>, glissez l'opération <em>XOR</em> dans la Recipe, entrez la clé en Hex, collez les octets en Input au format <code>2b 26 23 1d 30 72 21 29 77 63</code>.",
        "Avec <strong>F5</strong> (Hex-Rays) sur la fonction de décodage, le pseudo-code montre directement <code>out[i] = encoded[i] ^ 0x42</code>. Les octets sont <code>0x2B, 0x26, 0x23, 0x1D, 0x30, 0x72, 0x21, 0x29, 0x77, 0x63</code>. Dans CyberChef : Input = <code>2b2623 1d3072 212977 63</code> (From Hex) → XOR clé <code>42</code> → le mot de passe apparaît en Output.",
      ],
      answer: 'ida_r0ck5!',
    },
  },

  // ─────────────────────────────────────────────────────────────
  // COURS 2
  // ─────────────────────────────────────────────────────────────
  {
    id: 2,
    title: 'Formats Binaires : ELF & PE',
    subtitle: 'Anatomie des fichiers exécutables',
    releaseDate: '2026-03-11T17:00:00Z',
    duration: '60 min',
    difficulty: 'Débutant',
    tags: ['ELF', 'PE', 'format', 'headers'],
    content: [
      h2('Pourquoi étudier les formats binaires ?'),
      p("Comprendre la structure d'un fichier exécutable est <strong>indispensable</strong> en reverse engineering. Cette structure détermine comment le système d'exploitation charge le programme en mémoire, quelles bibliothèques il utilise, et où se trouvent le code et les données. Ignorer ces formats, c'est travailler à l'aveugle."),
      h2('Le format ELF (Linux/Unix)'),
      p("<strong>ELF</strong> (Executable and Linkable Format) est le format exécutable standard des systèmes Unix/Linux. Il est utilisé pour les exécutables, les bibliothèques partagées (<code>.so</code>), les fichiers objets (<code>.o</code>) et les core dumps."),
      h3('Structure générale'),
      code('text', `┌─────────────────────────────┐
│       ELF Header (64 bytes) │  ← Métadonnées globales
├─────────────────────────────┤
│   Program Header Table      │  ← Comment charger en mémoire
├─────────────────────────────┤
│                             │
│   Sections (.text, .data…)  │  ← Contenu réel
│                             │
├─────────────────────────────┤
│   Section Header Table      │  ← Index des sections
└─────────────────────────────┘`),
      h3('L\'ELF Header'),
      p("Les 4 premiers octets sont le <strong>magic number</strong> : <code>7f 45 4c 46</code> (soit <code>\\x7fELF</code> en ASCII). Ils identifient le fichier comme un ELF."),
      table(
        ['Offset', 'Taille', 'Champ', 'Description'],
        [
          ['0x00', '4 octets', '<code>e_ident[EI_MAG]</code>', 'Magic: <code>7f 45 4c 46</code>'],
          ['0x04', '1 octet', '<code>e_ident[EI_CLASS]</code>', '1=32-bit, 2=64-bit'],
          ['0x05', '1 octet', '<code>e_ident[EI_DATA]</code>', '1=little-endian, 2=big-endian'],
          ['0x06', '1 octet', '<code>e_ident[EI_VERSION]</code>', 'Version ELF (toujours 1)'],
          ['0x07', '1 octet', '<code>e_ident[EI_OSABI]</code>', 'ABI cible (0=System V)'],
          ['0x10', '2 octets', '<code>e_type</code>', '2=exécutable, 3=shared, 4=core'],
          ['0x12', '2 octets', '<code>e_machine</code>', '0x3E=x86-64, 0x28=ARM'],
          ['0x18', '8 octets', '<code>e_entry</code>', 'Adresse du point d\'entrée'],
          ['0x20', '8 octets', '<code>e_phoff</code>', 'Offset de la Program Header Table'],
          ['0x28', '8 octets', '<code>e_shoff</code>', 'Offset de la Section Header Table'],
        ]
      ),
      code('bash', `# Lire l'ELF header
readelf -h ./binary

# Afficher les sections
readelf -S ./binary

# Afficher les segments (program headers)
readelf -l ./binary

# Vue hexadécimale du début du fichier
xxd ./binary | head -4
# 00000000: 7f45 4c46 0201 0100 0000 0000 0000 0000  .ELF............`),
      h3('Sections importantes'),
      table(
        ['Section', 'Description'],
        [
          ['<code>.text</code>', 'Code exécutable (instructions machine)'],
          ['<code>.data</code>', 'Variables globales initialisées'],
          ['<code>.bss</code>', 'Variables globales non initialisées (zéro au démarrage)'],
          ['<code>.rodata</code>', 'Données en lecture seule (chaînes constantes, tables)'],
          ['<code>.plt</code>', 'Procedure Linkage Table : trampoline vers les fonctions dynamiques'],
          ['<code>.got</code>', 'Global Offset Table : adresses résolues par le linker dynamique'],
          ['<code>.symtab</code>', 'Table des symboles (présente si non strippé)'],
          ['<code>.debug_*</code>', 'Informations de débogage DWARF (si compilé avec -g)'],
        ]
      ),
      note('info', 'Binary strippé', "Quand on dit qu'un binaire est <strong>strippé</strong> (<code>strip ./binary</code>), cela signifie que la table des symboles (<code>.symtab</code>, <code>.strtab</code>) a été supprimée. Les noms de fonctions n'apparaissent plus, ce qui rend l'analyse plus difficile."),
      h2('Le format PE (Windows)'),
      p("Le format <strong>PE</strong> (Portable Executable) est l'équivalent Windows d'ELF. Il est utilisé pour les <code>.exe</code>, <code>.dll</code>, <code>.sys</code>, <code>.ocx</code>..."),
      h3('Structure générale'),
      code('text', `┌──────────────────────────────┐
│   DOS Header (64 bytes)      │  ← Commence par "MZ" (4D 5A)
│   DOS Stub (petit programme) │  ← Affiche "This program cannot..."
├──────────────────────────────┤
│   PE Signature ("PE\\0\\0")    │  ← 50 45 00 00
├──────────────────────────────┤
│   COFF Header (20 bytes)     │  ← Architecture, nbre de sections
├──────────────────────────────┤
│   Optional Header            │  ← Point d'entrée, ImageBase, ...
├──────────────────────────────┤
│   Section Table              │  ← .text, .data, .rdata, .rsrc
├──────────────────────────────┤
│   Sections                   │  ← Contenu réel
└──────────────────────────────┘`),
      p("Le <strong>DOS Header</strong> commence toujours par <code>4D 5A</code> (<code>MZ</code>, initiales de Mark Zbikowski, développeur MS-DOS). Le champ <code>e_lfanew</code> à l'offset 0x3C pointe vers le PE Header."),
      h3('Sections PE courantes'),
      table(
        ['Section', 'Description'],
        [
          ['<code>.text</code>', 'Code exécutable'],
          ['<code>.data</code>', 'Variables globales initialisées'],
          ['<code>.rdata</code>', 'Données en lecture seule, imports/exports'],
          ['<code>.rsrc</code>', 'Ressources (icônes, chaînes, dialogues)'],
          ['<code>.reloc</code>', 'Table de réadressage (relocation)'],
          ['<code>UPX0</code>, <code>UPX1</code>', 'Sections typiques d\'un binaire compressé UPX'],
        ]
      ),
      note('warning', 'Entropie et packing', "Une section avec une entropie élevée (proche de 8.0) est souvent le signe d'un binaire <strong>packé ou chiffré</strong>. Les outils comme <code>die</code> (Detect-It-Easy) ou PEiD peuvent identifier le packer utilisé."),
      h2('Identifier un fichier : les magic bytes'),
      p("Chaque format de fichier possède une <strong>signature unique</strong> dans ses premiers octets, appelée <em>magic bytes</em>. La commande <code>file</code> se base sur ces signatures (et d'autres heuristiques) pour identifier le type d'un fichier."),
      code('bash', `# Exemples de magic bytes courants
7f 45 4c 46  →  ELF (Linux exécutable)
4d 5a        →  MZ (Windows PE)
50 4b 03 04  →  ZIP (aussi .jar, .apk, .docx)
25 50 44 46  →  PDF
ca fe ba be  →  Java Class file
cf fa ed fe  →  Mach-O (macOS, iOS) 64-bit little-endian

# Utiliser 'file' pour identifier
file suspicious_binary
# suspicious_binary: ELF 64-bit LSB executable, x86-64, dynamically linked

# Voir les magic bytes en hexa
xxd suspicious_binary | head -2`),
      h2('Outils pratiques'),
      list([
        '<strong>readelf</strong> — Analyse complète des ELF (sections, symboles, dynamique)',
        '<strong>objdump</strong> — Désassemblage et inspection des sections',
        '<strong>xxd / hexdump</strong> — Vue hexadécimale brute',
        '<strong>nm</strong> — Liste les symboles d\'un binaire non strippé',
        '<strong>ldd</strong> — Liste les bibliothèques dynamiques requises',
        '<strong>PE-bear</strong> — Éditeur/viewer graphique pour les PE (Windows)',
        '<strong>CFF Explorer</strong> — Inspection et édition de PE',
        '<strong>Detect-It-Easy (die)</strong> — Identification du compilateur et du packer',
      ]),
    ],
    exercise: {
      title: 'Autopsie d\'un ELF',
      type: 'flag',
      scenario: "Un binaire ELF a été trouvé sur un honeypot. Avant de l'analyser dynamiquement, vous devez cartographier sa structure et identifier ses sections. Un flag a été caché dans ses métadonnées.",
      description: "Analysez le fichier <code>challenge02</code> avec <code>readelf</code> et <code>xxd</code>. Identifiez l'architecture cible et trouvez le flag encodé en base64 dans une section inhabituelle.",
      downloadFile: 'challenge02',
      hints: [
        "Utilisez <code>readelf -S challenge02</code> pour lister toutes les sections. Cherchez une section avec un nom inhabituel ou une taille étrange.",
        "Utilisez <code>readelf -p .nomdelasection challenge02</code> pour afficher le contenu textuel d'une section. Essayez toutes les sections insolites.",
        "Le flag est dans une section <code>.note.flag</code>. Décodez la valeur base64 trouvée : <code>echo 'valeur_base64' | base64 -d</code>",
      ],
      answer: 'FLAG{3lf_s3ct10ns_4r3_g0ld}',
    },
  },

  // ─────────────────────────────────────────────────────────────
  // COURS 3
  // ─────────────────────────────────────────────────────────────
  {
    id: 3,
    title: 'Analyse Statique',
    subtitle: 'Extraire l\'information sans exécuter le binaire',
    releaseDate: '2026-03-18T17:00:00Z',
    duration: '55 min',
    difficulty: 'Intermédiaire',
    tags: ['strings', 'objdump', 'ghidra', 'static'],
    content: [
      h2('Principe de l\'analyse statique'),
      p("L'<strong>analyse statique</strong> consiste à examiner un binaire <em>sans l'exécuter</em>. C'est la première étape d'une analyse : elle est sûre (le malware ne peut pas s'activer), rapide, et fournit une vue d'ensemble du programme. Ses limites apparaissent face au code obfusqué ou packé."),
      h2('Étape 1 : Reconnaissance rapide'),
      code('bash', `# 1. Identifier le type de fichier
file binary
# binary: ELF 64-bit LSB pie executable, x86-64, dynamically linked

# 2. Calcul du hash (vérification d'intégrité + VirusTotal)
sha256sum binary
md5sum binary

# 3. Lister les bibliothèques dynamiques nécessaires
ldd binary
# linux-vdso.so.1 (...)
# libc.so.6 => /lib/x86_64-linux-gnu/libc.so.6

# 4. Vérifier si le binaire est strippé
nm binary 2>&1 | head
# Si "no symbols" → strippé

# 5. Protections activées
checksec --file=binary
# RELRO: Partial  STACK_CANARY: No  NX: Yes  PIE: Yes`),
      h2('strings — Extraction de chaînes'),
      p("La commande <code>strings</code> est souvent la <strong>première arme</strong> d'un analyste. Elle extrait toutes les séquences de caractères imprimables d'une longueur minimale (par défaut 4)."),
      code('bash', `# Usage de base
strings binary

# Spécifier la longueur minimale (ici 8 caractères)
strings -n 8 binary

# Inclure l'offset de chaque chaîne
strings -t x binary   # offset en hex
strings -t d binary   # offset en décimal

# Cibler une section spécifique
strings -d binary     # section .data uniquement

# Filtrer avec grep
strings binary | grep -i password
strings binary | grep -i http
strings binary | grep "FLAG{"
strings binary | grep -E "[A-Z0-9]{32}"  # Hash MD5`),
      note('info', 'Ce que révèlent les strings', "Les chaînes d'un binaire peuvent révéler : URLs de C2 (Command & Control), chemins de fichiers, clés en dur, messages d'erreur, noms de fonctions importées, versions de librairies, commandes shell, flags de CTF..."),
      h2('objdump — Désassemblage'),
      p("<code>objdump</code> est un outil multi-usage : il peut désassembler du code, afficher les en-têtes, les symboles et les sections d'un binaire."),
      code('bash', `# Désassembler toutes les sections exécutables
objdump -d binary

# Désassembler avec syntaxe Intel (plus lisible)
objdump -d -M intel binary

# Désassembler UNE section spécifique
objdump -d -j .text binary

# Afficher le contenu d'une section en hex+ASCII
objdump -s -j .rodata binary

# Lister les symboles (si non strippé)
objdump -t binary

# Lister les imports (fonctions dynamiques)
objdump -p binary | grep -A 30 "Dynamic Section"`),
      code('text', `# Exemple de désassemblage Intel
0000000000401136 <check_password>:
  401136: 55                   push   rbp
  401137: 48 89 e5             mov    rbp, rsp
  40113a: 48 83 ec 10          sub    rsp, 0x10
  40113e: 48 89 7d f8          mov    QWORD PTR [rbp-0x8], rdi
  401142: 48 8b 45 f8          mov    rax, QWORD PTR [rbp-0x8]
  401146: 48 89 c7             mov    rdi, rax
  401149: e8 e2 fe ff ff       call   401030 <strlen@plt>
  40114e: 48 83 f8 08          cmp    rax, 0x8      ← Compare longueur à 8
  401152: 74 07                je     40115b        ← Saut si égal
  401154: b8 00 00 00 00       mov    eax, 0x0
  401159: eb 19                jmp    401174        ← Retourne 0 (échec)`),
      h2('readelf — Inspection ELF'),
      code('bash', `# Header principal
readelf -h binary

# Sections (noms, tailles, offsets)
readelf -S binary

# Segments (program headers, mapping mémoire)
readelf -l binary

# Table des symboles dynamiques
readelf -D binary

# Relocation entries
readelf -r binary

# Afficher le contenu d'une section en texte
readelf -p .rodata binary

# Tout d'un coup (verbose)
readelf -a binary | less`),
      h2('Ghidra — Décompilation'),
      p("<strong>Ghidra</strong> est un framework de reverse engineering open-source développé par la NSA, publié en 2019. Il inclut un <strong>décompilateur</strong> qui génère du pseudo-code C à partir du binaire, rendant l'analyse beaucoup plus rapide."),
      h3('Workflow Ghidra'),
      list([
        '<strong>Créer un projet</strong> : File → New Project → Non-Shared Project',
        '<strong>Importer le binaire</strong> : File → Import File, laisser Ghidra auto-détecter le format',
        '<strong>Analyse automatique</strong> : Double-clic sur le fichier → Analyze (laisser les options par défaut)',
        '<strong>Navigation</strong> : Symbol Tree pour les fonctions, Listing pour le désassemblage, Decompiler pour le pseudo-C',
        '<strong>Renommer</strong> : Clic droit sur une variable/fonction → Rename (L pour Label)',
        '<strong>Annoter</strong> : Clic droit → Set Comment (avec ; dans la vue Listing)',
      ], true),
      note('warning', 'Limitations de la décompilation', "Le pseudo-code généré par Ghidra n'est <strong>pas du C valide</strong>. Les types peuvent être erronés, les structures absentes, et certaines optimisations du compilateur produisent du code difficile à lire. Croisez toujours avec la vue assembleur."),
      h2('Recherche de patterns critiques'),
      h3('Fonctions d\'intérêt'),
      p("En analyse de malware ou CTF, cherchez en priorité les appels à ces fonctions :"),
      list([
        "<code>strcmp</code>, <code>strncmp</code>, <code>memcmp</code> → comparaisons de chaînes/buffers (souvent là où se fait la validation d'un mot de passe)",
        "<code>strcpy</code>, <code>strcat</code>, <code>gets</code> → fonctions dangereuses, sources de buffer overflow",
        "<code>system</code>, <code>execve</code>, <code>popen</code> → exécution de commandes",
        "<code>fopen</code>, <code>open</code>, <code>read</code>, <code>write</code> → opérations fichiers",
        "<code>socket</code>, <code>connect</code>, <code>recv</code>, <code>send</code> → réseau",
        "<code>CreateProcess</code>, <code>VirtualAlloc</code>, <code>WriteProcessMemory</code> → injection Windows",
      ]),
      code('bash', `# Trouver tous les appels à strcmp dans le désassemblage
objdump -d binary | grep "call.*strcmp"

# Utiliser nm pour lister les fonctions importées
nm -D binary | grep -i "cmp\|cpy\|exec\|system"`),
    ],
    exercise: {
      title: 'Secrets en Clair',
      type: 'flag',
      scenario: "Un développeur débutant a codé un programme de vérification de licence. Par manque d'expérience, il a stocké des informations sensibles directement dans le binaire. Votre mission : les retrouver.",
      description: "Analysez le binaire <code>challenge03</code> avec les outils vus en cours. Le programme contient un mot de passe hardcodé et compare votre entrée avec lui. Trouvez ce mot de passe — c'est votre flag.",
      downloadFile: 'challenge03',
      hints: [
        "Commencez par <code>strings challenge03</code> et regardez ce qui ressemble à un mot de passe ou un format de flag.",
        "Utilisez <code>objdump -d -M intel challenge03</code> et cherchez les appels à <code>strcmp</code> ou <code>strncmp</code>. Juste avant l'appel, les arguments sont chargés dans <code>rdi</code> et <code>rsi</code>.",
        "Dans Ghidra, trouvez la fonction <code>main</code> ou la fonction de vérification. Le décompilateur vous montrera clairement la comparaison : <code>iVar1 = strcmp(param,\"FLAG{...}\")</code>",
      ],
      answer: 'FLAG{n3v3r_h4rdc0d3_s3cr3ts}',
    },
  },

  // ─────────────────────────────────────────────────────────────
  // COURS 4
  // ─────────────────────────────────────────────────────────────
  {
    id: 4,
    title: 'Analyse Dynamique',
    subtitle: 'Observer un binaire en temps réel',
    releaseDate: '2026-03-25T17:00:00Z',
    duration: '65 min',
    difficulty: 'Intermédiaire',
    tags: ['GDB', 'strace', 'ltrace', 'dynamic'],
    content: [
      h2('Pourquoi l\'analyse dynamique ?'),
      p("L'analyse statique atteint ses limites face au code <strong>packé</strong> (compressé/chiffré en mémoire), <strong>obfusqué</strong> (logique intentionnellement complexifiée), ou dépendant de l'environnement. L'analyse dynamique <em>exécute</em> le programme et observe son comportement : allocations mémoire, appels système, valeurs en registres, flux de données."),
      note('danger', 'Sécurité absolue', "N'exécutez JAMAIS un binaire suspect sur votre machine principale. Utilisez une VM avec : snapshot récent, réseau désactivé ou simulé (FakeNet, INetSim), dossiers partagés désactivés. Un malware peut détecter les VMs — envisagez des solutions bare-metal isolées pour les analyses avancées."),
      h2('strace — Tracer les appels système'),
      p("<code>strace</code> intercepte tous les <strong>appels système</strong> (syscalls) effectués par un processus. Sur Linux, chaque interaction avec le noyau (lecture de fichier, connexion réseau, allocation mémoire) passe par un syscall."),
      code('bash', `# Tracer tous les syscalls
strace ./binary

# Filtrer sur des syscalls spécifiques
strace -e trace=open,read,write,execve ./binary

# Sauvegarder dans un fichier
strace -o output.txt ./binary

# Suivre les processus fils aussi
strace -f ./binary

# Attacher à un processus déjà en cours
strace -p <PID>

# Afficher les timestamps
strace -t ./binary`),
      code('text', `# Exemple de sortie strace
execve("./binary", ["./binary"], 0x7fff...) = 0
brk(NULL)                               = 0x5570...
openat(AT_FDCWD, "/etc/ld.so.cache", O_RDONLY) = 3
mmap(NULL, 4096, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_ANONYMOUS) = 0x7f...
write(1, "Enter password: ", 16)        = 16   ← Affiche un prompt
read(0, "test\n", 1024)                 = 5    ← Lit l'entrée utilisateur
write(1, "Wrong password!\n", 16)       = 16   ← Message d'erreur`),
      h2('ltrace — Tracer les appels de bibliothèques'),
      p("<code>ltrace</code> intercepte les appels aux <strong>bibliothèques partagées</strong> (libc, etc.). Particulièrement utile pour voir les arguments passés à <code>strcmp</code>, <code>strcpy</code>, etc."),
      code('bash', `# Tracer les appels de bibliothèques
ltrace ./binary

# Avec les valeurs de retour
ltrace -r ./binary

# Filtrer une fonction spécifique
ltrace -e strcmp ./binary`),
      code('text', `# Exemple ltrace - révèle le mot de passe !
__libc_start_main(0x401136, 1, 0x7fff...) = 0
puts("Enter password: ")                = 17
fgets("test", 256, stdin)               = 0x7fff...
strcmp("test", "s3cr3t_p4ssw0rd")      = -1  ← BINGO ! On voit les deux arguments
puts("Wrong password!")                  = 17
exit(1)                                 = <void>`),
      note('warning', 'Limitations ltrace', "<code>ltrace</code> ne fonctionne pas sur les binaires statiquement liés (pas de bibliothèques dynamiques). Pour ces cas, utilisez GDB ou Frida."),
      h2('GDB — Le débogueur GNU'),
      p("<strong>GDB</strong> (GNU Debugger) est l'outil de référence pour le débogage sous Linux. Il permet de mettre des points d'arrêt, d'inspecter la mémoire et les registres, et de modifier l'exécution à la volée."),
      h3('Commandes essentielles GDB'),
      table(
        ['Commande', 'Abréviation', 'Description'],
        [
          ['<code>run [args]</code>', '<code>r</code>', 'Lance le programme'],
          ['<code>break *0x401136</code>', '<code>b</code>', 'Breakpoint à une adresse'],
          ['<code>break main</code>', '<code>b</code>', 'Breakpoint sur une fonction (si non strippé)'],
          ['<code>next</code>', '<code>n</code>', 'Instruction suivante (sans entrer dans les fonctions)'],
          ['<code>step</code>', '<code>s</code>', 'Instruction suivante (entre dans les fonctions)'],
          ['<code>continue</code>', '<code>c</code>', 'Continuer jusqu\'au prochain breakpoint'],
          ['<code>info registers</code>', '<code>i r</code>', 'Affiche tous les registres'],
          ['<code>print $rax</code>', '<code>p $rax</code>', 'Affiche la valeur du registre RAX'],
          ['<code>x/20x $rsp</code>', '', 'Examine 20 mots en hexa à l\'adresse RSP'],
          ['<code>x/s 0x402000</code>', '', 'Examine une chaîne à cette adresse'],
          ['<code>disas main</code>', '', 'Désassemble la fonction main'],
          ['<code>backtrace</code>', '<code>bt</code>', 'Affiche la pile d\'appels'],
          ['<code>quit</code>', '<code>q</code>', 'Quitter GDB'],
        ]
      ),
      code('bash', `# Lancer GDB
gdb ./binary

# Désactiver l'ASLR pour des adresses stables
set disable-randomization on  # (ou via: echo 0 > /proc/sys/kernel/randomize_va_space)

# Mettre un breakpoint sur strcmp et voir les arguments
(gdb) break strcmp
(gdb) run
(gdb) # Quand strcmp est atteint :
(gdb) x/s $rdi   # Premier argument (notre input)
(gdb) x/s $rsi   # Second argument (la chaîne de comparaison)`),
      h3('Extensions GDB'),
      p("GDB de base est fonctionnel mais peu ergonomique. Des extensions améliorent massivement l'interface :"),
      list([
        "<strong>GEF</strong> (GDB Enhanced Features) — Affichage coloré des registres, heap analysis, pattern creation. Installation : <code>pip install gef</code>",
        "<strong>pwndbg</strong> — Orienté exploitation, très populaire en CTF. Affichage contexte automatique.",
        "<strong>PEDA</strong> — Python Exploit Development Assistance for GDB.",
      ]),
      code('bash', `# Avec GEF/pwndbg, le contexte s'affiche automatiquement à chaque break :
# ─── registers ────
# $rax   : 0x0
# $rbx   : 0x0
# $rsi   : 0x00007fffffffe380  →  "secretpassword"
# ─── stack ────────
# 0x00007fffffffe360│+0x0000: 0x0000000000000001
# ─── code ─────────
# ► 0x401149 <check_password+19>  call   0x401030 <strcmp@plt>`),
      h2('Modifier l\'exécution à la volée'),
      p("GDB permet de <strong>modifier des valeurs en mémoire</strong> ou de <strong>sauter des instructions</strong> pour forcer un chemin d'exécution particulier. Technique fondamentale pour contourner les vérifications."),
      code('bash', `# Modifier la valeur d'un registre
set $rax = 1

# Modifier un octet en mémoire
set {int}0x401154 = 0x90  # NOP (0x90 = NOP en x86)

# Forcer le saut (changer le flag ZF du registre RFLAGS)
set $eflags = $eflags | 0x40   # Met ZF à 1 (force JE)
set $eflags = $eflags & ~0x40  # Met ZF à 0 (force JNE)

# Changer l'instruction pointer (sauter à une adresse)
set $rip = 0x401200`),
    ],
    exercise: {
      title: 'Memory Peek',
      type: 'flag',
      scenario: "Un programme vérifie un mot de passe mais ne révèle aucune information utile à l'analyse statique (les chaînes sont construites dynamiquement en mémoire). Vous devez utiliser GDB pour intercepter la comparaison au moment de l'exécution.",
      description: "Exécutez <code>challenge04</code> sous GDB. Le programme compare votre input avec un mot de passe construit en mémoire à l'exécution. Mettez un breakpoint sur la comparaison et lisez la valeur attendue dans les registres.",
      downloadFile: 'challenge04',
      hints: [
        "Lancez <code>ltrace ./challenge04</code> en premier — si le binaire est dynamiquement lié, <code>ltrace</code> peut vous montrer directement les arguments de <code>strcmp</code>.",
        "Sous GDB : <code>break strcmp</code> puis <code>run</code>. Quand le breakpoint est atteint, <code>x/s $rdi</code> et <code>x/s $rsi</code> affichent les deux chaînes comparées.",
        "Si strcmp n'est pas visible, utilisez <code>strace -e read,write ./challenge04</code> pour voir les données échangées, puis cherchez la fonction de comparaison avec <code>objdump -d -M intel challenge04 | grep -A 5 'cmp\\|test'</code>",
      ],
      answer: 'FLAG{gdb_s33s_4ll_s3cr3ts}',
    },
  },

  // ─────────────────────────────────────────────────────────────
  // COURS 5
  // ─────────────────────────────────────────────────────────────
  {
    id: 5,
    title: 'Assembleur x86/x64',
    subtitle: 'Lire et comprendre le langage machine',
    releaseDate: '2026-04-02T16:00:00Z',
    duration: '75 min',
    difficulty: 'Intermédiaire',
    tags: ['x86', 'x64', 'assembleur', 'registres'],
    content: [
      h2('Pourquoi apprendre l\'assembleur ?'),
      p("Même avec un décompilateur comme Ghidra, comprendre l'assembleur est <strong>indispensable</strong> : le pseudo-C généré peut être trompeur, certaines constructions n'ont pas d'équivalent C direct, et les techniques anti-reverse se comprennent souvent uniquement au niveau assembleur."),
      h2('Registres x86-64'),
      p("Les registres sont de <strong>petites zones de stockage ultrarapides</strong> directement dans le processeur. En x86-64, les registres généraux font 64 bits (8 octets) et sont accessibles sous plusieurs formes :"),
      table(
        ['64-bit', '32-bit', '16-bit', '8-bit haut', '8-bit bas', 'Usage conventionnel'],
        [
          ['<code>RAX</code>', '<code>EAX</code>', '<code>AX</code>', '<code>AH</code>', '<code>AL</code>', 'Valeur de retour, accumulateur'],
          ['<code>RBX</code>', '<code>EBX</code>', '<code>BX</code>', '<code>BH</code>', '<code>BL</code>', 'Registre de base (callee-saved)'],
          ['<code>RCX</code>', '<code>ECX</code>', '<code>CX</code>', '<code>CH</code>', '<code>CL</code>', 'Compteur (boucles), 4e argument'],
          ['<code>RDX</code>', '<code>EDX</code>', '<code>DX</code>', '<code>DH</code>', '<code>DL</code>', 'Data, 3e argument, dividende'],
          ['<code>RSI</code>', '<code>ESI</code>', '<code>SI</code>', '—', '<code>SIL</code>', 'Source Index, 2e argument'],
          ['<code>RDI</code>', '<code>EDI</code>', '<code>DI</code>', '—', '<code>DIL</code>', 'Dest. Index, 1er argument'],
          ['<code>RSP</code>', '<code>ESP</code>', '<code>SP</code>', '—', '<code>SPL</code>', 'Stack Pointer (sommet de pile)'],
          ['<code>RBP</code>', '<code>EBP</code>', '<code>BP</code>', '—', '<code>BPL</code>', 'Base Pointer (frame courante)'],
          ['<code>RIP</code>', '<code>EIP</code>', '—', '—', '—', 'Instruction Pointer (PC)'],
          ['<code>R8</code>–<code>R15</code>', '<code>R8D</code>–<code>R15D</code>', '...', '—', '...', 'Registres supplémentaires 64-bit'],
        ]
      ),
      note('info', 'Convention d\'appel System V AMD64', "Sur Linux 64-bit, les arguments d'une fonction sont passés dans l'ordre : <strong>RDI, RSI, RDX, RCX, R8, R9</strong>, puis sur la pile. La valeur de retour est dans <strong>RAX</strong>. C'est la convention ABI System V AMD64."),
      h2('Instructions fondamentales'),
      h3('Transfert de données'),
      code('text', `;  MOV destination, source  — copie une valeur
mov rax, 42           ; rax = 42 (immédiat)
mov rax, rbx          ; rax = rbx
mov rax, [rbp-8]      ; rax = valeur à l'adresse rbp-8 (mémoire)
mov [rbp-8], rax      ; mémoire[rbp-8] = rax

; LEA — Load Effective Address (calcule une adresse, ne déréférence PAS)
lea rax, [rbp-8]      ; rax = rbp - 8  (l'adresse, pas la valeur)
lea rdi, [rip+0x200]  ; rdi = adresse d'une chaîne (PC-relative)

; PUSH / POP — pile
push rax    ; RSP -= 8, puis mémoire[RSP] = RAX
pop rbx     ; RBX = mémoire[RSP], puis RSP += 8

; XCHG — échange
xchg rax, rbx  ; swap(rax, rbx)`),
      h3('Arithmétique'),
      code('text', `add rax, rbx     ; rax += rbx
sub rax, 10      ; rax -= 10
imul rax, rbx    ; rax *= rbx (signé)
idiv rcx         ; rdx:rax /= rcx  →  rax=quotient, rdx=reste
inc rax          ; rax++
dec rbx          ; rbx--
neg rax          ; rax = -rax
not rax          ; rax = ~rax (complément bit à bit)`),
      h3('Logique et bits'),
      code('text', `and rax, rbx     ; rax &= rbx
or  rax, rbx     ; rax |= rbx
xor rax, rax     ; rax = 0  (idiome classique pour zéroiser)
xor rax, 0xff    ; rax ^= 0xff
shl rax, 3       ; rax <<= 3  (shift left, × 8)
shr rax, 1       ; rax >>= 1  (shift right logique, ÷ 2)
sar rax, 1       ; shift arithmétique (conserve le signe)`),
      note('info', 'XOR : idiome pour zéroiser', "<code>xor eax, eax</code> est le moyen le plus compact de mettre EAX à zéro. C'est plus court que <code>mov eax, 0</code>. Vous verrez cet idiome partout."),
      h3('Comparaison et sauts'),
      p("<code>CMP a, b</code> calcule <code>a - b</code> et positionne les flags (ZF, SF, OF, CF) sans stocker le résultat. <code>TEST a, b</code> calcule <code>a & b</code> et positionne les flags."),
      code('text', `; Comparaisons
cmp rax, 0       ; positionne ZF si rax == 0
test rax, rax    ; équivalent plus compact : ZF si rax == 0

; Sauts conditionnels (après un CMP ou TEST)
jmp 0x401200     ; saut inconditionnel
je  label        ; Jump if Equal       (ZF=1)
jne label        ; Jump if Not Equal   (ZF=0)
jg  label        ; Jump if Greater     (signé)
jl  label        ; Jump if Less        (signé)
jge label        ; Jump if >=          (signé)
jle label        ; Jump if <=          (signé)
ja  label        ; Jump if Above       (non signé)
jb  label        ; Jump if Below       (non signé)
jz  label        ; alias de je (ZF=1)
jnz label        ; alias de jne (ZF=0)`),
      h2('Structure de pile et frames'),
      p("La pile (<em>stack</em>) est une zone mémoire LIFO gérée par RSP. Chaque appel de fonction crée un <strong>stack frame</strong> pour stocker les variables locales et l'adresse de retour."),
      code('text', `; Prologue classique d'une fonction
push rbp          ; sauvegarder le frame pointer de l'appelant
mov rbp, rsp      ; rbp pointe sur le sommet actuel
sub rsp, 0x20     ; réserver 32 octets pour les variables locales

; Corps de la fonction
; Variables locales : [rbp-8], [rbp-16], etc.
; Arguments (si passés sur pile) : [rbp+16], [rbp+24], etc.

; Epilogue
mov rsp, rbp      ; restaurer RSP (libère les variables locales)
pop rbp           ; restaurer le frame pointer
ret               ; dépile l'adresse de retour et saute dessus`),
      h2('Lire du code assembleur : exemple complet'),
      code('text', `; Traduit en C : int check(char *input)
; Vérifie si strlen(input) == 8 et si input == "s3cr3t!!"

check:
  push   rbp
  mov    rbp, rsp
  sub    rsp, 0x10
  mov    QWORD PTR [rbp-0x8], rdi  ; sauvegarde input

  mov    rax, QWORD PTR [rbp-0x8]
  mov    rdi, rax                  ; arg1 de strlen = input
  call   strlen@plt
  cmp    rax, 0x8                  ; strlen(input) == 8 ?
  jne    .fail                     ; sinon → échec

  lea    rsi, [rip+0x100]          ; rsi = "s3cr3t!!" (adresse)
  mov    rdi, QWORD PTR [rbp-0x8] ; rdi = input
  call   strcmp@plt
  test   eax, eax                  ; strcmp retourne 0 si égal
  jnz    .fail                     ; non-zéro → différent → échec

  mov    eax, 0x1                  ; retourner 1 (succès)
  jmp    .end

.fail:
  mov    eax, 0x0                  ; retourner 0 (échec)
.end:
  leave
  ret`),
      h2('Syntaxe AT&T vs Intel'),
      p("Il existe deux syntaxes pour l'assembleur x86. <strong>Ghidra, IDA, x64dbg</strong> utilisent Intel par défaut. <strong>GDB, gcc</strong> produisent AT&T par défaut (mais GDB peut utiliser Intel avec <code>set disassembly-flavor intel</code>)."),
      table(
        ['Aspect', 'Intel', 'AT&T'],
        [
          ['Ordre opérandes', '<code>dst, src</code>', '<code>src, dst</code>'],
          ['Registres', '<code>rax</code>', '<code>%rax</code>'],
          ['Immédiats', '<code>42</code>', '<code>$42</code>'],
          ['Mémoire', '<code>[rbp-8]</code>', '<code>-8(%rbp)</code>'],
          ['Suffixes taille', 'absent (implicite)', '<code>movq, movl, movb</code>'],
        ]
      ),
    ],
    exercise: {
      title: 'Le Déchiffreur',
      type: 'question',
      question: "Analysez le code assembleur suivant. Quelle valeur est dans RAX après l'exécution de ces 4 instructions ?\n\nmov rax, 0x41\nxor rax, 0x15\nadd rax, 0x1\nshl rax, 1",
      options: ['0xAC', '0x56', '0xD4', '0x6C'],
      correctIndex: 0,
      explanation: "0x41 XOR 0x15 = 0x54 → 0x54 + 0x01 = 0x55 → 0x55 << 1 = 0xAA. Attention : le résultat correct est 0xAA. 0x41=65, XOR 0x15=21 → 84=0x54, +1=85=0x55, <<1=170=0xAA.",
      hints: [
        "Calculez étape par étape : MOV rax, 0x41 (rax = 65). XOR rax, 0x15 : effectuez le XOR bit à bit entre 0x41 et 0x15.",
        "0x41 = 0100 0001, 0x15 = 0001 0101. XOR donne : 0101 0100 = 0x54. Ensuite ADD 1 → 0x55, puis SHL 1 (décalage gauche de 1 bit = ×2).",
        "0x55 en binaire = 0101 0101. SHL 1 = 1010 1010 = 0xAA = 170 décimal.",
      ],
      answer: '0xAA',
    },
  },

  // ─────────────────────────────────────────────────────────────
  // COURS 6
  // ─────────────────────────────────────────────────────────────
  {
    id: 6,
    title: 'Techniques Anti-Reverse',
    subtitle: 'Comprendre et contourner les protections',
    releaseDate: '2026-04-09T16:00:00Z',
    duration: '70 min',
    difficulty: 'Avancé',
    tags: ['anti-debug', 'packing', 'obfuscation', 'bypass'],
    content: [
      h2('Pourquoi les protections anti-reverse ?'),
      p("Les développeurs de malware, mais aussi les auteurs de DRM (protection des droits numériques) et de logiciels commerciaux, intègrent des <strong>protections anti-analyse</strong> pour ralentir ou bloquer le travail des analystes. Comprendre ces techniques est essentiel pour les <strong>détecter</strong> et les <strong>contourner</strong>."),
      h2('Détection de débogueur'),
      h3('Linux : ptrace'),
      p("Sur Linux, un processus ne peut être tracé (via <code>ptrace</code>) que par <strong>un seul processus à la fois</strong>. Une technique courante consiste à s'auto-tracer au démarrage : si un débogueur est déjà attaché, le second <code>ptrace</code> échoue."),
      code('c', `// Détection via ptrace (C)
#include <sys/ptrace.h>
int is_debugged() {
    if (ptrace(PTRACE_TRACEME, 0, 0, 0) == -1) {
        // ptrace a échoué → un débogueur est présent
        return 1;
    }
    return 0;
}

// Bypass : patcher l'appel ptrace avec NOP
// ou précharger une lib qui hook ptrace :
// LD_PRELOAD=./bypass.so ./binary`),
      h3('Linux : /proc/self/status'),
      code('bash', `# Un binaire peut lire /proc/self/status et chercher TracerPid
cat /proc/self/status | grep TracerPid
# TracerPid: 0   ← pas de débogueur
# TracerPid: 1234 ← GDB ou strace est attaché`),
      code('c', `// Détection via /proc/self/status
int check_tracer() {
    FILE *f = fopen("/proc/self/status", "r");
    char line[256];
    while (fgets(line, sizeof(line), f)) {
        int pid;
        if (sscanf(line, "TracerPid: %d", &pid) == 1 && pid != 0)
            return 1; // débogué
    }
    return 0;
}`),
      h3('Windows : IsDebuggerPresent'),
      code('c', `// API Windows simple
if (IsDebuggerPresent()) {
    ExitProcess(1);
}

// Version plus robuste (lit le PEB directement)
// Bypass : patcher le byte retourné ou modifier le PEB.BeingDebugged`),
      h3('Timing attacks'),
      p("Un processus sous débogueur s'exécute <strong>plus lentement</strong>. Les vérifications de timing mesurent le temps écoulé entre deux points et concluent à la présence d'un débogueur si le délai est trop long."),
      code('c', `// Détection par timing (RDTSC = instruction x86)
uint64_t t1 = __rdtsc();
// ... quelques instructions ...
uint64_t t2 = __rdtsc();
if (t2 - t1 > THRESHOLD) {
    // Trop lent → débogueur détecté
    exit(1);
}`),
      note('info', 'Bypass timing', "Pour contourner : utilisez GDB avec <code>set scheduler-locking on</code>, ou patchez les instructions de vérification. Frida peut aussi hooker les fonctions de timing pour retourner des valeurs fixes."),
      h2('Obfuscation'),
      h3('Obfuscation de chaînes'),
      p("Au lieu de stocker les chaînes en clair dans <code>.rodata</code>, le binaire les déchiffre à l'exécution. La clé et le texte chiffré sont stockés séparément."),
      code('c', `// Exemple : XOR simple avec clé 0xAB
char encoded[] = {0xEF, 0xCB, 0xCF, 0xCA, 0xC3, 0xD7};
void decode(char *buf, char *enc, int len, char key) {
    for (int i = 0; i < len; i++)
        buf[i] = enc[i] ^ key;
}
// Résultat : "secret"`),
      h3('Obfuscation du flot de contrôle'),
      list([
        "<strong>Prédicats opaques</strong> — Conditions toujours vraies/fausses mais impossible à prouver statiquement (ex: une propriété mathématique).",
        "<strong>Junk code</strong> — Instructions inutiles (<code>nop</code>, calculs jetés) pour noyer le code réel.",
        "<strong>Instruction substitution</strong> — Remplacer <code>x = a + b</code> par <code>x = a - (-b)</code> ou des équivalences plus complexes.",
        "<strong>Virtualisation</strong> — Le code réel est compilé vers un bytecode custom interprété par une VM maison (Themida, VMProtect).",
      ]),
      h2('Packing'),
      p("Un <strong>packer</strong> compresse et/ou chiffre le code original, qui est décompressé en mémoire à l'exécution par un <em>stub</em> de décompression. Le binaire sur disque ne contient pas le code réel."),
      code('bash', `# Identifier un binaire packé
file ./packed_binary
# Entropie élevée (> 7.0) = signe de packing ou chiffrement

# Outil de détection
die ./packed_binary          # Detect-It-Easy
# UPX → compresseur open-source très courant

# Dépacker UPX (trivial)
upx -d packed_binary -o unpacked_binary

# Pour les packers custom : utiliser GDB/Frida pour dumper la mémoire
# une fois le stub de décompression terminé`),
      h3('Dépacker manuellement'),
      list([
        "<strong>Identifier la fin du stub</strong> — Chercher les patterns <code>PUSHAD/POPAD</code> (sauvegarde/restore de tous les registres) ou un <code>JMP</code> vers une adresse calculée dynamiquement (OEP - Original Entry Point).",
        "<strong>Breakpoint sur OEP</strong> — Mettre un breakpoint sur la dernière instruction du stub (souvent un <code>jmp rax</code>).",
        "<strong>Dumper la mémoire</strong> — Une fois à l'OEP, le code original est déchiffré en mémoire. Utiliser <code>process_vm_readv</code>, <code>dd if=/proc/PID/mem</code>, ou des plugins GDB pour extraire le code réel.",
        "<strong>Reconstruire les imports</strong> — Les tables IAT/PLT doivent être reconstruites. Outils : Scylla (Windows), scripts Python/GDB.",
      ], true),
      h2('Techniques avancées'),
      h3('Self-modifying code'),
      p("Le binaire <strong>modifie ses propres instructions</strong> en mémoire avant ou pendant l'exécution. Détectable avec un watchpoint GDB sur les pages d'instructions."),
      h3('Anti-VM'),
      list([
        "Vérification de la <strong>température CPU</strong> (les VMs ne la rapportent pas).",
        "Présence de fichiers/processus typiques des hyperviseurs (VMware Tools, VBoxService).",
        "Instructions CPUID pour détecter l'hyperviseur (<code>cpuid avec eax=1</code>, bit 31 de ECX).",
        "Analyse du timing (les instructions privilégiées sont plus lentes dans une VM).",
      ]),
      h2('Bypasses pratiques'),
      table(
        ['Protection', 'Bypass'],
        [
          ['ptrace self-trace', 'Patcher le JNE après ptrace en JE (ou NOP). <code>LD_PRELOAD</code> avec hook ptrace.'],
          ['/proc self status', 'Monter un <code>/proc</code> virtuel ou hooker <code>fopen</code> avec Frida.'],
          ['IsDebuggerPresent', 'Patcher le byte de retour (mettre 0). Modifier <code>PEB.BeingDebugged</code>.'],
          ['Timing checks', 'Modifier le seuil en mémoire. Hooker les fonctions de temps.'],
          ['String XOR', 'Lancer le binaire dans GDB jusqu\'à la déchiffrement, lire les strings en mémoire.'],
          ['UPX packing', '<code>upx -d binary</code>. Ou breakpoint OEP + dump mémoire.'],
        ]
      ),
      note('success', 'Mindset', "Face à une protection anti-reverse, ne cherchez pas à tout comprendre statiquement. <strong>Exécutez</strong>, observez où le programme dévie, identifiez la vérification et patchez-la. 90 % des protections sont contournables avec un simple NOP ou une modification d'octet."),
    ],
    exercise: {
      title: 'Ghost Mode',
      type: 'flag',
      scenario: "Un malware utilise une détection de débogueur basique avant d'afficher son flag. Il vérifie le TracerPid dans /proc/self/status. Vous devez contourner cette protection.",
      description: "Le binaire <code>challenge06</code> vérifie s'il est débogué. S'il détecte GDB, il affiche 'DEBUGGER DETECTED' et quitte. Contournez cette protection pour obtenir le flag. Plusieurs approches sont possibles.",
      downloadFile: 'challenge06',
      hints: [
        "Commencez par analyser statiquement avec <code>strings challenge06</code> et <code>objdump -d -M intel challenge06</code>. Identifiez où se fait la vérification et que fait le programme si elle échoue.",
        "Mettez un breakpoint juste après la vérification avec GDB. Quand vous arrivez au breakpoint, forcez le saut vers la branche 'pas débogué' en modifiant les flags : <code>set $eflags = $eflags ^ 0x40</code> (inverse ZF).",
        "Alternative : utilisez <code>LD_PRELOAD</code> pour hooker <code>fopen</code> et retourner un faux <code>/proc/self/status</code> sans TracerPid. Ou plus simple : patchez le binaire avec <code>objcopy</code> pour remplacer le JNZ par un JMP direct vers la bonne branche.",
      ],
      answer: 'FLAG{p4tch_4nd_0wn}',
    },
  },

  // ─────────────────────────────────────────────────────────────
  // COURS 7 — À VENIR
  // ─────────────────────────────────────────────────────────────
  {
    id: 7,
    title: 'Exploitation de Binaires : Bases',
    subtitle: 'Buffer overflows et contrôle du flux d\'exécution',
    releaseDate: '2026-04-16T16:00:00Z',
    duration: '80 min',
    difficulty: 'Avancé',
    tags: ['buffer-overflow', 'shellcode', 'ret2win'],
    content: [],
    exercise: null,
  },

  // ─────────────────────────────────────────────────────────────
  // COURS 8 — À VENIR
  // ─────────────────────────────────────────────────────────────
  {
    id: 8,
    title: 'Analyse de Malware',
    subtitle: 'Méthodes et outils pour l\'analyse des logiciels malveillants',
    releaseDate: '2026-04-23T16:00:00Z',
    duration: '90 min',
    difficulty: 'Avancé',
    tags: ['malware', 'IOC', 'sandbox', 'forensics'],
    content: [],
    exercise: null,
  },
]

export default courses
