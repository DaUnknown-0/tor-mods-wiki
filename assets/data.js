/* ============================================================================
 * TOR Mods Wiki — content data (bilingual EN/DE)
 * Each entry: { id, title:{en,de}, summary:{en,de}, body:{en,de}, badges:[{en,de}] }
 * ==========================================================================*/

const UI = {
  en: {
    langName: "English",
    nav_home: "Home",
    nav_chance: "Chance Modifier",
    nav_useful: "Forgotten Fixes",
    nav_unknowns: "Unknown's Collection",
    search_placeholder: "Search features…",
    search_none: "No entries match your search.",
    on_this_page: "On this page",
    expand_all: "Expand all",
    collapse_all: "Collapse all",
    version: "Version",
    all_clients: "All clients",
    host_auth: "Host-authoritative",
    repo: "Source on GitHub",
    download: "Download latest",
    back_top: "Back to top",
    home_hero_kicker: "Companion mods for The Other Roles",
    home_hero_title: "Three mods. One wiki.",
    home_hero_sub: "Randomized chaos, a pile of quality-of-life fixes, and brand-new custom roles for The Other Roles 4.8.0. Click any feature to read what it does.",
    home_explore: "Explore the mods",
    home_combined: "Combined feature highlights",
    open_mod: "Open wiki page",
    footer_note: "Not affiliated with Among Us or Innersloth LLC. A derivative work of The Other Roles, licensed under GPL-3.0.",
    disclaimer: "This mod is not affiliated with Among Us or Innersloth LLC, and the content contained therein is not endorsed or otherwise sponsored by Innersloth LLC. Portions of the materials contained herein are property of Innersloth LLC. © Innersloth LLC.",
    install_title: "Download & install",
    deps_title: "Requirements",
    toc_intro: "Jump to a section, or use the search box to filter every feature on the page.",
  },
  de: {
    langName: "Deutsch",
    nav_home: "Start",
    nav_chance: "Chance Modifier",
    nav_useful: "Forgotten Fixes",
    nav_unknowns: "Unknown's Collection",
    search_placeholder: "Features durchsuchen…",
    search_none: "Keine Einträge passen zu deiner Suche.",
    on_this_page: "Auf dieser Seite",
    expand_all: "Alle aufklappen",
    collapse_all: "Alle zuklappen",
    version: "Version",
    all_clients: "Alle Clients",
    host_auth: "Host-autoritativ",
    repo: "Quellcode auf GitHub",
    download: "Neueste Version laden",
    back_top: "Nach oben",
    home_hero_kicker: "Begleit-Mods für The Other Roles",
    home_hero_title: "Drei Mods. Ein Wiki.",
    home_hero_sub: "Zufalls-Chaos, ein Haufen Komfort-Fixes und brandneue eigene Rollen für The Other Roles 4.8.0. Klick auf ein Feature, um zu lesen, was es macht.",
    home_explore: "Mods erkunden",
    home_combined: "Kombinierte Feature-Highlights",
    open_mod: "Wiki-Seite öffnen",
    footer_note: "Nicht mit Among Us oder Innersloth LLC verbunden. Eine abgeleitete Arbeit von The Other Roles, lizenziert unter GPL-3.0.",
    disclaimer: "Dieser Mod ist nicht mit Among Us oder Innersloth LLC verbunden, und die enthaltenen Inhalte werden von Innersloth LLC weder unterstützt noch gesponsert. Teile der hierin enthaltenen Materialien sind Eigentum von Innersloth LLC. © Innersloth LLC.",
    install_title: "Download & Installation",
    deps_title: "Voraussetzungen",
    toc_intro: "Springe zu einem Abschnitt oder filtere mit der Suche alle Features der Seite.",
  }
};

/* ----- shared helpers for table rendering inside body html ----- */
function tbl(headers, rows) {
  const h = headers.map(c => `<th>${c}</th>`).join("");
  const r = rows.map(row => "<tr>" + row.map(c => `<td>${c}</td>`).join("") + "</tr>").join("");
  return `<div class="table-wrap"><table><thead><tr>${h}</tr></thead><tbody>${r}</tbody></table></div>`;
}

/* ============================================================================
 * CHANCE MODIFIER
 * ==========================================================================*/
