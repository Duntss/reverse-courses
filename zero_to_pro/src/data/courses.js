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
      scenario: "Vous venez de suivre la démo live. Maintenant, à vous de jouer : ouvrez demo_ida dans IDA (ou Ghidra) et retrouvez le mot de passe par vous-même sans regarder le code source C.",
      description: "Analysez le binaire <code>demo_ida</code> (compilé depuis <code>demo/demo_ida.c</code>) avec IDA Pro ou Ghidra. Trouvez le mot de passe attendu par le programme. Le flag à soumettre est le mot de passe lui-même.",
      downloadFile: 'demo_ida',
      hints: [
        "Ouvrez la <strong>Strings window</strong> (<code>Shift+F12</code> dans IDA). Le mot de passe n'apparaît pas en clair — il est obfusqué. Mais d'autres chaînes vous guident vers les bonnes fonctions.",
        "Cherchez la fonction qui contient une <strong>boucle avec un XOR</strong>. Dans IDA : graph view, repérez une boucle (<em>back edge</em> verte remontant). Dans le corps, cherchez <code>xor al, 42h</code>. Les octets du tableau <code>encoded[]</code> sont là — XORez-les avec 0x42 pour retrouver le mot de passe.",
        "Avec <code>F5</code> sur la fonction <code>decode_secret</code> (ou <code>sub_XXXXXX</code> si strippé), Hex-Rays vous montre directement : <code>out[i] = encoded[i] ^ 0x42</code>. Les valeurs du tableau sont visibles. Calculez : 0x2B^0x42, 0x26^0x42, 0x23^0x42...",
      ],
      answer: 'ida_r0ck5!',
    },
  },

  // ─────────────────────────────────────────────────────────────
  // COURS 2 : Packer
  // ─────────────────────────────────────────────────────────────
  {
    id: 2,
    title: 'Packer & protections légères',
    subtitle: 'Comprendre et briser les packers',
    releaseDate: '2026-03-08T10:00:00Z',
    duration: '60 min + démo live',
    difficulty: 'Intermédiaire',
    tags: ['packing', 'PE', 'UPX', 'OEP', 'x64dbg', 'virtualisation'],
    content: [
      h2('Histoire des packers'),
      p("À l'origine, un <strong>packer</strong> est un outil qui compresse un exécutable pour qu'il prenne moins de place sur le disque — un peu comme un ZIP qui se décompresse tout seul au lancement. Dans les années 90, quand les disquettes faisaient 1,44 Mo, c'était crucial."),
      p("Aujourd'hui, l'intérêt a changé : les packers servent surtout à <strong>masquer le code</strong> pour deux raisons — entraver l'analyse par un reverseur, et contourner les antivirus qui cherchent des signatures connues dans les binaires."),
      note('info', 'Analogie', "Un binaire packé, c'est comme une lettre mise sous enveloppe scellée. Vous voyez l'enveloppe (le stub), mais pas le contenu (le vrai code). Une fois que vous ouvrez l'enveloppe en mémoire, vous avez accès au programme réel."),
      h2("Structure d'un exécutable PE"),
      p("Avant de comprendre les packers, il faut comprendre comment est structuré un exécutable Windows. Le format <strong>PE (Portable Executable)</strong> est organisé en sections, chacune avec un rôle précis."),
      table(
        ['Section', 'Rôle'],
        [
          ['<code>.text</code>', "Code exécutable — les instructions du programme. C'est ici que IDA passe le plus de temps."],
          ['<code>.data</code>', 'Données globales initialisées (variables globales avec une valeur définie à la compilation).'],
          ['<code>.rdata</code> / <code>.rodata</code>', 'Données en lecture seule : chaînes de caractères, constantes. La Strings window IDA vient ici.'],
          ['<code>.idata</code>', "Import Address Table (IAT) : liste des DLLs et fonctions importées. La fenêtre Imports d'IDA lit cette section."],
          ['<code>.rsrc</code>', 'Ressources : icônes, boîtes de dialogue, manifestes, menus. Souvent ignorée en reverse.'],
          ['<code>.reloc</code>', "Table de relocations pour ASLR — ajustements d'adresses si le binaire n'est pas chargé à son adresse préférée."],
        ]
      ),
      note('warning', 'Un binaire packé', "Quand UPX packe un exécutable, il renomme les sections originales en <code>UPX0</code> (vide, mémoire allouée pour la décompression) et <code>UPX1</code> (données compressées + stub de décompression). La vraie <code>.text</code> n'existe plus en clair sur le disque."),
      code('text', `; Sections d'un binaire normal (Detect-It-Easy)
.text    0x1000   code
.rdata   0x2000   read-only data
.data    0x3000   initialized data
.idata   0x4000   imports

; Sections du même binaire après UPX
UPX0     0x1000   (vide sur disque, sera rempli en mémoire)
UPX1     0x2000   données compressées + stub
.rsrc    0x3000   ressources (laissées en clair)`),
      h2('Programme de démo'),
      p("On part d'un programme minimaliste dont le flag est affiché directement — la cible parfaite pour illustrer ce que fait un packer."),
      code('c', `#include <stdio.h>

int main(void)
{
    puts("FLAG{unpacked_success}");
    return 0;
}`),
      p("Compilation et packing sous Windows :"),
      code('bash', `# Compiler avec MinGW (GCC Windows)
gcc -O0 -o demo_packer.exe demo_packer.c

# Vérifier : le flag est visible en clair
strings demo_packer.exe | findstr FLAG
# -> FLAG{unpacked_success}

# Packer avec UPX
upx --best demo_packer.exe

# Vérifier : le flag n'est plus lisible par strings
strings demo_packer.exe | findstr FLAG
# -> rien (ou chaîne corrompue inexploitable)`),
      note('success', 'DÉMO LIVE', "L'instructeur compile <code>demo_packer.c</code>, montre le flag dans strings, packe avec UPX, et montre que le flag a disparu. Il ouvre ensuite les deux versions dans IDA pour comparer les sections."),
      h2('UPX en détail'),
      p("<strong>UPX (Ultimate Packer for eXecutables)</strong> est le packer le plus répandu — open-source, rapide, et multi-plateforme. Son fonctionnement à l'exécution :"),
      list([
        "<strong>1. Le stub démarre</strong> : le PE loader de Windows exécute le stub UPX (dans UPX1).",
        "<strong>2. VirtualAlloc</strong> : le stub demande à Windows un bloc mémoire pour y écrire le code décompressé.",
        "<strong>3. Décompression</strong> : le stub décompresse le code original dans la mémoire allouée.",
        "<strong>4. VirtualProtect</strong> : le stub marque la mémoire comme exécutable (RX) — c'est ici qu'on pose notre breakpoint.",
        "<strong>5. JMP OEP</strong> : le stub saute au point d'entrée original (OEP) du programme réel.",
      ]),
      h3('Détection UPX'),
      table(
        ['Outil', 'Commande / Action'],
        [
          ['<strong>upx</strong>', "<code>upx -l demo_packer.exe</code> — affiche l'en-tête UPX si présent"],
          ['<strong>Detect-It-Easy (DIE)</strong>', 'Interface graphique, détecte UPX et indique la version'],
          ['<strong>strings</strong>', "Chercher <code>UPX!</code> ou <code>This file is packed with UPX</code>"],
          ['<strong>IDA</strong>', 'Les sections UPX0, UPX1 apparaissent dans la liste des segments'],
        ]
      ),
      h2('Méthode 1 — Dépacking automatique'),
      code('bash', `# Décompresser directement sur le disque
upx -d demo_packer.exe

# Le flag est de nouveau visible
strings demo_packer.exe | findstr FLAG
# -> FLAG{unpacked_success}`),
      note('info', 'Limites', "Cette méthode ne fonctionne que si le stub UPX est intact. Les malwares remplacent souvent les magic bytes <code>UPX!</code> ou patchent le stub pour que <code>upx -d</code> échoue — il faut alors passer en dynamique."),
      h2("Méthode 2 — Trouver l'OEP dans IDA (statique)"),
      p("Quand le packer est inconnu ou modifié, on peut chercher l'OEP statiquement dans IDA."),
      h3('Pattern PUSHAD / POPAD (UPX)'),
      p("UPX sauvegarde tous les registres au début du stub avec <code>PUSHAD</code> et les restaure à la fin avec <code>POPAD</code> juste avant de sauter à l'OEP. Chercher ce pattern :"),
      code('text', `; Début du stub UPX
60              PUSHAD          ; sauvegarder tous les registres
...             ; code de décompression
...
61              POPAD           ; <- chercher ça à la fin du stub
FF E0           JMP EAX         ; <- suivi d'un JMP -> c'est l'OEP !`),
      h3('Chercher les zones XOR'),
      p("Les packers utilisent souvent du XOR pour chiffrer les données compressées. Dans IDA, chercher des boucles avec <code>xor</code> sur des blocs de mémoire — c'est le stub qui déchiffre avant de décompresser."),
      code('text', `; Pattern typique d'une boucle de déchiffrement dans un stub
loc_stub_loop:
    movzx eax, byte ptr [esi]    ; lire octet chiffré
    xor   al,  0x42              ; XOR avec la clé
    mov   [edi], al              ; écrire octet déchiffré
    inc   esi
    inc   edi
    dec   ecx
    jnz   loc_stub_loop          ; boucler`),
      note('success', 'DÉMO LIVE', "L'instructeur ouvre <code>demo_packer.exe</code> (version packée) dans IDA, navigue vers la section UPX1, cherche le PUSHAD initial et remonte jusqu'au POPAD + JMP final pour identifier l'OEP."),
      h2('Méthode 3 — Breakpoint VirtualProtect dans x64dbg'),
      p("C'est la méthode universelle en analyse dynamique — elle fonctionne pour UPX et pour beaucoup de packers inconnus. On intercepte le moment où le packer rend la mémoire exécutable, puis on attend que le stub finisse et on dumpe juste avant le JMP OEP."),
      h3('Étapes dans x64dbg'),
      list([
        "<strong>Ouvrir le binaire packé</strong> dans x64dbg (File → Open).",
        "<strong>Poser le breakpoint</strong> : dans la barre de commande en bas, taper <code>bp VirtualProtect</code>. x64dbg résout automatiquement l'adresse dans kernel32.",
        "<strong>F9 (Run)</strong> : le programme s'arrête dans VirtualProtect quand le stub change les permissions de la mémoire décompressée.",
        "<strong>Ctrl+F9 (Run to return)</strong> : on exécute jusqu'au <code>ret</code> de VirtualProtect et on revient dans le stub.",
        "<strong>F8 (Step Over)</strong> plusieurs fois : chercher le <code>POPAD</code> suivi d'un <code>JMP</code> — ce JMP amène à l'OEP.",
        "<strong>F2 sur le JMP + F9</strong> : poser un breakpoint sur ce JMP, run, F7 (Step Into) pour entrer dans l'OEP.",
        "<strong>Scylla</strong> : dans x64dbg, Plugins → Scylla → <em>IAT Autosearch</em> → <em>Get Imports</em> → <em>Dump</em>.",
      ]),
      code('text', `; Commandes x64dbg utiles (barre de commande)
bp VirtualAlloc       ; breakpoint sur VirtualAlloc
bp VirtualProtect     ; breakpoint sur VirtualProtect
bl                    ; lister les breakpoints actifs
bc 0                  ; supprimer le breakpoint numéro 0`),
      note('warning', 'VirtualAlloc vs VirtualProtect', "UPX moderne appelle surtout <strong>VirtualProtect</strong> pour rendre la mémoire exécutable. Certains packers custom utilisent <strong>VirtualAlloc</strong> pour allouer un nouveau bloc avant d'y écrire le code. En cas de doute, mettre les deux breakpoints."),
      h2('x64dbg et WinDbg — présentation rapide'),
      h3('x64dbg'),
      p("<strong>x64dbg</strong> est le débogueur Windows open-source de référence pour le reverse engineering. Interface graphique, plugins (Scylla pour le dump, ret-sync pour synchroniser avec IDA)."),
      table(
        ['Raccourci x64dbg', 'Action'],
        [
          ['<code>F9</code>', "Run — continuer jusqu'au prochain breakpoint"],
          ['<code>F8</code>', 'Step Over — exécuter une instruction sans entrer dans les appels'],
          ['<code>F7</code>', "Step Into — entrer dans l'appel"],
          ['<code>Ctrl+F9</code>', "Run to Return — exécuter jusqu'au RET de la fonction courante"],
          ['<code>F2</code>', "Toggle breakpoint sur l'instruction sélectionnée"],
          ['<code>F4</code>', 'Run to cursor'],
          ['<code>Ctrl+G</code>', 'Go to address'],
        ]
      ),
      h3('WinDbg'),
      p("<strong>WinDbg</strong> est le débogueur Microsoft — plus puissant mais moins graphique. Il s'intègre avec IDA via le plugin <strong>ret-sync</strong> : le curseur IDA suit l'exécution en temps réel."),
      code('text', `; Commandes WinDbg essentielles
bp kernel32!VirtualAlloc    ; breakpoint sur VirtualAlloc
bp kernel32!VirtualProtect  ; breakpoint sur VirtualProtect
g                           ; go (run)
gu                          ; go up (run to return)
p                           ; step over
t                           ; step into
u rip L10                   ; désassembler 10 instructions depuis RIP`),
      note('success', 'DÉMO LIVE', "L'instructeur ouvre <code>challenge_packer.exe</code> dans x64dbg, pose <code>bp VirtualProtect</code>, run, revient dans le stub, step jusqu'au POPAD + JMP, entre dans l'OEP, puis dump avec Scylla."),
      h2('Les différentes protections'),
      h3('1. Packer simple'),
      p("Le packer de base (UPX, PECompact…) compresse/chiffre le code et ajoute un stub. <strong>Faiblesse majeure :</strong> sans anti-debug, il suffit d'attendre que le stub finisse et de dumper la mémoire."),
      h3('2. Anti-debug dans le stub'),
      p("Les packers commerciaux ajoutent des vérifications dans le stub pour détecter la présence d'un débogueur :"),
      list([
        "<code>IsDebuggerPresent()</code> — vérifie un flag dans le PEB. Patch : forcer EAX = 0 au retour.",
        "<code>rdtsc</code> — mesure le temps entre deux instructions. Sous débogueur, c'est bien plus lent. Bypass : NOP les vérifications.",
        "<code>CheckRemoteDebuggerPresent()</code> — similaire via NtQueryInformationProcess.",
      ]),
      h3('3. Virtualisation (VMProtect, Themida)'),
      p("La protection la plus forte : une portion du code est transformée en bytecode d'une VM propriétaire. Le binaire embarque un interpréteur. Le reverseur voit du code incompréhensible — pas d'instructions x86/x64, juste des appels à l'interpréteur VM."),
      p("Il faut d'abord comprendre l'architecture de la VM (ses opcodes, ses registres virtuels, son dispatch loop) avant de déchiffrer la logique. Les auteurs de malware et les entreprises VMifient souvent les checks de sécurité — ce qui force à casser la VM en dynamique pour capturer les arguments et le résultat."),
      h2('Packers connus'),
      table(
        ['Packer', 'Contexte', 'Difficulté'],
        [
          ['<strong>UPX</strong>', 'Open-source, compression pure', "<code>upx -d</code> ou BP VirtualProtect — trivial"],
          ['<strong>Themida / WinLicense</strong>', 'Protection de licences logicielles', 'Difficile — anti-debug + VM partielle'],
          ['<strong>VMProtect</strong>', 'Protection commerciale et malware', 'Très difficile — virtualisation complète'],
          ['<strong>Custom packers</strong>', 'Threat actors, ransomware, APT', 'Variable — souvent XOR simple mais stub inconnu'],
        ]
      ),
      hr(),
      p("Points à retrouver lors de la démo :"),
      list([
        "<strong>[1]</strong> Ouvrir le binaire packé dans IDA → voir les sections UPX0 et UPX1 au lieu de .text",
        "<strong>[2]</strong> Chercher le PUSHAD en début de stub, trouver le POPAD + JMP à la fin → OEP identifié",
        "<strong>[3]</strong> Dans x64dbg : <code>bp VirtualProtect</code> → F9 → Ctrl+F9 → step jusqu'au JMP OEP → Scylla dump",
        "<strong>[4]</strong> Ouvrir le binaire dumpé dans IDA → le flag est visible dans la Strings window",
        "<strong>[5]</strong> <code>upx -d</code> comme raccourci — comparer le résultat avec le dump mémoire",
      ]),
    ],
    exercise: {
      title: 'Flag caché dans un binaire packé',
      type: 'flag',
      scenario: "On vous fournit <code>challenge_packer.exe</code> — un binaire Windows packé avec UPX. La commande <code>strings</code> ne révèle pas le flag. À vous de le récupérer.",
      description: "Dépackez <code>challenge_packer.exe</code> pour récupérer le flag. Utilisez la méthode de votre choix : <code>upx -d</code>, breakpoint VirtualProtect dans x64dbg, ou analyse statique dans IDA.",
      downloadFile: 'challenge_packer',
      hints: [
        "Commencez par <code>strings challenge_packer.exe | findstr FLAG</code> — le flag n'apparaît pas. Ensuite, <code>upx -l challenge_packer.exe</code> pour confirmer que c'est UPX.",
        "La méthode la plus directe : <code>upx -d challenge_packer.exe</code>. Si c'est un UPX standard, le binaire est dépacké et <code>strings</code> révèle le flag.",
        "En dynamique avec x64dbg : ouvrir le binaire, taper <code>bp VirtualProtect</code> dans la barre de commande, F9, Ctrl+F9, F8 plusieurs fois jusqu'au <code>POPAD</code> suivi d'un <code>JMP</code> — c'est l'OEP. Scylla → Dump.",
      ],
      answer: 'FLAG{unpacked_success}',
    },
  },
]

export default courses
