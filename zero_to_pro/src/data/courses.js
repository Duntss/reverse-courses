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
      hr(),
      h2('Challenge avancé : custom packer + anti-debug'),
      p("Le binaire <code>crackme_isdbg.exe</code> est un packer <strong>entièrement custom</strong>, beaucoup plus proche de ce qu'on trouve dans de vrais malwares ou protections commerciales."),
      h3("Ce que l'IAT révèle"),
      p("Ouvrez le binaire dans IDA / CFF Explorer → onglet Imports. Vous ne verrez que <strong>deux fonctions</strong> :"),
      list([
        "<code>GetModuleHandleA</code>",
        "<code>GetProcAddress</code>",
      ]),
      p("Ni <code>VirtualAlloc</code>, ni <code>VirtualProtect</code>, ni <code>IsDebuggerPresent</code> — tout est résolu <em>dynamiquement</em> par le stub via <code>GetProcAddress</code>."),
      h3('Logique du stub (à retrouver en désassemblage)'),
      list([
        "<strong>1.</strong> <code>GetProcAddress(k32, \"IsDebuggerPresent\")</code> → appel → si retour ≠ 0, <code>ExitProcess(0)</code> silencieux.",
        "<strong>2.</strong> <code>GetProcAddress(k32, \"VirtualAlloc\")</code> → alloue un buffer <code>PAGE_READWRITE</code>.",
        "<strong>3.</strong> Boucle XOR : déchiffre le shellcode embarqué octet par octet (clé 0x59).",
        "<strong>4.</strong> <code>GetProcAddress(k32, \"VirtualProtect\")</code> → passe le buffer en <code>PAGE_EXECUTE_READ</code>.",
        "<strong>5.</strong> <code>CALL rax</code> — saut dans le shellcode déchiffré.",
      ]),
      h3('Le shellcode (PEB-walk pur)'),
      p("Une fois déchiffré, le shellcode ne dépend d'<strong>aucun import</strong> du binaire. Il réalise lui-même :"),
      list([
        "PEB walk → <code>InMemoryOrderModuleList[2]</code> → base de <code>kernel32.dll</code>",
        "Parcours de la table d'exports de kernel32 → <code>GetProcAddress</code>",
        "<code>GetProcAddress(k32, \"LoadLibraryA\")</code> → charge <code>user32.dll</code>",
        "Parcours de la table d'exports de user32 → <code>MessageBoxA</code>",
        "Affiche le flag dans une <code>MessageBoxA</code>",
      ]),
      note('success', 'DÉMO LIVE', "L'instructeur ouvre <code>crackme_isdbg.exe</code> dans x64dbg. <strong>(1)</strong> <code>bp GetProcAddress</code> — F9 quatre fois pour observer les quatre résolutions. <strong>(2)</strong> Au premier retour (<code>IsDebuggerPresent</code>) : forcer <code>EAX = 0</code> dans le panneau des registres. <strong>(3)</strong> F9 → VirtualAlloc → boucle XOR visible en mémoire → VirtualProtect → CALL shellcode. <strong>(4)</strong> Entrer dans le shellcode : le PEB-walk est entièrement visible — observer l'accès à <code>GS:[60h]</code>, la traversée des listes de modules, le parsing des exports."),
      h3('Workflow etudiant'),
      code('asm', `; 1. Ouvrir crackme_isdbg.exe dans x64dbg
; 2. Poser un BP sur GetProcAddress
bp GetProcAddress

; 3. F9 x1 - premier retour = IsDebuggerPresent
;    Forcer EAX = 0 dans le panneau Registres
;    (ou patcher le JE/JNZ apres le CALL pour sauter l'exit)

; 4. F9 x3 - VirtualAlloc, VirtualProtect, (ExitProcess non appele)
;    Observer l'adresse retournee par VirtualAlloc -> region RX

; 5. F7 au CALL rax final -> entrer dans le shellcode
;    Step dans le PEB-walk, observer le parsing des exports

; 6. MessageBoxA affiche le flag`),
    ],
    exercise: {
      title: 'Bypass anti-debug : custom packer + shellcode PEB-walk',
      type: 'flag',
      scenario: "Le binaire <code>crackme_isdbg.exe</code> n'expose presque aucune fonction dans son IAT et se termine silencieusement si un débogueur est détecté. Il déchiffre un shellcode en mémoire, puis ce shellcode résout lui-même ses imports via le PEB pour afficher le flag. À vous de le contourner.",
      description: "Bypassez la protection <code>IsDebuggerPresent</code>, laissez le stub déchiffrer le shellcode, puis récupérez le flag affiché par la <code>MessageBoxA</code> du shellcode.",
      downloadFile: 'crackme_isdbg',
      hints: [
        "Ouvrez le binaire dans IDA ou CFF Explorer → Imports : vous ne verrez que <code>GetModuleHandleA</code> et <code>GetProcAddress</code>. Tout le reste est résolu dynamiquement.",
        "Dans x64dbg : <code>bp GetProcAddress</code>, F9. Au premier retour, regardez le nom passé en RDX — c'est <code>IsDebuggerPresent</code>. Faites F9 une fois de plus (Ctrl+F9 pour sortir du CALL), puis forcez <code>EAX = 0</code> dans le panneau Registres avant que la branche soit prise.",
        "Laissez ensuite tourner (F9) — VirtualAlloc alloue le buffer, le stub XOR-déchiffre le shellcode, VirtualProtect le rend exécutable. Au CALL final, F7 pour entrer dans le shellcode et observer le PEB-walk.",
      ],
      answer: 'zero_to_pro{IsDbg_byp4ss_v4lloc!}',
    },
  },

  // ─────────────────────────────────────────────────────────────
  // COURS 3
  // ─────────────────────────────────────────────────────────────
  {
    id: 3,
    title: 'Algorithmes Cryptographiques dans les Malwares',
    subtitle: 'Identifier RC4, AES, RSA et plus dans IDA Pro',
    releaseDate: '2026-03-20T17:00:00Z',
    duration: '90 min + démo live',
    difficulty: 'Intermédiaire',
    tags: ['Cryptographie', 'RC4', 'AES', 'RSA', 'WinCrypt', 'Malware Analysis'],
    content: [

      // ── INTRO ──────────────────────────────────────────────────
      h2('Pourquoi les malwares utilisent-ils la cryptographie ?'),
      p("La cryptographie est omniprésente dans les malwares modernes. Elle sert à trois objectifs principaux : <strong>protéger les communications C2</strong> (chiffrer le trafic réseau), <strong>chiffrer les fichiers victimes</strong> (ransomware), et <strong>dissimuler la configuration et le code</strong> (obfuscation de payload, strings chiffrées)."),
      p("En tant qu'analyste, reconnaître un algorithme cryptographique dans un binaire est une compétence fondamentale — elle permet de comprendre ce que fait le malware, d'extraire des clés, et parfois de décrypter des données volées ou des communications C2."),
      note('info', 'Trois approches de détection', "1. <strong>API calls</strong> — WinCrypt API (CryptEncrypt, CryptGenKey…)<br>2. <strong>Constantes</strong> — S-boxes, valeurs magiques propres à chaque algorithme<br>3. <strong>Flow / structure</strong> — boucles caractéristiques (ex. SBOX 256 octets pour RC4)"),
      hr(),

      // ── SECTION 1 : SYMÉTRIQUES ────────────────────────────────
      h2('Chiffrements Symétriques'),
      p("Dans un chiffrement symétrique, la même clé sert au chiffrement et au déchiffrement. Les malwares les privilégient pour chiffrer des volumes importants de données (ransomware) ou des streams réseau, car ils sont bien plus rapides que les algorithmes asymétriques."),

      // RC4
      h3('RC4 — Rivest Cipher 4'),
      p("<strong>RC4</strong> est un stream cipher extrêmement simple à implémenter (moins de 50 lignes de C), sans dépendances externes. C'est l'un des algorithmes les plus répandus dans les malwares, particulièrement pour chiffrer les communications C2 ou les configurations embarquées."),
      p("RC4 se décompose en <strong>3 étapes distinctes</strong>, toujours présentes et reconnaissables dans IDA :"),
      table(
        ['Étape', 'Nom', 'Description', 'Signature IDA'],
        [
          ['1', 'Init SBOX', 'Initialise un tableau S[256] avec S[i] = i (identité 0…255)', 'Boucle for(i=0;i<256;i++) S[i]=i'],
          ['2', 'KSA', 'Key Scheduling Algorithm — mélange S[] en fonction de la clé', 'Boucle 256 iters avec S[i] ↔ S[j] swap, j += key[i % keylen]'],
          ['3', 'PRGA', 'Pseudo-Random Generation Algorithm — génère le keystream, XOR avec les données', 'Boucle sur les données, double swap S[i] ↔ S[j], XOR avec S[(S[i]+S[j])&0xFF]'],
        ]
      ),
      note('warning', 'Signature caractéristique', "La présence d'un tableau local de <strong>256 octets initialisé avec la séquence 0…255</strong> (boucle mov byte ptr [rbp+rax], al) est quasi-certaine d'être une SBOX RC4. Le KSA qui suit avec une clé confirme le diagnostic."),
      p("Voici le code source commenté des 3 étapes :"),
      code('c', `/* Étape 1 : Init SBOX */
void rc4_init_sbox(RC4_CTX *ctx) {
    for (int i = 0; i < 256; i++)
        ctx->S[i] = (unsigned char)i;  // S = [0, 1, 2, ..., 255]
}

/* Étape 2 : KSA (Key Scheduling Algorithm) */
void rc4_ksa(RC4_CTX *ctx, const unsigned char *key, int keylen) {
    int j = 0;
    unsigned char tmp;
    for (int i = 0; i < 256; i++) {
        j = (j + ctx->S[i] + key[i % keylen]) & 0xFF;
        tmp = ctx->S[i]; ctx->S[i] = ctx->S[j]; ctx->S[j] = tmp;  // swap
    }
}

/* Étape 3 : PRGA (Pseudo-Random Generation Algorithm) */
void rc4_prga(RC4_CTX *ctx, unsigned char *data, int datalen) {
    int i = 0, j = 0;
    unsigned char tmp;
    for (int k = 0; k < datalen; k++) {
        i = (i + 1) & 0xFF;
        j = (j + ctx->S[i]) & 0xFF;
        tmp = ctx->S[i]; ctx->S[i] = ctx->S[j]; ctx->S[j] = tmp;  // swap
        data[k] ^= ctx->S[(ctx->S[i] + ctx->S[j]) & 0xFF];         // XOR
    }
}`),
      p("Dans le pseudocode Hex-Rays, la boucle PRGA est immédiatement reconnaissable par le double swap suivi d'un XOR avec une indexation à deux niveaux dans S[]."),
      table(
        ['Famille de malware', 'Usage de RC4'],
        [
          ['Mirai (botnet IoT)', 'Chiffrement des communications C2 (port 48101)'],
          ['Carbanak (APT financier)', 'Chiffrement du trafic C2 et des modules téléchargés'],
          ['APT28 / Fancy Bear', 'Chiffrement des configs et des données exfiltrées (outil X-Agent)'],
          ['ZLoader (banking trojan)', 'Déchiffrement des modules embarqués au runtime'],
          ['WannaCry', 'Chiffrement de la configuration interne (URL .onion)'],
        ]
      ),

      hr(),

      // AES
      h3('AES — Advanced Encryption Standard'),
      p("<strong>AES</strong> (Rijndael) est le standard de chiffrement symétrique par blocs le plus utilisé aujourd'hui. Les ransomwares modernes l'utilisent massivement (AES-128 ou AES-256) pour chiffrer les fichiers, souvent en combinaison avec RSA pour protéger la clé AES."),
      p("AES est reconnaissable à <strong>deux constantes emblématiques</strong> :"),
      table(
        ['Constante', 'Valeur', 'Rôle'],
        [
          ['S-box[0]', '0x63', 'Premier octet de la S-box de substitution — toujours 0x63 dans toute implémentation AES'],
          ['Rcon[1]', '0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1B, 0x36', 'Table de constantes pour le Key Schedule (Round Constants)'],
          ['MixColumns', 'Multiplications dans GF(2⁸) avec polynôme 0x11B', 'Transformée MixColumns visible dans le décompilateur comme des XOR complexes'],
        ]
      ),
      note('success', 'findcrypt / CAPA', "Le plugin <strong>findcrypt</strong> dans IDA détecte automatiquement la S-box AES. Cherchez aussi avec CAPA la capacité <code>encrypt data using AES via WinAPI</code>."),
      code('text', `AES S-box (16 premiers octets) :
63 7C 77 7B F2 6B 6F C5  30 01 67 2B FE D7 AB 76

Rcon (table de constantes Round) :
01 02 04 08 10 20 40 80  1B 36`),
      table(
        ['Famille', 'Variante AES', 'Usage'],
        [
          ['REvil / Sodinokibi', 'AES-256-CBC', 'Chiffrement des fichiers + Salsa20 pour les gros fichiers'],
          ['LockBit 2.0 / 3.0', 'AES-128', 'Chiffrement multi-threadé ultra-rapide'],
          ['Ryuk', 'AES-256', 'Chiffrement par volume (serveurs, NAS)'],
          ['Conti', 'AES-256', 'Pipeline chiffrement parallèle avec I/O Completion Ports'],
          ['BlackCat / ALPHV', 'AES-128-CTR + ChaCha20', 'Ransomware en Rust, dual cipher selon taille fichier'],
        ]
      ),
      p("Exemple de pattern AES dans un implémentation manuelle (sans AES-NI) — ce que vous voyez dans Hex-Rays :"),
      code('c', `/* La S-box AES (256 octets) est en .rdata — premier octet toujours 0x63 */
static const uint8_t aes_sbox[256] = {
    0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5,
    0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76,
    /* ... 240 autres octets identiques dans toute implémentation AES ... */
};

/* SubBytes — lookup table → pattern Hex-Rays : v5 = aes_sbox[v4] */
uint8_t SubBytes(uint8_t b) { return aes_sbox[b]; }

/* MixColumns — multiplications dans GF(2^8) avec polynôme 0x11B
   Pattern Hex-Rays : XOR imbriqués avec des shifts et des tests de bit */
uint8_t gf_mul(uint8_t a, uint8_t b) {
    uint8_t p = 0;
    for (int i = 0; i < 8; i++) {
        if (b & 1) p ^= a;
        int carry = a & 0x80;
        a <<= 1;
        if (carry) a ^= 0x1B;  /* 0x1B = polynôme irréductible de GF(2^8) */
        b >>= 1;
    }
    return p;
}`),

      hr(),

      // 3DES
      h3('3DES — Triple DES'),
      p("<strong>3DES</strong> applique l'algorithme DES trois fois consécutivement (Encrypt-Decrypt-Encrypt avec 3 clés de 56 bits). Bien que vieillissant et lent, il reste présent dans les malwares qui ciblent des environnements legacy ou qui réutilisent du code ancien."),
      p("DES est reconnaissable à ses <strong>tables de permutation</strong> fixes, notamment la <em>Initial Permutation (IP)</em> et la <em>S-box DES</em> (8 S-boxes de 64 entrées 6→4 bits)."),
      code('text', `DES S-box 1 (premières valeurs) :
14  4 13  1  2 15 11  8  3 10  6 12  5  9  0  7
 0 15  7  4 14  2 13  1 10  6 12 11  9  5  3  8`),
      table(
        ['Famille', 'Usage'],
        [
          ['Qakbot (versions pré-2020)', 'Chiffrement des communications C2 avec 3DES-CBC'],
          ['Dridex (anciennes variantes)', 'Protection de la configuration réseau'],
          ['Trojans bancaires ciblant AS/400', 'Compatibilité avec les systèmes mainframe legacy'],
        ]
      ),
      p("Usage typique via WinCrypt — pattern visible dans IDA Imports :"),
      code('c', `/* 3DES via WinCrypt — CALG_3DES = 0x6603 */
HCRYPTPROV hProv; HCRYPTKEY hKey; HCRYPTHASH hHash;

/* Étape 1 : acquérir le CSP */
CryptAcquireContextA(&hProv, NULL, NULL, PROV_RSA_FULL, CRYPT_VERIFYCONTEXT);

/* Étape 2 : hasher la clé (MD5 ou SHA-1) */
CryptCreateHash(hProv, CALG_MD5, 0, 0, &hHash);   /* CALG_MD5 = 0x8003 */
CryptHashData(hHash, (BYTE *)key, key_len, 0);

/* Étape 3 : dériver la clé 3DES — CALG_3DES = 0x6603 visible en push imm32 */
CryptDeriveKey(hProv, CALG_3DES, hHash, 0, &hKey);

/* Étape 4 : chiffrer */
CryptEncrypt(hKey, 0, TRUE, 0, data, &data_len, buf_size);`),

      hr(),

      // RC5
      h3('RC5'),
      p("<strong>RC5</strong> est un chiffrement par blocs paramétrable (taille bloc, nombre de rounds, taille clé). Sa version la plus courante dans les malwares est RC5-32/12/16. Il se distingue par l'usage intensif de <strong>rotations (ROL/ROR)</strong> et de <strong>deux constantes magiques</strong> dérivées de e et φ."),
      code('c', `/* Constantes magiques RC5 (version 32 bits) */
#define P32  0xB7E15163UL   /* Dérivé de (e-2) × 2^32 */
#define Q32  0x9E3779B9UL   /* Dérivé de (φ-1) × 2^32 — aussi dans AES KeyExp! */

/* Key expansion RC5 */
for (int i = 0; i < t; i++) {
    A = S[i] = ROL(S[i] + A + B, 3);
    B = L[j] = ROL(L[j] + A + B, A + B);
}`),
      note('info', 'Q32 = 0x9E3779B9', "Cette constante apparaît aussi dans AES KeyExpansion et dans les hash-maps (Knuth multiplicative hashing). Si vous la voyez seule, ne concluez pas RC5 directement — cherchez P32 = 0xB7E15163 pour confirmer."),
      table(
        ['Famille', 'Usage'],
        [
          ['Locky (variantes 2016)', 'Chiffrement des fichiers en RC5 + RSA'],
          ['Kelihos (spam botnet)', 'Chiffrement des communications C2'],
        ]
      ),

      hr(),

      // Serpent
      h3('Serpent'),
      p("<strong>Serpent</strong> était finaliste de l'appel AES (2000). Bien que moins répandu qu'AES, il apparaît dans certains malwares sophistiqués, notamment des outils de surveillance commerciaux. Il utilise <strong>32 rounds</strong> (contre 10/12/14 pour AES) avec 8 S-boxes de 4 bits."),
      table(
        ['Famille', 'Usage'],
        [
          ['FinFisher / FinSpy (surveillance commerciale)', 'Chiffrement des modules et des communications'],
          ['BitPaymer ransomware', 'Chiffrement des fichiers en Serpent'],
        ]
      ),
      note('warning', 'Détection', "Serpent est rare — si findcrypt le détecte, il s'agit probablement d'un malware ciblé / nation-state. Les 8 S-boxes (tableaux de 16 entrées 4 bits) sont visibles dans la section .data ou en inline."),

      hr(),

      // Salsa20 / ChaCha20
      h3('Salsa20 / ChaCha20'),
      p("<strong>Salsa20</strong> et sa variante <strong>ChaCha20</strong> sont des stream ciphers modernes, très rapides, avec une propriété remarquable : leur constante d'initialisation est une chaîne ASCII lisible en clair."),
      code('text', `Constante "magic" Salsa20 / ChaCha20 (32 bytes key) :
ASCII : "expand 32-byte k"
Hex   :  65 78 70 61  6E 64 20 33  32 2D 62 79  74 65 20 6B

Visible en clair dans les strings IDA ou dans la vue Hex !`),
      p("Le quarter-round (opération de base de Salsa20/ChaCha20) combine ADD + XOR + ROT, toujours dans cet ordre, ce qui crée un pattern de décompilation reconnaissable."),
      table(
        ['Famille', 'Usage'],
        [
          ['Thanos ransomware', 'Chiffrement des fichiers en ChaCha20 + RSA'],
          ['NightSky ransomware', 'ChaCha20 pour les communications C2'],
          ['REvil (gros fichiers)', 'Salsa20 pour les fichiers > quelques Mo (plus rapide qu\'AES)'],
        ]
      ),
      p("Implémentation du quarter-round — pattern caractéristique visible dans Hex-Rays (séquence ADD + XOR + ROT invariable) :"),
      code('c', `#define ROTL(v, n) (((v) << (n)) | ((v) >> (32-(n))))

/* Quarter-round Salsa20 : ADD + XOR + ROT — toujours dans cet ordre */
/* Dans IDA/Hex-Rays : séquence de __ROL4__ ou (v << n | v >> (32-n)) */
#define QR(a, b, c, d)          \\
    b ^= ROTL(a + d,  7);       \\
    c ^= ROTL(b + a,  9);       \\
    d ^= ROTL(c + b, 13);       \\
    a ^= ROTL(d + c, 18);

/* Bloc Salsa20 : état de 16 uint32 (64 octets), 10 double-rounds */
void salsa20_block(uint32_t out[16], const uint32_t in[16]) {
    uint32_t x[16];
    for (int i = 0; i < 16; i++) x[i] = in[i];

    for (int i = 0; i < 10; i++) {        /* 20 demi-rounds = Salsa20/20 */
        QR(x[ 0], x[ 4], x[ 8], x[12]); /* colonne 0 */
        QR(x[ 5], x[ 9], x[13], x[ 1]); /* colonne 1 */
        QR(x[10], x[14], x[ 2], x[ 6]); /* colonne 2 */
        QR(x[15], x[ 3], x[ 7], x[11]); /* colonne 3 */
        QR(x[ 0], x[ 1], x[ 2], x[ 3]); /* ligne 0 */
        QR(x[ 5], x[ 6], x[ 7], x[ 4]); /* ligne 1 */
        QR(x[10], x[11], x[ 8], x[ 9]); /* ligne 2 */
        QR(x[15], x[12], x[13], x[14]); /* ligne 3 */
    }
    for (int i = 0; i < 16; i++) out[i] = x[i] + in[i]; /* add-back final */
}

/* État initial — les 4 constantes sigma sont visibles dans IDA strings :
   x[0]=0x61707865, x[5]=0x3320646e, x[10]=0x79622d32, x[15]=0x6b206574
   → "expa" "nd 3" "2-by" "te k" = "expand 32-byte k"               */`),

      hr(),

      // MISTY-1
      h3('MISTY-1 — Algorithme rare'),
      p("<strong>MISTY-1</strong> est un algorithme japonais développé par Mitsubishi Electric en 1995. Il est extrêmement rare dans les malwares, mais a été observé dans des outils d'espionnage attribués à des groupes APT asiatiques. Il utilise un réseau de Feistel à 8 rounds avec des fonctions FL/FO/FI imbriquées."),
      note('info', 'Pourquoi le mentionner ?', "Sa rareté en fait un indicateur fort de malware sophistiqué/nation-state si vous le détectez. Le plugin findcrypt le reconnaît grâce aux tables de substitution SP7/SP9 qui lui sont propres."),

      hr(),

      // ── SECTION 2 : ASYMÉTRIQUES ──────────────────────────────
      h2('Chiffrements Asymétriques'),
      p("Les chiffrements asymétriques utilisent une paire de clés (publique/privée). Dans les malwares, ils ne chiffrent <strong>jamais</strong> des volumes importants de données (trop lents) — ils servent exclusivement à <strong>protéger la clé symétrique</strong>. Le schéma classique ransomware est : <em>AES/ChaCha20 chiffre les fichiers, RSA/ECDH chiffre la clé AES</em>."),

      // RSA
      h3('RSA'),
      p("RSA est le standard pour l'échange de clés dans les ransomwares. La clé publique de l'attaquant est embarquée dans le malware (ou téléchargée depuis le C2). Elle chiffre la clé AES générée localement. Sans la clé privée de l'attaquant, déchiffrement impossible."),
      p("Indicateurs dans IDA/WinCrypt :"),
      list([
        "<code>CryptGenKey(hProv, AT_KEYEXCHANGE, ...)</code> — génération de la paire RSA locale",
        "<code>CryptImportKey</code> — import de la clé publique de l'attaquant",
        "<code>CryptEncrypt</code> avec un handle provenant d'une clé RSA (PROV_RSA_FULL ou PROV_RSA_AES)",
        "Blob de clé publique (PUBLICKEYBLOB) en dur dans la section .data",
      ]),
      table(
        ['Famille', 'Schéma RSA'],
        [
          ['WannaCry', 'RSA-2048 (clé publique embedded) → chiffre la clé AES-128 par fichier'],
          ['Ryuk', 'RSA-2048 via CryptAPI, clé publique téléchargée depuis C2'],
          ['REvil / Sodinokibi', 'Courbe elliptique Curve25519 + RSA selon les variantes'],
          ['Locky', 'RSA-2048 pour protéger la clé RC4 de chiffrement'],
        ]
      ),

      hr(),

      // ECDH
      h3('ECDH — Elliptic Curve Diffie-Hellman'),
      p("<strong>ECDH</strong> offre le même niveau de sécurité que RSA avec des clés bien plus courtes (256 bits ECDH ≈ 3072 bits RSA). Les ransomwares modernes migrent vers ECDH pour cette efficacité."),
      p("Sur Windows, ECDH se fait via <strong>BCrypt</strong> (CNG — Cryptography Next Generation) et non WinCrypt :"),
      code('c', `// Indicateurs BCrypt pour ECDH
BCryptOpenAlgorithmProvider(&hAlg, BCRYPT_ECDH_P256_ALGORITHM, NULL, 0);
BCryptGenerateKeyPair(hAlg, &hKey, 256, 0);
BCryptFinalizeKeyPair(hKey, 0);
BCryptSecretAgreement(hKey, hPeerKey, &hSecret, 0);`),
      table(
        ['Famille', 'Courbe'],
        [
          ['Babuk ransomware', 'ECDH Curve25519 + HC-128 stream cipher'],
          ['BlackMatter / DarkSide', 'ECDH P-256 via BCrypt'],
          ['Hive ransomware', 'Curve25519 — génère une clé unique par fichier'],
        ]
      ),

      hr(),

      // ── SECTION 3 : WINCRYPT API ──────────────────────────────
      h2('Détection via la WinCrypt API'),
      p("Quand un malware délègue le chiffrement à l'OS via la <strong>WinCrypt API</strong> (aussi appelée <em>Crypto Service Provider — CSP</em>), ses imports deviennent des indicateurs directs de l'algorithme utilisé."),
      note('info', 'Où regarder dans IDA ?', "Onglet <strong>Imports</strong> : filtrez sur <code>Crypt</code>. Les fonctions WinCrypt sont dans <code>advapi32.dll</code>. BCrypt (CNG) est dans <code>bcrypt.dll</code>."),

      p("Les fonctions clés et ce qu'elles révèlent :"),
      table(
        ['Fonction', 'Rôle', 'Ce que ça révèle'],
        [
          ['CryptAcquireContext', 'Obtient un handle vers un CSP', 'Type de provider (PROV_RSA_AES, PROV_RSA_FULL…)'],
          ['CryptCreateHash', 'Crée un objet de hash', 'Algorithme de hash via ALG_ID (CALG_SHA_256, CALG_MD5…)'],
          ['CryptHashData', 'Hash des données', 'La clé de dérivation ou le payload haché'],
          ['CryptDeriveKey', 'Dérive une clé symétrique depuis un hash', 'Algorithme symétrique via ALG_ID'],
          ['CryptGenKey', 'Génère une clé (aléatoire ou asymétrique)', '<strong>ALG_ID directement — voir tableau ci-dessous</strong>'],
          ['CryptEncrypt', 'Chiffre des données', 'Présence de chiffrement, taille de bloc via le padding'],
          ['CryptDecrypt', 'Déchiffre des données', 'Déchiffrement au runtime (config, payload)'],
          ['CryptImportKey', 'Importe une clé depuis un blob', 'Clé publique RSA embedded dans le binaire'],
        ]
      ),

      h3('CryptGenKey — ALG_ID'),
      p('La valeur <code>AlgId</code> passée à <a href="https://learn.microsoft.com/en-us/windows/win32/api/wincrypt/nf-wincrypt-cryptgenkey" target="_blank" rel="noopener"><strong>CryptGenKey</strong></a> identifie directement l\'algorithme. Elle est visible en clair dans le décompilateur Hex-Rays comme une constante numérique.'),
      table(
        ['ALG_ID (hex)', 'Constante', 'Algorithme'],
        [
          ['0x6601', 'CALG_DES', 'DES 56-bit'],
          ['0x6603', 'CALG_3DES', '3DES (Triple DES)'],
          ['0x6602', 'CALG_RC2', 'RC2'],
          ['0x6801', 'CALG_RC4', 'RC4'],
          ['0x6802', 'CALG_RC5', 'RC5'],
          ['0x660E', 'CALG_AES_128', 'AES-128'],
          ['0x660F', 'CALG_AES_192', 'AES-192'],
          ['0x6610', 'CALG_AES_256', 'AES-256'],
          ['0x8004', 'CALG_SHA_256', 'SHA-256 (hash)'],
          ['0x8003', 'CALG_MD5', 'MD5 (hash)'],
          ['0xA400', 'AT_KEYEXCHANGE', 'RSA (échange de clé / chiffrement)'],
          ['0x2400', 'AT_SIGNATURE', 'RSA (signature)'],
        ]
      ),
      note('warning', 'ALG_ID comme IOC', "Dans le décompilateur Hex-Rays, <code>CryptGenKey(hProv, 0x6610, ...)</code> identifie AES-256 sans ambiguïté. Ajoutez ces valeurs à votre YARA rule comme indicateurs de capacité de chiffrement."),

      p("Séquence typique dans un malware utilisant AES via WinCrypt — visible dans le décompilateur :"),
      code('c', `// Pattern typique : dérivation de clé AES depuis un mot de passe
CryptAcquireContextA(&hProv, NULL, NULL, PROV_RSA_AES, CRYPT_VERIFYCONTEXT);
CryptCreateHash(hProv, CALG_SHA_256, 0, 0, &hHash);  // 0x8004
CryptHashData(hHash, password, passlen, 0);
CryptDeriveKey(hProv, CALG_AES_256, hHash, 0, &hKey); // 0x6610 → AES-256 !
CryptEncrypt(hKey, 0, TRUE, 0, data, &dataLen, bufLen);`),

      hr(),

      // ── SECTION 4 : CONSTANTES ────────────────────────────────
      h2('Détection par Constantes'),
      p("Chaque algorithme embarque des constantes mathématiques fixes dans son implémentation. Ces constantes sont <strong>des empreintes digitales</strong> visibles dans la section <code>.data</code>, <code>.rdata</code>, ou inline dans le code."),

      h3('AES — S-box et Rcon'),
      code('text', `/* AES S-box — 32 premiers octets (toujours identiques) */
63 7C 77 7B F2 6B 6F C5 30 01 67 2B FE D7 AB 76
CA 82 C9 7D FA 59 47 F0 AD D4 A2 AF 9C A4 72 C0

/* Rcon — Round Constants pour le Key Schedule */
01 02 04 08 10 20 40 80 1B 36`),
      note('success', 'findcrypt dans IDA', "Le plugin <strong>findcrypt</strong> (disponible sur HexRays plugin manager) scanne le binaire pour ces séquences et annote automatiquement les fonctions crypto détectées."),

      h3('SHA-256 — Constantes K'),
      code('text', `/* SHA-256 — 64 constantes K (premières valeurs) */
428A2F98 71374491 B5C0FBCF E9B5DBA5
3956C25B 59F111F1 923F82A4 AB1C5ED5

Ces DWORD sont visibles dans IDA dans la section .rdata ou en push imm32 inline.`),

      h3('RC5 — Constantes P32 / Q32'),
      code('c', `#define P32  0xB7E15163   // (e  - 2) × 2^32, e = base logarithme naturel
#define Q32  0x9E3779B9   // (φ - 1) × 2^32, φ = nombre d'or`),

      h3('Salsa20 / ChaCha20 — Constante ASCII'),
      code('text', `/* Chaîne ASCII visible dans les strings IDA */
"expand 32-byte k"   ← pour une clé 256-bit
"expand 16-byte k"   ← pour une clé 128-bit

Hex : 65 78 70 61 6E 64 20 33 32 2D 62 79 74 65 20 6B`),

      hr(),

      // ── SECTION 5 : FLOW ──────────────────────────────────────
      h2('Détection par Flow / Structure'),
      p("Même sans constantes numériques, certains algorithmes laissent une empreinte dans leur structure de contrôle (boucles, compteurs, opérations)."),

      h3('RC4 — Pattern SBOX'),
      p("La séquence de patterns pour confirmer RC4 dans IDA :"),
      list([
        "<strong>Pattern 1 (Init)</strong> — Boucle <code>for(i=0;i&lt;256;i++) S[i]=i</code> → tableau alloué sur la pile ou en .bss, 256 octets",
        "<strong>Pattern 2 (KSA)</strong> — Boucle 256 iters avec <code>j = (j + S[i] + key[i%keylen]) & 0xFF</code> puis deux mov pour swap",
        "<strong>Pattern 3 (PRGA)</strong> — Boucle sur len(data) avec swap + XOR indirect <code>S[(S[i]+S[j])&0xFF]</code>",
      ]),
      code('text', `Vue Graph IDA — RC4 KSA (schéma typique) :

[init: i=0, j=0]
       │
       ▼
[block: j += S[i] + key[i%len]]  ←─┐
[swap S[i] ↔ S[j]]                  │
[i++]                                │
[i < 256 ?] ──YES───────────────────┘
       │ NO
       ▼
[PRGA loop]`),

      h3('AES — SubBytes lookup'),
      p("Dans une implémentation manuelle d'AES (sans AES-NI), la fonction <code>SubBytes</code> est une lookup table dans la S-box. Le pattern dans Hex-Rays ressemble à :"),
      code('c', `// SubBytes — accès indirect dans sbox[256]
uint8_t SubBytes(uint8_t byte) {
    return sbox[byte];  // sbox est la table de 256 octets
}
// Dans le décompilateur : v5 = *((_BYTE *)&sbox + v4)`),

      h3('Outils d\'analyse automatique'),
      table(
        ['Outil', 'Type', 'Algorithmes détectés', 'Usage'],
        [
          ['findcrypt (IDA plugin)', 'Constantes', 'AES, DES, RC4, SHA, MD5, Serpent, Camellia…', 'Plugin IDA — annoter les fonctions'],
          ['CAPA (mandiant)', 'Règles CAPA', 'Capacités crypto + autres behaviors', 'CLI : capa.exe malware.exe'],
          ['YARA', 'Regex/bytes', 'Toute constante personnalisée', 'Règles custom sur S-boxes, magic values'],
          ['CyberChef', 'Déchiffrement', 'RC4, AES, XOR, Base64…', 'Déchiffrement rapide une fois la clé trouvée'],
          ['detect-it-easy (DIE)', 'Entropy / signatures', 'Packer, crypto libs (OpenSSL, mbedTLS)', 'Avant l\'analyse statique'],
        ]
      ),

      hr(),

      // ── SECTION 6 : RETENIR ───────────────────────────────────
      h2('Ce qu\'il faut retenir pour IDA'),
      p("En pratique, vous ne reconnaîtrez jamais un algorithme sur un seul indice. La méthode fiable est de <strong>combiner plusieurs patterns</strong> pour confirmer le diagnostic avant de conclure."),

      h3('RC4 — Les 3 patterns combinés'),
      note('warning', 'Signature la plus fiable en pratique', "La combinaison des 3 patterns ci-dessous est <strong>quasi-certaine d'identifier RC4</strong>, même sur un binaire strippé, obfusqué ou compilé avec des optimisations agressives."),
      table(
        ['Étape', 'Pattern ASM (x64)', 'Pattern Hex-Rays (F5)', 'Ce qui confirme RC4'],
        [
          ['Init S-Box', '<code>mov byte ptr [rbp+rax], al</code> en boucle 256 itérations', '<code>for(i=0;i&lt;256;i++) S[i]=i;</code>', 'Boucle compteur fixe = 256, octet = index — tableau sur la pile ou .bss'],
          ['KSA', '<code>xchg</code> ou double <code>mov</code> entre deux positions du tableau S[]', '<code>j=(j+S[i]+key[i%len])&0xFF; tmp=S[i]; S[i]=S[j]; S[j]=tmp;</code>', 'Swap de deux éléments dans S[] + indexation par la clé'],
          ['PRGA', 'Double swap + <code>xor</code> avec index indirect (<code>S[S[i]+S[j]]</code>)', '<code>data[k]^=S[(S[i]+S[j])&0xFF];</code>', 'XOR à double indexation dans S[] — signature unique à RC4'],
        ]
      ),
      code('text', `Checklist de confirmation RC4 dans IDA :

[✓] Tableau de 256 octets alloué sur la pile (rbp-0x108 typiquement)
[✓] Boucle 1 : mov byte ptr [rbp+rax], al  — compteur 0→255
[✓] Boucle 2 : swap via xchg ou 2x mov     — même tableau, 256 iters
[✓] Boucle 3 : XOR avec accès indirect S[S[i]+S[j]] — sur les données

Si les 4 cases sont cochées → RC4 confirmé à 99%
La clé est passée en argument de la fonction Boucle 2 (KSA).`),

      h3('Tableau de synthèse — Signatures rapides'),
      table(
        ['Algorithme', 'Signature principale', 'Constante/Valeur magique', 'Outil de détection'],
        [
          ['RC4', 'Tableau 256 octets + boucle swap', 'Aucune — détection par structure', 'Analyse manuelle ou findcrypt'],
          ['AES', 'S-box 256 octets dans .rdata', '0x63 (premier octet S-box)', 'findcrypt, CAPA'],
          ['RC5', 'ROL/ROR intenses + key schedule', 'P32=0xB7E15163 Q32=0x9E3779B9', 'findcrypt, recherche hex'],
          ['3DES', 'Import CryptDeriveKey', 'CALG_3DES = 0x6603 en push imm32', 'IDA Imports tab'],
          ['Salsa20/ChaCha20', 'QR macro : ADD+XOR+ROT×4', '"expand 32-byte k" dans strings', 'IDA Strings view'],
          ['RSA', 'Import CryptGenKey(AT_KEYEXCHANGE)', 'AT_KEYEXCHANGE = 0x1', 'IDA Imports tab'],
          ['ECDH', 'Import BCryptOpenAlgorithmProvider', 'String L"ECDH_P256" dans .rdata', 'IDA Strings / Imports'],
        ]
      ),

      hr(),

      // ── SECTION 7 : DEMO BINAIRE ──────────────────────────────
      h2('Démo — demo_crypto.exe'),
      p("Le binaire <strong>demo_crypto.exe</strong> illustre les deux approches de détection dans un même programme. Voici les éléments à retrouver :"),

      h3('Ce que contient le binaire'),
      table(
        ['Composant', 'Emplacement dans IDA', 'Ce qu\'il illustre'],
        [
          ['rc4_init_sbox()', 'Fonction visible dans la liste Functions', 'Étape 1 : boucle 256 iters, S[i]=i'],
          ['rc4_ksa()', 'Appelée après rc4_init_sbox', 'Étape 2 : KSA avec clé "Z2P_K3Y"'],
          ['rc4_prga()', 'Appelée avant printf du flag', 'Étape 3 : PRGA + XOR sur encrypted_flag[]'],
          ['aes_demo()', 'Imports : CryptCreateHash + CryptDeriveKey', 'Détection WinCrypt : CALG_AES_256 = 0x6610'],
          ['rsa_demo()', 'Imports : CryptGenKey(AT_KEYEXCHANGE)', 'Détection WinCrypt : AT_KEYEXCHANGE = 0x1'],
          ['encrypted_flag[]', 'Tableau de 35 octets dans .rdata', 'Flag chiffré RC4 — à déchiffrer'],
        ]
      ),

      h3('Workflow d\'analyse'),
      list([
        "<strong>IDA → Imports</strong> : identifiez <code>CryptCreateHash</code>, <code>CryptDeriveKey</code>, <code>CryptGenKey</code>. Notez la constante ALG_ID passée à <code>CryptDeriveKey</code> (2e arg) — c'est <code>0x6610</code> = AES-256.",
        "<strong>IDA → Functions</strong> : le binaire est strippé, les fonctions s'appellent <code>sub_XXXXXXXX</code>. Parcourez les courtes fonctions. Cherchez une boucle <code>for(i=0;i&lt;256;i++)</code> avec <code>S[i]=i</code> — c'est l'Init SBOX (étape 1).",
        "<strong>Étape 2 — KSA</strong> : la fonction appelée juste après l'Init SBOX contient une boucle 256 iters avec un swap et une indexation par la clé. Notez son adresse dans la barre d'adresse IDA — c'est la réponse.",
        "<strong>Étape 3 — PRGA</strong> : la 3e fonction RC4 opère sur les données et fait un XOR avec un double index dans S[]. Vérifiez les XREF depuis <code>main()</code> pour confirmer l'ordre d'appel des 3 étapes.",
        "<strong>WinCrypt</strong> : explorez <code>aes_demo()</code> et <code>rsa_demo()</code> via leurs XREF depuis les imports — identifiez <code>CALG_AES_256 = 0x6610</code> et <code>AT_KEYEXCHANGE = 0x1</code> dans le décompilateur.",
      ], true),

      note('warning', 'Compiler les binaires', `Depuis le dossier <code>demo/</code> :<br>
<code>gcc -O1 -s -o demo_crypto.exe demo_crypto.c -ladvapi32</code><br>
<code>gcc -O1 -s -o demo_crypto_full.exe demo_crypto_full.c -ladvapi32</code><br>
<code>gcc -O1 -s -o exam_crypto.exe exam_crypto.c</code><br><br>
<strong>demo_crypto_full.exe</strong> — binaire de référence du cours (RC4 + RC5 + Salsa20 + AES + 3DES + RSA commentés).<br>
<strong>demo_crypto.exe</strong> — démo RC4 + WinCrypt AES/RSA.<br>
<strong>exam_crypto.exe</strong> — binaire d'examen : strippé, sans output, sans strings. 5 questions à résoudre dans IDA.`),

    ],

    exercise: {
      type: 'multi',
      title: 'Examen — Identifier RC4, RC5 et RSA dans exam_crypto.exe',
      scenario: "Un analyste vous soumet un binaire suspect récupéré sur un poste compromis. Le programme ne produit aucune sortie — il s'exécute silencieusement. Votre mission : ouvrir le binaire dans IDA Pro et répondre aux 5 questions suivantes en retrouvant les adresses statiques.",
      description: "Ouvrez <strong>exam_crypto.exe</strong> dans IDA Pro. Le binaire est strippé, sans symboles, sans strings visibles. Il contient RC4 (3 étapes manuelles), RC5 (constantes P32/Q32 en .data) et une clé publique RSA embarquée en .rdata.<br><br>Format attendu : <code>0x14000XXXXX</code> — adresse statique telle qu'affichée dans IDA (image base <code>0x140000000</code>). Accepté avec ou sans préfixe <code>0x</code>, insensible à la casse.",
      downloadFile: 'exam_crypto',
      questions: [
        {
          id: 'q1',
          label: 'Q1 — RC4 Étape 1 : Adresse de la fonction <strong>Init SBOX</strong> (boucle S[i]=i sur 256 itérations)',
          answer: '0x1400016d0',
        },
        {
          id: 'q2',
          label: 'Q2 — RC4 Étape 2 : Adresse de la fonction <strong>KSA</strong> (Key Scheduling Algorithm — boucle swap avec la clé)',
          answer: '0x1400016f9',
        },
        {
          id: 'q3',
          label: 'Q3 — RC4 Étape 3 : Adresse de la fonction <strong>PRGA</strong> (double swap + XOR indirect sur les données)',
          answer: '0x140001745',
        },
        {
          id: 'q4',
          label: 'Q4 — RC5 : Adresse du tableau <code>rc5_magic[]</code> contenant <strong>P32 = 0xB7E15163</strong> (section .data)',
          answer: '0x140004010',
        },
        {
          id: 'q5',
          label: 'Q5 — RSA : Adresse du blob de clé publique RSA (magic <strong>0x31415352</strong> = "RSA1", section .rdata)',
          answer: '0x140005060',
        },
      ],
    },
  },
]

export default courses