const CHANCE = {
  key: "chance",
  name: "Chance Modifier",
  fullName: { en: "TOR — Unknown Chaos (Chance Modifier)", de: "TOR — Unknown Chaos (Chance Modifier)" },
  version: "1.2.0",
  allClients: true,
  repo: "https://github.com/DaUnknown-0/TOR-Chance",
  download: "https://github.com/DaUnknown-0/TOR-Chance/releases/latest",
  tagline: {
    en: "Affected players get randomized speed, cooldown, vision, tasks, votes — and a per-kill success chance. Everything about them is random.",
    de: "Betroffene Spieler bekommen zufällige Geschwindigkeit, Cooldown, Sicht, Aufgaben, Stimmen — und eine Kill-Erfolgschance. Alles an ihnen ist Zufall."
  },
  intro: {
    en: "ChanceMod adds two independent features, both configured under the <strong>Modifier</strong> settings tab: the <strong>Chance modifier</strong> (random stats for marked players) and <strong>Chaos Mode</strong> (roles re-rolled after every meeting).",
    de: "ChanceMod fügt zwei unabhängige Features hinzu, beide im <strong>Modifier</strong>-Tab konfigurierbar: den <strong>Chance-Modifier</strong> (zufällige Stats für markierte Spieler) und den <strong>Chaos Mode</strong> (Rollen werden nach jedem Meeting neu ausgelost)."
  },
  install: {
    en: "<ol><li>Install <a href='https://github.com/TheOtherRolesAU/TheOtherRoles'>The Other Roles</a> into your Among Us BepInEx setup.</li><li>Download the latest <code>TOR-ChanceModifier.dll</code> from the releases page.</li><li>Copy it into <code>&lt;Among Us&gt;/BepInEx/plugins/</code>.</li><li>Start the game — the host enables it under the <strong>Modifier</strong> tab (look for <code>Chance</code>).</li></ol><p>After the first install, the in-game auto-updater checks GitHub on the main menu and offers an update button — manual downloads are only needed for the initial setup.</p>",
    de: "<ol><li>Installiere <a href='https://github.com/TheOtherRolesAU/TheOtherRoles'>The Other Roles</a> in dein Among-Us-BepInEx-Setup.</li><li>Lade die neueste <code>TOR-ChanceModifier.dll</code> von der Releases-Seite.</li><li>Kopiere sie nach <code>&lt;Among Us&gt;/BepInEx/plugins/</code>.</li><li>Starte das Spiel — der Host aktiviert sie im <strong>Modifier</strong>-Tab (suche nach <code>Chance</code>).</li></ol><p>Nach der ersten Installation prüft der In-Game-Auto-Updater GitHub im Hauptmenü und bietet einen Update-Button an — manuelle Downloads sind nur für die Erstinstallation nötig.</p>"
  },
  deps: {
    en: "<ul><li><strong>The Other Roles 4.8.0</strong> (hard dependency)</li></ul>",
    de: "<ul><li><strong>The Other Roles 4.8.0</strong> (harte Abhängigkeit)</li></ul>"
  },
  sections: [
    {
      id: "chance-modifier",
      title: { en: "The Chance modifier", de: "Der Chance-Modifier" },
      intro: {
        en: "A modifier assigned to random players at role-assignment time. Each carrier gets their own randomized set of stats.",
        de: "Ein Modifier, der bei der Rollenzuweisung an zufällige Spieler vergeben wird. Jeder Träger erhält einen eigenen zufälligen Satz von Stats."
      },
      entries: [
        {
          id: "assignment",
          title: { en: "Assignment", de: "Zuweisung" },
          summary: {
            en: "Given to random players at role assignment — quantity and chance are configurable.",
            de: "Wird bei der Rollenzuweisung an zufällige Spieler vergeben — Anzahl und Wahrscheinlichkeit konfigurierbar."
          },
          body: {
            en: "<p>The modifier is handed out during role assignment to a configurable number of random players, each with a configurable chance. A carrier can be active from the start of the game, or only after a configured delay.</p>",
            de: "<p>Der Modifier wird während der Rollenzuweisung an eine konfigurierbare Anzahl zufälliger Spieler vergeben, jeweils mit einer konfigurierbaren Wahrscheinlichkeit. Ein Träger kann ab Spielstart aktiv sein oder erst nach einer konfigurierten Verzögerung.</p>"
          }
        },
        {
          id: "activation-delay",
          title: { en: "Activation delay", de: "Aktivierungs-Verzögerung" },
          summary: {
            en: "Effects can kick in immediately, or after N meetings / N seconds.",
            de: "Effekte können sofort wirken oder erst nach N Meetings / N Sekunden."
          },
          body: {
            en: tbl(["Option", "Values", "What it does"], [
              ["Activation Delay Mode", "Immediate / Delayed", "<em>Immediate</em>: works from game start. <em>Delayed</em>: only after X meetings or X seconds."],
              ["Activation Delay Unit", "Meetings / Seconds", "Which unit the delay is measured in."],
              ["Activate After Meetings", "0–10", "Meetings until activation."],
              ["Activate After Seconds", "0–600", "Seconds until activation."]
            ]) + "<p class='note'>Task reduction is only available with <strong>Immediate</strong>, since tasks are assigned at game start.</p>",
            de: tbl(["Option", "Werte", "Funktion"], [
              ["Activation Delay Mode", "Immediate / Delayed", "<em>Immediate</em>: wirkt ab Spielstart. <em>Delayed</em>: erst nach X Meetings oder X Sekunden."],
              ["Activation Delay Unit", "Meetings / Seconds", "Gibt an, in welcher Einheit die Verzögerung gemessen wird."],
              ["Activate After Meetings", "0–10", "Meetings bis zur Aktivierung."],
              ["Activate After Seconds", "0–600", "Sekunden bis zur Aktivierung."]
            ]) + "<p class='note'>Task-Reduzierung ist nur bei <strong>Immediate</strong> verfügbar, da Tasks bei Spielstart zugewiesen werden.</p>"
          }
        },
        {
          id: "toggles",
          title: { en: "Per-effect toggles", de: "Per-Effekt-Toggles" },
          summary: {
            en: "Every effect has its own enable switch. Default: off → that stat stays vanilla.",
            de: "Jeder Effekt hat einen eigenen Enable-Toggle. Standard: aus → der Stat bleibt vanilla."
          },
          body: {
            en: "<p>Each randomization can be turned on independently. Anything left off behaves exactly like vanilla TOR.</p>" + tbl(["Toggle", "Affected options"], [
              ["Enable Speed Randomization", "Min/Max Speed"],
              ["Enable Kill Cooldown Randomization", "Min/Max Kill Cooldown"],
              ["Enable Task Reduction", "Min/Max Tasks (Immediate only)"],
              ["Enable Kill Success Chance", "Kill Success Chance %"],
              ["Enable Auto-Report", "Auto-Report Chance % (per second)"],
              ["Enable Vision Randomization", "Min/Max Vision"],
              ["Enable Vent Access", "Vent Access Chance %"],
              ["Enable Vote Multiplier", "Min/Max Vote Multiplier"],
              ["Enable Kill Distance", "Min/Max Kill Distance"],
              ["Enable Sabotage Cooldown", "Min/Max Sabotage Cooldown (impostors)"]
            ]),
            de: "<p>Jede Randomisierung lässt sich einzeln aktivieren. Was aus bleibt, verhält sich exakt wie Vanilla-TOR.</p>" + tbl(["Toggle", "Betroffene Optionen"], [
              ["Enable Speed Randomization", "Min/Max Speed"],
              ["Enable Kill Cooldown Randomization", "Min/Max Kill Cooldown"],
              ["Enable Task Reduction", "Min/Max Tasks (nur Immediate)"],
              ["Enable Kill Success Chance", "Kill Success Chance %"],
              ["Enable Auto-Report", "Auto-Report Chance % (pro Sekunde)"],
              ["Enable Vision Randomization", "Min/Max Vision"],
              ["Enable Vent Access", "Vent Access Chance %"],
              ["Enable Vote Multiplier", "Min/Max Vote Multiplier"],
              ["Enable Kill Distance", "Min/Max Kill Distance"],
              ["Enable Sabotage Cooldown", "Min/Max Sabotage Cooldown (Impostoren)"]
            ])
          }
        },
        {
          id: "effects",
          title: { en: "Effects in detail", de: "Effekte im Detail" },
          summary: {
            en: "Speed, cooldown, tasks, kill success, auto-report, vision, vents, votes, kill distance, sabotage CD.",
            de: "Geschwindigkeit, Cooldown, Aufgaben, Kill-Erfolg, Auto-Report, Sicht, Vents, Stimmen, Kill-Reichweite, Sabo-CD."
          },
          body: {
            en: tbl(["Effect", "Range", "Description"], [
              ["Speed", "0.25–3×", "Player movement speed."],
              ["Kill cooldown", "2.5–60 s", "Cooldown after a kill."],
              ["Tasks", "1–10", "Number of tasks (Immediate only)."],
              ["Kill success", "0–100 %", "Probability that a kill does <em>not</em> go through (a BlankKill)."],
              ["Auto-report", "0–100 %", "Each second: chance to auto-report the nearest body."],
              ["Vision", "0.25–5×", "Vision radius."],
              ["Vent access", "0–100 %", "Chance to be able to use vents, independent of role."],
              ["Vote multiplier", "0–3×", "Vote weight during voting."],
              ["Kill distance", "0.5–2.5", "Kill radius."],
              ["Sabotage CD", "0–60 s", "Sabotage cooldown (impostors only)."]
            ]) + "<p class='note'>Min/Max pairs are auto-sorted (Min ≤ Max enforced by the UI sync).</p>",
            de: tbl(["Effekt", "Bereich", "Beschreibung"], [
              ["Geschwindigkeit", "0,25–3×", "Bewegungsgeschwindigkeit des Spielers."],
              ["Kill-Cooldown", "2,5–60 s", "Abkühlzeit nach einem Kill."],
              ["Aufgaben", "1–10", "Anzahl Aufgaben (nur Immediate)."],
              ["Kill-Erfolg", "0–100 %", "Wahrscheinlichkeit, dass ein Kill <em>nicht</em> ausgeführt wird (BlankKill)."],
              ["Auto-Report", "0–100 %", "Jede Sekunde: Chance, die nächste Leiche automatisch zu melden."],
              ["Sichtweite", "0,25–5×", "Sichtradius."],
              ["Vent-Zugang", "0–100 %", "Chance auf Vent-Zugang, unabhängig von der Rolle."],
              ["Vote-Multiplikator", "0–3×", "Stimmgewicht bei der Abstimmung."],
              ["Kill-Reichweite", "0,5–2,5", "Kill-Radius."],
              ["Sabo-CD", "0–60 s", "Sabotage-Cooldown (nur Impostoren)."]
            ]) + "<p class='note'>Min/Max-Paare werden automatisch sortiert (Min ≤ Max durch UI-Sync erzwungen).</p>"
          }
        },
        {
          id: "rerandom",
          title: { en: "Re-randomization & player display", de: "Neu-Auslosung & Spieleranzeige" },
          summary: {
            en: "Speed/cooldown/vision re-roll after every meeting; tasks stay fixed. You see your own stats.",
            de: "Speed/Cooldown/Sicht werden nach jedem Meeting neu ausgelost; Tasks bleiben fix. Du siehst deine eigenen Werte."
          },
          body: {
            en: "<p>Speed, kill cooldown and vision are re-randomized after every meeting (on the exile wrap-up, the same hook Chaos Mode uses), so the exiled player is already dead when stats re-roll. Task counts stay fixed for the whole game.</p><p>Chance players see their own randomized values in the role intro. Other players just see <em>“You are CHAOS!”</em>. In-game the modifier shows up as <code>Chance</code> in the role list.</p>",
            de: "<p>Geschwindigkeit, Kill-Cooldown und Sicht werden nach jedem Meeting neu ausgelost (beim Exile-WrapUp, demselben Hook wie Chaos Mode), sodass der herausgewählte Spieler bereits tot ist, wenn neu gewürfelt wird. Die Aufgabenzahl bleibt das ganze Spiel über fix.</p><p>Chance-Spieler sehen ihre eigenen zufälligen Werte im Rollen-Intro. Andere Spieler sehen nur <em>„You are CHAOS!“</em>. Im Spiel erscheint der Modifier als <code>Chance</code> in der Rollenliste.</p>"
          }
        }
      ]
    },
    {
      id: "chaos-mode",
      title: { en: "Chaos Mode", de: "Chaos Mode" },
      intro: {
        en: "Independent of the Chance modifier. After every meeting, the roles of all living players are re-rolled.",
        de: "Unabhängig vom Chance-Modifier. Nach jedem Meeting werden die Rollen aller lebenden Spieler neu ausgelost."
      },
      entries: [
        {
          id: "chaos-options",
          title: { en: "Options", de: "Optionen" },
          summary: {
            en: "Toggle the reroll, choose the role pool, and choose who is affected.",
            de: "Reroll aktivieren, Rollen-Pool wählen und festlegen, wer betroffen ist."
          },
          body: {
            en: tbl(["Option", "Values", "What it does"], [
              ["Chaos Mode", "Off / On", "Re-rolls roles after every meeting."],
              ["Chaos: Role Pool", "All enabled roles / Only roles already in play", "“All”: new roles can appear. “In play”: only existing roles are re-distributed (multi-shifter)."],
              ["Chaos: Affected Players", "All players / Only Chance players", "Reroll everyone, or only carriers of the Chance modifier."]
            ]),
            de: tbl(["Option", "Werte", "Funktion"], [
              ["Chaos Mode", "Off / On", "Lost die Rollen nach jedem Meeting neu aus."],
              ["Chaos: Role Pool", "All enabled roles / Only roles already in play", "„All“: Neue Rollen können auftauchen. „In play“: Nur bestehende Rollen werden neu verteilt (Multi-Shifter)."],
              ["Chaos: Affected Players", "All players / Only Chance players", "Reroll für alle oder nur für Träger des Chance-Modifiers."]
            ])
          }
        },
        {
          id: "chaos-exclusions",
          title: { en: "Exclusions (always protected)", de: "Ausschlüsse (immer geschützt)" },
          summary: {
            en: "Some roles are never re-rolled to avoid breaking their mechanics.",
            de: "Einige Rollen werden nie neu ausgelost, um ihre Mechaniken nicht zu zerstören."
          },
          body: {
            en: "<p>These roles / players are never pulled into the reroll:</p><ul><li>Godfather, Mafioso, Janitor (the Mafia trio)</li><li>Deputy (while a Sheriff is alive and the Deputy could still promote)</li><li>Guesser (Nice / Evil)</li><li>Spy, Snitch</li></ul><p>This keeps Mafia from silently breaking, the Sheriff↔Deputy pair intact as a unit, and avoids reroll races.</p>",
            de: "<p>Diese Rollen / Spieler werden nie in den Reroll gezogen:</p><ul><li>Godfather, Mafioso, Janitor (das Mafia-Trio)</li><li>Deputy (solange ein Sheriff lebt und der Deputy noch promoten könnte)</li><li>Guesser (Nice / Evil)</li><li>Spy, Snitch</li></ul><p>So bricht die Mafia nicht still, das Sheriff↔Deputy-Paar bleibt als Einheit intakt, und Reroll-Races werden vermieden.</p>"
          }
        },
        {
          id: "chaos-endscreen",
          title: { en: "End-screen role history", de: "End-Screen-Rollenverlauf" },
          summary: {
            en: "The summary shows each player's full role path, e.g. Sheriff → Medic → Mayor.",
            de: "Die Zusammenfassung zeigt den vollen Rollenverlauf, z. B. Sheriff → Medic → Mayor."
          },
          body: {
            en: "<p>At game end, the role summary shows the complete role path: <code>Sheriff → Medic → Mayor</code>. Overly long paths are trimmed from the left to fit the screen width (<code>… → Mayor</code>).</p>",
            de: "<p>Am Spielende zeigt der Rollen-Summary den vollständigen Verlauf: <code>Sheriff → Medic → Mayor</code>. Zu lange Verläufe werden linksseitig auf die Bildschirmbreite gekürzt (<code>… → Mayor</code>).</p>"
          }
        }
      ]
    },
    {
      id: "security",
      title: { en: "Security & internals", de: "Sicherheit & Interna" },
      entries: [
        {
          id: "rpc-validation",
          title: { en: "Host-authoritative RPC validation", de: "Host-autoritative RPC-Validierung" },
          badges: [{ en: "Host-authoritative", de: "Host-autoritativ" }],
          summary: {
            en: "Gameplay RPCs are accepted only from the host; a modified client can't set stats or roles for others.",
            de: "Gameplay-RPCs werden nur vom Host akzeptiert; ein modifizierter Client kann keine Stats oder Rollen für andere setzen."
          },
          body: {
            en: "<p>The RPCs that re-roll stats, reassign roles, and activate the modifier — <strong>SetValues (200)</strong>, <strong>ChaosReassign (201)</strong> and <strong>Activation (250)</strong> — are accepted only when the sender is the lobby host (<code>OwnerId == HostId</code>). Non-host senders are logged and the RPC is consumed. The version handshake (RPC 251) stays open to all clients by design.</p>",
            de: "<p>Die RPCs, die Stats neu auslosen, Rollen neu zuweisen und den Modifier aktivieren — <strong>SetValues (200)</strong>, <strong>ChaosReassign (201)</strong> und <strong>Activation (250)</strong> — werden nur akzeptiert, wenn der Sender der Lobby-Host ist (<code>OwnerId == HostId</code>). Nicht-Host-Sender werden geloggt und der RPC verworfen. Der Version-Handshake (RPC 251) bleibt bewusst für alle Clients offen.</p>"
          }
        }
      ]
    }
  ]
};

/* ============================================================================
 * USEFUL TOR STUFF
 * ==========================================================================*/
