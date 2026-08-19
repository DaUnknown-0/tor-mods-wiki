/* ============================================================================
 * TOR Mods Wiki — hidden prerelease test board (test.html)
 *
 * Reached by clicking the crewmate next to the "TOR Mods" wordmark five times
 * quickly (see wireSecretDoor in app.js). It is not linked anywhere else and
 * carries no entry in the navigation.
 *
 * READING is always allowed. CHANGING (ticking a box, writing a note) needs the
 * password once per browser: the same one that unlocks the game start in
 * LobbyPasswordGate. The page never stores or transmits the password - it
 * hashes the input with SHA-256 and compares it against password_hash.txt from
 * the Useful TOR Stuff repository, exactly like the mod does.
 *
 * Two details that keep this working outside a web server:
 *   - crypto.subtle only exists in a secure context, so a compact SHA-256
 *     implementation stands in when the page is opened straight from disk.
 *   - the hash file cannot be fetched from a file:// page (cross origin), so a
 *     known-good hash is compiled in as a fallback. Which source was used is
 *     shown in the unlock panel, because the fallback is by definition the hash
 *     of the day this page was built.
 *
 * State lives in localStorage and nowhere else - there is no backend. Export
 * and import move a test run between browsers or testers.
 * ==========================================================================*/
(function () {
  "use strict";

  const STORE_KEY = "tormods-test-state";
  const UNLOCK_KEY = "tormods-test-unlocked";
  const LANG_KEY = "tormods-lang";

  const HASH_URL =
    "https://raw.githubusercontent.com/DaUnknown-0/Useful-TOR-stuff/main/password_hash.txt";
  // Fallback for offline / file:// use, see the header.
  const HASH_FALLBACK =
    "dd4e65f7148512d215ff6c5283391278593dd2c685d17a1a6adb83c087dbfaeb";

  /* ---------------------------------------------------------------- groups */
  const GROUPS = [
    { key: "unknowns", name: "Unknown's Collection" },
    { key: "useful", name: "TOR - Forgotten Fixes" },
    { key: "chance", name: "Unknown Chaos" },
    { key: "nightfall", name: "Nightfall" },
    { key: "tools", name: "Tools" },
  ];

  /* ------------------------------------------------------------- test items
   * id: never rename one - it is the localStorage key for that row's state.
   * how: what to actually do in game. risk: what is known to be shaky.
   */
  const ITEMS = [
    /* ---------------- Unknown's Collection ---------------- */
    {
      id: "uc-werewolf", mod: "unknowns",
      title: { en: "Werewolf: alpha charge and wolf form", de: "Werewolf: Alpha-Ladung und Wolfsform" },
      how: {
        en: "Play a round with the Werewolf on. Stand in the dark until the alpha charge fills, transform, and check the howl, the speed multiplier and that the form ends after its duration.",
        de: "Runde mit aktivem Werewolf spielen. Im Dunkeln stehen bis die Alpha-Ladung voll ist, verwandeln, dann Howl, Speed-Multiplikator und das Ende der Wolfsform nach Ablauf prüfen.",
      },
      risk: {
        en: "Charge reset on lights fix, and whether the form survives a meeting.",
        de: "Ladungs-Reset beim Lichtfix und ob die Form ein Meeting übersteht.",
      },
    },
    {
      id: "uc-silver", mod: "unknowns",
      title: { en: "Werewolf: the silver matrix", de: "Werewolf: die Silber-Matrix" },
      how: {
        en: "Trigger every silver source once: trapper trap, saboteur trap, deputy handcuffs. Each must behave exactly as the matrix says (wound, revert, or nothing).",
        de: "Jede Silberquelle einmal auslösen: Trapper-Falle, Saboteur-Falle, Deputy-Handschellen. Jede muss sich genau so verhalten wie die Matrix es festlegt (verwunden, zurückverwandeln oder nichts).",
      },
    },
    {
      id: "uc-hunter", mod: "unknowns",
      title: { en: "Hunter rises from the Sheriff", de: "Hunter steigt aus dem Sheriff auf" },
      how: {
        en: "With a Sheriff in play, let the Werewolf transform. The Sheriff must become the Hunter, keep the flashlight bonus, and see a guess grid that contains the Werewolf only.",
        de: "Mit Sheriff im Spiel den Werewolf verwandeln lassen. Der Sheriff muss zum Hunter werden, den Flashlight-Bonus behalten und ein Guess-Grid sehen, das nur den Werewolf enthält.",
      },
      risk: {
        en: "Deputy promotion when the Hunter rises, and the hat swap.",
        de: "Deputy-Beförderung beim Hunter-Aufstieg und der Hut-Wechsel.",
      },
    },
    {
      id: "uc-pelican", mod: "unknowns",
      title: { en: "Pelican: swallow and release", de: "Pelican: schlucken und freigeben" },
      how: {
        en: "Swallow a player, check the swallowed player's own view, then kill the Pelican and confirm everyone inside is released the way the options say.",
        de: "Einen Spieler schlucken, dessen eigene Ansicht prüfen, dann den Pelican töten und bestätigen, dass alle Geschluckten so freikommen wie in den Optionen eingestellt.",
      },
    },
    {
      id: "uc-collector", mod: "unknowns",
      title: { en: "Collector: relic hunt and instant win", de: "Collector: Relikt-Jagd und Instant-Win" },
      how: {
        en: "Confirm relics are visible on the map, that collecting respects the cooldown, that extra relics spawn per completed crew tasks, and that reaching the target actually ends the round with the Collector win.",
        de: "Prüfen: Relikte sind auf der Map sichtbar, Einsammeln respektiert den Cooldown, Extra-Relikte spawnen pro erledigten Crew-Tasks, und das Erreichen der Zielzahl beendet die Runde wirklich mit dem Collector-Sieg.",
      },
      risk: {
        en: "The win was swallowed by the bypass freeze once; it is now retried every 2s.",
        de: "Der Sieg wurde einmal vom Bypass-Freeze verschluckt; er wird jetzt alle 2 s wiederholt.",
      },
    },
    {
      id: "uc-manipulator", mod: "unknowns",
      title: { en: "Manipulator: fake admin and vitals", de: "Manipulator: gefälschtes Admin und Vitals" },
      how: {
        en: "As Manipulator, fake both surfaces while a second player watches them. Positions and life signs must look plausible to the victim and must not flicker.",
        de: "Als Manipulator beide Oberflächen fälschen, während ein zweiter Spieler zuschaut. Positionen und Lebenszeichen müssen für das Opfer plausibel aussehen und dürfen nicht flackern.",
      },
      risk: {
        en: "Vitals cardio line may stutter; TOR's hacker player icons stay stale during a fake.",
        de: "Die Vitals-Kardiolinie könnte stottern; TORs Hacker-Spielericons bleiben während einer Fälschung stale.",
      },
    },
    {
      id: "uc-poltergeist", mod: "unknowns",
      title: { en: "Poltergeist: haunting from the grave", de: "Poltergeist: Spuk aus dem Grab" },
      how: {
        en: "Die first, then use every ability once: manifestation, door haunt, ghost hand, hex. Watch the energy pool drain and refill.",
        de: "Als Erster sterben, dann jede Fähigkeit einmal nutzen: Manifestation, Tür-Spuk, Geisterhand, Hex. Dabei den Energie-Pool beim Leeren und Auffüllen beobachten.",
      },
      risk: {
        en: "The ghost hand does not know the Airship helicopter (a deliberate v1 gap).",
        de: "Die Geisterhand kennt den Airship-Heli nicht (bewusste v1-Lücke).",
      },
    },
    {
      id: "uc-necromancer", mod: "unknowns",
      title: { en: "Necromancer: thralls that look alive", de: "Necromancer: Thralls, die lebendig wirken" },
      how: {
        en: "Raise a fresh corpse, then check from another client that the thrall looks alive, that its vote counts zero in the meeting, and that killing the Necromancer ends the army.",
        de: "Frische Leiche erwecken, dann von einem anderen Client prüfen: Der Thrall wirkt lebendig, seine Stimme zählt im Meeting null, und der Tod des Necromancers beendet die Armee.",
      },
      risk: {
        en: "SetVote(253) behaviour of the vote area and the icon count in the meeting.",
        de: "SetVote(253)-Verhalten der Vote-Area und die Icon-Anzahl im Meeting.",
      },
    },
    {
      id: "uc-auditor", mod: "unknowns",
      title: { en: "Auditor: taking completed tasks back", de: "Auditor: erledigte Tasks zurücknehmen" },
      how: {
        en: "Revert a crew task that was really completed and confirm the crew task bar drops on every client, not just locally. Then check the Snitch cannot be guessed while the option is on.",
        de: "Eine wirklich erledigte Crew-Task zurücknehmen und prüfen, ob die Task-Leiste auf JEDEM Client fällt, nicht nur lokal. Danach prüfen, dass der Snitch bei aktiver Option nicht guessbar ist.",
      },
      risk: {
        en: "Whether an impostor can complete a real vanilla task at all is the open question.",
        de: "Ob ein Impostor in Vanilla überhaupt eine echte Task abschließen kann, ist die offene Frage.",
      },
    },
    {
      id: "uc-gambler", mod: "unknowns",
      title: { en: "Gambler: bets settle in the meeting", de: "Gambler: Wetten werden im Meeting abgerechnet" },
      how: {
        en: "Place a bet of each tier, then let the meeting settle it. Confirm the payout (speed, own tasks, impostor kill cooldown) and that nothing leaks before the meeting.",
        de: "Je eine Wette pro Stufe platzieren und im Meeting abrechnen lassen. Auszahlung prüfen (Speed, eigene Tasks, Impostor-Kill-Cooldown) und dass vor dem Meeting nichts durchsickert.",
      },
    },
    {
      id: "uc-saboteur", mod: "unknowns",
      title: { en: "Saboteur: traps on every map", de: "Saboteur: Fallen auf jeder Map" },
      how: {
        en: "Place traps on Skeld, Polus, Mira, Airship and Fungle. Each must stun, the limp must follow, and the crew scan sweep must find and defuse them.",
        de: "Fallen auf Skeld, Polus, Mira, Airship und Fungle legen. Jede muss stunnen, das Humpeln muss folgen, und der Crew-Scan-Sweep muss sie finden und entschärfen.",
      },
      risk: {
        en: "The map-agnostic trap fix (StopCharles detection) is the part that was rebuilt.",
        de: "Der map-agnostische Fallen-Fix (StopCharles-Erkennung) ist der neu gebaute Teil.",
      },
    },
    {
      id: "uc-killfx-uc", mod: "unknowns",
      title: { en: "Kill cutscenes for UC roles", de: "Kill-Cutscenes für UC-Rollen" },
      how: {
        en: "Trigger a kill as Tesla, Saboteur (task kill), Poisoner, Shade and Maniac. Each must play its own cutscene for the victim, and the Poisoner's must survive the exile path.",
        de: "Je einen Kill als Tesla, Saboteur (Task-Kill), Poisoner, Shade und Maniac auslösen. Jeder muss beim Opfer seine eigene Cutscene zeigen, und die des Poisoners muss den Exil-Pfad überstehen.",
      },
    },
    {
      id: "uc-killfx-tor", mod: "unknowns",
      title: { en: "Kill cutscenes for TOR roles", de: "Kill-Cutscenes für TOR-Rollen" },
      how: {
        en: "Off by default: switch them on and check a special kill from as many of the ten TOR roles as you can. The Vampire bite and the Warlock curse must stay vanilla.",
        de: "Standardmäßig aus: einschalten und Spezialkills von möglichst vielen der zehn TOR-Rollen prüfen. Vampire-Biss und Warlock-Fluch müssen vanilla bleiben.",
      },
    },
    {
      id: "uc-hats", mod: "unknowns",
      title: { en: "Custom hats", de: "Eigene Hüte" },
      how: {
        en: "Wear the virus, billboard and werewolf hats. Check the silhouette in the lobby, in game, while climbing a ladder and after a meeting.",
        de: "Virus-, Werbetafel- und Werewolf-Hut tragen. Silhouette prüfen: in der Lobby, im Spiel, beim Leiterklettern und nach einem Meeting.",
      },
    },
    {
      id: "uc-music", mod: "unknowns",
      title: { en: "Reactor music and the one-cue rule", de: "Reaktor-Musik und die Ein-Cue-Regel" },
      how: {
        en: "Start the reactor sabotage while a role cue is already playing. The reactor score must take over, and only one cue may ever be audible.",
        de: "Reaktor-Sabotage starten, während bereits ein Rollen-Cue läuft. Die Reaktor-Musik muss übernehmen, und es darf immer nur ein Cue hörbar sein.",
      },
    },

    /* ---------------- Forgotten Fixes ---------------- */
    {
      id: "ff-settings-overlay", mod: "useful",
      title: { en: "The rebuilt settings list (F1)", de: "Die neu gebaute Settings-Liste (F1)" },
      how: {
        en: "Open F1 on every page. Roles must carry their own colour, values must line up, 0% roles must collapse into one 'Off:' line, and the mod tags [UC]/[FF]/[Chance] must sit on the right settings.",
        de: "F1 auf jeder Seite öffnen. Rollen müssen ihre eigene Farbe tragen, Werte müssen ausgerichtet stehen, 0%-Rollen in einer 'Off:'-Zeile zusammenfallen, und die Kürzel [UC]/[FF]/[Chance] müssen an den richtigen Einstellungen stehen.",
      },
      risk: {
        en: "With very many active roles the fourth column can still reach the screen edge - that is TOR's own layout limit.",
        de: "Bei sehr vielen aktiven Rollen kann die vierte Spalte weiterhin an den Bildschirmrand stoßen: das ist TORs eigene Layout-Grenze.",
      },
    },
    {
      id: "ff-overlay-hud", mod: "useful",
      title: { en: "HUD steps aside for F1", de: "HUD tritt für F1 beiseite" },
      how: {
        en: "Press F1 in the lobby: the mod-check line and the newcomer shield / mod sync buttons must disappear at once and come back when F1 closes.",
        de: "In der Lobby F1 drücken: Die Mod-Check-Zeile und die Buttons für Newcomer-Schild / Mod-Abgleich müssen sofort verschwinden und beim Schließen zurückkommen.",
      },
    },
    {
      id: "ff-antistartkill", mod: "useful",
      title: { en: "Anti start kill: the spawn safe zone", de: "Anti Start Kill: die Spawn-Schutzzone" },
      how: {
        en: "Start rounds on each map and try to kill inside the spawn area. The zone must cover the spawn room and not half the map; the shield outline must cycle when several shields stack.",
        de: "Auf jeder Map Runden starten und im Spawnbereich zu killen versuchen. Die Zone muss den Spawnraum abdecken und nicht die halbe Map; die Schild-Outline muss bei mehreren Schilden zyklen.",
      },
      risk: {
        en: "The zone was too large twice before; map-by-map check is the point here.",
        de: "Die Zone war schon zweimal zu groß; genau deshalb hier Map für Map prüfen.",
      },
    },
    {
      id: "ff-shieldpeace", mod: "useful",
      title: { en: "Shields block attacks, not peaceful abilities", de: "Schilde blocken Angriffe, nicht friedliche Fähigkeiten" },
      how: {
        en: "With a protected player on the field, try Medic shield, Shifter, Morphling sample, Tracker, Deputy handcuffs, Eraser, Arsonist and Pursuer on them. All must work. Then try to kill them - that must still fail.",
        de: "Mit einem geschützten Spieler auf dem Feld: Medic-Schild, Shifter, Morphling-Probe, Tracker, Deputy-Handschellen, Eraser, Arsonist und Pursuer an ihm ausprobieren. Alles muss gehen. Dann versuchen, ihn zu töten: das muss weiterhin scheitern.",
      },
      risk: {
        en: "A protected player died despite the green shield in an earlier playtest.",
        de: "In einem früheren Playtest starb ein geschützter Spieler trotz grünem Schild.",
      },
    },
    {
      id: "ff-newcomer", mod: "useful",
      title: { en: "Newcomer shield", de: "Newcomer-Schild" },
      how: {
        en: "Let someone join who has not played this session. They must survive their first round's kills, and the killer must get the configured explanation.",
        de: "Jemanden beitreten lassen, der diese Session noch nicht gespielt hat. Er muss die Kills seiner ersten Runde überleben, und der Killer muss die eingestellte Erklärung bekommen.",
      },
    },
    {
      id: "ff-newcomer-sidekick", mod: "useful",
      title: { en: "Newcomer shield lets the Sidekick through", de: "Newcomer-Schild lässt den Sidekick durch" },
      how: {
        en: "As Jackal, target a shielded newcomer: recruiting him as Sidekick must work, killing him must still fail with the usual message. After the sidekick exists, the shielded player must be untargetable again.",
        de: "Als Jackal einen geschützten Neuling anvisieren: Ihn als Sidekick anzuwerben muss klappen, ihn zu töten muss weiterhin mit der üblichen Meldung scheitern. Sobald der Sidekick existiert, muss der Geschützte wieder unanvisierbar sein.",
      },
      risk: {
        en: "The kill now rests on the two kill blocks alone, since the targeting gate stands down for the Jackal.",
        de: "Der Kill hängt jetzt allein an den beiden Kill-Sperren, weil die Ziel-Sperre für den Jackal aussetzt.",
      },
    },
    {
      id: "ff-modsync", mod: "useful",
      title: { en: "Mod sync against the host", de: "Mod-Abgleich mit dem Host" },
      how: {
        en: "Join a lobby with one mod missing or outdated. The lobby button must offer exactly that mod, and the download must land in the plugins folder.",
        de: "Einer Lobby mit einem fehlenden oder veralteten Mod beitreten. Der Lobby-Button muss genau diesen Mod anbieten, und der Download muss im Plugins-Ordner landen.",
      },
      risk: {
        en: "Version comparison of BepInEx plugin versions (SemanticVersioning pitfall).",
        de: "Versionsvergleich der BepInEx-Plugin-Versionen (SemanticVersioning-Fallstrick).",
      },
    },
    {
      id: "ff-webconfig", mod: "useful",
      title: { en: "WebConfig on 127.0.0.1:32200", de: "WebConfig auf 127.0.0.1:32200" },
      how: {
        en: "As host, open the page in a browser and change a mod option and a vanilla option. Both must arrive in the lobby, and a client must never be able to write.",
        de: "Als Host die Seite im Browser öffnen und je eine Mod- und eine Vanilla-Option ändern. Beide müssen in der Lobby ankommen, und ein Client darf niemals schreiben können.",
      },
    },
    {
      id: "ff-impcount", mod: "useful",
      title: { en: "Random impostor count", de: "Zufällige Impostor-Anzahl" },
      how: {
        en: "Set a min/max range and start several rounds. The count must vary inside the range, the Spy must unlock at max >= 2, and the Sidekick refill must respect its chance.",
        de: "Min/Max-Bereich setzen und mehrere Runden starten. Die Anzahl muss im Bereich schwanken, der Spy muss bei Max >= 2 freigeschaltet sein, und der Sidekick-Refill muss seine Chance beachten.",
      },
    },
    {
      id: "ff-loc", mod: "useful",
      title: { en: "25 languages", de: "25 Sprachen" },
      how: {
        en: "Switch the game language and walk through settings, buttons and meeting texts. Role names must stay English everywhere.",
        de: "Spielsprache umschalten und Einstellungen, Buttons und Meeting-Texte durchgehen. Rollennamen müssen überall englisch bleiben.",
      },
    },
    {
      id: "ff-perf", mod: "useful",
      title: { en: "Performance patches", de: "Performance-Patches" },
      how: {
        en: "Keep F1 open during a round and watch the frame rate; play a round with several bloody players. Neither may drag the game down the way it used to.",
        de: "F1 während einer Runde offen lassen und die Framerate beobachten; eine Runde mit mehreren Bloody-Spielern spielen. Keines darf das Spiel so ausbremsen wie früher.",
      },
    },
    {
      id: "ff-guards", mod: "useful",
      title: { en: "Crash guards", de: "Absturz-Schutz" },
      how: {
        en: "Have a player leave right after a kill, during a guess and while a portal teleport runs. Nothing may throw, and the round must continue.",
        de: "Einen Spieler direkt nach einem Kill, während eines Guesses und während einer Portal-Teleportation verlassen lassen. Nichts darf werfen, und die Runde muss weiterlaufen.",
      },
    },
    {
      id: "ff-settingsshare", mod: "useful",
      title: { en: "Settings share", de: "Settings-Austausch" },
      how: {
        en: "Copy the settings, paste them in a fresh lobby, and confirm the freshness marker and the file export both describe the same set.",
        de: "Einstellungen kopieren, in einer frischen Lobby einfügen und prüfen, dass Freshness-Marker und Datei-Export denselben Stand beschreiben.",
      },
    },

    /* ---------------- Chance ---------------- */
    {
      id: "chance-chaosswap", mod: "chance",
      title: { en: "Chaos swap: role interactions", de: "Chaos-Swap: Rollen-Interaktionen" },
      how: {
        en: "Run chaos mode with Sheriff, Deputy and roles outside the chaos pools in play. Holders of pool-less roles must be protected, and the Sheriff must stay safe while a living Deputy exists.",
        de: "Chaos-Modus mit Sheriff, Deputy und Rollen außerhalb der Chaos-Pools spielen. Halter von Rollen ohne Pool müssen geschützt sein, und der Sheriff muss geschützt bleiben, solange ein lebender Deputy existiert.",
      },
    },
    {
      id: "chance-c1", mod: "chance",
      title: { en: "Open audit item C-1", de: "Offener Audit-Punkt C-1" },
      how: {
        en: "Still unresolved from the 2026-08-11 audit and marked critical. Confirm it is fixed before this mod ships.",
        de: "Aus dem Audit vom 11.08.2026 weiterhin offen und als kritisch markiert. Vor dem Release dieses Mods bestätigen, dass er behoben ist.",
      },
    },

    /* ---------------- Nightfall ---------------- */
    {
      id: "nf-firstperson", mod: "nightfall",
      title: { en: "First person on transformation", de: "Ich-Perspektive bei der Verwandlung" },
      how: {
        en: "Transform as the Werewolf and check the raycaster view: walls, floor and other players must be where the map says they are, and leaving the form must restore the normal camera.",
        de: "Als Werewolf verwandeln und die Raycaster-Sicht prüfen: Wände, Boden und andere Spieler müssen dort sein, wo die Map sie hat, und das Ende der Form muss die normale Kamera wiederherstellen.",
      },
    },

    /* ---------------- Tools ---------------- */
    {
      id: "tool-autopilot", mod: "tools",
      title: { en: "AutoPilot M1: the bot plays tasks", de: "AutoPilot M1: der Bot spielt Tasks" },
      how: {
        en: "Toggle with F9 in a task round on Skeld/Polus/Mira. The bot must find a path, open the task and finish it without getting stuck.",
        de: "Mit F9 in einer Task-Runde auf Skeld/Polus/Mira umschalten. Der Bot muss einen Weg finden, die Task öffnen und sie beenden, ohne hängen zu bleiben.",
      },
    },
    {
      id: "tool-rolecontrol", mod: "tools",
      title: { en: "Role Control", de: "Role Control" },
      how: {
        en: "Assign roles, modifiers, speed, cooldown, vent ban and tasks to other players from chat, the F7 overlay and the web page on 32210. Every change must arrive on the target client.",
        de: "Rollen, Modifier, Speed, Cooldown, Vent-Sperre und Tasks anderer Spieler über Chat, F7-Overlay und die Web-Seite auf 32210 setzen. Jede Änderung muss beim Zielclient ankommen.",
      },
    },
  ];

  /* ------------------------------------------------------------------ i18n */
  const S = {
    en: {
      kicker: "Internal · not linked from the wiki",
      title: "Prerelease test board",
      lead: "Everything that is built but not confirmed in a playtest. Tick a row once you have actually seen it work, and note what broke if it did not.",
      locked: "Read only",
      unlocked: "Unlocked",
      unlock: "Unlock",
      unlock_hint: "Enter the same password that unlocks the game start. It is checked against the hash in the repository and never leaves this page.",
      password: "Password",
      wrong: "Wrong password.",
      checking: "Checking...",
      source_live: "Hash source: repository (live)",
      source_fallback: "Hash source: built into this page (repository not reachable)",
      progress: "tested",
      note_placeholder: "Note, e.g. what broke",
      export: "Export",
      import: "Import",
      copy: "Copy",
      copied: "Copied",
      close: "Close",
      import_hint: "Paste an exported test run here and confirm. This overwrites the rows it contains.",
      apply: "Apply",
      imported: "Test run imported.",
      import_bad: "That is not a valid export.",
      reset: "Clear all",
      reset_confirm: "Clear every tick and note on this board?",
      back: "Back to the wiki",
      risk: "Watch out",
      all_done: "Everything on this board has been tested.",
      relock: "Lock again",
    },
    de: {
      kicker: "Intern · nicht aus dem Wiki verlinkt",
      title: "Prerelease-Testboard",
      lead: "Alles, was gebaut, aber noch nicht im Playtest bestätigt ist. Hake eine Zeile ab, wenn du sie wirklich hast laufen sehen, und notiere, was kaputt war, falls nicht.",
      locked: "Nur lesen",
      unlocked: "Entsperrt",
      unlock: "Entsperren",
      unlock_hint: "Dasselbe Passwort eingeben, das den Spielstart freischaltet. Es wird gegen den Hash im Repository geprüft und verlässt diese Seite nie.",
      password: "Passwort",
      wrong: "Falsches Passwort.",
      checking: "Prüfe...",
      source_live: "Hash-Quelle: Repository (live)",
      source_fallback: "Hash-Quelle: in dieser Seite hinterlegt (Repository nicht erreichbar)",
      progress: "getestet",
      note_placeholder: "Notiz, z. B. was kaputt war",
      export: "Exportieren",
      import: "Importieren",
      copy: "Kopieren",
      copied: "Kopiert",
      close: "Schließen",
      import_hint: "Einen exportierten Teststand hier einfügen und bestätigen. Die enthaltenen Zeilen werden überschrieben.",
      apply: "Übernehmen",
      imported: "Teststand importiert.",
      import_bad: "Das ist kein gültiger Export.",
      reset: "Alles leeren",
      reset_confirm: "Wirklich jedes Häkchen und jede Notiz auf diesem Board löschen?",
      back: "Zurück ins Wiki",
      risk: "Achtung",
      all_done: "Alles auf diesem Board ist getestet.",
      relock: "Wieder sperren",
    },
  };

  const lang = () => (localStorage.getItem(LANG_KEY) === "de" ? "de" : "en");
  const t = (k) => S[lang()][k] || S.en[k] || k;
  const L = (o) => (o ? (o[lang()] != null ? o[lang()] : o.en) : "");

  /* ----------------------------------------------------------------- state */
  function load() {
    try {
      return JSON.parse(localStorage.getItem(STORE_KEY) || "{}") || {};
    } catch {
      return {};
    }
  }
  function save(state) {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  }
  let state = load();
  let unlocked = localStorage.getItem(UNLOCK_KEY) === "1";

  /* ------------------------------------------------------- password checks */
  // Compact SHA-256 - stands in where crypto.subtle is unavailable (file://).
  function sha256Fallback(ascii) {
    function rr(v, a) { return (v >>> a) | (v << (32 - a)); }
    const K = [];
    const H = [];
    let p = 2, n = 0;
    for (; n < 64; p++) {
      let prime = true;
      for (let f = 2; f * f <= p; f++) if (p % f === 0) { prime = false; break; }
      if (!prime) continue;
      if (n < 8) H[n] = (Math.pow(p, 0.5) % 1 * 4294967296) | 0;
      K[n] = (Math.pow(p, 1 / 3) % 1 * 4294967296) | 0;
      n++;
    }
    // TextEncoder is not a secure-context feature, so it is available even here and
    // encodes astral characters (emoji) correctly, which a hand-rolled three-byte
    // loop would not. The loop stays as a last resort for very old engines.
    let bytes;
    if (window.TextEncoder) {
      bytes = Array.from(new TextEncoder().encode(ascii));
    } else {
      bytes = [];
      for (let i = 0; i < ascii.length; i++) {
        const c = ascii.charCodeAt(i);
        if (c < 128) bytes.push(c);
        else if (c < 2048) bytes.push(192 | (c >> 6), 128 | (c & 63));
        else bytes.push(224 | (c >> 12), 128 | ((c >> 6) & 63), 128 | (c & 63));
      }
    }
    const bitLen = bytes.length * 8;
    bytes.push(0x80);
    while (bytes.length % 64 !== 56) bytes.push(0);
    for (let i = 7; i >= 0; i--) bytes.push((i < 4 ? Math.floor(bitLen / Math.pow(2, i * 8)) : 0) & 255);

    const w = new Array(64);
    const h = H.slice(0);
    for (let i = 0; i < bytes.length; i += 64) {
      for (let j = 0; j < 16; j++)
        w[j] = (bytes[i + j * 4] << 24) | (bytes[i + j * 4 + 1] << 16) |
               (bytes[i + j * 4 + 2] << 8) | bytes[i + j * 4 + 3];
      for (let j = 16; j < 64; j++) {
        const s0 = rr(w[j - 15], 7) ^ rr(w[j - 15], 18) ^ (w[j - 15] >>> 3);
        const s1 = rr(w[j - 2], 17) ^ rr(w[j - 2], 19) ^ (w[j - 2] >>> 10);
        w[j] = (w[j - 16] + s0 + w[j - 7] + s1) | 0;
      }
      let [a, b, c, d, e, f, g, hh] = h;
      for (let j = 0; j < 64; j++) {
        const S1 = rr(e, 6) ^ rr(e, 11) ^ rr(e, 25);
        const ch = (e & f) ^ (~e & g);
        const t1 = (hh + S1 + ch + K[j] + w[j]) | 0;
        const S0 = rr(a, 2) ^ rr(a, 13) ^ rr(a, 22);
        const maj = (a & b) ^ (a & c) ^ (b & c);
        const t2 = (S0 + maj) | 0;
        hh = g; g = f; f = e; e = (d + t1) | 0;
        d = c; c = b; b = a; a = (t1 + t2) | 0;
      }
      h[0] = (h[0] + a) | 0; h[1] = (h[1] + b) | 0; h[2] = (h[2] + c) | 0; h[3] = (h[3] + d) | 0;
      h[4] = (h[4] + e) | 0; h[5] = (h[5] + f) | 0; h[6] = (h[6] + g) | 0; h[7] = (h[7] + hh) | 0;
    }
    return h.map((x) => ("00000000" + (x >>> 0).toString(16)).slice(-8)).join("");
  }

  async function sha256(text) {
    if (window.crypto && crypto.subtle && window.isSecureContext) {
      const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
      return Array.from(new Uint8Array(buf))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    }
    return sha256Fallback(text);
  }

  let expectedHash = null;
  let hashLive = false;
  async function loadHash() {
    if (expectedHash) return expectedHash;
    try {
      const res = await fetch(HASH_URL, { cache: "no-store" });
      if (res.ok) {
        const text = (await res.text()).trim().toLowerCase();
        if (/^[0-9a-f]{64}$/.test(text)) {
          expectedHash = text;
          hashLive = true;
          return expectedHash;
        }
      }
    } catch {
      /* offline or file:// - fall through to the compiled-in hash */
    }
    expectedHash = HASH_FALLBACK;
    hashLive = false;
    return expectedHash;
  }

  /* ---------------------------------------------------------------- render */
  function esc(s) {
    return String(s).replace(/[&<>"]/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  }

  function counts() {
    const done = ITEMS.filter((i) => state[i.id] && state[i.id].done).length;
    return { done, total: ITEMS.length };
  }

  function itemHTML(item) {
    const st = state[item.id] || {};
    const risk = item.risk
      ? `<p class="test-risk"><span>${t("risk")}</span>${esc(L(item.risk))}</p>`
      : "";
    const note = esc(st.note || "");
    return `
      <li class="test-item${st.done ? " done" : ""}${st.note ? " noted" : ""}" data-id="${item.id}">
        <label class="test-check">
          <input type="checkbox" ${st.done ? "checked" : ""} ${unlocked ? "" : "disabled"} />
          <span class="box" aria-hidden="true"></span>
          <span class="test-title">${esc(L(item.title))}</span>
        </label>
        <p class="test-how">${esc(L(item.how))}</p>
        ${risk}
        <input class="test-note" type="text" value="${note}"
               placeholder="${esc(t("note_placeholder"))}" ${unlocked ? "" : "disabled"} />
      </li>`;
  }

  function groupHTML(group) {
    const items = ITEMS.filter((i) => i.mod === group.key);
    if (!items.length) return "";
    const done = items.filter((i) => state[i.id] && state[i.id].done).length;
    return `
      <section class="doc-section test-group ${group.key}" id="g-${group.key}">
        <h2>${esc(group.name)}
          <span class="test-count">${done}/${items.length}</span>
        </h2>
        <ul class="test-list">${items.map(itemHTML).join("")}</ul>
      </section>`;
  }

  function render() {
    const main = document.getElementById("content");
    const side = document.getElementById("sidebar");
    if (!main) return;
    if (side) side.innerHTML = "";

    const c = counts();
    const pct = c.total ? Math.round((c.done / c.total) * 100) : 0;

    main.innerHTML = `
      <header class="mod-hero test-hero">
        <p class="kicker">${esc(t("kicker"))}</p>
        <h1>${esc(t("title"))}</h1>
        <p class="lead">${esc(t("lead"))}</p>
        <div class="meta-row">
          <span class="chip lock-chip">${unlocked ? esc(t("unlocked")) : esc(t("locked"))}</span>
          <span class="chip">${c.done}/${c.total} ${esc(t("progress"))}</span>
          <a class="btn" href="index.html">${esc(t("back"))}</a>
        </div>
        <div class="test-progress"><span style="width:${pct}%"></span></div>
      </header>

      <div class="test-actions">
        ${unlocked
          ? `<button class="btn small" id="tRelock">${esc(t("relock"))}</button>`
          : `<button class="btn primary small" id="tUnlock">${esc(t("unlock"))}</button>`}
        <button class="btn small" id="tExport">${esc(t("export"))}</button>
        <button class="btn small" id="tImport">${esc(t("import"))}</button>
        ${unlocked ? `<button class="btn small danger" id="tReset">${esc(t("reset"))}</button>` : ""}
      </div>
      <div id="tPanel" class="test-panel" hidden></div>

      ${GROUPS.map(groupHTML).join("")}
      ${c.done === c.total ? `<p class="test-alldone">${esc(t("all_done"))}</p>` : ""}
    `;

    wire();
  }

  /* -------------------------------------------------------------- wiring */
  function wire() {
    document.querySelectorAll(".test-item").forEach((li) => {
      const id = li.dataset.id;
      const box = li.querySelector('input[type="checkbox"]');
      const note = li.querySelector(".test-note");

      if (box) box.addEventListener("change", () => {
        if (!unlocked) return;
        const entry = state[id] || {};
        entry.done = box.checked;
        state[id] = entry;
        save(state);
        li.classList.toggle("done", box.checked);
        refreshCounters();
      });

      if (note) note.addEventListener("input", () => {
        if (!unlocked) return;
        const entry = state[id] || {};
        entry.note = note.value;
        state[id] = entry;
        save(state);
        li.classList.toggle("noted", !!note.value);
      });
    });

    const unlockBtn = document.getElementById("tUnlock");
    if (unlockBtn) unlockBtn.addEventListener("click", showUnlock);

    const relock = document.getElementById("tRelock");
    if (relock) relock.addEventListener("click", () => {
      unlocked = false;
      localStorage.removeItem(UNLOCK_KEY);
      render();
    });

    const exportBtn = document.getElementById("tExport");
    if (exportBtn) exportBtn.addEventListener("click", showExport);

    const importBtn = document.getElementById("tImport");
    if (importBtn) importBtn.addEventListener("click", showImport);

    const reset = document.getElementById("tReset");
    if (reset) reset.addEventListener("click", () => {
      if (!confirm(t("reset_confirm"))) return;
      state = {};
      save(state);
      render();
    });
  }

  // Only the numbers change on a tick - re-rendering the whole board would
  // throw away the note field the tester is typing in.
  function refreshCounters() {
    const c = counts();
    const pct = c.total ? Math.round((c.done / c.total) * 100) : 0;
    const chip = document.querySelectorAll(".test-hero .chip")[1];
    if (chip) chip.textContent = `${c.done}/${c.total} ${t("progress")}`;
    const bar = document.querySelector(".test-progress span");
    if (bar) bar.style.width = pct + "%";
    GROUPS.forEach((g) => {
      const items = ITEMS.filter((i) => i.mod === g.key);
      const done = items.filter((i) => state[i.id] && state[i.id].done).length;
      const el = document.querySelector(`#g-${g.key} .test-count`);
      if (el) el.textContent = `${done}/${items.length}`;
    });
  }

  function panel(html) {
    const p = document.getElementById("tPanel");
    if (!p) return null;
    p.innerHTML = html;
    p.hidden = false;
    return p;
  }
  function closePanel() {
    const p = document.getElementById("tPanel");
    if (p) { p.hidden = true; p.innerHTML = ""; }
  }

  function showUnlock() {
    const p = panel(`
      <p class="test-panel-hint">${esc(t("unlock_hint"))}</p>
      <div class="test-panel-row">
        <input type="password" id="tPass" placeholder="${esc(t("password"))}" autocomplete="off" />
        <button class="btn primary small" id="tPassOk">${esc(t("unlock"))}</button>
        <button class="btn small" id="tPassCancel">${esc(t("close"))}</button>
      </div>
      <p class="test-panel-msg" id="tPassMsg"></p>`);
    if (!p) return;

    const input = document.getElementById("tPass");
    const msg = document.getElementById("tPassMsg");
    input.focus();

    loadHash().then(() => {
      msg.textContent = hashLive ? t("source_live") : t("source_fallback");
      msg.className = "test-panel-msg";
    });

    const submit = async () => {
      msg.textContent = t("checking");
      const expected = await loadHash();
      const got = await sha256(input.value);
      if (got === expected) {
        unlocked = true;
        localStorage.setItem(UNLOCK_KEY, "1");
        closePanel();
        render();
      } else {
        msg.textContent = t("wrong");
        msg.className = "test-panel-msg bad";
        input.select();
      }
    };

    document.getElementById("tPassOk").addEventListener("click", submit);
    document.getElementById("tPassCancel").addEventListener("click", closePanel);
    input.addEventListener("keydown", (e) => { if (e.key === "Enter") submit(); });
  }

  function showExport() {
    const payload = JSON.stringify({ board: "tormods-prerelease", state }, null, 2);
    const p = panel(`
      <div class="test-panel-row">
        <button class="btn small" id="tCopy">${esc(t("copy"))}</button>
        <button class="btn small" id="tExpClose">${esc(t("close"))}</button>
      </div>
      <textarea class="test-io" id="tExpText" readonly rows="10">${esc(payload)}</textarea>`);
    if (!p) return;
    document.getElementById("tExpClose").addEventListener("click", closePanel);
    document.getElementById("tCopy").addEventListener("click", (e) => {
      const ta = document.getElementById("tExpText");
      ta.select();
      try { document.execCommand("copy"); } catch { /* selection is the fallback */ }
      if (navigator.clipboard) navigator.clipboard.writeText(payload).catch(() => {});
      e.target.textContent = t("copied");
    });
  }

  function showImport() {
    const p = panel(`
      <p class="test-panel-hint">${esc(t("import_hint"))}</p>
      <div class="test-panel-row">
        <button class="btn primary small" id="tImpOk">${esc(t("apply"))}</button>
        <button class="btn small" id="tImpClose">${esc(t("close"))}</button>
      </div>
      <textarea class="test-io" id="tImpText" rows="10" placeholder='{"board":"tormods-prerelease", ...}'></textarea>
      <p class="test-panel-msg" id="tImpMsg"></p>`);
    if (!p) return;
    document.getElementById("tImpClose").addEventListener("click", closePanel);
    document.getElementById("tImpOk").addEventListener("click", () => {
      const msg = document.getElementById("tImpMsg");
      let data;
      try { data = JSON.parse(document.getElementById("tImpText").value); } catch { data = null; }
      if (!data || data.board !== "tormods-prerelease" || typeof data.state !== "object") {
        msg.textContent = t("import_bad");
        msg.className = "test-panel-msg bad";
        return;
      }
      Object.keys(data.state).forEach((k) => { state[k] = data.state[k]; });
      save(state);
      closePanel();
      render();
    });
  }

  window.TORTEST = { render };
})();