const USEFUL = {
  key: "useful",
  name: "Forgotten Fixes",
  fullName: { en: "TOR - Forgotten Fixes", de: "TOR - Forgotten Fixes" },
  version: "1.2.0",
  allClients: true,
  repo: "https://github.com/DaUnknown-0/Useful-TOR-stuff",
  download: "https://github.com/DaUnknown-0/Useful-TOR-stuff/releases/latest",
  tagline: {
    en: "A bundle of quality-of-life fixes and new role options for TOR 4.8.0, plus a cross-mod Mod Manager.",
    de: "Ein Bündel aus Komfort-Fixes und neuen Rollen-Optionen für TOR 4.8.0, plus ein Mod-übergreifender Mod Manager."
  },
  intro: {
    en: "TOR - Forgotten Fixes (formerly Useful TOR Stuff) adds new options to TOR 4.8.0 and fixes bugs without touching TOR's source. It resolves TOR types via reflection, so every patch degrades to a no-op (with a log warning) rather than crashing if TOR's internals change. Most win-checks and meeting overrides are host-authoritative — they apply regardless of who has the mod.",
    de: "TOR - Forgotten Fixes (früher Useful TOR Stuff) fügt TOR 4.8.0 neue Optionen hinzu und behebt Bugs ohne Änderung an TORs Quellcode. Es löst TOR-Typen per Reflection auf, sodass jeder Patch zu einem No-Op (mit Log-Warnung) degradiert, statt abzustürzen, wenn sich TORs Interna ändern. Die meisten Win-Checks und Meeting-Overrides sind host-autoritativ — sie wirken unabhängig davon, wer den Mod hat."
  },
  install: {
    en: "<ol><li>Install <a href='https://github.com/TheOtherRolesAU/TheOtherRoles'>The Other Roles</a> into your Among Us BepInEx setup.</li><li>Download the latest <code>UsefulTORStuff.dll</code> from the releases page.</li><li>Copy it into <code>&lt;Among Us&gt;/BepInEx/plugins/</code>.</li><li>Start the game.</li></ol><p>An in-game auto-updater checks GitHub on the main menu and offers an update button.</p>",
    de: "<ol><li>Installiere <a href='https://github.com/TheOtherRolesAU/TheOtherRoles'>The Other Roles</a> in dein Among-Us-BepInEx-Setup.</li><li>Lade die neueste <code>UsefulTORStuff.dll</code> von der Releases-Seite.</li><li>Kopiere sie nach <code>&lt;Among Us&gt;/BepInEx/plugins/</code>.</li><li>Starte das Spiel.</li></ol><p>Ein In-Game-Auto-Updater prüft GitHub im Hauptmenü und bietet einen Update-Button an.</p>"
  },
  deps: {
    en: "<ul><li><strong>The Other Roles 4.8.0</strong> (hard dependency)</li><li><strong>BepInEx IL2CPP</strong> 6.0.0-be.697</li><li><strong>HostFix</strong> (optional, for Snitch coordination)</li></ul>",
    de: "<ul><li><strong>The Other Roles 4.8.0</strong> (harte Abhängigkeit)</li><li><strong>BepInEx IL2CPP</strong> 6.0.0-be.697</li><li><strong>HostFix</strong> (optional, für Snitch-Koordination)</li></ul>"
  },
  sections: [
    {
      id: "bugfixes",
      title: { en: "Bugfixes (automatic — no option needed)", de: "Bugfixes (automatisch — keine Option nötig)" },
      intro: {
        en: "These apply on their own as soon as the mod is loaded.",
        de: "Diese greifen von selbst, sobald der Mod geladen ist."
      },
      entries: [
        {
          id: "bloody-throttle",
          title: { en: "Bloody lag throttle", de: "Bloody Lag-Drosselung" },
          summary: {
            en: "Cuts the object count (and lag) on long Bloody trails by spacing out blood drops.",
            de: "Senkt die Objektzahl (und den Lag) langer Bloody-Spuren, indem Blutstropfen weiter auseinander liegen."
          },
          body: {
            en: "<p><strong>Problem:</strong> TOR spawns a new <code>Bloodytrail</code> GameObject on every FixedUpdate (~50/s) — up to ~500 at once per bloody player.</p><p><strong>Fix:</strong> a new drop only spawns once the player has moved at least <code>MinDropDistance</code> (default 0.35 units) since the last drop. Configurable in the BepInEx config under <code>[Bloody] MinDropDistance</code> (<code>0</code> disables throttling). The per-player last-drop map is cleared each round.</p>",
            de: "<p><strong>Problem:</strong> TOR spawnt bei jedem FixedUpdate (~50/s) ein neues <code>Bloodytrail</code>-GameObject — bis zu ~500 gleichzeitig pro blutigem Spieler.</p><p><strong>Fix:</strong> Ein neuer Tropfen erscheint erst, wenn der Spieler seit dem letzten Tropfen mindestens <code>MinDropDistance</code> (Standard 0,35 Einheiten) zurückgelegt hat. Einstellbar in der BepInEx-Config unter <code>[Bloody] MinDropDistance</code> (<code>0</code> deaktiviert die Drosselung). Die Per-Spieler-Map des letzten Tropfens wird jede Runde geleert.</p>"
          }
        },
        {
          id: "bloody-killer-map",
          title: { en: "Bloody killer-map fix", de: "Bloody Killer-Map-Fix" },
          summary: {
            en: "A Bloody trail now tracks the latest victim instead of pinning to the first one.",
            de: "Eine Bloody-Spur folgt jetzt dem neuesten Opfer statt am ersten zu kleben."
          },
          body: {
            en: "<p><strong>Problem:</strong> <code>Bloody.bloodyKillerMap[killer]</code> stayed permanently pinned to the first victim — trails after the second kill had the wrong color.</p><p><strong>Fix:</strong> <code>RPCProcedure.bloody</code> is overridden so the map entry is set via indexer (overwrite) instead of <code>Add</code>.</p>",
            de: "<p><strong>Problem:</strong> <code>Bloody.bloodyKillerMap[killer]</code> blieb dauerhaft beim ersten Opfer — Blutspuren nach dem zweiten Kill hatten die falsche Farbe.</p><p><strong>Fix:</strong> <code>RPCProcedure.bloody</code> wird überschrieben, sodass der Map-Eintrag per Indexer (Überschreiben) statt per <code>Add</code> gesetzt wird.</p>"
          }
        },
        {
          id: "snitch-logic",
          title: { en: "Snitch reveal reimplementation", de: "Snitch-Reveal-Reimplementierung" },
          badges: [{ en: "All players need the mod", de: "Alle brauchen den Mod" }],
          summary: {
            en: "A client-side Snitch reveal that survives the host's room-map reset.",
            de: "Ein client-seitiger Snitch-Reveal, der den Room-Map-Reset des Hosts übersteht."
          },
          body: {
            en: "<p><strong>Problem:</strong> TOR's Snitch reveal reads <code>playerRoomMap</code>, which gets wiped on the host by a reset.</p><p><strong>Fix:</strong> a persistent own <code>roomMap</code> records every <code>ShareRoom</code> RPC. The Snitch chat, map, and HUD are reimplemented over this own map. It only takes effect when all players have Forgotten Fixes (<code>SnitchClientFixActive</code>); otherwise TOR's original behavior (plus TOR - Hostfix Fix 4) applies.</p>",
            de: "<p><strong>Problem:</strong> TORs Snitch-Reveal liest <code>playerRoomMap</code>, die beim Host durch einen Reset verloren geht.</p><p><strong>Fix:</strong> Eine persistente eigene <code>roomMap</code> zeichnet jeden <code>ShareRoom</code>-RPC auf. Snitch-Chat, -Karte und -HUD werden über diese eigene Map reimplementiert. Wirkt nur, wenn alle Spieler Forgotten Fixes haben (<code>SnitchClientFixActive</code>); sonst greift TORs Original (plus TOR - Hostfix Fix 4).</p>"
          }
        }
      ]
    },
    {
      id: "crewmate",
      title: { en: "New options — Crewmate", de: "Neue Optionen — Crewmate" },
      entries: [
        {
          id: "sheriff-parity",
          title: { en: "Sheriff prevents killer parity win", de: "Sheriff verhindert Killer-Parity-Win" },
          badges: [{ en: "Crewmate → Sheriff", de: "Crewmate → Sheriff" }, { en: "Host-authoritative", de: "Host-autoritativ" }],
          summary: {
            en: "Stops impostors/Jackal from winning on parity while a Sheriff is alive.",
            de: "Verhindert, dass Impostoren/Jackal bei Gleichstand gewinnen, solange ein Sheriff lebt."
          },
          body: {
            en: tbl(["Option", "Values", "What it does"], [
              ["Sheriff Prevents Killer Parity Win", "Off / On", "Suppresses the impostor/Jackal parity win while the Sheriff is alive."],
              ["Parity Win Block Mode", "At Exact Parity Only / Always While Sheriff Alive", "“Exact”: only suppress at a tie. “Always”: suppress for as long as the Sheriff lives."]
            ]) + "<p class='note'>Host-authoritative — applies to everyone when on; the host is warned in the lobby if not everyone has the mod.</p>",
            de: tbl(["Option", "Werte", "Funktion"], [
              ["Sheriff Prevents Killer Parity Win", "Off / On", "Unterdrückt den Impostor/Jackal-Parity-Win, solange der Sheriff lebt."],
              ["Parity Win Block Mode", "At Exact Parity Only / Always While Sheriff Alive", "„Exact“: nur bei Gleichstand unterdrücken. „Always“: immer, solange der Sheriff lebt."]
            ]) + "<p class='note'>Host-autoritativ — wirkt für alle, wenn aktiv; der Host wird in der Lobby gewarnt, falls nicht alle den Mod haben.</p>"
          }
        },
        {
          id: "swapper-fix",
          title: { en: "Swapper can fix Lights / Comms", de: "Swapper kann Licht / Komms reparieren" },
          badges: [{ en: "Crewmate → Swapper", de: "Crewmate → Swapper" }],
          summary: {
            en: "Lets the Swapper use the Lights and/or Comms panels, which TOR normally blocks.",
            de: "Erlaubt dem Swapper, das Licht- und/oder Komms-Panel zu nutzen, was TOR normalerweise sperrt."
          },
          body: {
            en: tbl(["Option", "Values", "What it does"], [
              ["Swapper Can Fix Lights", "Off / On", "Allows the Swapper to use the lights panel."],
              ["Swapper Can Fix Comms", "Off / On", "Allows the Swapper to use the comms panel."]
            ]) + "<p class='note'>TOR explicitly blocks both; these options lift that locally.</p>",
            de: tbl(["Option", "Werte", "Funktion"], [
              ["Swapper Can Fix Lights", "Off / On", "Erlaubt dem Swapper, das Licht-Panel zu benutzen."],
              ["Swapper Can Fix Comms", "Off / On", "Erlaubt dem Swapper, das Komms-Panel zu benutzen."]
            ]) + "<p class='note'>TOR sperrt beides explizit; diese Optionen heben das lokal auf.</p>"
          }
        },
        {
          id: "medic-reshield",
          title: { en: "Medic can reshield", de: "Medic kann neu schilden" },
          badges: [{ en: "Crewmate → Medic", de: "Crewmate → Medic" }],
          summary: {
            en: "Once-per-meeting unshield button to remove and re-assign the shield, plus a limited pool of shield charges.",
            de: "Unshield-Button (einmal pro Meeting) zum Abnehmen und Neuvergeben des Schilds, plus ein begrenzter Vorrat an Schild-Ladungen."
          },
          body: {
            en: tbl(["Option", "Values", "What it does"], [
              ["Medic Can Reshield", "Off / On", "Medic gets an Unshield button (G) once per meeting to remove the shield and re-assign it."],
              ["Shield Charges", "∞ / 1–10", "Total shield placements per game, shown as <code>X/Y</code>. A charge is spent only on placement (∞ = unlimited)."]
            ]) + "<p class='note'>The shield-reset RPC (ID 249) is sent to all clients, so kill suppression stays consistent everywhere.</p>",
            de: tbl(["Option", "Werte", "Funktion"], [
              ["Medic Can Reshield", "Off / On", "Medic erhält einmal pro Meeting einen Unshield-Button (G), um das Schild abzunehmen und neu zu vergeben."],
              ["Shield Charges", "∞ / 1–10", "Schild-Platzierungen pro Spiel insgesamt, angezeigt als <code>X/Y</code>. Eine Ladung wird nur beim Platzieren verbraucht (∞ = unbegrenzt)."]
            ]) + "<p class='note'>Das Schild-Reset-RPC (ID 249) wird an alle Clients gesendet, sodass die Kill-Unterdrückung überall konsistent bleibt.</p>"
          }
        },
        {
          id: "timemaster",
          title: { en: "Time Master unguessable after shield saved a kill", de: "Time Master unratbar, nachdem das Schild einen Kill verhinderte" },
          badges: [{ en: "Crewmate → Time Master", de: "Crewmate → Time Master" }],
          summary: {
            en: "Once the Time Master's shield blocks a kill, he can no longer be guessed.",
            de: "Sobald das Schild des Time Master einen Kill verhindert, kann er nicht mehr erraten werden."
          },
          body: {
            en: tbl(["Option", "Values", "What it does"], [
              ["Time Master Unguessable After Shield Saved A Kill", "Off / On", "Time Master can't be guessed in Guesser mode once his shield has prevented a kill."]
            ]) + "<p class='note'>He disappears from the guess list and a correct guess is blocked (no death, no shot consumed).</p>",
            de: tbl(["Option", "Werte", "Funktion"], [
              ["Time Master Unguessable After Shield Saved A Kill", "Off / On", "Time Master ist im Guesser-Modus nicht ratbar, sobald sein Schild einen Kill verhindert hat."]
            ]) + "<p class='note'>Er verschwindet aus der Guess-Liste, und ein korrekter Guess wird blockiert (kein Tod, kein Schuss-Verbrauch).</p>"
          }
        },
        {
          id: "trapper-limp",
          title: { en: "Trapped players limp / Trapper self-limp", de: "Gefangene Spieler hinken / Trapper-Selbst-Hinken" },
          badges: [{ en: "Crewmate → Trapper", de: "Crewmate → Trapper" }],
          summary: {
            en: "Players who step in a trap keep limping after the freeze; the Trapper can also slow himself.",
            de: "Spieler, die in eine Falle treten, hinken nach dem Freeze weiter; der Trapper kann sich auch selbst verlangsamen."
          },
          body: {
            en: tbl(["Option", "Values", "What it does"], [
              ["Trapped Players Limp", "Off / On", "Players who stepped in a trap limp for <code>Limp Duration</code> seconds after the freeze."],
              ["Trapper Can Self-Limp", "Off / On", "Trapper gets a toggle button (H) to slow himself down."],
              ["Limp Speed Multiplier", "0.25–0.9×", "Speed while limping."],
              ["Limp Duration After Freeze", "1–20 s", "How long the limp lasts after the freeze ends."]
            ]),
            de: tbl(["Option", "Werte", "Funktion"], [
              ["Trapped Players Limp", "Off / On", "Spieler, die in eine Falle getreten sind, hinken nach dem Freeze noch <code>Limp Duration</code> Sekunden."],
              ["Trapper Can Self-Limp", "Off / On", "Trapper erhält einen Toggle-Button (H), um sich selbst zu verlangsamen."],
              ["Limp Speed Multiplier", "0,25–0,9×", "Geschwindigkeit während des Hinkens."],
              ["Limp Duration After Freeze", "1–20 s", "Wie lange das Hinken nach dem Freeze anhält."]
            ])
          }
        },
        {
          id: "spy-vent",
          title: { en: "Spy can fully vent", de: "Spy kann voll venten" },
          badges: [{ en: "Crewmate → Spy", de: "Crewmate → Spy" }],
          summary: {
            en: "Lets the Spy travel through vents like an Engineer, not just enter/exit.",
            de: "Erlaubt dem Spy, wie ein Ingenieur durch Vents zu reisen, nicht nur betreten/verlassen."
          },
          body: {
            en: tbl(["Option", "Values", "What it does"], [
              ["Spy Can Fully Vent", "Off / On", "Spy can not only enter/exit vents but travel inside them like an Engineer."]
            ]) + "<p class='note'>TOR only allows enter/exit; this option unlocks the directional arrows.</p>",
            de: tbl(["Option", "Werte", "Funktion"], [
              ["Spy Can Fully Vent", "Off / On", "Spy kann Vents nicht nur betreten/verlassen, sondern wie ein Ingenieur darin reisen."]
            ]) + "<p class='note'>TOR erlaubt nur Betreten/Verlassen; diese Option schaltet die Richtungspfeile frei.</p>"
          }
        },
        {
          id: "spy-evil-flash",
          title: { en: "Spy evil flash on death", de: "Spy Evil-Flash beim Tod" },
          badges: [{ en: "Crewmate → Spy", de: "Crewmate → Spy" }],
          summary: {
            en: "When a Spy who also has the VIP modifier dies, everyone sees a red impostor-coloured flash — except, optionally, the Seer.",
            de: "Stirbt ein Spy, der auch den VIP-Modifier hat, sehen alle einen roten Impostor-Flash — außer optional dem Seher."
          },
          body: {
            en: tbl(["Option", "Values", "What it does"], [
              ["Evil Flash on Death", "Off / On", "When a Spy who also has the VIP modifier is killed, all living players see a red (impostor-coloured) flash."],
              ["Seer Sees True Flash", "Off / On", "The Seer instead sees the true crewmate-white flash, revealing the Spy's real alignment."]
            ]) + "<p class='note'>Only applies when the Spy also has VIP. \"Seer Sees True Flash\" only differs while VIP colours are on; otherwise the Seer sees the same red flash as everyone.</p>",
            de: tbl(["Option", "Werte", "Funktion"], [
              ["Evil Flash on Death", "Off / On", "Wird ein Spy mit VIP-Modifier getötet, sehen alle lebenden Spieler einen roten (Impostor-farbigen) Flash."],
              ["Seer Sees True Flash", "Off / On", "Der Seher sieht stattdessen den echten crewmate-weißen Flash und erkennt so die wahre Gesinnung des Spy."]
            ]) + "<p class='note'>Greift nur, wenn der Spy auch VIP ist. „Seer Sees True Flash\" unterscheidet sich nur bei aktiven VIP-Farben; sonst sieht der Seher denselben roten Flash wie alle.</p>"
          }
        },
        {
          id: "spy-shifter",
          title: { en: "Shifter interaction with the Spy", de: "Shifter-Interaktion mit dem Spy" },
          badges: [{ en: "Crewmate → Spy", de: "Crewmate → Spy" }],
          summary: {
            en: "Controls what happens when the Shifter targets the Spy.",
            de: "Steuert, was passiert, wenn der Shifter den Spy als Ziel wählt."
          },
          body: {
            en: tbl(["Option", "Values", "What it does"], [
              ["Shifter Interaction", "Shift Succeeds / Shifter Dies / Shift Cancelled", "<em>Shift Succeeds</em>: vanilla. <em>Shifter Dies</em>: the Shifter is exiled and the shift is cancelled. <em>Shift Cancelled</em>: the shift silently fails, nobody dies."],
              ["Shifter Gets Shift Back", "Off / On", "In <em>Shift Cancelled</em> mode: keep the player as the Shifter and return the shift button instead of consuming the shift."]
            ]),
            de: tbl(["Option", "Werte", "Funktion"], [
              ["Shifter Interaction", "Shift Succeeds / Shifter Dies / Shift Cancelled", "<em>Shift Succeeds</em>: Vanilla. <em>Shifter Dies</em>: Der Shifter wird exiliert, der Shift abgebrochen. <em>Shift Cancelled</em>: Der Shift schlägt still fehl, niemand stirbt."],
              ["Shifter Gets Shift Back", "Off / On", "Im Modus <em>Shift Cancelled</em>: Spieler bleibt Shifter und bekommt den Shift-Button zurück, statt den Shift zu verbrauchen."]
            ])
          }
        }
      ]
    },
    {
      id: "neutral",
      title: { en: "New options — Neutral", de: "Neue Optionen — Neutral" },
      entries: [
        {
          id: "vulture-eat",
          title: { en: "Vulture counts guessed players as eaten", de: "Vulture zählt erratene Spieler als gefressen" },
          badges: [{ en: "Neutral → Vulture", de: "Neutral → Vulture" }, { en: "Host-authoritative", de: "Host-autoritativ" }],
          summary: {
            en: "A Vulture in Guesser mode gets +1 body when he correctly guesses a player.",
            de: "Ein Vulture im Guesser-Modus erhält +1 Körper, wenn er einen Spieler korrekt errät."
          },
          body: {
            en: tbl(["Option", "Values", "What it does"], [
              ["Vulture Counts Guessed Players As Eaten", "Off / On", "Vulture gets +1 body when he guesses a player in Guesser mode."],
              ["Play Eat Sound On Counted Guess", "Off / On", "Plays the eat sound on a counted guess (audible to everyone)."]
            ]) + "<p class='note'>Only the directly guessed player counts; a lover partner who dies alongside does not.</p>",
            de: tbl(["Option", "Werte", "Funktion"], [
              ["Vulture Counts Guessed Players As Eaten", "Off / On", "Vulture erhält +1 Körper, wenn er im Guesser-Modus einen Spieler errät."],
              ["Play Eat Sound On Counted Guess", "Off / On", "Spielt den Fress-Sound bei einem gewerteten Guess ab (hörbar für alle)."]
            ]) + "<p class='note'>Nur der direkt erratene Spieler zählt; ein mitsterbender Liebhaber-Partner nicht.</p>"
          }
        },
        {
          id: "sidekick-kill",
          title: { en: "Sidekick can kill Jackal", de: "Sidekick kann Jackal töten" },
          badges: [{ en: "Neutral → Jackal → Sidekick", de: "Neutral → Jackal → Sidekick" }],
          summary: {
            en: "Lets the Sidekick target the Jackal for a kill (betrayal).",
            de: "Erlaubt dem Sidekick, den Jackal als Kill-Ziel zu wählen (Verrat)."
          },
          body: {
            en: tbl(["Option", "Values", "What it does"], [
              ["Sidekick Can Kill Jackal", "Off / On", "Sidekick can select the Jackal as a kill target."]
            ]) + "<p class='note'>Whether the Sidekick is then promoted to Jackal is governed by TOR's own option.</p>",
            de: tbl(["Option", "Werte", "Funktion"], [
              ["Sidekick Can Kill Jackal", "Off / On", "Sidekick kann den Jackal als Kill-Ziel auswählen."]
            ]) + "<p class='note'>Ob der Sidekick danach zum Jackal befördert wird, steuert TORs eigene Option.</p>"
          }
        },
        {
          id: "lawyer-lover-tracking",
          title: { en: "Lawyer / Lover position tracking", de: "Anwalt- / Liebhaber-Positionsanzeige" },
          badges: [{ en: "Neutral → Lawyer · Modifier → Lover", de: "Neutral → Lawyer · Modifier → Lover" }],
          summary: {
            en: "Lets the Lawyer see their target, and a Lover see their partner, on the map.",
            de: "Lässt den Anwalt sein Ziel und einen Liebhaber seinen Partner auf der Karte sehen."
          },
          body: {
            en: tbl(["Option", "Values", "What it does"], [
              ["Lawyer Knows Target Position", "Off / On", "Lawyer sees their target on the map."],
              ["…Last Position Visible In Meeting", "Off / On", "Marker stays at the last known position during meetings."],
              ["Lover Knows Partner Position", "Off / On", "Lover sees their partner on the map."],
              ["…Last Position Visible In Meeting", "Off / On", "Marker stays at the last known position during meetings."]
            ]),
            de: tbl(["Option", "Werte", "Funktion"], [
              ["Lawyer Knows Target Position", "Off / On", "Anwalt sieht sein Ziel auf der Karte."],
              ["…Last Position Visible In Meeting", "Off / On", "Marker bleibt im Meeting auf der letzten bekannten Position."],
              ["Lover Knows Partner Position", "Off / On", "Liebhaber sieht seinen Partner auf der Karte."],
              ["…Last Position Visible In Meeting", "Off / On", "Marker bleibt im Meeting auf der letzten bekannten Position."]
            ])
          }
        }
      ]
    },
    {
      id: "impostor",
      title: { en: "New options — Impostor", de: "Neue Optionen — Impostor" },
      entries: [
        {
          id: "bomber-cancel",
          title: { en: "Bomber can cancel bomb", de: "Bomber kann Bombe abbrechen" },
          badges: [{ en: "Impostor → Bomber", de: "Impostor → Bomber" }],
          summary: {
            en: "Gives the Bomber a cancel button to remove a placed bomb at any time.",
            de: "Gibt dem Bomber einen Abbrechen-Button, um eine gelegte Bombe jederzeit zu entfernen."
          },
          body: {
            en: tbl(["Option", "Values", "What it does"], [
              ["Bomber Can Cancel Bomb", "Off / On", "Bomber gets a cancel button (G) that removes the bomb at any time."]
            ]) + "<p class='note'>Broadcast via RPC 252 to all clients.</p>",
            de: tbl(["Option", "Werte", "Funktion"], [
              ["Bomber Can Cancel Bomb", "Off / On", "Bomber erhält einen Abbrechen-Button (G), der die Bombe jederzeit entfernt."]
            ]) + "<p class='note'>Broadcast via RPC 252 an alle Clients.</p>"
          }
        },
        {
          id: "trickster-mixup",
          title: { en: "Trickster avatar mixup sabotage", de: "Trickster Avatar-Verwechslungs-Sabotage" },
          badges: [{ en: "Impostor → Trickster", de: "Impostor → Trickster" }],
          summary: {
            en: "A new button swaps every living player's skin for a configured duration.",
            de: "Ein neuer Button tauscht die Skins aller lebenden Spieler für eine konfigurierte Zeit."
          },
          body: {
            en: tbl(["Option", "Values", "What it does"], [
              ["Trickster Avatar Mixup Sabotage", "Off / On", "New button (C): all living players swap skins for a configured time."],
              ["Avatar Mixup Sabotage Cooldown", "10–60 s", "Cooldown of the button."],
              ["Avatar Mixup Sabotage Duration", "3–30 s", "How long the mixup lasts."]
            ]) + "<p class='note'>Shares its cooldown with Lights-Out. Works on all maps (no Fungle dependency).</p>",
            de: tbl(["Option", "Werte", "Funktion"], [
              ["Trickster Avatar Mixup Sabotage", "Off / On", "Neuer Button (C): Alle lebenden Spieler tauschen ihre Skins für eine konfigurierte Zeit."],
              ["Avatar Mixup Sabotage Cooldown", "10–60 s", "Cooldown des Buttons."],
              ["Avatar Mixup Sabotage Duration", "3–30 s", "Wie lange die Verwechslung dauert."]
            ]) + "<p class='note'>Teilt sich den Cooldown mit Lights-Out. Funktioniert auf allen Maps (keine Fungle-Abhängigkeit).</p>"
          }
        }
      ]
    },
    {
      id: "settings",
      title: { en: "New options — TOR Settings & Modifier", de: "Neue Optionen — TOR Settings & Modifier" },
      entries: [
        {
          id: "meeting-duration",
          title: { en: "Override meeting duration", de: "Meeting-Dauer überschreiben" },
          badges: [{ en: "TOR Settings", de: "TOR Settings" }, { en: "Host-authoritative", de: "Host-autoritativ" }],
          summary: {
            en: "Dynamically scales discussion and voting time from the alive/dead counts at meeting start.",
            de: "Skaliert Diskussions- und Abstimmungszeit dynamisch aus den Lebend/Tot-Zahlen bei Meeting-Start."
          },
          body: {
            en: tbl(["Option", "Range", "What it does"], [
              ["Override Meeting Duration", "Off / On", "Master toggle for dynamic discussion/voting time."],
              ["Discussion Base Time", "0–120 s", "Base time for discussion."],
              ["Discussion Per Alive Player", "0–30 s", "+X seconds per living player."],
              ["Discussion Reduction Per Dead Player", "0–30 s", "−X seconds per dead player."],
              ["Voting Base Time", "0–120 s", "Base time for voting."],
              ["Voting Per Alive Player", "0–30 s", "+X seconds per living player."],
              ["Voting Reduction Per Dead Player", "0–30 s", "−X seconds per dead player."]
            ]) + "<p class='note'>Host-authoritative (SyncOptions to all). Formula: <code>Base + (alive × PerAlive) − (dead × PerDead)</code>, min 0. The host's configured times are restored when the game ends.</p>",
            de: tbl(["Option", "Bereich", "Funktion"], [
              ["Override Meeting Duration", "Off / On", "Master-Toggle für dynamische Diskussions-/Abstimmungszeit."],
              ["Discussion Base Time", "0–120 s", "Basiszeit für die Diskussion."],
              ["Discussion Per Alive Player", "0–30 s", "+X Sekunden pro lebendem Spieler."],
              ["Discussion Reduction Per Dead Player", "0–30 s", "−X Sekunden pro totem Spieler."],
              ["Voting Base Time", "0–120 s", "Basiszeit für die Abstimmung."],
              ["Voting Per Alive Player", "0–30 s", "+X Sekunden pro lebendem Spieler."],
              ["Voting Reduction Per Dead Player", "0–30 s", "−X Sekunden pro totem Spieler."]
            ]) + "<p class='note'>Host-autoritativ (SyncOptions an alle). Formel: <code>Base + (alive × PerAlive) − (dead × PerDead)</code>, min. 0. Die konfigurierten Zeiten des Hosts werden am Spielende wiederhergestellt.</p>"
          }
        },
        {
          id: "sabotage-tuning",
          title: { en: "Sabotage Tuning", de: "Sabotage-Tuning" },
          badges: [{ en: "TOR Settings", de: "TOR Settings" }, { en: "All impostors need the mod", de: "Alle Impostoren brauchen den Mod" }, { en: "Host-authoritative (durations)", de: "Host-autoritativ (Dauern)" }],
          summary: {
            en: "Independent per-sabotage cooldowns (with per-use reduction) and custom durations for the deadly sabotages.",
            de: "Unabhängige Cooldowns pro Sabotage (mit Reduktion je Nutzung) und eigene Dauern für die tödlichen Sabotagen."
          },
          body: {
            en: "<p>Replaces Among Us's single shared sabotage cooldown with an <strong>independent timer per sabotage type</strong>. While no sabotage is active each timer ticks down on its own; when any sabotage ends, all timers reset to their maximum. The master toggle defaults off, so everything stays vanilla until you enable it.</p>"
              + tbl(["Option", "Range", "What it does"], [
                ["Sabotage Tuning", "Off / On", "Master toggle. While off, all of the below behaves like vanilla."],
                ["Minimum Cooldown (Reduction Floor)", "0–30 s", "Global lower bound the per-use reduction can never push a cooldown below."],
                ["Reactor/Meltdown · Oxygen · Communications · Lights · Airship Crash — Cooldown", "10–60 s", "Independent cooldown for each sabotage type."],
                ["… Cooldown Reduction per Use", "0–15 s", "Each use of a type lowers <em>that</em> type's cooldown by X seconds (floored at the minimum, reset every meeting)."]
              ])
              + "<p>Only the <strong>deadly</strong> sabotages additionally get a configurable duration — the others run until they are fixed:</p>"
              + tbl(["Option", "Range", "What it does"], [
                ["Reactor/Meltdown Duration", "10–90 s", "Reactor fix time (also the Polus laboratory)."],
                ["Oxygen Duration", "10–90 s", "Oxygen depletion time (Skeld)."],
                ["Airship Crash Duration", "10–120 s", "Crash-course countdown on the Airship."]
              ])
              + "<p class='note'>Map-aware: each option only applies where that sabotage exists (Reactor and the Polus laboratory are one type). The per-use reduction is counted globally for all impostors, not just whoever triggered it. Cooldowns are enforced client-side, so they require every impostor to run the mod; durations are host-authoritative and apply to all clients. Mutually exclusive with the Chance modifier's sabotage-cooldown override — while Sabotage Tuning is on, the Chance override stands down (Sabotage Tuning takes precedence).</p>",
            de: "<p>Ersetzt den einzelnen, geteilten Sabotage-Cooldown von Among Us durch einen <strong>unabhängigen Timer pro Sabotage-Typ</strong>. Solange keine Sabotage aktiv ist, zählt jeder Timer für sich herunter; endet eine Sabotage, werden alle Timer wieder auf ihr Maximum gesetzt. Der Master-Toggle ist standardmäßig aus, sodass alles vanilla bleibt, bis du ihn aktivierst.</p>"
              + tbl(["Option", "Bereich", "Funktion"], [
                ["Sabotage Tuning", "Off / On", "Master-Toggle. Solange aus, verhält sich alles Folgende wie Vanilla."],
                ["Minimum Cooldown (Reduction Floor)", "0–30 s", "Globale Untergrenze, unter die die Reduktion einen Cooldown nie drücken kann."],
                ["Reactor/Meltdown · Oxygen · Communications · Lights · Airship Crash — Cooldown", "10–60 s", "Unabhängiger Cooldown für jeden Sabotage-Typ."],
                ["… Cooldown Reduction per Use", "0–15 s", "Jede Nutzung eines Typs senkt <em>dessen</em> Cooldown um X Sekunden (begrenzt durch das Minimum, Reset in jedem Meeting)."]
              ])
              + "<p>Nur die <strong>tödlichen</strong> Sabotagen bekommen zusätzlich eine einstellbare Dauer — die übrigen laufen, bis sie repariert werden:</p>"
              + tbl(["Option", "Bereich", "Funktion"], [
                ["Reactor/Meltdown Duration", "10–90 s", "Reaktor-Fixzeit (auch das Polus-Labor)."],
                ["Oxygen Duration", "10–90 s", "Sauerstoff-Auslaufzeit (Skeld)."],
                ["Airship Crash Duration", "10–120 s", "Absturz-Countdown auf der Airship."]
              ])
              + "<p class='note'>Map-bewusst: Jede Option greift nur dort, wo es die Sabotage gibt (Reaktor und Polus-Labor sind ein Typ). Die Reduktion je Nutzung wird global für alle Impostoren gezählt, nicht nur für den Auslöser. Cooldowns wirken client-seitig und setzen daher voraus, dass jeder Impostor den Mod hat; Dauern sind host-autoritativ und gelten für alle Clients. Schließt sich mit dem Sabotage-Cooldown-Override des Chance-Modifiers gegenseitig aus — solange Sabotage Tuning an ist, tritt der Chance-Override zurück (Sabotage Tuning hat Vorrang).</p>"
          }
        },
        {
          id: "inverted-vision",
          title: { en: "Inverted vision", de: "Invertierte Sicht" },
          badges: [{ en: "Modifier → Invert", de: "Modifier → Invert" }],
          summary: {
            en: "Inverts the screen colors (a true negative) while the Invert modifier is active.",
            de: "Invertiert die Bildschirmfarben (echtes Negativ), solange der Invert-Modifier aktiv ist."
          },
          body: {
            en: tbl(["Option", "Values", "What it does"], [
              ["Inverted Vision", "Off / On", "Inverts screen colors (a true color negative) during the Invert modifier."]
            ]) + "<p class='note'>No external shader file needed — uses Unity's built-in <code>Hidden/Internal-Colored</code> shader.</p>",
            de: tbl(["Option", "Werte", "Funktion"], [
              ["Inverted Vision", "Off / On", "Invertiert die Bildschirmfarben (echtes Farb-Negativ) während des Invert-Modifiers."]
            ]) + "<p class='note'>Kein externes Shader-File nötig — nutzt Unitys eingebauten <code>Hidden/Internal-Colored</code>-Shader.</p>"
          }
        },
        {
          id: "drunk-rename",
          title: { en: "Rename Invert to \"Drunk\"", de: "Invert in „Drunk\" umbenennen" },
          badges: [{ en: "Modifier → Invert", de: "Modifier → Invert" }],
          summary: {
            en: "Renames the Invert modifier (and its intro / end-screen text) to \"Drunk\", live and without a restart.",
            de: "Benennt den Invert-Modifier (samt Intro-/End-Screen-Text) live und ohne Neustart in „Drunk\" um."
          },
          body: {
            en: tbl(["Option", "Values", "What it does"], [
              ["Rename to Drunk", "Off / On", "Renames the Invert modifier and its description to \"Drunk\"."]
            ]) + "<p class='note'>Pure cosmetic re-theme — only changes the modifier's name and text strings, not its behaviour. Toggling it in the lobby applies instantly.</p>",
            de: tbl(["Option", "Werte", "Funktion"], [
              ["Rename to Drunk", "Off / On", "Benennt den Invert-Modifier und seine Beschreibung in „Drunk\" um."]
            ]) + "<p class='note'>Rein kosmetisches Re-Theme — ändert nur Name und Texte des Modifiers, nicht sein Verhalten. Das Umschalten in der Lobby greift sofort.</p>"
          }
        },
        {
          id: "tiebreaker",
          title: { en: "Tiebreaker quantity", de: "Tiebreaker-Anzahl" },
          badges: [{ en: "Modifier → Tiebreaker", de: "Modifier → Tiebreaker" }],
          summary: {
            en: "Allows up to 3 Tiebreakers at once.",
            de: "Erlaubt bis zu 3 Tiebreaker gleichzeitig."
          },
          body: {
            en: tbl(["Option", "Values", "What it does"], [
              ["Tiebreaker Quantity (max 3)", "1 / 2 / 3", "Allows up to 3 Tiebreakers at once."]
            ]) + "<p class='note'>On a tie, the candidate with the most Tiebreaker votes wins. If those Tiebreakers are also tied, it stays a tie.</p>",
            de: tbl(["Option", "Werte", "Funktion"], [
              ["Tiebreaker Quantity (max 3)", "1 / 2 / 3", "Erlaubt bis zu 3 Tiebreaker gleichzeitig."]
            ]) + "<p class='note'>Bei einem Unentschieden gewinnt der Kandidat mit den meisten Tiebreaker-Stimmen. Sind auch diese Tiebreaker im Gleichstand, bleibt es ein Tie.</p>"
          }
        }
      ]
    },
    {
      id: "manager",
      title: { en: "Mod Manager & version handshake", de: "Mod Manager & Versions-Handshake" },
      entries: [
        {
          id: "mod-manager",
          title: { en: "Mod Manager", de: "Mod Manager" },
          badges: [{ en: "F2", de: "F2" }],
          summary: {
            en: "An in-game UI listing companion mods, versions, update status and per-mod toggles.",
            de: "Eine In-Game-UI mit Begleit-Mods, Versionen, Update-Status und Per-Mod-Toggles."
          },
          body: {
            en: "<p>An in-game UI listing the installed companion mods, their versions, update status, and per-mod enable/disable toggles. Asset-cached, so repeatedly opening it or toggling no longer leaks textures, sprites, or materials.</p><p>Since 1.1.0 it also has an <strong>Update All</strong> header button (sequential, with a summary line) and shows each updatable mod's <strong>release notes</strong> in its entry — both from the already-fetched GitHub JSON (no extra API calls), and both degrade gracefully for older installed updaters that lack the new hooks.</p>",
            de: "<p>Eine In-Game-UI, die die installierten Begleit-Mods, ihre Versionen, den Update-Status und Per-Mod-Enable/Disable-Toggles auflistet. Asset-gecacht, sodass wiederholtes Öffnen oder Umschalten keine Texturen, Sprites oder Materialien mehr leakt.</p><p>Seit 1.1.0 gibt es zudem einen <strong>Update-All</strong>-Header-Button (sequentiell, mit Zusammenfassungs-Zeile) und die Anzeige der <strong>Release Notes</strong> jedes aktualisierbaren Mods in seinem Eintrag — beides aus dem bereits geladenen GitHub-JSON (keine zusätzlichen API-Calls) und beides degradiert sauber für ältere installierte Updater ohne die neuen Hooks.</p>"
          }
        },
        {
          id: "mod-check",
          title: { en: "Combined lobby Mod-Check", de: "Kombinierter Lobby-Mod-Check" },
          badges: [{ en: "F1", de: "F1" }],
          summary: {
            en: "One combined per-player version overview when both mods are installed.",
            de: "Eine kombinierte Per-Spieler-Versionsübersicht, wenn beide Mods installiert sind."
          },
          body: {
            en: "<p>When the Chance mod is also installed, the lobby shows a single per-player version overview (green ok / red mismatch / gray missing) that Forgotten Fixes renders, instead of two separate warning lists. Each mod publishes its snapshot over the documented <code>TORMods.Handshake.*</code> AppDomain keys; Chance suppresses its own block while Forgotten Fixes is present. TOR - Hostfix is excluded by design (host-only). Host-side by default; the RPC wire format is unchanged.</p>",
            de: "<p>Wenn der Chance-Mod ebenfalls installiert ist, zeigt die Lobby eine einzige Per-Spieler-Versionsübersicht (grün ok / rot Abweichung / grau fehlt), die Forgotten Fixes rendert, statt zweier getrennter Warnlisten. Jeder Mod veröffentlicht seinen Snapshot über die dokumentierten <code>TORMods.Handshake.*</code>-AppDomain-Keys; Chance unterdrückt seinen eigenen Block, solange Forgotten Fixes präsent ist. TOR - Hostfix ist bewusst ausgeschlossen (host-only). Standardmäßig host-seitig; das RPC-Wire-Format ist unverändert.</p>"
          }
        },
        {
          id: "handshake",
          title: { en: "Mod version handshake (RPC 253)", de: "Mod-Versions-Handshake (RPC 253)" },
          summary: {
            en: "Each client broadcasts its version + GUID at lobby time so everyone knows if builds match.",
            de: "Jeder Client sendet bei Lobby-Eintritt Version + GUID, damit alle wissen, ob die Builds zusammenpassen."
          },
          body: {
            en: "<p>Each client broadcasts its version and assembly GUID at lobby time so every client can tell whether all players share the same build (the precondition for the client-side Snitch fix). The handshake cache is cleared on joining a lobby so it only reflects the current lobby. The wire format is unchanged across 1.0.x, so mixed lobbies keep working.</p>",
            de: "<p>Jeder Client sendet bei Lobby-Eintritt seine Version und Assembly-GUID, damit jeder Client erkennt, ob alle Spieler denselben Build haben (die Voraussetzung für den client-seitigen Snitch-Fix). Der Handshake-Cache wird beim Beitritt zu einer Lobby geleert, sodass er nur die aktuelle Lobby widerspiegelt. Das Wire-Format ist über 1.0.x hinweg unverändert, sodass gemischte Lobbys weiter funktionieren.</p>"
          }
        }
      ]
    }
  ]
};

/* ============================================================================
 * UNKNOWN'S COLLECTION
 * ==========================================================================*/
const UNKNOWNS = {
  key: "unknowns",
  name: "Unknown's Collection",
  fullName: { en: "Unknown's Collection — custom roles for TOR", de: "Unknown's Collection — eigene Rollen für TOR" },
  version: "1.0.1",
  allClients: true,
  repo: "https://github.com/DaUnknown-0/UnknownsCollection",
  download: "https://github.com/DaUnknown-0/UnknownsCollection/releases/latest",
  tagline: {
    en: "Brand-new custom roles for The Other Roles, layered on without touching TOR's source. Roles: The Tesla & The Saboteur.",
    de: "Brandneue eigene Rollen für The Other Roles, aufgesetzt ohne Änderung an TORs Quellcode. Rollen: The Tesla & The Saboteur."
  },
  intro: {
    en: "Unknown's Collection is a separate plugin that adds <strong>new roles</strong> to TOR 4.8.0 purely through Harmony patches — TOR's source is never modified, and the only hard dependency is The Other Roles. The roles are client-side, so the lobby can only be started when every player runs the same Unknown's Collection version. Current roles: <strong>The Tesla</strong> and <strong>The Saboteur</strong> (both Impostor), and both are pickable in TOR's Role Draft.",
    de: "Unknown's Collection ist ein eigenständiges Plugin, das TOR 4.8.0 <strong>neue Rollen</strong> rein über Harmony-Patches hinzufügt — TORs Quellcode wird nie verändert, einzige harte Abhängigkeit ist The Other Roles. Die Rollen sind client-seitig, daher kann die Lobby nur gestartet werden, wenn alle Spieler dieselbe Unknown's-Collection-Version haben. Aktuelle Rollen: <strong>The Tesla</strong> und <strong>The Saboteur</strong> (beide Impostor), beide auch im Role Draft von TOR wählbar."
  },
  install: {
    en: "<ol><li>Install <a href='https://github.com/TheOtherRolesAU/TheOtherRoles'>The Other Roles</a> into your Among Us BepInEx setup.</li><li>Download the latest <code>UnknownsCollection.dll</code> from the releases page.</li><li>Copy it into <code>&lt;Among Us&gt;/BepInEx/plugins/</code> (next to <code>TheOtherRoles.dll</code>).</li><li>Start the game. Every player who should see the role needs the mod — same version.</li></ol><p>A channel-aware in-game auto-updater checks GitHub and integrates with the Mod Manager (from Forgotten Fixes).</p>",
    de: "<ol><li>Installiere <a href='https://github.com/TheOtherRolesAU/TheOtherRoles'>The Other Roles</a> in dein Among-Us-BepInEx-Setup.</li><li>Lade die neueste <code>UnknownsCollection.dll</code> von der Releases-Seite.</li><li>Kopiere sie nach <code>&lt;Among Us&gt;/BepInEx/plugins/</code> (neben <code>TheOtherRoles.dll</code>).</li><li>Starte das Spiel. Jeder Spieler, der die Rolle sehen soll, braucht den Mod — gleiche Version.</li></ol><p>Ein kanal-bewusster In-Game-Auto-Updater prüft GitHub und integriert sich in den Mod Manager (aus Forgotten Fixes).</p>"
  },
  deps: {
    en: "<ul><li><strong>The Other Roles 4.8.0</strong> (hard dependency)</li><li><strong>BepInEx IL2CPP</strong></li><li><strong>Forgotten Fixes</strong> (optional — provides the Mod Manager the updater plugs into)</li></ul>",
    de: "<ul><li><strong>The Other Roles 4.8.0</strong> (harte Abhängigkeit)</li><li><strong>BepInEx IL2CPP</strong></li><li><strong>Forgotten Fixes</strong> (optional — stellt den Mod Manager bereit, in den sich der Updater einklinkt)</li></ul>"
  },
  sections: [
    {
      id: "tesla",
      title: { en: "The Tesla (Impostor)", de: "The Tesla (Impostor)" },
      intro: {
        en: "A normal Impostor is secretly promoted to The Tesla at game start. Instead of (or alongside) sneaking kills, the Tesla charges two players and lethally pulls them together.",
        de: "Ein normaler Impostor wird beim Spielstart heimlich zur Tesla befördert. Statt (oder zusätzlich zu) heimlichen Kills lädt die Tesla zwei Spieler und zieht sie tödlich zusammen."
      },
      entries: [
        {
          id: "tesla-charging",
          title: { en: "Charging the pair", de: "Das Paar laden" },
          summary: {
            en: "In a meeting, charge exactly two players: one +, one −. Never the same person twice, never more than two at once.",
            de: "Im Meeting genau zwei Spieler laden: einen +, einen −. Nie dieselbe Person zweimal, nie mehr als zwei gleichzeitig."
          },
          body: {
            en: "<p>During a <strong>meeting</strong>, the Tesla opens a Swapper-style selection and charges exactly two players: one <strong>positive (+)</strong> and one <strong>negative (−)</strong>. The two poles must be different players, and at most two players are charged at any time.</p>",
            de: "<p>Während eines <strong>Meetings</strong> öffnet die Tesla eine Swapper-artige Auswahl und lädt genau zwei Spieler: einen <strong>positiven (+)</strong> und einen <strong>negativen (−)</strong>. Die beiden Pole müssen verschiedene Spieler sein, und es sind nie mehr als zwei Spieler gleichzeitig geladen.</p>"
          }
        },
        {
          id: "tesla-countdown",
          title: { en: "Proximity countdown", de: "Nähe-Countdown" },
          summary: {
            en: "Too close → a hidden countdown drains. Apart pauses it (no refill). Resets only in meetings. At zero, both die.",
            de: "Zu nah → ein versteckter Countdown läuft runter. Abstand pausiert ihn (kein Auffüllen). Reset nur im Meeting. Bei null sterben beide."
          },
          body: {
            en: "<p>While the charged pair stays <strong>too close together</strong>, a hidden <strong>countdown</strong> drains. Moving apart <strong>pauses</strong> it — it does not refill — and it only resets to full <strong>in a meeting</strong>. If the countdown reaches <strong>zero</strong>, <strong>both charged players die</strong>.</p>",
            de: "<p>Solange das geladene Paar <strong>zu nah beieinander</strong> bleibt, läuft ein versteckter <strong>Countdown</strong> runter. Abstand <strong>pausiert</strong> ihn — er füllt sich nicht auf — und er setzt sich nur <strong>im Meeting</strong> wieder auf voll zurück. Erreicht der Countdown <strong>null</strong>, <strong>sterben beide geladenen Spieler</strong>.</p>"
          }
        },
        {
          id: "tesla-warning",
          title: { en: "What the victims see", de: "Was die Opfer sehen" },
          summary: {
            en: "A persistent ⚡ charged indicator; near the partner a pulsing red ⚡ danger warning + spark particles + sound — but no exact timer.",
            de: "Ein dauerhafter ⚡-Lade-Hinweis; nahe am Partner ein pulsierender roter ⚡-Gefahr-Warner + Funken-Partikel + Sound — aber keine genaue Restzeit."
          },
          body: {
            en: "<p>Charged players see a persistent <strong>⚡ charged</strong> indicator. When they get within trigger distance of their partner, it switches to a pulsing red <strong>⚡ danger</strong> warning with electric spark particles and a warning sound — but the exact remaining seconds are never shown.</p>",
            de: "<p>Geladene Spieler sehen einen dauerhaften <strong>⚡-geladen</strong>-Hinweis. Kommen sie in Auslöse-Reichweite ihres Partners, wechselt er zu einer pulsierend roten <strong>⚡-Gefahr</strong>-Warnung mit elektrischen Funken-Partikeln und einem Warn-Sound — die genaue Restzeit wird aber nie angezeigt.</p>"
          }
        },
        {
          id: "tesla-options",
          title: { en: "Options (Impostor tab)", de: "Optionen (Impostor-Tab)" },
          summary: {
            en: "Spawn rate, min players, trigger distance, countdown, min alive, self-charge.",
            de: "Spawnrate, Min-Spieler, Auslöse-Distanz, Countdown, Min-Lebende, Selbst-Laden."
          },
          body: {
            en: tbl(["Option", "Default", "What it does"], [
              ["Tesla", "Off", "Spawn chance for the role."],
              ["Tesla Minimum Players To Spawn", "6", "The role isn't assigned below this lobby size."],
              ["Tesla Charge Trigger Distance", "1.5", "How close (world units) the pair must be to drain the countdown."],
              ["Tesla Charge Countdown (sec)", "5", "Time the pair can stay close before they die."],
              ["Tesla Minimum Alive Players For Charges", "4", "Below this many alive players, charges become harmless."],
              ["Tesla Can Charge Itself", "Off", "Allow the Tesla to pick its own row as one pole."],
              ["Self-Charge Also Kills The Tesla", "On", "If self-charged and triggered, whether the Tesla dies too."]
            ]),
            de: tbl(["Option", "Standard", "Funktion"], [
              ["Tesla", "Off", "Spawn-Chance der Rolle."],
              ["Tesla Minimum Players To Spawn", "6", "Die Rolle wird unter dieser Lobby-Größe nicht vergeben."],
              ["Tesla Charge Trigger Distance", "1,5", "Wie nah (Welteinheiten) das Paar sein muss, damit der Countdown läuft."],
              ["Tesla Charge Countdown (sec)", "5", "Wie lange das Paar nah sein darf, bevor es stirbt."],
              ["Tesla Minimum Alive Players For Charges", "4", "Unter so vielen Lebenden werden Ladungen harmlos."],
              ["Tesla Can Charge Itself", "Off", "Erlaubt der Tesla, die eigene Zeile als einen Pol zu wählen."],
              ["Self-Charge Also Kills The Tesla", "On", "Ob die Tesla bei Selbst-Ladung und Auslösung mitstirbt."]
            ])
          }
        },
        {
          id: "tesla-gating",
          title: { en: "Client-side gating", de: "Client-seitiges Gating" },
          badges: [{ en: "All players need the mod", de: "Alle brauchen den Mod" }],
          summary: {
            en: "The lobby can only be started when all players run the same Unknown's Collection version.",
            de: "Die Lobby kann nur gestartet werden, wenn alle Spieler dieselbe Unknown's-Collection-Version haben."
          },
          body: {
            en: "<p>The Tesla is a client-side role (meeting UI, charge indicators, warnings). A version handshake gates it: the lobby start is <strong>blocked</strong> until every connected player runs the same Unknown's Collection version, and the host gets a lobby warning otherwise.</p>",
            de: "<p>Die Tesla ist eine client-seitige Rolle (Meeting-UI, Lade-Hinweise, Warnungen). Ein Versions-Handshake gated sie: Der Lobby-Start ist <strong>blockiert</strong>, bis jeder verbundene Spieler dieselbe Unknown's-Collection-Version hat; sonst bekommt der Host eine Lobby-Warnung.</p>"
          }
        }
      ]
    },
    {
      id: "saboteur",
      title: { en: "The Saboteur (Impostor)", de: "The Saboteur (Impostor)" },
      intro: {
        en: "A normal Impostor is secretly promoted to The Saboteur at game start. Once per round he spends a token to either sabotage a task console (lethal on completion) or lay an invisible stun trap — and the crew can fight back by searching consoles.",
        de: "Ein normaler Impostor wird beim Spielstart heimlich zum Saboteur befördert. Einmal pro Runde gibt er einen Token aus, um entweder eine Task-Konsole zu sabotieren (tödlich beim Abschließen) oder eine unsichtbare Stun-Falle zu legen — und die Crew kann mit dem Durchsuchen von Konsolen kontern."
      },
      entries: [
        {
          id: "saboteur-sabotage",
          title: { en: "Sabotage a task", de: "Eine Task sabotieren" },
          summary: {
            en: "Mark a console at its spot. The first non-Impostor who finishes it dies in an electric kill — max one such kill per round.",
            de: "Eine Konsole an Ort und Stelle markieren. Der erste Nicht-Impostor, der sie abschließt, stirbt durch einen Stromschlag — max. ein solcher Kill pro Runde."
          },
          body: {
            en: "<p>Standing at a task console, the Saboteur presses <strong>SABOTAGE</strong> to mark that exact console. The first <strong>non-Impostor</strong> who finishes it dies instantly with a generic <strong>electric kill effect</strong>. It counts as the Saboteur's kill (and can catch a Bait), is limited to <strong>one kill per round</strong>, only works above a minimum alive-player count, and raises the Saboteur's next kill cooldown.</p>",
            de: "<p>An einer Task-Konsole drückt der Saboteur <strong>SABOTAGE</strong>, um genau diese Konsole zu markieren. Der erste <strong>Nicht-Impostor</strong>, der sie abschließt, stirbt sofort mit einem generischen <strong>Stromschlag-Effekt</strong>. Es zählt als Kill des Saboteurs (und kann ein Bait treffen), ist auf <strong>einen Kill pro Runde</strong> begrenzt, greift nur über einer Mindest-Lebendenzahl und erhöht den nächsten Kill-Cooldown des Saboteurs.</p>"
          }
        },
        {
          id: "saboteur-traps",
          title: { en: "Invisible traps", de: "Unsichtbare Fallen" },
          summary: {
            en: "Lay a ground trap, invisible to everyone but the Saboteur. Walking into it stuns (and optionally limps) the victim. Not near the emergency button, reactor or O2.",
            de: "Eine Bodenfalle legen, unsichtbar für alle außer dem Saboteur. Reinlaufen stunnt (und hinkt optional) das Opfer. Nicht beim Notfallknopf, Reaktor oder O2."
          },
          body: {
            en: "<p>The <strong>TRAP</strong> button drops an invisible trap (Trapper-style) at the Saboteur's feet — visible only to him (and other Impostors if enabled). Any non-Impostor who walks into it is <strong>stunned</strong> for the configured time, optionally <strong>limping</strong> afterwards; the Saboteur is always immune. Traps cannot be placed in the same room as the emergency button, the reactor or the O2 system, and are cleared each meeting.</p>",
            de: "<p>Der <strong>TRAP</strong>-Button legt eine unsichtbare Falle (Trapper-Stil) zu Füßen des Saboteurs ab — nur für ihn sichtbar (und andere Impostor, falls aktiviert). Jeder Nicht-Impostor, der hineinläuft, wird für die eingestellte Zeit <strong>gestunnt</strong> und hinkt optional danach; der Saboteur ist immer immun. Fallen lassen sich nicht im selben Raum wie Notfallknopf, Reaktor oder O2-System legen und werden jedes Meeting gelöscht.</p>"
          }
        },
        {
          id: "saboteur-counterplay",
          title: { en: "Crew counterplay: search & defuse", de: "Crew-Konter: Suchen & Entschärfen" },
          summary: {
            en: "Any non-Impostor can SEARCH a console (Scan-Sweep) to reveal sabotage, then DEFUSE it (Wire-Cut). Being Drunk makes the search harder and unreliable.",
            de: "Jeder Nicht-Impostor kann eine Konsole DURCHSUCHEN (Scan-Sweep), um Sabotage aufzudecken, und sie dann ENTSCHÄRFEN (Wire-Cut). Drunk macht die Suche schwerer und unzuverlässig."
          },
          body: {
            en: "<p>A <strong>SEARCH</strong> button appears for every non-Impostor whenever the role could spawn (so it never leaks whether a Saboteur is actually present). It opens a <strong>Scan-Sweep</strong> minigame — hit the action inside the green window to reveal <em>SAFE</em> or <em>SABOTAGED</em>. A sabotaged console can then be <strong>DEFUSED</strong> via a <strong>Wire-Cut</strong> minigame (cut the wires in order). A searcher who is <strong>Drunk</strong> (the renamed Invert modifier) gets a narrower, faster, jittery scan whose result may lie. The action is Left-Click / E / Space / Enter.</p>",
            de: "<p>Ein <strong>SEARCH</strong>-Button erscheint für jeden Nicht-Impostor, sobald die Rolle spawnen könnte (so wird nie verraten, ob wirklich ein Saboteur dabei ist). Er öffnet ein <strong>Scan-Sweep</strong>-Minispiel — die Aktion im grünen Feld treffen, um <em>SAFE</em> oder <em>SABOTAGED</em> aufzudecken. Eine sabotierte Konsole lässt sich dann per <strong>Wire-Cut</strong>-Minispiel <strong>ENTSCHÄRFEN</strong> (Drähte der Reihe nach durchtrennen). Ein <strong>Drunk</strong>-Sucher (der zu „Drunk“ umbenannte Invert-Modifier) bekommt eine engere, schnellere, zitternde Suche, deren Ergebnis lügen kann. Aktion: Linksklick / E / Leertaste / Enter.</p>"
          }
        },
        {
          id: "saboteur-tokens",
          title: { en: "Tokens per round", de: "Tokens pro Runde" },
          summary: {
            en: "Tokens refill every meeting. By default 1 token, and sabotage or trap costs 1 — i.e. one action per round. Raise the budget to allow more.",
            de: "Tokens füllen sich jedes Meeting auf. Standard: 1 Token, Sabotage oder Falle kostet 1 — also eine Aktion pro Runde. Budget hochstellen für mehr."
          },
          body: {
            en: "<p>The Saboteur gets <strong>tokens</strong> that reset to the configured amount each meeting (and at game start). Sabotaging a task and placing a trap each cost a configurable number of tokens — so the default (1 token, cost 1 each) means <strong>one action per round</strong>, while a larger budget allows, for example, a sabotage plus a couple of traps.</p>",
            de: "<p>Der Saboteur erhält <strong>Tokens</strong>, die sich jedes Meeting (und zu Spielbeginn) auf den eingestellten Wert zurücksetzen. Eine Task zu sabotieren und eine Falle zu legen kosten je eine einstellbare Tokenzahl — der Standard (1 Token, je Kosten 1) bedeutet also <strong>eine Aktion pro Runde</strong>, während ein größeres Budget z. B. eine Sabotage plus ein paar Fallen erlaubt.</p>"
          }
        },
        {
          id: "saboteur-options",
          title: { en: "Options (Impostor tab)", de: "Optionen (Impostor-Tab)" },
          summary: {
            en: "Spawn rate, tokens & costs, kill gating, trap stun/limp, crew search & defuse.",
            de: "Spawnrate, Tokens & Kosten, Kill-Gating, Fallen-Stun/Hinken, Crew-Suche & Entschärfen."
          },
          body: {
            en: tbl(["Option", "Default", "What it does"], [
              ["Saboteur", "Off", "Spawn chance for the role."],
              ["Saboteur Minimum Players To Spawn", "6", "The role isn't assigned below this lobby size."],
              ["Minimum Alive Players For Sabotage Kill", "4", "Below this many alive players, the sabotage kill is disabled."],
              ["Saboteur Tokens Per Round", "1", "Tokens granted each meeting."],
              ["Sabotage-Task / Trap Token Cost", "1 / 1", "Token cost of each action."],
              ["Extra Kill Cooldown After Sabotage Kill", "10", "Seconds added to the Saboteur's next kill cooldown."],
              ["Saboteur Max Active Traps", "1", "Traps that can be live at once."],
              ["Saboteur Trap Stun Duration", "5", "Stun seconds when a victim steps in a trap."],
              ["Traps Also Affect Other Impostors", "Off", "Whether other Impostors can be trapped."],
              ["Other Impostors Can See Traps", "Off", "Whether other Impostors see the traps."],
              ["Trapped Players Limp After Stun", "Off", "Adds a limp after the freeze (+ self-limp toggle)."],
              ["Crew Can Search / Defuse", "On / On", "The search and defuse counterplay."],
              ["Minimum Alive Players For Traps", "3", "Below this many alive players, traps are inert."]
            ]),
            de: tbl(["Option", "Standard", "Funktion"], [
              ["Saboteur", "Off", "Spawn-Chance der Rolle."],
              ["Saboteur Minimum Players To Spawn", "6", "Die Rolle wird unter dieser Lobby-Größe nicht vergeben."],
              ["Minimum Alive Players For Sabotage Kill", "4", "Unter so vielen Lebenden ist der Sabotage-Kill deaktiviert."],
              ["Saboteur Tokens Per Round", "1", "Tokens pro Meeting."],
              ["Sabotage-Task / Trap Token Cost", "1 / 1", "Token-Kosten je Aktion."],
              ["Extra Kill Cooldown After Sabotage Kill", "10", "Sekunden auf den nächsten Kill-Cooldown des Saboteurs."],
              ["Saboteur Max Active Traps", "1", "Gleichzeitig aktive Fallen."],
              ["Saboteur Trap Stun Duration", "5", "Stun-Sekunden beim Reinlaufen in eine Falle."],
              ["Traps Also Affect Other Impostors", "Off", "Ob andere Impostor gefangen werden können."],
              ["Other Impostors Can See Traps", "Off", "Ob andere Impostor die Fallen sehen."],
              ["Trapped Players Limp After Stun", "Off", "Hinken nach dem Freeze (+ Selbst-Hinken-Schalter)."],
              ["Crew Can Search / Defuse", "On / On", "Das Such- und Entschärfungs-Konterspiel."],
              ["Minimum Alive Players For Traps", "3", "Unter so vielen Lebenden sind Fallen wirkungslos."]
            ])
          }
        },
        {
          id: "saboteur-draft",
          title: { en: "Role Draft support", de: "Role-Draft-Unterstützung" },
          badges: [{ en: "Draftable", de: "Draftbar" }],
          summary: {
            en: "Tesla and Saboteur can be picked in TOR's Role Draft — integrated entirely from Unknown's Collection without touching TOR's source.",
            de: "Tesla und Saboteur sind in TORs Role Draft wählbar — komplett aus Unknown's Collection integriert, ohne TORs Quellcode anzufassen."
          },
          body: {
            en: "<p>When <strong>Role Draft</strong> is enabled, the Tesla and Saboteur appear as draftable impostor picks instead of being assigned by the usual random promotion. (In the draft list their buttons use the impostor red so the faction filter shows them; their own colours return in-game.)</p>",
            de: "<p>Ist der <strong>Role Draft</strong> aktiv, erscheinen Tesla und Saboteur als wählbare Impostor-Picks, statt über die übliche Zufalls-Beförderung vergeben zu werden. (In der Draft-Liste sind ihre Buttons impostor-rot, damit der Fraktionsfilter sie zeigt; im Spiel kehren ihre Eigenfarben zurück.)</p>"
          }
        },
        {
          id: "saboteur-gating",
          title: { en: "Client-side gating", de: "Client-seitiges Gating" },
          badges: [{ en: "All players need the mod", de: "Alle brauchen den Mod" }],
          summary: {
            en: "Like the Tesla, the Saboteur is client-side, so the lobby start is blocked unless every player runs the same Unknown's Collection version.",
            de: "Wie die Tesla ist der Saboteur client-seitig, daher ist der Lobby-Start blockiert, solange nicht alle dieselbe Unknown's-Collection-Version haben."
          },
          body: {
            en: "<p>The Saboteur's kill effect, invisible traps and the search/defuse minigames are all client-side, so the same version handshake applies: the lobby start is <strong>blocked</strong> until every connected player runs the same Unknown's Collection version.</p>",
            de: "<p>Der Kill-Effekt, die unsichtbaren Fallen und die Such-/Entschärf-Minispiele des Saboteurs sind alle client-seitig, daher greift derselbe Versions-Handshake: Der Lobby-Start ist <strong>blockiert</strong>, bis jeder verbundene Spieler dieselbe Unknown's-Collection-Version hat.</p>"
          }
        }
      ]
    },
    {
      id: "uc-versioning",
      title: { en: "Versioning & updater", de: "Versionierung & Updater" },
      entries: [
        {
          id: "uc-channels",
          title: { en: "Stable & test channels", de: "Stable- & Test-Kanäle" },
          summary: {
            en: "vX.Y.Z = stable, vX.Y.Z.W = test build. A channel-aware updater follows the shared Test Versions toggle.",
            de: "vX.Y.Z = stable, vX.Y.Z.W = Test-Build. Ein kanal-bewusster Updater folgt dem geteilten Test-Versionen-Schalter."
          },
          body: {
            en: "<p>Releases use <code>vX.Y.Z</code> for stable and <code>vX.Y.Z.W</code> for test builds (the 4th part is the test number, published as a GitHub pre-release). The shared <strong>Test Versions</strong> toggle in the Mod Manager (off by default) controls whether the <code>.W</code> suffix is shown and which channel the updater follows: off → newest stable, on → newest test build, but only when it is genuinely ahead of the latest stable. A stable <code>vX.Y.Z</code> always supersedes its own test builds.</p>",
            de: "<p>Releases nutzen <code>vX.Y.Z</code> für Stable und <code>vX.Y.Z.W</code> für Test-Builds (die 4. Stelle ist die Testnummer, als GitHub-Prerelease veröffentlicht). Der geteilte <strong>Test-Versionen</strong>-Schalter im Mod Manager (standardmäßig aus) steuert, ob das <code>.W</code>-Suffix angezeigt wird und welchem Kanal der Updater folgt: aus → neuster Stable, an → neuster Test-Build, aber nur wenn er dem neusten Stable wirklich vorausgeht. Ein Stable <code>vX.Y.Z</code> überholt immer seine eigenen Test-Builds.</p>"
          }
        }
      ]
    }
  ]
};

const MODS = { chance: CHANCE, useful: USEFUL, unknowns: UNKNOWNS };
