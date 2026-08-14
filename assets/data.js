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
    nav_nightfall: "Nightfall",
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
    nav_nightfall: "Nightfall",
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
  version: "1.2.19",
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
              ["Chaos: Affected Players", "All players / Only Chance players", "Reroll everyone, or only carriers of the Chance modifier."],
              ["Chaos: Reroll Modifiers Too", "Off / On", "Also re-rolls modifiers (Invert, Tiebreaker, etc.) for affected players."],
              ["Chaos: Modifier Reroll Affects", "All players / Only Chance players", "Which players get their modifiers re-rolled — all or only Chance carriers."]
            ]),
            de: tbl(["Option", "Werte", "Funktion"], [
              ["Chaos Mode", "Off / On", "Lost die Rollen nach jedem Meeting neu aus."],
              ["Chaos: Role Pool", "All enabled roles / Only roles already in play", "„All“: Neue Rollen können auftauchen. „In play“: Nur bestehende Rollen werden neu verteilt (Multi-Shifter)."],
              ["Chaos: Affected Players", "All players / Only Chance players", "Reroll für alle oder nur für Träger des Chance-Modifiers."],
              ["Chaos: Reroll Modifiers Too", "Off / On", "Würfelt auch Modifier (Invert, Tiebreaker, usw.) für betroffene Spieler neu."],
              ["Chaos: Modifier Reroll Affects", "All players / Only Chance players", "Welche Spieler ihre Modifier neu zugelost bekommen — alle oder nur Chance-Träger."]
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
  version: "1.3.0",
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
      id: "lover-revenger",
      title: { en: "Lover Revenger", de: "Lover Revenger" },
      intro: {
        en: "A new path for the surviving Lover: instead of dying instantly when the partner is killed, the Lover can be spared and become a Revenger — a vengeful role with a mission to avenge the fallen partner.",
        de: "Ein neuer Pfad für den überlebenden Lover: Statt sofort zu sterben, wenn der Partner getötet wird, kann der Lover verschont und zum Revenger werden — einer rächenden Rolle mit der Mission, den gefallenen Partner zu rächen."
      },
      entries: [
        {
          id: "delay-lover-death",
          title: { en: "Delay Lover Death", de: "Verzögerter Lover-Tod" },
          badges: [{ en: "Modifier → Lover", de: "Modifier → Lover" }],
          summary: {
            en: "Suppresses the instant Lover suicide when the partner is killed, deferring the decision to the end of the next meeting.",
            de: "Unterdrückt den sofortigen Lover-Selbstmord, wenn der Partner getötet wird, und verschiebt die Entscheidung ans Ende des nächsten Meetings."
          },
          body: {
            en: "<p>When <strong>Delay Lover Death</strong> is ON and the first Lover was <em>killed</em> (not exiled) while \"Both Lovers Die\" is ON, the surviving Lover's instant suicide is suppressed. The decision is deferred to the end of the next meeting, where a configurable %-roll decides the outcome.</p>"
            + "<p>If the first Lover was <strong>voted out</strong> (exiled), no Revenger path is possible — the surviving Lover dies at the end of the next meeting as a delayed suicide.</p>"
            + "<p>A Lover shot by a <strong>Guesser</strong> also arms the Revenger, with the Guesser becoming the target.</p>"
            + tbl(["Option", "Values", "What it does"], [
              ["Delay Lover Death", "Off / On", "Suppresses instant suicide; defers the decision to the next meeting end."],
              ["Chance Surviving Lover Becomes Revenger", "0–100%", "%-roll for the surviving Lover to become a Revenger (otherwise they die as a delayed suicide)."]
            ]),
            de: "<p>Wenn <strong>Delay Lover Death</strong> AN ist und der erste Lover <em>getötet</em> (nicht exiliert) wurde, während \"Both Lovers Die\" AN ist, wird der sofortige Selbstmord des überlebenden Lovers unterdrückt. Die Entscheidung wird ans Ende des nächsten Meetings verschoben, wo ein konfigurierbarer %-Wurf den Ausgang bestimmt.</p>"
            + "<p>Wurde der erste Lover <strong>herausgestimmt</strong> (exiliert), gibt es keinen Revenger-Pfad — der überlebende Lover stirbt am Ende des nächsten Meetings als verzögerter Selbstmord.</p>"
            + "<p>Ein durch einen <strong>Guesser</strong> erschossener Lover aktiviert ebenfalls den Revenger, wobei der Guesser zum Ziel wird.</p>"
            + tbl(["Option", "Werte", "Funktion"], [
              ["Delay Lover Death", "Off / On", "Unterdrückt den Sofort-Suizid; verschiebt die Entscheidung ans Meeting-Ende."],
              ["Chance Surviving Lover Becomes Revenger", "0–100%", "%-Chance, dass der überlebende Lover zum Revenger wird (sonst stirbt er als verzögerter Suizid)."]
            ])
          }
        },
        {
          id: "revenger-role",
          title: { en: "The Revenger role", de: "Die Revenger-Rolle" },
          badges: [{ en: "Modifier → Lover", de: "Modifier → Lover" }],
          summary: {
            en: "Shows as \"Revenger\" in name tags and the role tab, but the win counts as a Lovers win.",
            de: "Zeigt sich als \"Revenger\" in Namensschildern und dem Rollen-Tab, aber der Sieg zählt als Lovers-Sieg."
          },
          body: {
            en: "<p>The Revenger shows its own <strong>RoleInfo</strong> (keeping the Lovers color) in name tags, the role tab and the end-game summary. The <strong>win</strong> counts as a Lovers win for exactly the two Lovers (the fallen one + the Revenger) — the end screen reads \"Lovers Win\".</p>"
            + "<p>A <strong>non-killer</strong> Revenger (crew) gets a Sheriff-like kill button. A Revenger that already has its own kill button (Impostor, Jackal/Sidekick/Thief, Sheriff) gets no second button — their normal kill on the Lover's killer triggers the win.</p>",
            de: "<p>Der Revenger zeigt eine eigene <strong>RoleInfo</strong> (mit der Lovers-Farbe) in Namensschildern, dem Rollen-Tab und der Endzusammenfassung. Der <strong>Sieg</strong> zählt als Lovers-Sieg für genau die zwei Lover (der gefallene + der Revenger) — der Endscreen zeigt \"Lovers Win\".</p>"
            + "<p>Ein <strong>Nicht-Killer</strong>-Revenger (Crew) bekommt einen Sheriff-ähnlichen Kill-Button. Ein Revenger, der bereits einen eigenen Kill-Button hat (Impostor, Jackal/Sidekick/Thief, Sheriff), bekommt keinen zweiten Button — ihr normaler Kill am Lover-Killer löst den Sieg aus.</p>"
          }
        },
        {
          id: "revenger-modes",
          title: { en: "Revenger modes: Targeted Justice vs Blind Rage", de: "Revenger-Modi: Targeted Justice vs Blind Rage" },
          badges: [{ en: "Modifier → Lover", de: "Modifier → Lover" }],
          summary: {
            en: "Targeted Justice: may only kill the Lover's killer. Blind Rage: may kill anyone.",
            de: "Targeted Justice: darf nur den Lover-Killer töten. Blind Rage: darf jeden töten."
          },
          body: {
            en: "<p>A host option picks the behaviour for crew Revengers:</p>"
            + tbl(["Mode", "Behaviour"], [
              ["Targeted Justice", "May only kill the Lover's killer. A correct kill ends the game instantly as a Lovers win. A wrong target is a fatal misfire — the Revenger dies."],
              ["Blind Rage", "May kill anyone. Hitting the real killer wins as above. Otherwise the Revenger dies at the end of the next meeting with a random rage chat message."]
            ])
            + "<p class='note'>Killer Revengers (Impostor, neutral killers, Sheriff) always act in Targeted Justice mode — only their correct kill triggers the win.</p>",
            de: "<p>Eine Host-Option bestimmt das Verhalten für Crew-Revenger:</p>"
            + tbl(["Modus", "Verhalten"], [
              ["Targeted Justice", "Darf nur den Lover-Killer töten. Ein korrekter Kill beendet das Spiel sofort als Lovers-Sieg. Ein falsches Ziel ist ein tödlicher Fehlschuss — der Revenger stirbt."],
              ["Blind Rage", "Darf jeden töten. Trifft er den echten Killer, gewinnt er wie oben. Sonst stirbt der Revenger am Ende des nächsten Meetings mit einer zufälligen Zorn-Chat-Nachricht."]
            ])
            + "<p class='note'>Killer-Revenger (Impostor, neutrale Killer, Sheriff) handeln immer im Targeted-Justice-Modus — nur ihr korrekter Kill löst den Sieg aus.</p>"
          }
        },
        {
          id: "revenger-options",
          title: { en: "Options (Modifier → Lover)", de: "Optionen (Modifier → Lover)" },
          summary: {
            en: "Master toggle, Revenger chance, mode selection and kill cooldown.",
            de: "Master-Toggle, Revenger-Chance, Modus-Auswahl und Kill-Cooldown."
          },
          body: {
            en: tbl(["Option", "Default", "What it does"], [
              ["Delay Lover Death", "Off", "Master toggle for the delayed death + Revenger path."],
              ["Chance Surviving Lover Becomes Revenger", "50%", "%-chance to become a Revenger instead of dying."],
              ["Revenger Mode", "Targeted Justice / Blind Rage", "Behaviour mode for crew Revengers."],
              ["Revenger Kill Cooldown", "10 s", "Kill cooldown for the Revenger's button."]
            ]),
            de: tbl(["Option", "Standard", "Funktion"], [
              ["Delay Lover Death", "Off", "Master-Toggle für den verzögerten Tod + Revenger-Pfad."],
              ["Chance Surviving Lover Becomes Revenger", "50%", "%-Chance, Revenger zu werden statt zu sterben."],
              ["Revenger Mode", "Targeted Justice / Blind Rage", "Verhaltensmodus für Crew-Revenger."],
              ["Revenger Kill Cooldown", "10 s", "Kill-Cooldown für den Revenger-Button."]
            ])
          }
        },
        {
          id: "revenger-win",
          title: { en: "Win condition & parity blocking", de: "Sieg-Bedingung & Parity-Block" },
          badges: [{ en: "Modifier → Lover", de: "Modifier → Lover" }, { en: "Host-authoritative", de: "Host-autoritativ" }],
          summary: {
            en: "Revenger wins count as Lovers win. While a Revenger is alive, Impostors/Jackal cannot claim a parity win.",
            de: "Revenger-Siege zählen als Lovers-Sieg. Solange ein Revenger lebt, können Impostoren/Jackal keinen Parity-Win beanspruchen."
          },
          body: {
            en: "<p>The Revenger win uses a <strong>separate CustomGameOverReason (17)</strong> with a dedicated end screen. The win is flagged <em>before</em> the killing blow so a kill that removes the last evil player can't race a Crew \"No Evil Killers Left\" end.</p>"
            + "<p>If the <strong>target dies first</strong> (voted out or killed by someone else), the revenge is denied and the Revenger dies at the next meeting end with a flavour line. The Revenger is <strong>guessable</strong> in Guesser mode — its RoleInfo is listed in all role infos.</p>"
            + "<p>While a Revenger is <strong>alive</strong>, the Impostors/Jackal cannot claim a numerical parity win — they must deal with the Revenger first.</p>"
            + "<p class='note'>Gated: all players need the mod. State syncs over a small custom RPC (247). Kills reuse TOR's UncheckedMurderPlayer.</p>",
            de: "<p>Der Revenger-Sieg nutzt einen <strong>separaten CustomGameOverReason (17)</strong> mit einem eigenen Endscreen. Der Sieg wird <em>vor</em> dem tödlichen Schlag gesetzt, sodass ein Kill, der den letzten bösen Spieler entfernt, nicht mit einem Crew-\"No Evil Killers Left\"-Ende konkurrieren kann.</p>"
            + "<p>Wenn das <strong>Ziel zuerst stirbt</strong> (herausgestimmt oder von jemand anderem getötet), wird die Rache verweigert und der Revenger stirbt am Ende des nächsten Meetings mit einer Textzeile. Der Revenger ist im Guesser-Modus <strong>ratbar</strong> — seine RoleInfo ist in allen Rollen-Infos gelistet.</p>"
            + "<p>Solange ein Revenger <strong>lebt</strong>, können die Impostoren/Jackal keinen numerischen Parity-Win beanspruchen — sie müssen sich zuerst um den Revenger kümmern.</p>"
            + "<p class='note'>Gated: alle Spieler brauchen den Mod. State-Sync über ein kleines Custom-RPC (247). Kills nutzen TORs UncheckedMurderPlayer.</p>"
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
  version: "1.1.0",
  allClients: true,
  repo: "https://github.com/DaUnknown-0/UnknownsCollection",
  download: "https://github.com/DaUnknown-0/UnknownsCollection/releases/latest",
  tagline: {
    en: "Brand-new custom roles for The Other Roles, layered on without touching TOR's source. Impostor: The Tesla, The Saboteur, The Silencer, The Poisoner, The Illusionist, The Maniac, The Shade & The Manipulator. Crewmate: The Siphoner, The Witness, The Scout & The Beacon. Neutral: The Bug, The Follower, The Copycat & The Collector. Ghost: The Poltergeist.",
    de: "Brandneue eigene Rollen für The Other Roles, aufgesetzt ohne Änderung an TORs Quellcode. Impostor: The Tesla, The Saboteur, The Silencer, The Poisoner, The Illusionist, The Maniac, The Shade & The Manipulator. Crewmate: The Siphoner, The Witness, The Scout & The Beacon. Neutral: The Bug, The Follower, The Copycat & The Collector. Geist: The Poltergeist."
  },
  intro: {
    en: "Unknown's Collection is a separate plugin that adds <strong>new roles</strong> to TOR 4.8.0 purely through Harmony patches — TOR's source is never modified, and the only hard dependency is The Other Roles. The roles are client-side, so the lobby can only be started when every player runs the same Unknown's Collection version. Current roles — Impostor: <strong>The Tesla</strong>, <strong>The Saboteur</strong>, <strong>The Silencer</strong>, <strong>The Poisoner</strong>, <strong>The Illusionist</strong>, <strong>The Maniac</strong>, <strong>The Shade</strong> and <strong>The Manipulator</strong>; Crewmate: <strong>The Siphoner</strong>, <strong>The Witness</strong>, <strong>The Scout</strong> and <strong>The Beacon</strong>; Neutral: <strong>The Bug</strong>, <strong>The Follower</strong>, <strong>The Copycat</strong> and <strong>The Collector</strong>; plus <strong>The Poltergeist</strong> — a ghost role the first dead player rises into. All Impostor roles and the Collector are pickable in TOR's Role Draft. Since 1.0.1.60 every ability comes with dedicated particle effects and positional stereo sound.",
    de: "Unknown's Collection ist ein eigenständiges Plugin, das TOR 4.8.0 <strong>neue Rollen</strong> rein über Harmony-Patches hinzufügt — TORs Quellcode wird nie verändert, einzige harte Abhängigkeit ist The Other Roles. Die Rollen sind client-seitig, daher kann die Lobby nur gestartet werden, wenn alle Spieler dieselbe Unknown's-Collection-Version haben. Aktuelle Rollen — Impostor: <strong>The Tesla</strong>, <strong>The Saboteur</strong>, <strong>The Silencer</strong>, <strong>The Poisoner</strong>, <strong>The Illusionist</strong>, <strong>The Maniac</strong>, <strong>The Shade</strong> und <strong>The Manipulator</strong>; Crewmate: <strong>The Siphoner</strong>, <strong>The Witness</strong>, <strong>The Scout</strong> und <strong>The Beacon</strong>; Neutral: <strong>The Bug</strong>, <strong>The Follower</strong>, <strong>The Copycat</strong> und <strong>The Collector</strong>; dazu <strong>The Poltergeist</strong> — eine Geist-Rolle, in die der erste Tote aufsteigt. Alle Impostor-Rollen und der Collector sind im Role Draft von TOR wählbar. Seit 1.0.1.60 hat jede Fähigkeit eigene Partikeleffekte und positionalen Stereo-Sound."
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
      id: "silencer",
      title: { en: "The Silencer (Impostor)", de: "The Silencer (Impostor)" },
      intro: {
        en: "A normal Impostor is secretly promoted to The Silencer at game start. During a round the Silencer marks a victim; a marked player is muted in the next meeting — they cannot vote and cannot chat, with a red [MUTED] marker visible to everyone.",
        de: "Ein normaler Impostor wird beim Spielstart heimlich zum Silencer befördert. Während einer Runde markiert der Silencer ein Opfer; ein markierter Spieler wird im nächsten Meeting stummgeschaltet — er kann nicht abstimmen und nicht chatten, mit einem roten [MUTED]-Marker, der für alle sichtbar ist."
      },
      entries: [
        {
          id: "silencer-mark",
          title: { en: "Marking a victim", de: "Ein Opfer markieren" },
          summary: {
            en: "Press the SILENCE button to mark a player. They will be muted in the next meeting — vote and chat blocked.",
            de: "Drücke den SILENCE-Button, um einen Spieler zu markieren. Er wird im nächsten Meeting stummgeschaltet — Vote und Chat blockiert."
          },
          body: {
            en: "<p>The Silencer presses <strong>SILENCE</strong> (a CustomButton with a cooldown) to mark a nearby player. A marked player has their vote area click and <strong>SendChat</strong> blocked in the <strong>next meeting</strong>; their Skip vote is additionally blocked unless <strong>Silencer Can Still Skip</strong> is enabled. They are excluded from the meeting entirely rather than having a vote cast on their behalf, so voting can still end early without waiting on them. A red <strong>[MUTED]</strong> marker is shown next to their name both in-game and on their meeting vote area — obvious to everyone so the victim knows to mute their voice client too. The mute lasts exactly one meeting and is cleared when it ends.</p>",
            de: "<p>Der Silencer drückt <strong>SILENCE</strong> (ein CustomButton mit Cooldown), um einen nahen Spieler zu markieren. Ein markierter Spieler hat im <strong>nächsten Meeting</strong> seinen Vote-Bereich und <strong>SendChat</strong> blockiert; sein Skip-Vote ist zusätzlich blockiert, außer <strong>Silencer Can Still Skip</strong> ist aktiviert. Er wird komplett von der Abstimmung ausgeschlossen, statt dass eine Stimme für ihn abgegeben wird — die Abstimmung kann also trotzdem vorzeitig enden, ohne auf ihn zu warten. Ein roter <strong>[MUTED]</strong>-Marker wird neben seinem Namen angezeigt, sowohl im Spiel als auch im Vote-Bereich — offensichtlich für alle, damit das Opfer weiß, auch seinen Voice-Client stummzuschalten. Das Mute dauert genau ein Meeting und wird danach aufgehoben.</p>"
          }
        },
        {
          id: "silencer-options",
          title: { en: "Options (Impostor tab)", de: "Optionen (Impostor-Tab)" },
          summary: {
            en: "Spawn rate, mark cooldown, targets per round, skip allowance, in-game marker.",
            de: "Spawnrate, Mark-Cooldown, Ziele pro Runde, Skip-Erlaubnis, In-Game-Marker."
          },
          body: {
            en: tbl(["Option", "Default", "What it does"], [
              ["Silencer", "Off", "Spawn chance for the role."],
              ["Silencer Minimum Players To Spawn", "6", "The role isn't assigned below this lobby size."],
              ["Silencer Mark Cooldown", "25 s", "Cooldown of the SILENCE button."],
              ["Silencer Targets Per Round", "1", "How many players can be silenced per round."],
              ["Silencer Can Still Skip", "Off", "A muted player may still press Skip during voting."],
              ["Silencer Show In-Game Marker", "On", "Also show the red [MUTED] marker next to the player's in-game name."]
            ]),
            de: tbl(["Option", "Standard", "Funktion"], [
              ["Silencer", "Off", "Spawn-Chance der Rolle."],
              ["Silencer Minimum Players To Spawn", "6", "Die Rolle wird unter dieser Lobby-Größe nicht vergeben."],
              ["Silencer Mark Cooldown", "25 s", "Cooldown des SILENCE-Buttons."],
              ["Silencer Targets Per Round", "1", "Wie viele Spieler pro Runde stummgeschaltet werden können."],
              ["Silencer Can Still Skip", "Off", "Ein stummgeschalteter Spieler darf während der Abstimmung noch Skip drücken."],
              ["Silencer Show In-Game Marker", "On", "Zeigt den roten [MUTED]-Marker auch neben dem In-Game-Namen des Spielers an."]
            ])
          }
        }
      ]
    },
    {
      id: "siphoner",
      title: { en: "The Siphoner (Crewmate)", de: "The Siphoner (Crewmate)" },
      intro: {
        en: "A normal Crewmate is secretly promoted to The Siphoner at game start. While the Siphoner stands close to an Impostor, it passively drains the Impostor's kill cooldown — pushing it back every tick. Host-authoritative: the host runs the proximity check and broadcasts drain pulses.",
        de: "Ein normaler Crewmate wird beim Spielstart heimlich zum Siphoner befördert. Während der Siphoner in der Nähe eines Impostors steht, zieht er passiv dessen Kill-Cooldown — er wird bei jedem Tick zurückgesetzt. Host-autoritativ: Der Host führt den Nähe-Check durch und sendet Drain-Impulse."
      },
      entries: [
        {
          id: "siphoner-drain",
          title: { en: "Passive drain mechanic", de: "Passive Drain-Mechanik" },
          summary: {
            en: "Staying close to an Impostor pushes their kill cooldown back every tick. Closer = stronger drain.",
            de: "In der Nähe eines Impostors wird dessen Kill-Cooldown bei jedem Tick zurückgesetzt. Näher = stärkerer Drain."
          },
          body: {
            en: "<p>While the Siphoner is within range of an Impostor, every tick (configurable interval) the Impostor's kill cooldown is pushed back by a configurable penalty. The drain can optionally scale with distance — closer means more cooldown added. The affected Impostor can optionally see a warning flash.</p>"
            + "<p>This is <strong>host-authoritative</strong>: a Crewmate client doesn't know who the Impostors are, so the host runs the proximity detection and broadcasts a drain pulse via RPC 196. The targeted Impostor's own client applies <code>SetKillTimer</code> to itself.</p>"
            + "<p>Additionally, the Siphoner can also drain the sabotage cooldown, holding it while in range.</p>",
            de: "<p>Solange der Siphoner in Reichweite eines Impostors ist, wird bei jedem Tick (konfigurierbares Intervall) der Kill-Cooldown des Impostors um eine konfigurierbare Strafe erhöht. Der Drain kann optional mit der Distanz skalieren — näher bedeutet mehr Cooldown. Der betroffene Impostor kann optional einen Warnblitz sehen.</p>"
            + "<p>Dies ist <strong>host-autoritativ</strong>: Ein Crewmate-Client weiß nicht, wer die Impostoren sind, daher führt der Host die Nähe-Erkennung durch und sendet einen Drain-Impuls via RPC 196. Der betroffene Impostor-Client wendet <code>SetKillTimer</code> auf sich selbst an.</p>"
            + "<p>Zusätzlich kann der Siphoner auch den Sabotage-Cooldown ziehen und ihn in Reichweite halten.</p>"
          }
        },
        {
          id: "siphoner-options",
          title: { en: "Options (Crewmate tab)", de: "Optionen (Crewmate-Tab)" },
          summary: {
            en: "Spawn rate, drain range, penalty per tick, interval, distance scaling, warnings.",
            de: "Spawnrate, Drain-Reichweite, Strafe pro Tick, Intervall, Distanz-Skalierung, Warnungen."
          },
          body: {
            en: tbl(["Option", "Default", "What it does"], [
              ["Siphoner", "Off", "Spawn chance for the role."],
              ["Siphoner Minimum Players To Spawn", "6", "The role isn't assigned below this lobby size."],
              ["Siphoner Drain Range", "3.0", "Proximity range in world units."],
              ["Siphoner Penalty Per Tick", "2 s", "Kill cooldown seconds added per tick."],
              ["Siphoner Tick Interval", "1.5 s", "Seconds between drain ticks."],
              ["Siphoner Scale With Distance", "On", "Closer = stronger drain."],
              ["Siphoner Warn Impostor", "On", "Drained Impostor sees a warning flash."],
              ["Siphoner Affect Sabotage", "Off", "Also drain the Impostor's sabotage cooldown."]
            ]),
            de: tbl(["Option", "Standard", "Funktion"], [
              ["Siphoner", "Off", "Spawn-Chance der Rolle."],
              ["Siphoner Minimum Players To Spawn", "6", "Die Rolle wird unter dieser Lobby-Größe nicht vergeben."],
              ["Siphoner Drain Range", "3,0", "Nähe-Reichweite in Welteinheiten."],
              ["Siphoner Penalty Per Tick", "2 s", "Kill-Cooldown-Sekunden, die pro Tick hinzugefügt werden."],
              ["Siphoner Tick Interval", "1,5 s", "Sekunden zwischen Drain-Ticks."],
              ["Siphoner Scale With Distance", "On", "Näher = stärkerer Drain."],
              ["Siphoner Warn Impostor", "On", "Gedrainter Impostor sieht einen Warnblitz."],
              ["Siphoner Affect Sabotage", "Off", "Zieht auch den Sabotage-Cooldown des Impostors."]
            ])
          }
        }
      ]
    },
    {
      id: "witness",
      title: { en: "The Witness (Crewmate)", de: "The Witness (Crewmate)" },
      intro: {
        en: "A normal Crewmate is secretly promoted to The Witness at game start. If the Witness is the sole living crewmate who sees a kill happen, the killer's identity is noted — revealed either publicly or anonymously depending on circumstances.",
        de: "Ein normaler Crewmate wird beim Spielstart heimlich zum Witness befördert. Wenn der Witness der einzige lebende Crewmate ist, der einen Kill sieht, wird die Identität des Killers notiert — je nach Umständen öffentlich oder anonym enthüllt."
      },
      entries: [
        {
          id: "witness-sighting",
          title: { en: "Sole-witness sighting", de: "Allein-Zeugen-Sichtung" },
          summary: {
            en: "If the Witness is the only crewmate who saw the kill, the killer's name glows red for the Witness.",
            de: "Wenn der Witness der einzige Crewmate ist, der den Kill gesehen hat, leuchtet der Name des Killers rot für den Witness."
          },
          body: {
            en: "<p>If the Witness is the <strong>sole living crewmate</strong> who <strong>sees</strong> a kill happen (within sight range AND with a clear line of sight — no wall between), the killer's identity is \"noted on a piece of paper\":</p><ul><li>The killer's name glows <strong>red</strong> for the Witness (permanently, or until the next meeting ends).</li></ul>"
            + "<p>This is <strong>host-authoritative</strong>: deciding \"sole crewmate to see it\" needs every player's position + role + line of sight, which only the host has.</p>",
            de: "<p>Wenn der Witness der <strong>einzige lebende Crewmate</strong> ist, der einen Kill <strong>sieht</strong> (in Sichtweite UND mit freier Sichtlinie — keine Wand dazwischen), wird die Identität des Killers \"auf einem Stück Papier notiert\":</p><ul><li>Der Name des Killers leuchtet <strong>rot</strong> für den Witness (dauerhaft oder bis zum Ende des nächsten Meetings).</li></ul>"
            + "<p>Dies ist <strong>host-autoritativ</strong>: Die Entscheidung \"einziger Crewmate, der es sieht\" benötigt die Position + Rolle + Sichtlinie jedes Spielers, was nur der Host hat.</p>"
          }
        },
        {
          id: "witness-reveal",
          title: { en: "Public reveal & anonymous notes", de: "Öffentliche Enthüllung & anonyme Notizen" },
          summary: {
            en: "If the killer later dies and their body is reported, everyone sees a public note. If the killer survives, anonymous notes are slipped to random players.",
            de: "Stirbt der Killer später und seine Leiche wird gemeldet, sehen alle eine öffentliche Notiz. Überlebt der Killer, werden anonyme Notizen an zufällige Spieler verteilt."
          },
          body: {
            en: "<p>Two outcomes after a sighting:</p><ul><li>If the killer later <strong>dies</strong> and their body is <strong>reported</strong>, everyone sees a public note in the meeting: <em>\"I saw {killer} killing {victim}. I need to report this.\"</em></li><li>If the killer <strong>survives</strong> (still alive at first meeting after sighting), the Witness slips an <strong>anonymous note</strong> to a few random players: <em>\"I saw {killer} killing {victim}. Please do something.\"</em> The recipients do <strong>not</strong> learn who the Witness is.</li></ul>",
            de: "<p>Zwei Ergebnisse nach einer Sichtung:</p><ul><li>Stirbt der Killer später und seine <strong>Leiche wird gemeldet</strong>, sehen alle eine öffentliche Notiz im Meeting: <em>\"Ich sah {killer}, wie er {victim} tötete. Ich muss das melden.\"</em></li><li>Überlebt der Killer (noch am Leben beim ersten Meeting nach der Sichtung), schiebt der Witness ein paar zufälligen Spielern eine <strong>anonyme Notiz</strong> zu: <em>\"Ich sah {killer}, wie er {victim} tötete. Bitte tut etwas.\"</em> Die Empfänger erfahren <strong>nicht</strong>, wer der Witness ist.</li></ul>"
          }
        },
        {
          id: "witness-options",
          title: { en: "Options (Crewmate tab)", de: "Optionen (Crewmate-Tab)" },
          summary: {
            en: "Spawn rate, sight range, red name persistence, note recipients.",
            de: "Spawnrate, Sichtweite, Rot-Name-Persistenz, Notiz-Empfänger."
          },
          body: {
            en: tbl(["Option", "Default", "What it does"], [
              ["Witness", "Off", "Spawn chance for the role."],
              ["Witness Minimum Players To Spawn", "6", "The role isn't assigned below this lobby size."],
              ["Witness Sight Factor", "1.0", "Sight range factor (× base 5 world units)."],
              ["Witness Red Name Permanent", "Off", "Red name stays after the first meeting."],
              ["Witness Note Recipients", "2", "How many random players get the survive-note."]
            ]),
            de: tbl(["Option", "Standard", "Funktion"], [
              ["Witness", "Off", "Spawn-Chance der Rolle."],
              ["Witness Minimum Players To Spawn", "6", "Die Rolle wird unter dieser Lobby-Größe nicht vergeben."],
              ["Witness Sight Factor", "1,0", "Sichtweiten-Faktor (× Basis 5 Welteinheiten)."],
              ["Witness Red Name Permanent", "Off", "Roter Name bleibt nach dem ersten Meeting bestehen."],
              ["Witness Note Recipients", "2", "Wie viele zufällige Spieler die Überlebens-Notiz erhalten."]
            ])
          }
        }
      ]
    },
    {
      id: "poisoner",
      title: { en: "The Poisoner (Impostor)", de: "The Poisoner (Impostor)" },
      intro: {
        en: "A normal Impostor is secretly promoted to The Poisoner at game start. Every kill leaves the victim's body poisoned; the first player who reports that body catches the poison too and dies after a set number of meetings — unless the Medic heals them with their antidote ability.",
        de: "Ein normaler Impostor wird beim Spielstart heimlich zum Poisoner befördert. Jeder Kill hinterlässt eine vergiftete Leiche des Opfers; der erste Spieler, der diese Leiche meldet, fängt sich die Vergiftung ebenfalls ein und stirbt nach einer festgelegten Anzahl an Meetings — es sei denn, der Medic heilt ihn mit seiner Antidot-Fähigkeit."
      },
      entries: [
        {
          id: "poisoner-poison",
          title: { en: "Poisoned bodies", de: "Vergiftete Leichen" },
          summary: {
            en: "A Poisoner kill leaves the body poisoned rather than just dead — the poison itself does nothing until someone reports it.",
            de: "Ein Poisoner-Kill hinterlässt statt eines normalen Toten eine vergiftete Leiche — das Gift selbst wirkt erst, wenn jemand sie meldet."
          },
          body: {
            en: "<p>Whenever the Poisoner kills, the victim's body is marked as <strong>poisoned</strong> instead of a normal corpse. The poison itself is inert until the body gets reported — up to <strong>Max Poisoned Bodies Per Round</strong> bodies can carry this mark at once.</p>",
            de: "<p>Immer wenn der Poisoner tötet, wird die Leiche des Opfers als <strong>vergiftet</strong> markiert statt als normaler Toter. Das Gift selbst ist wirkungslos, bis die Leiche gemeldet wird — bis zu <strong>Max Poisoned Bodies Per Round</strong> Leichen können diese Markierung gleichzeitig tragen.</p>"
          }
        },
        {
          id: "poisoner-report",
          title: { en: "Reporting the body spreads the poison", de: "Melden verbreitet das Gift" },
          summary: {
            en: "The first player to report a poisoned body is infected themselves and will die after a set number of meetings.",
            de: "Der erste Spieler, der eine vergiftete Leiche meldet, infiziert sich selbst und stirbt nach einer festgelegten Anzahl an Meetings."
          },
          body: {
            en: "<p>The first player who <strong>reports</strong> a poisoned body is themselves infected. Unless cured, they die after <strong>Poison Death After Meetings</strong> meetings have ended — a slow-burning ticking clock rather than an instant kill, so the poisoned player has time to be found out or saved.</p>",
            de: "<p>Der erste Spieler, der eine vergiftete Leiche <strong>meldet</strong>, infiziert sich selbst. Ohne Heilung stirbt er, nachdem <strong>Poison Death After Meetings</strong> Meetings beendet wurden — eine langsam tickende Uhr statt eines sofortigen Kills, sodass genug Zeit bleibt, den Vergifteten zu entdecken oder zu retten.</p>"
          }
        },
        {
          id: "poisoner-warning",
          title: { en: "\"You don't feel so good\"", de: "\"Dir ist nicht gut\"" },
          summary: {
            en: "The poisoned player gets a private warning message in the meeting where they were infected.",
            de: "Der vergiftete Spieler bekommt im Meeting, in dem er infiziert wurde, eine private Warn-Nachricht."
          },
          body: {
            en: "<p>In the meeting where the infection happens, the poisoned player privately sees a warning message — <em>\"you don't feel so good\"</em> — so they know something is wrong even though no one else is told.</p>",
            de: "<p>Im Meeting, in dem die Infektion passiert, sieht der vergiftete Spieler privat eine Warn-Nachricht — <em>\"Dir ist nicht gut\"</em> —, damit er weiß, dass etwas nicht stimmt, auch wenn niemand sonst davon erfährt.</p>"
          }
        },
        {
          id: "poisoner-antidote",
          title: { en: "The Medic's antidote", de: "Das Antidot des Medic" },
          summary: {
            en: "The Medic can spend a limited number of antidote uses per round to cure a poisoned player before the countdown runs out.",
            de: "Der Medic kann eine begrenzte Anzahl Antidot-Anwendungen pro Runde einsetzen, um einen Vergifteten zu heilen, bevor der Countdown abläuft."
          },
          body: {
            en: "<p>The Medic can cure a poisoned player with their <strong>antidote</strong> ability, clearing the infection before the poison countdown reaches zero. Antidote uses are limited per round via <strong>Medic Antidote Uses Per Round</strong>, so the Medic must choose carefully who to save.</p>",
            de: "<p>Der Medic kann einen vergifteten Spieler mit seiner <strong>Antidot</strong>-Fähigkeit heilen und die Infektion beseitigen, bevor der Gift-Countdown null erreicht. Antidot-Anwendungen sind pro Runde über <strong>Medic Antidote Uses Per Round</strong> begrenzt, der Medic muss also sorgfältig wählen, wen er rettet.</p>"
          }
        },
        {
          id: "poisoner-options",
          title: { en: "Options (Impostor tab)", de: "Optionen (Impostor-Tab)" },
          summary: {
            en: "Spawn rate, min players, death delay, Medic antidote uses, max poisoned bodies.",
            de: "Spawnrate, Min-Spieler, Todes-Verzögerung, Medic-Antidot-Anwendungen, max. vergiftete Leichen."
          },
          body: {
            en: tbl(["Option", "Default", "What it does"], [
              ["Poisoner", "Off", "Spawn chance for the role."],
              ["Poisoner Minimum Players To Spawn", "6", "The role isn't assigned below this lobby size."],
              ["Poison Death After Meetings", "3", "Meetings after infection before the poisoned player dies (range 2–5)."],
              ["Medic Antidote Uses Per Round", "1", "How many times the Medic can cure a poisoned player per round."],
              ["Max Poisoned Bodies Per Round", "2", "How many bodies can carry the poison mark at once per round."]
            ]),
            de: tbl(["Option", "Standard", "Funktion"], [
              ["Poisoner", "Off", "Spawn-Chance der Rolle."],
              ["Poisoner Minimum Players To Spawn", "6", "Die Rolle wird unter dieser Lobby-Größe nicht vergeben."],
              ["Poison Death After Meetings", "3", "Meetings nach der Infektion, bevor der Vergiftete stirbt (Bereich 2–5)."],
              ["Medic Antidote Uses Per Round", "1", "Wie oft der Medic pro Runde einen Vergifteten heilen kann."],
              ["Max Poisoned Bodies Per Round", "2", "Wie viele Leichen pro Runde gleichzeitig die Gift-Markierung tragen können."]
            ])
          }
        }
      ]
    },
    {
      id: "illusionist",
      title: { en: "The Illusionist (Impostor)", de: "The Illusionist (Impostor)" },
      intro: {
        en: "A normal Impostor is secretly promoted to The Illusionist at game start. The Illusionist records its walking path, then plays it back as a shielded clone that looks exactly like the Illusionist — any kill attempt on the clone is blocked.",
        de: "Ein normaler Impostor wird beim Spielstart heimlich zum Illusionist befördert. Der Illusionist zeichnet seinen Laufpfad auf und spielt ihn als beschützten Clone ab, der genau wie der Illusionist aussieht — jeder Kill-Versuch am Clone wird blockiert."
      },
      entries: [
        {
          id: "illusionist-record",
          title: { en: "Record & playback", de: "Aufzeichnung & Wiedergabe" },
          summary: {
            en: "RECORD your path for a configurable length, then PLAY it back as a shielded clone.",
            de: "Zeichne deinen Pfad für eine konfigurierbare Länge auf und spiele ihn als beschützten Clone ab."
          },
          body: {
            en: "<p>The Illusionist <strong>RECORDS</strong> its own walking path (for a configurable max length). At any time (with a cooldown), it <strong>PLAYS</strong> it back: a clone that looks exactly like the Illusionist walks the recorded path. The clone wears a Medic-shield glow and is effectively a protected player — any kill attempt on it is blocked with a shield flash (it never dies).</p>"
            + "<p>The recorded path is broadcast on playback; every client builds + replays its own clone locally. A blocked kill costs the attacker a full cooldown penalty.</p>",
            de: "<p>Der Illusionist <strong>ZEICHNET</strong> seinen eigenen Laufpfad auf (für eine konfigurierbare maximale Länge). Jederzeit (mit einem Cooldown) <strong>SPIELT</strong> er ihn ab: Ein Clone, der genau wie der Illusionist aussieht, läuft den aufgezeichneten Pfad ab. Der Clone trägt einen Medic-Schild-Glow und ist praktisch ein geschützter Spieler — jeder Kill-Versuch wird mit einem Schild-Blitz blockiert (er stirbt nie).</p>"
            + "<p>Der aufgezeichnete Pfad wird bei der Wiedergabe gesendet; jeder Client baut seinen eigenen Clone lokal auf und spielt ihn ab. Ein blockierter Kill kostet dem Angreifer eine volle Cooldown-Strafe.</p>"
          }
        },
        {
          id: "illusionist-options",
          title: { en: "Options (Impostor tab)", de: "Optionen (Impostor-Tab)" },
          summary: {
            en: "Spawn rate, record length, playback cooldown, block penalty, shield visibility.",
            de: "Spawnrate, Aufzeichnungslänge, Wiedergabe-Cooldown, Block-Strafe, Schild-Sichtbarkeit."
          },
          body: {
            en: tbl(["Option", "Default", "What it does"], [
              ["Illusionist", "Off", "Spawn chance for the role."],
              ["Illusionist Minimum Players To Spawn", "6", "The role isn't assigned below this lobby size."],
              ["Illusionist Record Length", "5 s", "Max recording length in seconds."],
              ["Illusionist Playback Cooldown", "20 s", "Cooldown between playbacks."],
              ["Illusionist Block Penalty", "Full Cooldown", "A blocked kill costs the attacker a full cooldown."],
              ["Illusionist Shield Visible To All", "Off", "The shield glow is visible to everyone."]
            ]),
            de: tbl(["Option", "Standard", "Funktion"], [
              ["Illusionist", "Off", "Spawn-Chance der Rolle."],
              ["Illusionist Minimum Players To Spawn", "6", "Die Rolle wird unter dieser Lobby-Größe nicht vergeben."],
              ["Illusionist Record Length", "5 s", "Maximale Aufzeichnungslänge in Sekunden."],
              ["Illusionist Playback Cooldown", "20 s", "Cooldown zwischen Wiedergaben."],
              ["Illusionist Block Penalty", "Full Cooldown", "Ein blockierter Kill kostet dem Angreifer einen vollen Cooldown."],
              ["Illusionist Shield Visible To All", "Off", "Der Schild-Glow ist für alle sichtbar."]
            ])
          }
        }
      ]
    },
    {
      id: "maniac",
      title: { en: "The Maniac (Impostor)", de: "The Maniac (Impostor)" },
      intro: {
        en: "A normal Impostor is secretly promoted to The Maniac at game start. Instead of a normal kill, the Maniac plants a bomb on a player; the bomb can be passed to a nearby player before it detonates, and whoever is carrying it when time runs out dies.",
        de: "Ein normaler Impostor wird beim Spielstart heimlich zum Maniac befördert. Statt eines normalen Kills pflanzt der Maniac eine Bombe auf einen Spieler; die Bombe kann vor der Detonation an einen nahen Spieler weitergegeben werden, und wer sie beim Ablaufen trägt, stirbt."
      },
      entries: [
        {
          id: "maniac-plant",
          title: { en: "Planting the bomb", de: "Die Bombe pflanzen" },
          summary: {
            en: "The Maniac plants an invisible bomb on a nearby player. The victim doesn't notice at first.",
            de: "Der Maniac pflanzt eine unsichtbare Bombe auf einen nahen Spieler. Das Opfer merkt zunächst nichts."
          },
          body: {
            en: "<p>The Maniac plants a bomb on a nearby player, subject to a cooldown. For an <strong>Unaware Delay</strong>, the carrier has no idea they are carrying it — no warning, no indicator.</p>",
            de: "<p>Der Maniac pflanzt eine Bombe auf einen nahen Spieler, mit Cooldown. Für eine als <strong>Unaware Delay</strong> eingestellte Zeitspanne merkt der Träger nichts davon — keine Warnung, kein Hinweis.</p>"
          }
        },
        {
          id: "maniac-pass",
          title: { en: "Passing the bomb on", de: "Die Bombe weitergeben" },
          summary: {
            en: "Once aware, the carrier has a window to pass the bomb to a nearby player before it goes off.",
            de: "Sobald er es merkt, hat der Träger ein Zeitfenster, die Bombe an einen nahen Spieler weiterzugeben, bevor sie hochgeht."
          },
          body: {
            en: "<p>Once the <strong>Unaware Delay</strong> ends, the carrier is warned and gets a <strong>Pass Window</strong> during which they can hand the bomb to another nearby player — passing it on and on before it detonates. Whoever is holding the bomb when the timer expires dies, along with anyone else within the <strong>Explosion Range</strong>.</p>",
            de: "<p>Nach Ablauf der <strong>Unaware Delay</strong> wird der Träger gewarnt und bekommt ein <strong>Pass Window</strong>, in dem er die Bombe an einen anderen nahen Spieler weiterreichen kann — so kann sie mehrfach wandern, bevor sie detoniert. Wer die Bombe hält, wenn der Timer abläuft, stirbt, ebenso jeder andere innerhalb der <strong>Explosion Range</strong>.</p>"
          }
        },
        {
          id: "maniac-options",
          title: { en: "Options (Impostor tab)", de: "Optionen (Impostor-Tab)" },
          summary: {
            en: "Spawn rate, min players, bomb cooldown, unaware delay, pass window, explosion range.",
            de: "Spawnrate, Min-Spieler, Bomben-Cooldown, Unaware-Delay, Pass-Fenster, Explosionsreichweite."
          },
          body: {
            en: tbl(["Option", "Default", "What it does"], [
              ["Maniac", "Off", "Spawn chance for the role."],
              ["Maniac Minimum Players To Spawn", "6", "The role isn't assigned below this lobby size."],
              ["Maniac Bomb Cooldown", "25 s", "Cooldown between planting bombs."],
              ["Maniac Unaware Delay", "5 s", "How long the carrier stays unaware after being planted on."],
              ["Maniac Pass Window", "4 s", "Time the aware carrier has to pass the bomb on."],
              ["Maniac Explosion Range", "2.0", "Range in world units within which the explosion kills."]
            ]),
            de: tbl(["Option", "Standard", "Funktion"], [
              ["Maniac", "Off", "Spawn-Chance der Rolle."],
              ["Maniac Minimum Players To Spawn", "6", "Die Rolle wird unter dieser Lobby-Größe nicht vergeben."],
              ["Maniac Bomb Cooldown", "25 s", "Cooldown zwischen dem Pflanzen von Bomben."],
              ["Maniac Unaware Delay", "5 s", "Wie lange der Träger nichts von der Bombe merkt."],
              ["Maniac Pass Window", "4 s", "Zeit, die der informierte Träger hat, um die Bombe weiterzugeben."],
              ["Maniac Explosion Range", "2,0", "Reichweite in Welteinheiten, innerhalb derer die Explosion tötet."]
            ])
          }
        }
      ]
    },
    {
      id: "shade",
      title: { en: "The Shade (Impostor)", de: "The Shade (Impostor)" },
      intro: {
        en: "A normal Impostor is secretly promoted to The Shade at game start. Kills made by the Shade make the victim's body vanish; other players only find it by walking close enough, which then reports it automatically. Bait victims stay visible so their usual self-report still works.",
        de: "Ein normaler Impostor wird beim Spielstart heimlich zum Shade befördert. Kills des Shade lassen die Leiche des Opfers verschwinden; andere Spieler finden sie nur, indem sie nah genug herangehen, was die Leiche dann automatisch meldet. Bait-Opfer bleiben sichtbar, damit ihr üblicher Selbst-Report weiterhin funktioniert."
      },
      entries: [
        {
          id: "shade-vanish",
          title: { en: "Vanishing bodies", de: "Verschwindende Leichen" },
          summary: {
            en: "A Shade kill removes the body from sight entirely — nobody can spot it from a distance.",
            de: "Ein Shade-Kill entfernt die Leiche vollständig aus dem Sichtfeld — niemand kann sie aus der Ferne entdecken."
          },
          body: {
            en: "<p>When the Shade kills, the victim's body <strong>vanishes</strong> instead of lying visibly on the ground. It cannot be spotted from a distance and does not show up until a player is close enough to it.</p>",
            de: "<p>Tötet der Shade, <strong>verschwindet</strong> die Leiche des Opfers, statt sichtbar am Boden zu liegen. Sie kann aus der Ferne nicht entdeckt werden und taucht erst auf, wenn ein Spieler nah genug herankommt.</p>"
          }
        },
        {
          id: "shade-find",
          title: { en: "Finding & auto-reporting", de: "Finden & Auto-Melden" },
          summary: {
            en: "Get within Find Distance of a hidden body and it is automatically reported for you.",
            de: "Kommt man in Find Distance an eine versteckte Leiche heran, wird sie automatisch für einen gemeldet."
          },
          body: {
            en: "<p>Any player who gets within <strong>Find Distance</strong> of a hidden body automatically triggers a report — there's no separate button to press, walking close enough is enough to find it and call the meeting.</p>",
            de: "<p>Jeder Spieler, der in <strong>Find Distance</strong> an eine versteckte Leiche herankommt, löst automatisch eine Meldung aus — es gibt keinen separaten Button dafür, nah genug herankommen reicht, um sie zu finden und das Meeting einzuberufen.</p>"
          }
        },
        {
          id: "shade-bait",
          title: { en: "Bait bodies stay visible", de: "Bait-Leichen bleiben sichtbar" },
          summary: {
            en: "Bait victims are excluded from the vanish effect so their usual self-report still works as intended.",
            de: "Bait-Opfer sind vom Verschwinden-Effekt ausgenommen, damit ihr üblicher Selbst-Report wie vorgesehen funktioniert."
          },
          body: {
            en: "<p>Bodies belonging to a <strong>Bait</strong> victim are excluded from the vanish effect and stay normally visible, so the Bait's own self-report mechanic keeps working exactly as it does against other kill roles.</p>",
            de: "<p>Leichen eines <strong>Bait</strong>-Opfers sind vom Verschwinden-Effekt ausgenommen und bleiben normal sichtbar, damit der Selbst-Report-Mechanismus des Bait genauso funktioniert wie gegen andere Kill-Rollen.</p>"
          }
        },
        {
          id: "shade-options",
          title: { en: "Options (Impostor tab)", de: "Optionen (Impostor-Tab)" },
          summary: {
            en: "Spawn rate, min players, find distance.",
            de: "Spawnrate, Min-Spieler, Find-Distanz."
          },
          body: {
            en: tbl(["Option", "Default", "What it does"], [
              ["Shade", "Off", "Spawn chance for the role."],
              ["Shade Minimum Players To Spawn", "6", "The role isn't assigned below this lobby size."],
              ["Shade Find Distance", "1.5", "How close a player must get to a hidden body to find and auto-report it."]
            ]),
            de: tbl(["Option", "Standard", "Funktion"], [
              ["Shade", "Off", "Spawn-Chance der Rolle."],
              ["Shade Minimum Players To Spawn", "6", "Die Rolle wird unter dieser Lobby-Größe nicht vergeben."],
              ["Shade Find Distance", "1,5", "Wie nah ein Spieler einer versteckten Leiche kommen muss, um sie zu finden und automatisch zu melden."]
            ])
          }
        }
      ]
    },
    {
      id: "manipulator",
      title: { en: "The Manipulator (Impostor)", de: "The Manipulator (Impostor)" },
      intro: {
        en: "A normal Impostor is secretly promoted to The Manipulator at game start. On demand, the ship's security devices lie to everyone: the Admin table shows fake positions and Vitals shows dead players as alive.",
        de: "Ein normaler Impostor wird beim Spielstart heimlich zum Manipulator befördert. Auf Abruf lügen die Sicherheitsgeräte des Schiffs für alle: Der Admin-Tisch zeigt gefälschte Positionen und Vitals zeigt Tote als lebendig."
      },
      entries: [
        {
          id: "manipulator-fake",
          title: { en: "Faking Admin & Vitals", de: "Admin & Vitals fälschen" },
          summary: {
            en: "One button (cooldown + duration): while active, Admin shows a believable lie and Vitals hides deaths — identically on every client.",
            de: "Ein Button (Cooldown + Dauer): solange aktiv, zeigt Admin eine glaubwürdige Lüge und Vitals verbirgt Tode — auf jedem Client identisch."
          },
          body: {
            en: "<p>The Manipulator's button starts a timed manipulation window. While it runs, the <strong>Admin table</strong> distributes the <em>real</em> number of living players pseudo-randomly across rooms — every client sees the <strong>same</strong> lie, and it re-rolls every few seconds so it looks alive. <strong>Vitals</strong> keeps showing dead players as alive (disconnects stay marked). A comms sabotage overrides the fake with the vanilla \"signal lost\" screen, so the lie never gives itself away there.</p>",
            de: "<p>Der Button des Manipulators startet ein zeitlich begrenztes Manipulations-Fenster. Solange es läuft, verteilt der <strong>Admin-Tisch</strong> die <em>echte</em> Anzahl lebender Spieler pseudozufällig auf die Räume — jeder Client sieht die <strong>gleiche</strong> Lüge, und sie würfelt sich alle paar Sekunden neu, damit sie lebendig wirkt. <strong>Vitals</strong> zeigt Tote weiterhin als lebendig (Disconnects bleiben markiert). Eine Komms-Sabotage übersteuert den Fake mit dem Vanilla-„signal lost\"-Bildschirm, sodass die Lüge sich dort nie selbst verrät.</p>"
          }
        },
        {
          id: "manipulator-maps",
          title: { en: "Map coverage", de: "Map-Abdeckung" },
          summary: {
            en: "Skeld/Mira: Admin only. Fungle: Vitals only. Polus/Airship: both. Cameras are deliberately not faked.",
            de: "Skeld/Mira: nur Admin. Fungle: nur Vitals. Polus/Airship: beides. Kameras werden bewusst nicht gefälscht."
          },
          body: {
            en: "<p>What the manipulation covers depends on what the map has: <strong>Skeld and Mira HQ</strong> only have Admin, <strong>Fungle</strong> only has Vitals, <strong>Polus and Airship</strong> have both. Security cameras are <strong>deliberately not faked</strong> — a camera showing an empty hallway where someone visibly stands would instantly expose the role.</p>",
            de: "<p>Was die Manipulation abdeckt, hängt von der Map ab: <strong>Skeld und Mira HQ</strong> haben nur Admin, <strong>Fungle</strong> nur Vitals, <strong>Polus und Airship</strong> beides. Überwachungskameras werden <strong>bewusst nicht gefälscht</strong> — eine Kamera, die einen leeren Flur zeigt, in dem sichtbar jemand steht, würde die Rolle sofort entlarven.</p>"
          }
        },
        {
          id: "manipulator-feedback",
          title: { en: "What the Manipulator sees", de: "Was der Manipulator sieht" },
          summary: {
            en: "A private glitch swirl + warp sound on activation and a closing cue when the window ends — invisible and silent to everyone else.",
            de: "Ein privater Glitch-Wirbel + Warp-Sound bei Aktivierung und ein Abschluss-Cue am Fenster-Ende — für alle anderen unsichtbar und lautlos."
          },
          body: {
            en: "<p>On activation the Manipulator gets a short red/violet <strong>glitch swirl</strong> around themselves plus a warp sound, and a distinct closing cue when the fake window runs out. Both are strictly <strong>self-only</strong> — the whole point of the role is that nobody can tell the devices are lying.</p>",
            de: "<p>Bei Aktivierung bekommt der Manipulator einen kurzen rot-violetten <strong>Glitch-Wirbel</strong> um sich selbst plus einen Warp-Sound, und einen eigenen Abschluss-Cue, wenn das Fake-Fenster ausläuft. Beides ist strikt <strong>self-only</strong> — der Kern der Rolle ist ja gerade, dass niemand merkt, dass die Geräte lügen.</p>"
          }
        },
        {
          id: "manipulator-options",
          title: { en: "Options (Impostor tab)", de: "Optionen (Impostor-Tab)" },
          summary: {
            en: "Spawn rate, min players, cooldown, duration, per-device toggles.",
            de: "Spawnrate, Min-Spieler, Cooldown, Dauer, Per-Gerät-Toggles."
          },
          body: {
            en: tbl(["Option", "Default", "What it does"], [
              ["Manipulator", "Off", "Spawn chance for the role."],
              ["Manipulator Minimum Players To Spawn", "6", "The role isn't assigned below this lobby size."],
              ["Manipulation Cooldown", "30", "Seconds between manipulation windows."],
              ["Manipulation Duration", "12", "How long the devices lie per activation."],
              ["Admin Table Shows Fake Positions", "On", "Whether the Admin table is faked."],
              ["Vitals Shows Dead Players As Alive", "On", "Whether Vitals is faked."]
            ]),
            de: tbl(["Option", "Standard", "Funktion"], [
              ["Manipulator", "Off", "Spawn-Chance der Rolle."],
              ["Manipulator Minimum Players To Spawn", "6", "Die Rolle wird unter dieser Lobby-Größe nicht vergeben."],
              ["Manipulation Cooldown", "30", "Sekunden zwischen zwei Manipulations-Fenstern."],
              ["Manipulation Duration", "12", "Wie lange die Geräte pro Aktivierung lügen."],
              ["Admin Table Shows Fake Positions", "On", "Ob der Admin-Tisch gefälscht wird."],
              ["Vitals Shows Dead Players As Alive", "On", "Ob Vitals gefälscht wird."]
            ])
          }
        }
      ]
    },
    {
      id: "scout",
      title: { en: "The Scout (Crewmate)", de: "The Scout (Crewmate)" },
      intro: {
        en: "A normal Crewmate is secretly promoted to The Scout at game start. On demand, the Scout can activate a short ability that makes them transparent and fast — and while it's active, lights or sabotage never cut their vision.",
        de: "Ein normaler Crewmate wird beim Spielstart heimlich zum Scout befördert. Auf Abruf kann der Scout eine kurze Fähigkeit aktivieren, die ihn transparent und schnell macht — und solange sie aktiv ist, schneiden Lichter oder Sabotage seine Sicht nie."
      },
      entries: [
        {
          id: "scout-ability",
          title: { en: "Activatable ability", de: "Aktivierbare Fähigkeit" },
          summary: {
            en: "Press the ability button to turn transparent and gain a speed boost for a limited time.",
            de: "Den Fähigkeits-Button drücken, um für begrenzte Zeit transparent zu werden und einen Geschwindigkeitsschub zu erhalten."
          },
          body: {
            en: "<p>The Scout presses an ability button, subject to a cooldown, to become <strong>transparent</strong> and gain a <strong>speed multiplier</strong> for <strong>Ability Duration</strong> seconds, then the effect ends and the cooldown starts again.</p>",
            de: "<p>Der Scout drückt einen Fähigkeits-Button (mit Cooldown), um für <strong>Ability Duration</strong> Sekunden <strong>transparent</strong> zu werden und einen <strong>Geschwindigkeits-Multiplikator</strong> zu erhalten; danach endet der Effekt und der Cooldown beginnt erneut.</p>"
          }
        },
        {
          id: "scout-vision",
          title: { en: "Vision immune to lights & sabotage", de: "Sicht immun gegen Lichter & Sabotage" },
          summary: {
            en: "While the ability is active, the usual vision penalty from a lights sabotage simply doesn't apply.",
            de: "Solange die Fähigkeit aktiv ist, greift die übliche Sichteinschränkung durch eine Licht-Sabotage einfach nicht."
          },
          body: {
            en: "<p>While the ability is active, the normal vision reduction from a lights sabotage (or any other darkness effect) is bypassed — the Scout keeps their full <strong>Transparency</strong>-adjusted vision regardless.</p>",
            de: "<p>Solange die Fähigkeit aktiv ist, wird die normale Sichtreduzierung durch eine Licht-Sabotage (oder jeden anderen Dunkelheits-Effekt) umgangen — der Scout behält trotzdem seine volle, per <strong>Transparency</strong> angepasste Sicht.</p>"
          }
        },
        {
          id: "scout-options",
          title: { en: "Options (Crewmate tab)", de: "Optionen (Crewmate-Tab)" },
          summary: {
            en: "Spawn rate, min players, ability duration, cooldown, speed multiplier, transparency.",
            de: "Spawnrate, Min-Spieler, Fähigkeitsdauer, Cooldown, Geschwindigkeits-Multiplikator, Transparenz."
          },
          body: {
            en: tbl(["Option", "Default", "What it does"], [
              ["Scout", "Off", "Spawn chance for the role."],
              ["Scout Minimum Players To Spawn", "6", "The role isn't assigned below this lobby size."],
              ["Scout Ability Duration", "5 s", "How long the transparent + fast state lasts."],
              ["Scout Ability Cooldown", "30 s", "Cooldown between activations."],
              ["Scout Speed Multiplier", "1.5", "Speed multiplier while the ability is active."],
              ["Scout Transparency", "0.5", "Transparency level while the ability is active."]
            ]),
            de: tbl(["Option", "Standard", "Funktion"], [
              ["Scout", "Off", "Spawn-Chance der Rolle."],
              ["Scout Minimum Players To Spawn", "6", "Die Rolle wird unter dieser Lobby-Größe nicht vergeben."],
              ["Scout Ability Duration", "5 s", "Wie lange der transparent-schnelle Zustand anhält."],
              ["Scout Ability Cooldown", "30 s", "Cooldown zwischen Aktivierungen."],
              ["Scout Speed Multiplier", "1,5", "Geschwindigkeits-Multiplikator, während die Fähigkeit aktiv ist."],
              ["Scout Transparency", "0,5", "Transparenzgrad, während die Fähigkeit aktiv ist."]
            ])
          }
        }
      ]
    },
    {
      id: "beacon",
      title: { en: "The Beacon (Crewmate)", de: "The Beacon (Crewmate)" },
      intro: {
        en: "A normal Crewmate is secretly promoted to The Beacon at game start. A lights sabotage never reduces the Beacon's own vision, and nearby crewmates share the Beacon's full vision too.",
        de: "Ein normaler Crewmate wird beim Spielstart heimlich zum Beacon befördert. Eine Licht-Sabotage verringert die Sicht des Beacon selbst nie, und nahe Crewmitglieder teilen sich die volle Sicht des Beacon."
      },
      entries: [
        {
          id: "beacon-vision",
          title: { en: "Immune to lights", de: "Immun gegen Lichter" },
          summary: {
            en: "The Beacon's own vision is never reduced by a lights sabotage.",
            de: "Die eigene Sicht des Beacon wird durch eine Licht-Sabotage nie verringert."
          },
          body: {
            en: "<p>Whenever lights are sabotaged, the Beacon is simply unaffected — their vision radius always stays at its normal, non-sabotaged value.</p>",
            de: "<p>Wird das Licht sabotiert, ist der Beacon davon einfach nicht betroffen — sein Sichtradius bleibt immer auf dem normalen, nicht sabotierten Wert.</p>"
          }
        },
        {
          id: "beacon-share",
          title: { en: "Sharing vision with nearby crew", de: "Sicht mit naher Crew teilen" },
          summary: {
            en: "Crewmates within Share Radius of the Beacon see with the Beacon's full, unreduced vision too.",
            de: "Crewmitglieder innerhalb der Share Radius um den Beacon sehen ebenfalls mit dessen voller, ungekürzter Sicht."
          },
          body: {
            en: "<p>Any crewmate within the <strong>Share Radius</strong> of the Beacon has their own vision boosted to match the Beacon's — including during a lights sabotage, since the Beacon itself is unaffected.</p>",
            de: "<p>Jedes Crewmitglied innerhalb der <strong>Share Radius</strong> um den Beacon bekommt seine eigene Sicht auf das Niveau des Beacon angehoben — auch während einer Licht-Sabotage, da der Beacon selbst davon nicht betroffen ist.</p>"
          }
        },
        {
          id: "beacon-options",
          title: { en: "Options (Crewmate tab)", de: "Optionen (Crewmate-Tab)" },
          summary: {
            en: "Spawn rate, min players, share radius, guesser exemption.",
            de: "Spawnrate, Min-Spieler, Teil-Radius, Rate-Ausnahme."
          },
          body: {
            en: tbl(["Option", "Default", "What it does"], [
              ["Beacon", "Off", "Spawn chance for the role."],
              ["Beacon Minimum Players To Spawn", "6", "The role isn't assigned below this lobby size."],
              ["Beacon Share Radius", "5.0", "Range in world units within which nearby crew share the Beacon's vision."],
              ["Beacon Not Guessable", "Off", "Excludes the Beacon from guessing (if the Guesser role is enabled)."]
            ]),
            de: tbl(["Option", "Standard", "Funktion"], [
              ["Beacon", "Off", "Spawn-Chance der Rolle."],
              ["Beacon Minimum Players To Spawn", "6", "Die Rolle wird unter dieser Lobby-Größe nicht vergeben."],
              ["Beacon Share Radius", "5,0", "Reichweite in Welteinheiten, innerhalb derer nahe Crew die Sicht des Beacon teilt."],
              ["Beacon Not Guessable", "Off", "Schließt den Beacon vom Raten aus (falls die Guesser-Rolle aktiviert ist)."]
            ])
          }
        }
      ]
    },
    {
      id: "bug",
      title: { en: "The Bug (Neutral)", de: "The Bug (Neutral)" },
      intro: {
        en: "A normal player is secretly turned into The Bug at game start. The Bug's only goal is to survive to the end of the game and win alone. The moment a team (Crewmate, Impostor or Jackal) would normally win while the Bug is still alive, the Bug steals the victory for itself instead.",
        de: "Ein normaler Spieler wird beim Spielstart heimlich zum Bug. Das einzige Ziel des Bug ist es, bis zum Spielende zu überleben und ALLEIN zu gewinnen. Sobald ein Team (Crewmate, Impostor oder Jackal) eigentlich gewinnen würde und der Bug noch lebt, stiehlt der Bug stattdessen den Sieg für sich selbst."
      },
      entries: [
        {
          id: "bug-win",
          title: { en: "Stealing the win", de: "Den Sieg stehlen" },
          summary: {
            en: "Whichever team would otherwise win, a still-living Bug hijacks the outcome into a solo win.",
            de: "Egal welches Team eigentlich gewinnen würde — ein noch lebender Bug kappert das Ergebnis zu einem Solo-Sieg."
          },
          body: {
            en: "<p>The Bug has no faction of its own. It simply needs to be <strong>alive</strong> at the moment a <strong>team win</strong> triggers — Crewmate (tasks/votes), Impostor (kills/sabotage) or the Jackal team. That win is rewritten so the <strong>Bug wins alone</strong> instead. Neutral solo wins (Jester, Arsonist, Vulture, Lovers, Prosecutor, …) are <strong>not</strong> stolen — they resolve normally.</p>",
            de: "<p>Der Bug gehört keiner Fraktion an. Er muss lediglich in dem Moment, in dem ein <strong>Team-Sieg</strong> eintritt, noch <strong>am Leben</strong> sein — Crewmate (Tasks/Votes), Impostor (Kills/Sabotage) oder das Jackal-Team. Dieser Sieg wird umgeschrieben, sodass stattdessen <strong>der Bug allein gewinnt</strong>. Neutrale Solo-Siege (Jester, Arsonist, Vulture, Lovers, Prosecutor, …) werden <strong>nicht</strong> gestohlen — sie werden normal gewertet.</p>"
          }
        },
        {
          id: "bug-glitch",
          title: { en: "Glitchy victory screen", de: "Glitchiger Sieg-Bildschirm" },
          summary: {
            en: "Optional visual glitch effects sell the \"error in the system\" theme on the Bug's win screen.",
            de: "Optionale visuelle Glitch-Effekte unterstreichen das „Fehler im System\"-Thema auf dem Sieg-Bildschirm des Bug."
          },
          body: {
            en: "<p>When the Bug steals the win, an optional glitch effect (screen tearing, static, corrupted text) can be layered onto the victory screen to sell the idea that the Bug is a glitch in the game itself rather than a proper role.</p>",
            de: "<p>Stiehlt der Bug den Sieg, kann optional ein Glitch-Effekt (Bildstörung, Rauschen, verzerrter Text) über den Sieg-Bildschirm gelegt werden, um die Idee zu unterstreichen, dass der Bug ein Fehler im Spiel selbst ist statt einer richtigen Rolle.</p>"
          }
        },
        {
          id: "bug-options",
          title: { en: "Options (Neutral tab)", de: "Optionen (Neutral-Tab)" },
          summary: {
            en: "Spawn rate, min players.",
            de: "Spawnrate, Min-Spieler."
          },
          body: {
            en: tbl(["Option", "Default", "What it does"], [
              ["Bug", "Off", "Spawn chance for the role."],
              ["Bug Minimum Players To Spawn", "6", "The role isn't assigned below this lobby size."]
            ]),
            de: tbl(["Option", "Standard", "Funktion"], [
              ["Bug", "Off", "Spawn-Chance der Rolle."],
              ["Bug Minimum Players To Spawn", "6", "Die Rolle wird unter dieser Lobby-Größe nicht vergeben."]
            ])
          }
        }
      ]
    },
    {
      id: "follower",
      title: { en: "The Follower (Neutral)", de: "The Follower (Neutral)" },
      intro: {
        en: "A normal player is secretly turned into The Follower at game start. The moment the first other player dies, the Follower fully inherits that player's role — team, ability and win condition included, whether that role was Impostor, Crewmate or Neutral.",
        de: "Ein normaler Spieler wird beim Spielstart heimlich zum Follower. Sobald der erste andere Spieler stirbt, übernimmt der Follower dessen Rolle vollständig — inklusive Team, Fähigkeit und Siegbedingung, egal ob diese Rolle Impostor, Crewmate oder Neutral war."
      },
      entries: [
        {
          id: "follower-inherit",
          title: { en: "Inheriting the first death's role", de: "Die Rolle des ersten Toten übernehmen" },
          summary: {
            en: "Whoever dies first in the game, the Follower becomes them — same team, same ability, same win condition.",
            de: "Wer im Spiel auch zuerst stirbt — der Follower wird zu ihm: gleiches Team, gleiche Fähigkeit, gleiche Siegbedingung."
          },
          body: {
            en: "<p>The Follower waits for the <strong>first player to die</strong>, by any cause. At that moment, the Follower fully <strong>becomes</strong> that role: same faction, same abilities and buttons, same win condition — including becoming an Impostor with kill access, or another Neutral role with its own goal. Only the very first death counts; later deaths change nothing.</p>",
            de: "<p>Der Follower wartet auf den <strong>ersten sterbenden Spieler</strong>, gleich aus welchem Grund. In diesem Moment <strong>wird</strong> der Follower vollständig zu dieser Rolle: gleiche Fraktion, gleiche Fähigkeiten und Buttons, gleiche Siegbedingung — bis hin dazu, selbst Impostor mit Kill-Zugriff zu werden, oder eine andere Neutrale Rolle mit eigenem Ziel. Nur der allererste Tod zählt; spätere Tode ändern nichts mehr.</p>"
          }
        },
        {
          id: "follower-options",
          title: { en: "Options (Neutral tab)", de: "Optionen (Neutral-Tab)" },
          summary: {
            en: "Spawn rate, min players.",
            de: "Spawnrate, Min-Spieler."
          },
          body: {
            en: tbl(["Option", "Default", "What it does"], [
              ["Follower", "Off", "Spawn chance for the role."],
              ["Follower Minimum Players To Spawn", "6", "The role isn't assigned below this lobby size."]
            ]),
            de: tbl(["Option", "Standard", "Funktion"], [
              ["Follower", "Off", "Spawn-Chance der Rolle."],
              ["Follower Minimum Players To Spawn", "6", "Die Rolle wird unter dieser Lobby-Größe nicht vergeben."]
            ])
          }
        }
      ]
    },
    {
      id: "copycat",
      title: { en: "The Copycat (Neutral)", de: "The Copycat (Neutral)" },
      intro: {
        en: "A normal player is secretly turned into The Copycat at game start. The Copycat learns abilities by witnessing them in use — Camouflage, Morph, Shield, Shoot and Vent — and each learned ability becomes its own button. It wins together with whichever side wins the game, as long as it's alive and has used enough of its learned abilities.",
        de: "Ein normaler Spieler wird beim Spielstart heimlich zum Copycat. Der Copycat lernt Fähigkeiten, indem er sie mitbekommt — Camouflage, Morph, Shield, Shoot und Vent —, und jede gelernte Fähigkeit wird zu einem eigenen Button. Er gewinnt mit der siegreichen Seite, solange er am Leben ist und genug seiner gelernten Fähigkeiten benutzt hat."
      },
      entries: [
        {
          id: "copycat-learn",
          title: { en: "Learning by witnessing", de: "Lernen durch Mitbekommen" },
          summary: {
            en: "See another player use Camouflage, Morph, Shield, Shoot or Vent, and the Copycat learns it — up to a stored maximum.",
            de: "Sieht der Copycat, wie ein anderer Spieler Camouflage, Morph, Shield, Shoot oder Vent benutzt, lernt er es — bis zu einem gespeicherten Maximum."
          },
          body: {
            en: "<p>Whenever the Copycat witnesses another player use one of the tracked abilities — <strong>Camouflage</strong>, <strong>Morph</strong>, <strong>Shield</strong> (unkillable), <strong>Shoot</strong> (Sheriff-style, with the usual backfire against Crewmates) or <strong>Vent</strong> (vent access) — the Copycat learns it and gains a button for it, up to <strong>Max Stored Abilities</strong> at once.</p>",
            de: "<p>Immer wenn der Copycat mitbekommt, dass ein anderer Spieler eine der beobachteten Fähigkeiten benutzt — <strong>Camouflage</strong>, <strong>Morph</strong>, <strong>Shield</strong> (unkillbar), <strong>Shoot</strong> (Sheriff-artig, mit dem üblichen Backfire gegen Crewmates) oder <strong>Vent</strong> (Lüftungszugriff) —, lernt der Copycat sie und erhält dafür einen Button, bis zu <strong>Max Stored Abilities</strong> gleichzeitig.</p>"
          }
        },
        {
          id: "copycat-win",
          title: { en: "Winning with the winning team", de: "Gewinnen mit dem siegreichen Team" },
          summary: {
            en: "The Copycat has no team of its own — it wins alongside whoever wins, provided it's alive and has used enough learned abilities.",
            de: "Der Copycat hat kein eigenes Team — er gewinnt zusammen mit den Siegern, sofern er lebt und genug gelernte Fähigkeiten benutzt hat."
          },
          body: {
            en: "<p>The Copycat doesn't belong to the Impostors, the Crewmates or any other Neutral faction. At game end, if the Copycat is still <strong>alive</strong> and has actually <strong>used</strong> at least <strong>Abilities Needed To Win</strong> of its learned abilities during the game, it wins together with whichever side the game declares victorious.</p>",
            de: "<p>Der Copycat gehört weder den Impostoren noch der Crew noch einer anderen Neutralen Fraktion an. Ist der Copycat am Spielende noch <strong>am Leben</strong> und hat im Spielverlauf tatsächlich mindestens <strong>Abilities Needed To Win</strong> seiner gelernten Fähigkeiten <strong>benutzt</strong>, gewinnt er zusammen mit der Seite, die das Spiel für sich entscheidet.</p>"
          }
        },
        {
          id: "copycat-options",
          title: { en: "Options (Neutral tab)", de: "Optionen (Neutral-Tab)" },
          summary: {
            en: "Spawn rate, min players, max stored abilities, tasks, abilities needed to win.",
            de: "Spawnrate, Min-Spieler, max. gespeicherte Fähigkeiten, Tasks, benötigte Fähigkeiten zum Sieg."
          },
          body: {
            en: tbl(["Option", "Default", "What it does"], [
              ["Copycat", "Off", "Spawn chance for the role."],
              ["Copycat Minimum Players To Spawn", "6", "The role isn't assigned below this lobby size."],
              ["Copycat Max Stored Abilities", "3", "How many learned abilities the Copycat can hold at once."],
              ["Copycat Has Tasks", "On", "Whether the Copycat is given tasks like a Crewmate."],
              ["Copycat Abilities Needed To Win", "1", "How many learned abilities must be used before the Copycat can win with the winning team."]
            ]),
            de: tbl(["Option", "Standard", "Funktion"], [
              ["Copycat", "Off", "Spawn-Chance der Rolle."],
              ["Copycat Minimum Players To Spawn", "6", "Die Rolle wird unter dieser Lobby-Größe nicht vergeben."],
              ["Copycat Max Stored Abilities", "3", "Wie viele gelernte Fähigkeiten der Copycat gleichzeitig speichern kann."],
              ["Copycat Has Tasks", "On", "Ob der Copycat wie ein Crewmate Tasks bekommt."],
              ["Copycat Abilities Needed To Win", "1", "Wie viele gelernte Fähigkeiten benutzt sein müssen, damit der Copycat mit dem siegreichen Team gewinnen kann."]
            ])
          }
        }
      ]
    },
    {
      id: "collector",
      title: { en: "The Collector (Neutral)", de: "The Collector (Neutral)" },
      intro: {
        en: "A neutral relic hunter. Hidden relics are scattered across the map — only the Collector can see them clearly. Collect enough and the Collector wins alone.",
        de: "Ein neutraler Relikt-Jäger. Versteckte Relikte sind über die Map verteilt — nur der Collector sieht sie klar. Wer genug sammelt, gewinnt allein."
      },
      entries: [
        {
          id: "collector-relics",
          title: { en: "Relics on the map", de: "Relikte auf der Map" },
          summary: {
            en: "The host scatters relics at task-console anchors (map-agnostic, never at critical consoles). Collector sees them fully, the dead almost fully, Impostors optionally sense a faint shimmer — plain crew sees nothing.",
            de: "Der Host streut Relikte an Task-Konsolen-Ankern (map-agnostisch, nie an kritischen Konsolen). Der Collector sieht sie voll, Tote fast voll, Impostoren spüren optional einen schwachen Schimmer — normale Crew sieht nichts."
          },
          body: {
            en: "<p>At round start the host scatters golden crystal relics anchored to task consoles — works on every map (Skeld, Mira HQ, Polus, Airship, Fungle, Submerged), always excluding critical sabotage consoles and the emergency button, with a relaxing minimum spread so they don't clump. Visibility follows the role: the <strong>Collector</strong> sees relics fully, <strong>dead players</strong> see them slightly dimmed, and <strong>Impostors</strong> can optionally sense a faint shimmer within a radius. Regular crew never sees them. Extra relics can spawn as the crew finishes tasks (option), optionally raising the needed count with each one.</p>",
            de: "<p>Beim Rundenstart streut der Host goldene Kristall-Relikte an Task-Konsolen-Ankern — funktioniert auf jeder Map (Skeld, Mira HQ, Polus, Airship, Fungle, Submerged), immer unter Ausschluss kritischer Sabotage-Konsolen und des Notfallknopfs, mit sich lockerndem Mindestabstand gegen Klumpenbildung. Die Sichtbarkeit folgt der Rolle: Der <strong>Collector</strong> sieht Relikte voll, <strong>Tote</strong> leicht gedimmt, und <strong>Impostoren</strong> können optional einen schwachen Schimmer im Radius spüren. Normale Crew sieht sie nie. Zusätzliche Relikte können spawnen, während die Crew Tasks erledigt (Option), wobei optional jedes das Sammelziel erhöht.</p>"
          }
        },
        {
          id: "collector-collecting",
          title: { en: "Collecting is a channel", de: "Sammeln ist eine Kanalisierung" },
          summary: {
            en: "Standing at a relic and channeling for a few seconds collects it — moving breaks the channel. The pickup sparkle + sound is visible to everyone nearby, on purpose.",
            de: "Am Relikt stehen und ein paar Sekunden kanalisieren sammelt es ein — Bewegung bricht ab. Das Einsammel-Glitzern + der Sound sind für alle in der Nähe wahrnehmbar, mit Absicht."
          },
          body: {
            en: "<p>Collecting takes a <strong>channel</strong> (configurable duration) during which the crystal pulses — moving away breaks it, and a cooldown gates back-to-back grabs. The moment a relic is collected, a golden <strong>pickup burst</strong> and a distance-attenuated chime play for everyone near that spot: that tell is deliberate counterplay, because plain crew otherwise has no way to interact with the relic hunt.</p>",
            de: "<p>Das Einsammeln braucht eine <strong>Kanalisierung</strong> (konfigurierbare Dauer), während der der Kristall pulsiert — Weggehen bricht ab, und ein Cooldown verhindert Kette-Sammeln. Im Moment des Einsammelns spielen ein goldener <strong>Pickup-Burst</strong> und ein distanzbasierter Chime für alle in der Nähe: Dieser Tell ist bewusstes Counterplay, weil normale Crew sonst keinerlei Berührungspunkt mit der Relikt-Jagd hätte.</p>"
          }
        },
        {
          id: "collector-win",
          title: { en: "Winning", de: "Gewinnen" },
          summary: {
            en: "Instant win on the last relic, or Survive-To-End mode where the Collector hijacks the end screen if still alive — with its own \"Collector Wins\" banner and gold fanfare.",
            de: "Sofort-Sieg beim letzten Relikt, oder Survive-To-End-Modus, in dem der Collector das Spielende kapert, wenn er noch lebt — mit eigenem „Collector Wins\"-Banner und Gold-Fanfare."
          },
          body: {
            en: "<p>Two win modes: <strong>Instantly</strong> ends the game the moment the last needed relic is collected. <strong>Survive To The End</strong> arms the Collector instead — if they are still alive when any team would win, the Collector steals that win (the same hijack mechanic the Bug uses). Either way the end screen shows a dedicated <strong>Collector Wins</strong> banner with a gold fanfare. In Survive mode the Collector gets a private golden aura as a reminder that they are now a live win condition.</p>",
            de: "<p>Zwei Sieg-Modi: <strong>Instantly</strong> beendet das Spiel im Moment des letzten benötigten Relikts. <strong>Survive To The End</strong> schärft den Collector stattdessen scharf — lebt er noch, wenn ein Team gewinnen würde, stiehlt der Collector diesen Sieg (dieselbe Hijack-Mechanik wie beim Bug). In beiden Fällen zeigt der Endscreen ein eigenes <strong>Collector Wins</strong>-Banner mit Gold-Fanfare. Im Survive-Modus bekommt der Collector eine private goldene Aura als Erinnerung, dass er jetzt eine scharfe Sieg-Bedingung ist.</p>"
          }
        },
        {
          id: "collector-options",
          title: { en: "Options (Neutral tab)", de: "Optionen (Neutral-Tab)" },
          summary: {
            en: "Spawn rate, relic counts, channel duration, win mode, impostor sense, tasks, cooldown, extra relics.",
            de: "Spawnrate, Relikt-Zahlen, Kanalisierungs-Dauer, Sieg-Modus, Impostor-Gespür, Tasks, Cooldown, Extra-Relikte."
          },
          body: {
            en: tbl(["Option", "Default", "What it does"], [
              ["Collector", "Off", "Spawn chance for the role."],
              ["Collector Minimum Players To Spawn", "6", "The role isn't assigned below this lobby size."],
              ["Relics Spawned On The Map", "6", "How many relics are scattered at round start."],
              ["Relics Needed To Win", "4", "How many the Collector must collect."],
              ["Collecting Duration", "3", "Channel time per relic (seconds)."],
              ["Collector Win", "Instantly", "Instantly / Survive To The End."],
              ["Impostors Sense Nearby Relics", "Off", "Whether Impostors see a faint shimmer near relics."],
              ["Relic Sense Radius", "5", "Radius of the Impostor shimmer."],
              ["Collector Has Tasks", "Off", "Whether the Collector is given (non-counting) tasks as cover."],
              ["Collect Cooldown", "15", "Seconds between two collects."],
              ["New Relic Every X Crew Tasks (0 = Off)", "0", "Spawns an extra relic per X completed crew tasks."],
              ["Extra Relics Raise The Needed Count", "On", "Each extra relic also raises the win requirement by one."]
            ]),
            de: tbl(["Option", "Standard", "Funktion"], [
              ["Collector", "Off", "Spawn-Chance der Rolle."],
              ["Collector Minimum Players To Spawn", "6", "Die Rolle wird unter dieser Lobby-Größe nicht vergeben."],
              ["Relics Spawned On The Map", "6", "Wie viele Relikte beim Rundenstart verteilt werden."],
              ["Relics Needed To Win", "4", "Wie viele der Collector sammeln muss."],
              ["Collecting Duration", "3", "Kanalisierungs-Zeit pro Relikt (Sekunden)."],
              ["Collector Win", "Instantly", "Instantly / Survive To The End."],
              ["Impostors Sense Nearby Relics", "Off", "Ob Impostoren nahe Relikte als schwachen Schimmer sehen."],
              ["Relic Sense Radius", "5", "Radius des Impostor-Schimmers."],
              ["Collector Has Tasks", "Off", "Ob der Collector (nicht zählende) Tasks als Tarnung bekommt."],
              ["Collect Cooldown", "15", "Sekunden zwischen zwei Sammel-Vorgängen."],
              ["New Relic Every X Crew Tasks (0 = Off)", "0", "Spawnt ein Extra-Relikt je X erledigter Crew-Tasks."],
              ["Extra Relics Raise The Needed Count", "On", "Jedes Extra-Relikt erhöht auch das Sammelziel um eins."]
            ])
          }
        }
      ]
    },
    {
      id: "poltergeist",
      title: { en: "The Poltergeist (Ghost)", de: "The Poltergeist (Geist)" },
      intro: {
        en: "Not a starting role: the first player to die rises as The Poltergeist and keeps haunting for their original team. Abilities run on an energy pool instead of cooldowns.",
        de: "Keine Startrolle: Der erste Tote steigt als Poltergeist auf und spukt für sein ursprüngliches Team weiter. Die Fähigkeiten laufen über einen Energie-Pool statt über Cooldowns."
      },
      entries: [
        {
          id: "poltergeist-rise",
          title: { en: "Rising as the Poltergeist", de: "Als Poltergeist aufsteigen" },
          summary: {
            en: "The first death (kills; exile optional) becomes the Poltergeist, keeps their team and win condition, and gets a private rise flash + ghost aura.",
            de: "Der erste Tod (Kills; Exil optional) wird zum Poltergeist, behält Team und Sieg-Bedingung und bekommt einen privaten Aufstiegs-Flash + Geist-Aura."
          },
          body: {
            en: "<p>The first player to die rises as the Poltergeist — a dead crewmate haunts for the crew, a dead Impostor for the Impostors; the original win condition stays. Whether an exile counts as the first death is an option, as is whether a crew-side Poltergeist keeps its tasks. Only the Poltergeist sees its own faint violet ghost aura; nobody else learns the role exists until it acts. Energy regenerates over time (never in meetings) and every ability costs energy instead of running on a cooldown.</p>",
            de: "<p>Der erste Tote steigt als Poltergeist auf — ein toter Crewmate spukt für die Crew, ein toter Impostor für die Impostoren; die ursprüngliche Sieg-Bedingung bleibt. Ob Exil als erster Tod zählt, ist eine Option, ebenso ob ein Crew-Poltergeist seine Tasks behält. Nur der Poltergeist sieht seine eigene schwach-violette Geist-Aura; niemand sonst erfährt von der Rolle, bis sie handelt. Energie regeneriert über Zeit (nie in Meetings), und jede Fähigkeit kostet Energie statt über einen Cooldown zu laufen.</p>"
          }
        },
        {
          id: "poltergeist-manifest",
          title: { en: "Manifestation", de: "Manifestation" },
          summary: {
            en: "Appear as a copy of a living player (template pickable via K) — a framing tool. Killing the manifest just pops it: a reveal burst, no body.",
            de: "Als Kopie eines lebenden Spielers erscheinen (Vorlage per K wählbar) — ein Framing-Werkzeug. Ein Kill auf den Manifest lässt ihn nur zerplatzen: Reveal-Burst, keine Leiche."
          },
          body: {
            en: "<p>The expensive ability: the Poltergeist materializes as a <strong>copy of a living player</strong> (nearest by default, template selectable with <strong>K</strong>) — walking around as someone else is a pure framing tool. The manifest cannot kill, report or call meetings; venting is an option. If an Impostor \"kills\" the manifest, it bursts in a sharp reveal effect with <strong>no body</strong> — and the killer's cooldown refund (none / half / full) is an option. A meeting ends the manifestation instantly and silently.</p>",
            de: "<p>Die teure Fähigkeit: Der Poltergeist materialisiert sich als <strong>Kopie eines lebenden Spielers</strong> (standardmäßig der nächste, Vorlage per <strong>K</strong> wählbar) — als jemand anderes herumzulaufen ist ein reines Framing-Werkzeug. Der Manifest kann nicht killen, melden oder Meetings einberufen; Venten ist eine Option. „Killt\" ein Impostor den Manifest, zerplatzt er in einem scharfen Reveal-Effekt <strong>ohne Leiche</strong> — die Cooldown-Erstattung des Killers (keine / halb / voll) ist eine Option. Ein Meeting beendet die Manifestation sofort und lautlos.</p>"
          }
        },
        {
          id: "poltergeist-door",
          title: { en: "Door Haunt", de: "Tür-Spuk" },
          summary: {
            en: "Cheaply slams the nearest single door shut for a few seconds — with an audible, position-based slam. Mira HQ has no doors, so the button grays out there.",
            de: "Schließt günstig die nächste einzelne Tür für ein paar Sekunden — mit hörbarem, positionsbasiertem Zuschlagen. Mira HQ hat keine Türen, dort ist der Button ausgegraut."
          },
          body: {
            en: "<p>The cheap bread-and-butter ability: the nearest <strong>single door</strong> slams shut for a configurable duration, with an in-rushing wisp burst and a distance-attenuated slam everyone nearby can hear — spooky, but locally verifiable. On Mira HQ (no doors) the button is grayed out.</p>",
            de: "<p>Die günstige Brot-und-Butter-Fähigkeit: Die nächste <strong>einzelne Tür</strong> knallt für eine konfigurierbare Dauer zu, mit einem einwärts strömenden Wisp-Burst und einem distanzbasierten Zuschlagen, das jeder in der Nähe hört — gruselig, aber lokal nachprüfbar. Auf Mira HQ (keine Türen) ist der Button ausgegraut.</p>"
          }
        },
        {
          id: "poltergeist-hand",
          title: { en: "Ghost Hand", de: "Geisterhand" },
          summary: {
            en: "Channel at reactor/seismic to count as one hand — draining energy per second, with a visible channel ring as counterplay.",
            de: "An Reaktor/Seismic kanalisieren und als eine Hand zählen — kostet Energie pro Sekunde, mit sichtbarem Channel-Ring als Counterplay."
          },
          body: {
            en: "<p>During a reactor/seismic sabotage the Poltergeist can hold a console and count as <strong>one</strong> of the two required hands (never both). It drains energy per second, and a pulsing cyan <strong>channel ring</strong> is visible at the spot for everyone nearby — the crew can see that \"something\" is helping (or, for an Impostor-side Poltergeist, blocking a slot).</p>",
            de: "<p>Während einer Reaktor-/Seismic-Sabotage kann der Poltergeist eine Konsole halten und als <strong>eine</strong> der zwei benötigten Hände zählen (nie beide). Das kostet Energie pro Sekunde, und ein pulsierender cyaner <strong>Channel-Ring</strong> ist an der Stelle für alle in der Nähe sichtbar — die Crew sieht, dass „etwas\" mithilft (bzw. bei einem Impostor-Poltergeist einen Slot blockiert).</p>"
          }
        },
        {
          id: "poltergeist-hex",
          title: { en: "Hex", de: "Hex" },
          summary: {
            en: "Curses the nearest living player with a cyclable effect: speed boost, blindness or night vision — with a cast burst, a vignette for the victim and a quiet expiry chime.",
            de: "Verflucht den nächsten Lebenden mit einem durchschaltbaren Effekt: Speed-Boost, Blindheit oder Nachtsicht — mit Cast-Burst, Vignette für das Opfer und leisem Auslauf-Chime."
          },
          body: {
            en: "<p>The Hex curses the nearest living player with one of three cyclable effects (each individually allowed via options): <strong>speed boost</strong>, <strong>blindness</strong> or <strong>night vision</strong>. The cast shows a sparkle burst at the target with a position-based sound. A blinded/night-vision victim gets a subtle violet screen vignette so the curse is distinguishable from a lights sabotage; while the hex runs, a quiet orbiting halo marks the target — visible only to the victim, the Poltergeist and the dead. It dissolves with a small burst and chime when the hex expires.</p>",
            de: "<p>Der Hex verflucht den nächsten Lebenden mit einem von drei durchschaltbaren Effekten (jeder einzeln per Option erlaubt): <strong>Speed-Boost</strong>, <strong>Blindheit</strong> oder <strong>Nachtsicht</strong>. Der Cast zeigt einen Funkel-Burst am Ziel mit positionsbasiertem Sound. Ein geblendetes/nachtsichtiges Opfer bekommt eine dezente violette Bildschirm-Vignette, damit der Fluch von einer Licht-Sabotage unterscheidbar ist; solange der Hex läuft, markiert ein leiser orbitierender Halo das Ziel — sichtbar nur für das Opfer, den Poltergeist und Tote. Beim Auslaufen löst er sich mit kleinem Burst und Chime auf.</p>"
          }
        },
        {
          id: "poltergeist-options",
          title: { en: "Options (Neutral tab)", de: "Optionen (Neutral-Tab)" },
          summary: {
            en: "Spawn rate, energy pool, per-ability costs and durations, hex toggles, tasks.",
            de: "Spawnrate, Energie-Pool, Kosten und Dauern pro Fähigkeit, Hex-Toggles, Tasks."
          },
          body: {
            en: tbl(["Option", "Default", "What it does"], [
              ["Poltergeist", "Off", "Spawn chance for the role."],
              ["Poltergeist Minimum Players To Spawn", "6", "The role isn't assigned below this lobby size."],
              ["Exile Counts As First Death", "Off", "Whether a voted-out player can rise as the Poltergeist."],
              ["Poltergeist Energy Maximum", "100", "Size of the energy pool."],
              ["Energy Regeneration Per Second", "3", "Regen rate (never regenerates during meetings)."],
              ["Starting Energy (%)", "50", "Energy on rising."],
              ["Manifest Energy Cost", "60", "Cost of a manifestation."],
              ["Manifest Duration", "12", "Seconds the manifest lasts."],
              ["Manifested Poltergeist Can Vent", "On", "Whether the manifest can use vents."],
              ["Killing A Manifest Refunds Kill Cooldown", "No Refund", "No / Half / Full refund for the fooled killer."],
              ["Door Haunt Energy Cost", "20", "Cost per door slam."],
              ["Door Haunt Duration", "8", "Seconds the door stays shut."],
              ["Ghost Hand Energy Drain Per Second", "5", "Channel cost at reactor/seismic."],
              ["Hex Energy Cost", "35", "Cost per hex."],
              ["Hex Duration", "10", "Seconds a hex lasts."],
              ["Hex: Speed Boost / Blindness / Night Vision Allowed", "On / On / On", "Which hex effects are in the rotation."],
              ["Poltergeist Keeps Its Tasks", "Off", "Whether a crew-side Poltergeist still counts for taskwin."]
            ]),
            de: tbl(["Option", "Standard", "Funktion"], [
              ["Poltergeist", "Off", "Spawn-Chance der Rolle."],
              ["Poltergeist Minimum Players To Spawn", "6", "Die Rolle wird unter dieser Lobby-Größe nicht vergeben."],
              ["Exile Counts As First Death", "Off", "Ob ein rausgewählter Spieler als Poltergeist aufsteigen kann."],
              ["Poltergeist Energy Maximum", "100", "Größe des Energie-Pools."],
              ["Energy Regeneration Per Second", "3", "Regenerationsrate (nie während Meetings)."],
              ["Starting Energy (%)", "50", "Energie beim Aufstieg."],
              ["Manifest Energy Cost", "60", "Kosten einer Manifestation."],
              ["Manifest Duration", "12", "Sekunden, die der Manifest hält."],
              ["Manifested Poltergeist Can Vent", "On", "Ob der Manifest Vents nutzen kann."],
              ["Killing A Manifest Refunds Kill Cooldown", "No Refund", "Keine / halbe / volle Erstattung für den getäuschten Killer."],
              ["Door Haunt Energy Cost", "20", "Kosten pro Tür-Spuk."],
              ["Door Haunt Duration", "8", "Sekunden, die die Tür zu bleibt."],
              ["Ghost Hand Energy Drain Per Second", "5", "Kanalisierungs-Kosten an Reaktor/Seismic."],
              ["Hex Energy Cost", "35", "Kosten pro Hex."],
              ["Hex Duration", "10", "Sekunden, die ein Hex wirkt."],
              ["Hex: Speed Boost / Blindness / Night Vision Allowed", "On / On / On", "Welche Hex-Effekte in der Rotation sind."],
              ["Poltergeist Keeps Its Tasks", "Off", "Ob ein Crew-Poltergeist weiter für den Taskwin zählt."]
            ])
          }
        }
      ]
    },
    {
      id: "uc-fx",
      title: { en: "Visuals & audio (1.0.1.60)", de: "Visuals & Audio (1.0.1.60)" },
      intro: {
        en: "1.0.1.60 is a full audiovisual overhaul: every ability now has dedicated particle effects and sound, world-anchored cues play in positional stereo, and all sounds and icons were rebuilt against a hard quality gate.",
        de: "1.0.1.60 ist eine komplette audiovisuelle Überarbeitung: Jede Fähigkeit hat jetzt eigene Partikeleffekte und Sound, weltverankerte Cues spielen in positionalem Stereo, und alle Sounds und Icons wurden gegen ein hartes Qualitäts-Gate neu gebaut."
      },
      entries: [
        {
          id: "uc-fx-audio",
          title: { en: "Positional stereo audio", de: "Positionaler Stereo-Sound" },
          summary: {
            en: "World-anchored sounds pan left/right by where they happen and fade smoothly with distance — a door slam to your left sounds like it.",
            de: "Weltverankerte Sounds pannen nach links/rechts, je nachdem wo sie passieren, und blenden weich mit der Distanz aus — ein Türknall links klingt auch links."
          },
          body: {
            en: "<p>Every world-anchored cue (door slams, kill bursts, relic pickups, explosions …) now pans in the stereo field based on where it happens relative to you and follows a smooth distance falloff instead of a linear ramp. Purely private cues stay centered and local. 31 new sounds were added — from the Tesla's geiger-style countdown to the Saboteur's complete search-&-defuse minigame sound set — and every single sound passes an automated quality gate (no clicks, consistent loudness, real stereo width, seamless fuse loop).</p>",
            de: "<p>Jeder weltverankerte Cue (Türknallen, Kill-Bursts, Relikt-Pickups, Explosionen …) pannt jetzt im Stereobild danach, wo er relativ zu dir passiert, und folgt einem weichen Distanz-Falloff statt einer linearen Rampe. Rein private Cues bleiben zentriert und lokal. 31 neue Sounds kamen dazu — vom Geigerzähler-Countdown der Tesla bis zum kompletten Sound-Set des Such-&-Entschärf-Minispiels des Saboteurs — und jeder einzelne Sound besteht ein automatisiertes Qualitäts-Gate (keine Klicks, konsistente Lautheit, echte Stereo-Breite, nahtloser Zündschnur-Loop).</p>"
          }
        },
        {
          id: "uc-fx-feedback",
          title: { en: "Feedback for every ability", de: "Feedback für jede Fähigkeit" },
          summary: {
            en: "Previously silent moments now land: Tesla's double-kill lightning chain, Maniac's explosion burst, clone materialize/dissolve, manifest kill-reveal, shield auras, promotion reveals and more.",
            de: "Vorher stumme Momente sitzen jetzt: Teslas Doppel-Kill-Blitzkette, Maniacs Explosions-Burst, Klon-Materialisierung/-Auflösung, Manifest-Kill-Reveal, Schild-Auren, Beförderungs-Reveals und mehr."
          },
          body: {
            en: "<p>Highlights: the Tesla's double kill fires spark bursts at both victims joined by a crackling lightning chain; the Maniac's bomb gets a real explosion burst and a fuse that audibly escalates toward zero; the Illusionist's clone materializes and dissolves with a shimmer instead of popping in and out; killing a Poltergeist manifest triggers a distinct reveal instead of a quiet poof; and mid-game role promotions get a golden reveal flash. Private information stays private: shield auras, range rings, markers and confirmation cues are rendered strictly for the player they belong to.</p>",
            de: "<p>Highlights: Teslas Doppel-Kill zündet Funken-Bursts an beiden Opfern, verbunden durch eine knisternde Blitzkette; die Bombe des Maniac bekommt einen echten Explosions-Burst und eine Zündschnur, die hörbar Richtung null eskaliert; der Klon des Illusionist materialisiert und löst sich mit einem Schimmer auf, statt ein- und auszuploppen; ein Kill auf den Poltergeist-Manifest löst ein eigenes Reveal aus statt eines leisen Poofs; und Beförderungen im laufenden Spiel bekommen einen goldenen Reveal-Flash. Private Information bleibt privat: Schild-Auren, Reichweiten-Ringe, Marker und Bestätigungs-Cues werden strikt nur für den Spieler gerendert, dem sie gehören.</p>"
          }
        },
        {
          id: "uc-fx-icons",
          title: { en: "Sharper button icons", de: "Schärfere Button-Icons" },
          summary: {
            en: "Nine icons were redrawn for legibility at real button size — trap teeth, playback, record, mask, hex and more read cleanly at 50 px now.",
            de: "Neun Icons wurden für Lesbarkeit in echter Button-Größe neu gezeichnet — Fallen-Zähne, Playback, Record, Maske, Hex und mehr sind bei 50 px jetzt sauber erkennbar."
          },
          body: {
            en: "<p>All button icons follow the TOR comic-burst style with each role's identity color. Nine were redrawn specifically for legibility at actual in-game button size (~50 px): fewer, bolder trap teeth; a larger play glyph and a tinted echo crewmate on the Illusionist icons; a clearer REC lamp; a magenta mask that separates from the red burst; a bolder hex spiral; and cleaner pass, hand, drain and collect icons.</p>",
            de: "<p>Alle Button-Icons folgen dem TOR-Comic-Burst-Stil mit der Identitätsfarbe der jeweiligen Rolle. Neun wurden gezielt für die Lesbarkeit in echter In-Game-Button-Größe (~50 px) neu gezeichnet: weniger, dafür kräftigere Fallen-Zähne; ein größeres Play-Symbol und ein getöntes Echo-Crewmate auf den Illusionist-Icons; eine klarere REC-Lampe; eine Magenta-Maske, die sich vom roten Burst abhebt; eine kräftigere Hex-Spirale; und sauberere Pass-, Hand-, Drain- und Collect-Icons.</p>"
          }
        }
      ]
    },
    {
      id: "uc-roledraft",
      title: { en: "Role Draft support", de: "Role-Draft-Unterstützung" },
      intro: {
        en: "All Unknown's Collection impostor roles plus the Collector are pickable in TOR's Role Draft — integrated entirely from the plugin without touching TOR's source.",
        de: "Alle Unknown's-Collection-Impostor-Rollen plus der Collector sind in TORs Role Draft wählbar — komplett aus dem Plugin integriert, ohne TORs Quellcode anzufassen."
      },
      entries: [
        {
          id: "uc-roledraft-pick",
          title: { en: "All impostor roles + the Collector draftable", de: "Alle Impostor-Rollen + der Collector draftbar" },
          badges: [{ en: "Draftable", de: "Draftbar" }],
          summary: {
            en: "With Role Draft on, all eight Unknown's Collection impostor roles — Tesla, Saboteur, Silencer, Poisoner, Illusionist, Maniac, Shade and Manipulator — plus the neutral Collector appear as picks instead of being assigned by the usual random promotion.",
            de: "Mit aktivem Role Draft erscheinen alle acht Unknown's-Collection-Impostor-Rollen — Tesla, Saboteur, Silencer, Poisoner, Illusionist, Maniac, Shade und Manipulator — plus der neutrale Collector als Picks, statt über die übliche Zufalls-Beförderung vergeben zu werden."
          },
          body: {
            en: "<p>When TOR's <strong>Role Draft</strong> is enabled, all enabled Unknown's Collection impostor roles — <strong>The Tesla</strong>, <strong>The Saboteur</strong>, <strong>The Silencer</strong>, <strong>The Poisoner</strong>, <strong>The Illusionist</strong>, <strong>The Maniac</strong>, <strong>The Shade</strong> and <strong>The Manipulator</strong> — plus the neutral <strong>Collector</strong> become regular picks (max one each per game), and the random promotion is suppressed so the draft decides. The Poltergeist is deliberately not draftable — it is not a starting role. The integration lives entirely in the plugin via Harmony patches — TOR's source is untouched. (In the draft list the impostor buttons use the impostor red so the faction filter shows them; each role's own colour returns in-game.)</p>",
            de: "<p>Ist TORs <strong>Role Draft</strong> aktiv, werden alle aktivierten Unknown's-Collection-Impostor-Rollen — <strong>The Tesla</strong>, <strong>The Saboteur</strong>, <strong>The Silencer</strong>, <strong>The Poisoner</strong>, <strong>The Illusionist</strong>, <strong>The Maniac</strong>, <strong>The Shade</strong> und <strong>The Manipulator</strong> — plus der neutrale <strong>Collector</strong> zu normalen Picks (max. je einer pro Spiel), und die Zufalls-Beförderung wird unterdrückt, damit der Draft entscheidet. Der Poltergeist ist bewusst nicht draftbar — er ist keine Startrolle. Die Integration liegt komplett im Plugin via Harmony-Patches — TORs Quellcode bleibt unangetastet. (In der Draft-Liste sind die Impostor-Buttons impostor-rot, damit der Fraktionsfilter sie zeigt; im Spiel kehrt die jeweilige Eigenfarbe zurück.)</p>"
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

/* ============================================================================
 * NIGHTFALL
 * ==========================================================================*/
const NIGHTFALL = {
  key: "nightfall",
  name: "Nightfall",
  fullName: { en: "Nightfall — first person for Among Us", de: "Nightfall — Ich-Perspektive für Among Us" },
  version: "0.2.0",
  allClients: true,
  repo: "https://github.com/DaUnknown-0/Nightfall",
  download: "https://github.com/DaUnknown-0/Nightfall/releases/latest",
  tagline: {
    en: "When Unknown's Collection's werewolf transforms, the top-down view is gone: real walls in perspective, a flashlight in your hand — and the beast gets red predator sight and its own claws.",
    de: "Sobald sich der Werwolf aus Unknown's Collection verwandelt, ist die Draufsicht weg: perspektivische Wände, eine Taschenlampe in der Hand — und das Biest bekommt rote Raubtiersicht und seine eigenen Krallen."
  },
  intro: {
    en: "Nightfall is a standalone BepInEx plugin. It changes neither The Other Roles nor Unknown's Collection, it only reads their state by reflection — without Unknown's Collection it loads anyway and stays quiet. The picture is drawn by a software renderer that contains no Unity at all, and is put on screen as one full-screen sprite under the HUD. <strong>Only Polus has a described world so far</strong>; on every other map the view deliberately stays off (see <em>World &amp; maps</em>).",
    de: "Nightfall ist ein eigenständiges BepInEx-Plugin. Es verändert weder The Other Roles noch Unknown's Collection, sondern liest deren Zustand nur per Reflection mit — ohne Unknown's Collection lädt es trotzdem und hält still. Das Bild zeichnet ein Software-Renderer, der überhaupt kein Unity enthält, und landet als ein einziges Vollbild-Sprite unter dem HUD auf dem Schirm. <strong>Bisher hat nur Polus eine beschriebene Welt</strong>; auf jeder anderen Karte bleibt die Sicht bewusst aus (siehe <em>Welt &amp; Karten</em>)."
  },
  install: {
    en: "<ol><li>Install <a href='https://github.com/TheOtherRolesAU/TheOtherRoles'>The Other Roles</a> into your Among Us BepInEx setup. <a href='https://github.com/DaUnknown-0/UnknownsCollection'>Unknown's Collection</a> is optional, but it is what supplies the Werewolf whose transformation triggers Nightfall.</li><li>Download the latest <code>Nightfall.dll</code> from the releases page.</li><li>Copy it into <code>&lt;Among Us&gt;/BepInEx/plugins/</code>.</li><li>Start the game.</li></ol><p>After the first install, the built-in updater checks this repo's GitHub releases on the main menu and offers an update button — manual downloads are only needed for the initial setup.</p>",
    de: "<ol><li>Installiere <a href='https://github.com/TheOtherRolesAU/TheOtherRoles'>The Other Roles</a> in dein Among-Us-BepInEx-Setup. <a href='https://github.com/DaUnknown-0/UnknownsCollection'>Unknown's Collection</a> ist optional, liefert aber den Werwolf, dessen Verwandlung Nightfall auslöst.</li><li>Lade die neueste <code>Nightfall.dll</code> von der Releases-Seite.</li><li>Kopiere sie nach <code>&lt;Among Us&gt;/BepInEx/plugins/</code>.</li><li>Starte das Spiel.</li></ol><p>Nach der ersten Installation prüft der eingebaute Updater die GitHub-Releases dieses Repos im Hauptmenü und bietet einen Update-Button an — manuelle Downloads sind nur für die Erstinstallation nötig.</p>"
  },
  deps: {
    en: "<ul><li><strong>The Other Roles 4.8.0</strong> (hard dependency)</li><li><strong>Unknown's Collection</strong> (optional) — supplies the Werewolf whose transformation is the default trigger. Without it, the view is only reachable via the <em>Always</em> mode and the debug key.</li></ul>",
    de: "<ul><li><strong>The Other Roles 4.8.0</strong> (harte Abhängigkeit)</li><li><strong>Unknown's Collection</strong> (optional) — liefert den Werwolf, dessen Verwandlung der Standard-Auslöser ist. Ohne UC ist die Sicht nur über den Modus <em>Always</em> und die Debug-Taste erreichbar.</li></ul>"
  },
  sections: [
    {
      id: "how-it-works",
      title: { en: "How it works", de: "Wie es funktioniert" },
      intro: {
        en: "A software renderer instead of real 3D, a fairness handshake before anything switches, and one relay that puts everything the mods place in the world back into the picture.",
        de: "Ein Software-Renderer statt echtem 3D, ein Fairness-Handshake, bevor überhaupt etwas umschaltet, und ein Weiterleiter, der alles zurück ins Bild holt, was die Mods in die Welt stellen."
      },
      entries: [
        {
          id: "trigger",
          title: { en: "When the world flips", de: "Wann die Welt kippt" },
          summary: {
            en: "The werewolf's transformation is the default trigger; four hard blocks come before everything else.",
            de: "Die Verwandlung des Werwolfs ist der Standard-Auslöser; vier harte Sperren stehen vor allem anderen."
          },
          body: {
            en: "<p>By default the view begins when Unknown's Collection's werewolf transforms and ends when it reverts. The host can widen or switch that off entirely with the <strong>3D Mode</strong> option (see <em>Configuration</em>).</p><p>Four blocks sit <strong>before</strong> everything else, including the debug key and the mode:</p>" + tbl(["Block", "Why"], [
              ["Ghosts", "The rest of a ghost's game is tasks and watching, and neither survives being put into a corridor."],
              ["Meeting, voting, exile", "The head must not follow the cursor that is currently voting."],
              ["Round end", "Between the win condition firing and the actual scene change the game already draws its end screen — the view has to be gone by then."],
              ["Maps without a described world", "Only Polus is built. On the other maps the view never comes up at all."]
            ]),
            de: "<p>Standardmäßig beginnt die Sicht mit dem Verwandeln des Werwolfs aus Unknown's Collection und endet mit dem Zurückverwandeln. Der Host kann das mit der Option <strong>3D Mode</strong> ausweiten oder ganz abschalten (siehe <em>Einstellungen</em>).</p><p>Vier Sperren stehen <strong>vor</strong> allem anderen, auch vor der Debug-Taste und vor dem Modus:</p>" + tbl(["Sperre", "Warum"], [
              ["Geist", "Das Restspiel eines Geistes sind Aufgaben und Zusehen, und beides überlebt es nicht, in einen Gang gesteckt zu werden."],
              ["Besprechung, Abstimmung, Ausschluss", "Der Kopf darf nicht dem Zeiger folgen, der gerade abstimmt."],
              ["Rundenende", "Zwischen dem Auslösen der Siegbedingung und dem Szenenwechsel zeichnet das Spiel schon seinen Endbildschirm — die Sicht muss da weg sein."],
              ["Karten ohne beschriebene Welt", "Gebaut ist bisher nur Polus. Auf den anderen Karten kommt die Sicht gar nicht erst hoch."]
            ])
          }
        },
        {
          id: "renderer",
          title: { en: "The renderer, and why it is not Unity 3D", de: "Der Renderer, und warum er kein Unity-3D ist" },
          summary: {
            en: "Among Us has no wall geometry. The renderer needs exactly one thing from the host: put this byte array on screen.",
            de: "Among Us hat keine Wandgeometrie. Der Renderer braucht vom Wirt genau eine Fähigkeit: leg dieses Byte-Array auf den Schirm."
          },
          body: {
            en: "<p>Real 3D would need runtime meshes, a shader that survives Il2Cpp stripping and an asset pipeline — three unknowns instead of none. Nightfall draws its own picture in plain C# instead (it began as a raycaster and is a triangle rasterizer today) and hands the finished image to a single full-screen sprite on the world camera, under the HUD. <strong>Not one call crosses the Il2Cpp border per frame.</strong></p><p>Measured on Polus over all 91 viewpoints with a full turn at each, at the default <code>854x480</code>: <strong>16.6 ms worst viewpoint, 13.7 ms average</strong>, 38 228 triangles. The 16.7 ms of a 60 Hz frame is the line the default resolution is chosen against.</p>",
            de: "<p>Echtes 3D bräuchte Laufzeit-Meshes, einen Shader, der das Il2Cpp-Stripping überlebt, und eine Asset-Pipeline: drei Unbekannte statt keiner. Nightfall zeichnet sein Bild stattdessen in reinem C# (angefangen als Raycaster, heute ein Dreiecks-Rasterizer) und übergibt es einem einzigen Vollbild-Sprite auf der Weltkamera, unter dem HUD. <strong>Pro Bild geht kein einziger Aufruf über die Il2Cpp-Grenze.</strong></p><p>Gemessen auf Polus über alle 91 Standpunkte mit voller Drehung an jedem, bei der Standardauflösung <code>854x480</code>: <strong>16,6 ms schlechtester Standpunkt, 13,7 ms im Mittel</strong>, 38 228 Dreiecke. Die 16,7 ms eines 60-Hz-Bildes sind die Grenze, gegen die die Standardauflösung gewählt ist.</p>"
          }
        },
        {
          id: "offline-tool",
          title: { en: "The same code draws PNGs outside the game", de: "Derselbe Code zeichnet PNGs außerhalb des Spiels" },
          summary: {
            en: "The renderer contains no Unity on purpose — an offline tool compiles the identical files and produces the identical picture.",
            de: "Der Renderer enthält absichtlich kein Unity — ein Offline-Werkzeug kompiliert dieselben Dateien und erzeugt dasselbe Bild."
          },
          body: {
            en: "<p>Everything under <code>Core\\</code> is Unity-free by design. The same files are compiled into an offline render tool that draws the identical picture into PNG files, which is how the look is checked and corrected without launching the game — including a camera that can be placed at an exact coordinate and angle, so a screenshot reported from a playtest can be reproduced and held against the fix. <strong>What is checked outside the game as an image is line-for-line what runs inside it.</strong></p><p>The tool also measures the frame cost across every viewpoint of the map with a full turn at each; those are the numbers quoted here.</p>",
            de: "<p>Alles unter <code>Core\\</code> ist bewusst Unity-frei. Dieselben Dateien werden in ein Offline-Render-Werkzeug kompiliert, das dasselbe Bild als PNG zeichnet — so wird die Optik geprüft und korrigiert, ohne das Spiel zu starten, samt einer Kamera, die sich auf eine exakte Koordinate und einen exakten Winkel stellen lässt: ein aus dem Spieltest gemeldeter Screenshot ist damit nachstellbar und gegen den Fix zu halten. <strong>Was außerhalb des Spiels als Bild geprüft wird, ist zeilengleich das, was im Spiel läuft.</strong></p><p>Dasselbe Werkzeug misst auch die Bildkosten über jeden Standpunkt der Karte mit voller Drehung — daher stammen die hier genannten Zahlen.</p>"
          }
        },
        {
          id: "wolf-vs-crew",
          title: { en: "Torch against predator sight", de: "Taschenlampe gegen Raubtiersicht" },
          summary: {
            en: "Crew carry a flashlight and only see people inside its beam; the beast has no lamp, sees further and shows its own claws.",
            de: "Die Crew trägt eine Taschenlampe und sieht Menschen nur in ihrem Kegel; das Biest hat keine Lampe, sieht weiter und zeigt seine eigenen Krallen."
          },
          body: {
            en: "<p>A person outside the beam has to disappear, otherwise the blackout is a radar. Player figures are judged against a narrow cone of their own (full at 22°, nothing at 33°) plus a range limit, with a deliberate arm's-length exception: closer than a metre nobody is ever invisible, but never more than half — walk through someone and you see a shape, not an identity. Walls may stay dark-but-readable; people may not.</p><p>The werewolf gets the other side of it: no torch, a red night sight that reaches further, living prey lifted to full brightness so it reads as a heat signature against the cold room, blood-red distance fog, and its own front paws at the bottom of the screen. That asymmetry is what makes the transformation playable.</p>",
            de: "<p>Ein Mensch außerhalb des Kegels muss weg, sonst ist der Blackout ein Radar. Spielerfiguren werden gegen einen eigenen, engen Kegel bewertet (voll bei 22°, null bei 33°) plus eine Reichweitengrenze, mit einer bewussten Armlängen-Ausnahme: näher als ein Meter ist nie jemand unsichtbar, aber höchstens halb — wer durch einen hindurchläuft, sieht eine Gestalt, keine Identität. Wände dürfen dunkel-aber-lesbar sein, Menschen nicht.</p><p>Der Werwolf bekommt die Gegenseite: keine Lampe, eine rote Nachtsicht, die weiter reicht, lebende Beute auf volle Helligkeit gehoben (eine Wärmesignatur gegen den kalten Raum), blutroter Distanznebel und seine eigenen Vorderpfoten im Bild. Diese Asymmetrie macht die Verwandlung spielbar.</p>"
          }
        },
        {
          id: "handshake",
          title: { en: "The fairness handshake", de: "Der Fairness-Handshake" },
          badges: [{ en: "All clients", de: "Alle Clients" }],
          summary: {
            en: "By default the view only arms when every player in the lobby has Nightfall installed.",
            de: "Standardmäßig schaltet die Sicht nur, wenn jeder in der Lobby Nightfall installiert hat."
          },
          body: {
            en: "<p>Whoever is missing the mod would keep the top-down overview during the hunt, and in a blackout that is not a cosmetic difference but a real advantage: they can read a room the others have to walk into. So <code>RequireEveryone</code> (on by default) holds the view back for <em>everybody</em> until every player in the lobby has answered the lobby handshake. The host gets a single log warning with the names.</p><p>The switch exists to be turned off for solo testing — that is the one case in which a client may act on its own settings instead of the host's.</p>",
            de: "<p>Wem die Mod fehlt, der behielte während der Jagd die Draufsicht, und im Blackout ist das kein Schönheits-, sondern ein Spielvorteil: er liest einen Raum, den die anderen betreten müssen. Deshalb hält <code>RequireEveryone</code> (standardmäßig an) die Sicht bei <em>allen</em> zurück, bis jeder Spieler in der Lobby den Lobby-Handshake beantwortet hat. Der Host bekommt einmal eine Log-Warnung mit den Namen.</p><p>Der Schalter ist dafür da, für Solo-Tests ausgeschaltet zu werden — das ist der eine Fall, in dem ein Client mit seinen eigenen Einstellungen statt mit denen des Hosts rechnet.</p>"
          }
        },
        {
          id: "world-relay",
          title: { en: "Roles in first person: one relay instead of thirty special cases", de: "Rollen in der Ich-Perspektive: ein Weiterleiter statt dreißig Sonderfällen" },
          summary: {
            en: "Traps, relics, clones, ghost hands: everything the three mods place in the world comes back into the picture through one generic path.",
            de: "Fallen, Relikte, Klone, Geisterhände: alles, was die drei Mods in die Welt stellen, kommt über einen einzigen allgemeinen Weg zurück ins Bild."
          },
          body: {
            en: "<p>Hiding the vanilla top-down world also hides every world sprite a mod creates. Rather than teaching Nightfall each ability one by one, a relay walks the scene's root objects, skips the handful Nightfall draws itself plus the HUD and the cameras, and turns everything else into a billboard. <strong>A new role appears in first person on the day it appears in the game</strong>, without a line of code here.</p><p>Two properties come for free: the relay reads the <em>live</em> renderers, so it can never show what the game has already hidden from that player (a trap only its owner may see is inactive for everyone else anyway) — and the 2D sort depth doubles as height above the floor, so floor stickers stay on the floor and auras float.</p><p>Screen arrows are handled the same way in spirit: task, sabotage and tracker arrows leave the lens and become glowing target pins standing in the room, in the arrow's own colour. They are exempt from the visibility cone — a direction hint is game information the player is entitled to — but walls still hide them.</p>",
            de: "<p>Wer die Vanilla-Draufsicht verbirgt, verbirgt auch jedes Welt-Sprite, das eine Mod erzeugt. Statt Nightfall jede Fähigkeit einzeln beizubringen, läuft ein Weiterleiter die Wurzel-Objekte der Szene ab, überspringt die wenigen, die Nightfall selbst zeichnet, plus HUD und Kameras, und macht aus allem Übrigen ein Billboard. <strong>Eine neue Rolle erscheint in der Ich-Perspektive an dem Tag, an dem sie im Spiel erscheint</strong>, ohne eine Zeile hier.</p><p>Zwei Eigenschaften fallen umsonst ab: der Weiterleiter liest die <em>lebenden</em> Renderer, kann also nie zeigen, was das Spiel vor diesem Spieler ohnehin verborgen hat (eine Falle, die nur ihr Besitzer sehen darf, ist für alle anderen längst deaktiviert) — und die 2D-Sortiertiefe ist zugleich die Höhe über dem Boden, also bleiben Boden-Aufkleber unten und Auren schweben.</p><p>Die Bildschirm-Pfeile folgen demselben Gedanken: Task-, Sabotage- und Tracker-Pfeile verlassen die Linse und werden zu leuchtenden Zielpins im Raum, in der Farbe des jeweiligen Pfeils. Sie sind vom Sichtbarkeitskegel ausgenommen — ein Richtungshinweis ist Spielinformation, die dem Spieler zusteht — aber Wände verdecken sie weiterhin.</p>"
          }
        }
      ]
    },
    {
      id: "controls",
      title: { en: "Controls & keys", de: "Steuerung & Tasten" },
      intro: {
        en: "The mouse turns the head instead of pointing at things — which is exactly why every ability needs a key, and why the key is printed on its button.",
        de: "Die Maus dreht den Kopf, statt auf etwas zu zeigen — genau deshalb braucht jede Fähigkeit eine Taste, und genau deshalb steht die Taste auf ihrem Knopf."
      },
      entries: [
        {
          id: "movement",
          title: { en: "Looking and walking", de: "Sehen und Laufen" },
          summary: {
            en: "Mouse turns the view, WASD walks relative to it, and the view freezes wherever the cursor is needed.",
            de: "Die Maus dreht den Blick, WASD läuft relativ dazu, und der Blick friert ein, wo der Zeiger gebraucht wird."
          },
          body: {
            en: "<p>The mouse turns the view and WASD walks relative to it (<code>W</code> forwards). With a task, a meeting, the chat, a vent or <strong>any map — including the sabotage map</strong> open, the view freezes and the cursor is released, so a click on a console or a reactor does not yank the player around. Holding <strong>Alt</strong> releases the cursor at any time for as long as the key is held.</p>" + tbl(["Key", "Effect"], [
              ["Mouse", "Turn the view"],
              ["W A S D", "Walk, relative to the view (configurable)"],
              ["Alt (hold)", "Release the cursor, freeze the view"],
              ["F9", "Force the first-person view on (testing). Bypasses the handshake, <strong>not</strong> the four blocks."]
            ]) + "<p class='note'>Nightfall does not touch the physics. The only intervention is one postfix that <em>rotates</em> the movement vector; collision, colliders and doors stay entirely with the game — the mod cannot change where you can walk through.</p>",
            de: "<p>Die Maus dreht den Blick, WASD läuft relativ dazu (<code>W</code> vorwärts). Bei offenem Task, Meeting, Chat, im Vent oder bei <strong>offener Karte — auch der Sabotage-Karte</strong> friert der Blick ein und der Zeiger wird freigegeben, damit ein Klick auf eine Konsole oder einen Reaktor den Spieler nicht herumreißt. <strong>Alt</strong> gibt den Zeiger jederzeit frei, solange die Taste gehalten wird.</p>" + tbl(["Taste", "Wirkung"], [
              ["Maus", "Blick drehen"],
              ["W A S D", "Laufen, relativ zum Blick (konfigurierbar)"],
              ["Alt (halten)", "Zeiger freigeben, Blick einfrieren"],
              ["F9", "Ich-Perspektive erzwingen (Test). Umgeht den Handshake, <strong>nicht</strong> die vier Sperren."]
            ]) + "<p class='note'>Nightfall fasst die Physik nicht an. Der einzige Eingriff ist ein Postfix, der den Bewegungsvektor <em>dreht</em>; Kollision, Collider und Türen bleiben vollständig beim Spiel — die Mod kann nicht ändern, wo man hindurchlaufen kann.</p>"
          }
        },
        {
          id: "ability-keys",
          title: { en: "A key for every ability", de: "Eine Taste für jede Fähigkeit" },
          summary: {
            en: "With the cursor captured, an ability without a key is an ability the player has lost. Nightfall fills the gaps and resolves clashes.",
            de: "Bei gefangenem Zeiger ist eine Fähigkeit ohne Taste eine verlorene Fähigkeit. Nightfall füllt die Lücken und löst Kollisionen auf."
          },
          body: {
            en: "<p>The HUD buttons are still drawn and still clickable — but only while Alt is held, and holding Alt also stops you looking, which in the middle of a hunt is the same as not having the ability at all. Three things were missing, and all three are fixed from the outside, <strong>without changing a line of The Other Roles</strong>:</p><ul><li><strong>Some buttons had no key at all</strong> (TOR's Shifter, garlic and bomb-defuse; Unknown's Collection's four Copycat buttons were mouse-only by design).</li><li><strong>Keys were handed out per mod, not per player.</strong> TOR's convention (Q kill, F ability, G second, H third) assumes one role per player, and that assumption is gone: a role, a modifier with its own button, a cross-role counterplay button and a Forgotten Fixes extra can all be on screen at once.</li><li><strong>The key was nowhere on the button.</strong> The player learned it from a wiki.</li></ul><p>Five buttons get a fixed, written-down key; everything else keeps whatever key its own mod gave it and only moves if a real clash is detected for that player in that moment. Nightfall is not a rebinding mod — a player who knows the Sheriff shoots with Q must not have to relearn it.</p>" + tbl(["Button", "Key", "Why this one"], [
              ["Shifter (shift)", "V", "A <em>modifier</em>, so it sits on top of an arbitrary role."],
              ["Garlic", "B", "Belongs to every living player as soon as garlic is in play."],
              ["Defuse bomb", "N", "Belongs to every living player while a bomb is armed."],
              ["Saboteur search", "M", "Belongs to every non-impostor — and sat on F, which the Scout needs for its own role."],
              ["Lover Revenger", "X", "Granted by the Lover modifier, sat on Q like the role underneath it."]
            ]) + "<p>The key is printed in the <strong>top-right corner of the button</strong>, and by default all the time rather than only during the view: a key learned during the round is a key already known when the lights go out. Vanilla buttons (use, kill, report, sabotage, vent) stay unlabelled — they carry Among Us' own bindings.</p>",
            de: "<p>Die HUD-Knöpfe werden weiter gezeichnet und sind weiter klickbar — aber nur, solange Alt gehalten wird, und wer Alt hält, dreht sich nicht mehr, was mitten in einer Jagd dasselbe ist wie keine Fähigkeit zu haben. Drei Dinge fehlten, und alle drei sind von außen gelöst, <strong>ohne eine Zeile an The Other Roles zu ändern</strong>:</p><ul><li><strong>Manche Knöpfe hatten überhaupt keine Taste</strong> (TORs Shifter, Knoblauch und Bomben-Entschärfung; die vier Copycat-Knöpfe aus Unknown's Collection waren bewusst nur mit der Maus bedienbar).</li><li><strong>Tasten wurden pro Mod vergeben, nicht pro Spieler.</strong> TORs Konvention (Q Töten, F Fähigkeit, G zweite, H dritte) setzt eine Rolle je Spieler voraus, und diese Annahme hält nicht mehr: eine Rolle, ein Modifier mit eigenem Knopf, ein fremder Gegenspiel-Knopf und ein Forgotten-Fixes-Zusatz können gleichzeitig auf dem Schirm sein.</li><li><strong>Die Taste stand nirgends auf dem Knopf.</strong> Der Spieler erfuhr sie aus der Wiki.</li></ul><p>Fünf Knöpfe bekommen eine fest vergebene, aufgeschriebene Taste; alles andere behält die Taste seiner eigenen Mod und wird nur verschoben, wenn für diesen Spieler in diesem Moment wirklich eine Kollision auftritt. Nightfall ist kein Umbelegungs-Mod — wer weiß, dass der Sheriff mit Q schießt, soll das nicht neu lernen müssen.</p>" + tbl(["Knopf", "Taste", "Warum genau der"], [
              ["Shifter (Shift)", "V", "Ein <em>Modifier</em>, sitzt also auf einer beliebigen Rolle obendrauf."],
              ["Knoblauch", "B", "Gehört jedem lebenden Spieler, sobald Knoblauch im Spiel ist."],
              ["Bombe entschärfen", "N", "Gehört jedem lebenden Spieler, solange eine Bombe scharf ist."],
              ["Saboteur-Suche", "M", "Gehört jedem Nicht-Impostor — und lag auf F, das der Scout für seine eigene Rolle braucht."],
              ["Lover Revenger", "X", "Vom Lover-Modifier verliehen, lag auf Q wie die Rolle darunter."]
            ]) + "<p>Die Taste steht <strong>oben rechts auf dem Knopf</strong>, standardmäßig immer und nicht nur während der Sicht: eine Taste, die man während der Runde gelernt hat, kennt man schon, wenn das Licht ausgeht. Vanilla-Knöpfe (Benutzen, Töten, Melden, Sabotage, Lüftung) bleiben unbeschriftet — sie tragen Among Us' eigene Bindungen.</p>"
          }
        }
      ]
    },
    {
      id: "configuration",
      title: { en: "Configuration", de: "Einstellungen" },
      intro: {
        en: "One host-synchronised option, everything else local: resolution and mouse sensitivity are a property of the machine, not of the lobby.",
        de: "Eine host-synchronisierte Option, alles andere lokal: Auflösung und Mausempfindlichkeit sind Sache der Maschine, nicht der Lobby."
      },
      entries: [
        {
          id: "mode-option",
          title: { en: "3D Mode (host setting)", de: "3D Mode (Host-Einstellung)" },
          badges: [{ en: "Host-authoritative", de: "Host-autoritativ" }],
          summary: {
            en: "Always / Werewolf only / Never — registered as a TOR option in the General tab, so the host's value travels.",
            de: "Always / Werewolf only / Never — als TOR-Option im General-Tab registriert, also reist der Wert des Hosts mit."
          },
          body: {
            en: "<p>Everything else Nightfall settles is a matter of taste on one machine. The mode is not: it decides whether a player spends the round inside a corridor or looking down on the map, and two players who answer that differently are not playing the same game. So it is registered into The Other Roles' own option list (<strong>General</strong> tab, <code>Nightfall: 3D Mode</code>) and is host-synchronised for free.</p>" + tbl(["Value", "Meaning"], [
              ["<strong>Werewolf only</strong> (default)", "The view starts when Unknown's Collection's werewolf transforms and stops when it reverts."],
              ["Always", "First person for the whole round, werewolf or not."],
              ["Never", "Off. Nothing brings the view up."]
            ]) + "<p>The default is deliberately <em>Werewolf only</em>, so an existing lobby plays exactly as it did and nobody finds themselves in a corridor after an update. <em>Always</em> waits out the lobby and the intro cutscene; ghosts keep the top-down view in all three modes.</p><p class='note'>Without The Other Roles the mode falls back to a local config entry with the same three values.</p>",
            de: "<p>Alles andere, was Nightfall einstellt, ist Geschmackssache auf einem Rechner. Der Modus ist es nicht: er entscheidet, ob ein Spieler die Runde in einem Gang verbringt oder von oben auf die Karte sieht, und zwei Spieler, die das verschieden beantworten, spielen nicht dasselbe Spiel. Deshalb trägt er sich in die Options-Liste von The Other Roles ein (<strong>General</strong>-Tab, <code>Nightfall: 3D Mode</code>) und ist damit umsonst host-synchron.</p>" + tbl(["Wert", "Bedeutung"], [
              ["<strong>Werewolf only</strong> (Standard)", "Die Sicht beginnt mit dem Verwandeln des Werwolfs aus Unknown's Collection und endet mit dem Zurückverwandeln."],
              ["Always", "Ich-Perspektive die ganze Runde, unabhängig vom Werwolf."],
              ["Never", "Aus. Nichts bringt die Sicht hoch."]
            ]) + "<p>Der Standard ist bewusst <em>Werewolf only</em>, damit eine bestehende Lobby sich exakt wie vorher spielt und niemand sich nach einem Update ungefragt in einem Korridor wiederfindet. <em>Always</em> wartet Lobby und Intro-Cutscene ab; Geister behalten in allen drei Modi die Draufsicht.</p><p class='note'>Ohne The Other Roles fällt der Modus auf einen lokalen Konfigurationseintrag mit denselben drei Werten zurück.</p>"
          }
        },
        {
          id: "config-file",
          title: { en: "Local settings", de: "Lokale Einstellungen" },
          summary: {
            en: "Everything in BepInEx\\config\\com.tormod.nightfall.cfg — feature switches, look, key labels.",
            de: "Alles in BepInEx\\config\\com.tormod.nightfall.cfg — Feature-Schalter, Optik, Tastenbeschriftung."
          },
          body: {
            en: "<p>File: <code>BepInEx\\config\\com.tormod.nightfall.cfg</code>. Editable in the game's mod-config UI as well.</p>" + tbl(["Key", "Default", "What it does"], [
              ["<code>Nightfall / Enabled</code>", "true", "Switch the first-person view on when Unknown's Collection's werewolf transforms."],
              ["<code>Nightfall / Mode</code>", "WerewolfOnly", "Fallback for the host option above — only in force when The Other Roles is not installed."],
              ["<code>Nightfall / RequireEveryone</code>", "true", "Only arm the view when every player in the lobby has Nightfall installed. Whoever is missing it would otherwise keep the top-down overview during the hunt, which is a real advantage. Turn off for solo testing."],
              ["<code>Nightfall / RelativeMovement</code>", "true", "Move relative to where you are looking (W walks forwards). Off means Among Us' normal world-axis movement, which is far less disorienting but also far less first person."],
              ["<code>Look / RenderWidth</code>", "854 <span class='note'>(160–1280)</span>", "Internal horizontal resolution; the image is point-magnified to the screen, so lower is chunkier and cheaper. Height follows at 16:9. 640 if the machine is tight, 960 is for looking at the map rather than playing on it."],
              ["<code>Look / FieldOfView</code>", "75 <span class='note'>(50–110)</span>", "Horizontal field of view in degrees."],
              ["<code>Look / TorchRange</code>", "13 <span class='note'>(4–30)</span>", "How far the flashlight reaches, in world units."],
              ["<code>Look / TurnSpeed</code>", "9 <span class='note'>(2–30)</span>", "How quickly the head follows the mouse."],
              ["<code>Look / MouseSensitivity</code>", "3.2 <span class='note'>(0.5–12)</span>", "How far the view turns per unit of mouse movement."],
              ["<code>Keys / ShowKeyOnButton</code>", "true", "Print each ability's key in the top-right corner of its button."],
              ["<code>Keys / AlwaysOn</code>", "true", "Hand out keys and label the buttons all the time, not only while the first-person view is up."],
              ["<code>General / Enabled</code>", "true", "Whether the mod is loaded at all — the Mod Manager's own switch, which needs a restart either way. Kept separate from the feature-level toggle above."]
            ]),
            de: "<p>Datei: <code>BepInEx\\config\\com.tormod.nightfall.cfg</code>. Auch über die Mod-Config-Oberfläche im Spiel editierbar.</p>" + tbl(["Schlüssel", "Standard", "Funktion"], [
              ["<code>Nightfall / Enabled</code>", "true", "Schaltet die Ich-Perspektive ein, wenn sich der Werwolf aus Unknown's Collection verwandelt."],
              ["<code>Nightfall / Mode</code>", "WerewolfOnly", "Rückfallwert für die Host-Option oben — nur wirksam, wenn The Other Roles nicht installiert ist."],
              ["<code>Nightfall / RequireEveryone</code>", "true", "Die Sicht nur scharfschalten, wenn jeder Spieler in der Lobby Nightfall installiert hat. Wem sie fehlt, der behielte während der Jagd die Draufsicht, und das ist ein echter Vorteil. Für Solo-Tests ausschalten."],
              ["<code>Nightfall / RelativeMovement</code>", "true", "Bewegung relativ zur Blickrichtung (W läuft vorwärts). Aus bedeutet Among Us' normale Bewegung entlang der Weltachsen: deutlich weniger verwirrend, aber auch deutlich weniger Ich-Perspektive."],
              ["<code>Look / RenderWidth</code>", "854 <span class='note'>(160–1280)</span>", "Interne horizontale Auflösung; das Bild wird punktweise auf den Schirm vergrößert, niedriger ist also gröber und billiger. Die Höhe folgt in 16:9. 640 für schwache Rechner, 960 zum Anschauen statt zum Spielen."],
              ["<code>Look / FieldOfView</code>", "75 <span class='note'>(50–110)</span>", "Horizontales Sichtfeld in Grad."],
              ["<code>Look / TorchRange</code>", "13 <span class='note'>(4–30)</span>", "Wie weit die Taschenlampe reicht, in Welteinheiten."],
              ["<code>Look / TurnSpeed</code>", "9 <span class='note'>(2–30)</span>", "Wie schnell der Kopf der Maus folgt."],
              ["<code>Look / MouseSensitivity</code>", "3,2 <span class='note'>(0,5–12)</span>", "Wie weit sich der Blick pro Einheit Mausbewegung dreht."],
              ["<code>Keys / ShowKeyOnButton</code>", "true", "Die Taste jeder Fähigkeit oben rechts auf ihren Knopf schreiben."],
              ["<code>Keys / AlwaysOn</code>", "true", "Tasten vergeben und Knöpfe beschriften auch außerhalb der Ich-Perspektive."],
              ["<code>General / Enabled</code>", "true", "Ob die Mod überhaupt geladen wird — der Schalter des Mod Managers, der ohnehin einen Neustart braucht. Bewusst getrennt vom Feature-Schalter oben."]
            ])
          }
        }
      ]
    },
    {
      id: "world",
      title: { en: "World & maps", de: "Welt & Karten" },
      intro: {
        en: "Polus is hand-built and complete. The other four maps are switched off on purpose — the honest state of the project, not a promise.",
        de: "Polus ist von Hand gebaut und fertig. Die anderen vier Karten sind bewusst abgeschaltet — der ehrliche Stand des Projekts, kein Versprechen."
      },
      entries: [
        {
          id: "polus",
          title: { en: "Polus is built, not guessed", de: "Polus ist gebaut, nicht geraten" },
          summary: {
            en: "17 areas, every number read off a printed grid over the map photo and checked from eye level.",
            de: "17 Bereiche, jede Zahl am gedruckten Gitter über dem Kartenfoto abgelesen und aus Augenhöhe nachgeprüft."
          },
          body: {
            en: "<p>Polus' geometry is described by hand: <strong>17 areas, 172 floors, 126 walls (38 openings), 57 ceilings and over 1100 pieces of furniture</strong>, plus a catalogue of drawn surfaces. It is the most accurate description of Polus this project has.</p><p>The obvious alternative would have been the game's own colliders, and they are not walls: a collider runs into every door recess and back out, encloses crates, ends in mid-air and follows a wire fence in Electrical — windows, plinths, door frames and lintels are missing entirely, because the game never needs them as collision. What the game <em>does</em> supply and Nightfall reads directly: the footstep-sound zones (a complete floor-material map of the station, set by the developers) and the physics layers, which say what is a full-height wall and what is a hip-high table you can see over.</p><p>Sixteen doors are coupled to the game's own doors, eye height follows the floor (smoothed, so stairs carry the camera), and the night sky is a panorama baked once per session — stars, Milky Way, aurora and horizon extinction, standing still while the head pans past it.</p>",
            de: "<p>Die Geometrie von Polus ist von Hand beschrieben: <strong>17 Bereiche, 172 Böden, 126 Wände (38 Öffnungen), 57 Decken und über 1100 Einrichtungsstücke</strong>, dazu ein Katalog gezeichneter Oberflächen. Das ist die genaueste Beschreibung von Polus, die es in diesem Projekt gibt.</p><p>Die naheliegende Alternative wären die Collider des Spiels, und die sind keine Wände: ein Collider läuft in jede Türnische hinein und wieder heraus, umschließt Kisten, endet mitten im Nichts und folgt in Electrical einem Maschendrahtzaun — Fenster, Sockel, Türrahmen und Sturz fehlen ganz, weil das Spiel sie nie als Kollision braucht. Was das Spiel dagegen <em>mitliefert</em> und Nightfall direkt ausliest: die Schrittgeräusch-Zonen (eine vollständige Bodenmaterialkarte der Station, von den Entwicklern gesetzt) und die Physik-Ebenen, die sagen, was eine volle Wand ist und was ein hüfthoher Tisch, über den man hinwegsieht.</p><p>Sechzehn Türen sind an die Türen des Spiels gekoppelt, die Augenhöhe folgt dem Boden (geglättet, damit Treppen die Kamera tragen), und der Nachthimmel ist ein einmal pro Sitzung gebackenes Panorama — Sterne, Milchstraße, Aurora und Horizont-Extinktion, still stehend, während der Kopf daran vorbeischwenkt.</p>"
          }
        },
        {
          id: "other-maps",
          title: { en: "The other four maps are off", de: "Die anderen vier Karten sind aus" },
          badges: [{ en: "In progress", de: "In Arbeit" }],
          summary: {
            en: "Skeld, Mira, Airship and Fungle: the view deliberately never comes up until they have a described world.",
            de: "Skeld, Mira, Airship und Fungle: Die Sicht kommt bewusst gar nicht erst hoch, bis sie eine beschriebene Welt haben."
          },
          body: {
            en: "<p>Only Polus has a built world. The other four maps used to run through the older collider-and-map-photograph path, and that path was never good enough to play on — it <em>renders</em>, and that is exactly the problem, because “it renders” reads to a player as “this is the mod”, and they would judge Polus by Skeld.</p><p>So the map block sits <strong>before</strong> everything, including the debug key: on a map without a described world there is nothing worth forcing on. One line goes into the log per map, so that “nothing happens” does not happen silently. The old path stays in the code and remains reachable from the offline render tool; the day a second map is described, one line changes.</p><p>A side effect that saves more than the block itself: on an undescribed map the map photograph and the sprite harvest are skipped entirely — those exist only to feed a picture that is never drawn there.</p>",
            de: "<p>Nur Polus hat eine gebaute Welt. Die anderen vier Karten liefen früher über den älteren Weg aus Collidern und Kartenfotografie, und der war nie gut genug zum Spielen — er <em>rendert</em>, und genau das ist das Problem, denn „es rendert“ liest sich für einen Spieler als „so ist die Mod“, und er beurteilt Polus dann nach Skeld.</p><p>Deshalb steht die Karten-Sperre <strong>vor</strong> allem anderen, auch vor der Debug-Taste: auf einer Karte ohne beschriebene Welt gibt es nichts, das zu erzwingen sich lohnt. Ins Log geht eine Zeile je Karte, damit „nichts passiert“ nicht schweigend passiert. Der alte Weg bleibt im Code und ist aus dem Offline-Render-Werkzeug weiter erreichbar; sobald eine zweite Karte beschrieben ist, ändert sich genau eine Zeile.</p><p>Ein Nebeneffekt, der mehr spart als die Sperre selbst: auf einer nicht beschriebenen Karte entfallen Kartenfotografie und Sprite-Ernte ganz — beide gibt es nur, um ein Bild zu füttern, das dort nie gezeichnet wird.</p>"
          }
        },
        {
          id: "known-limits",
          title: { en: "Known limits", de: "Bekannte Grenzen" },
          summary: {
            en: "Written down rather than hidden: invented ceilings, opaque windows, no name tags, aliased edges.",
            de: "Aufgeschrieben statt versteckt: erfundene Decken, undurchsichtige Fenster, keine Namensschilder, harte Kanten."
          },
          body: {
            en: "<ul><li><strong>Ceilings are invented.</strong> A top-down view does not contain any, so they are dark panels in a desaturated derivation of the room's colour.</li><li><strong>Windows are opaque dark blue.</strong> The rasterizer cannot blend; a window at night is nearly that anyway.</li><li><strong>There are no name tags in first person</strong>, and three abilities that write into the name (a bomb carrier's shield, a silenced marker, a red killer name) are therefore only visible in meetings. Bringing name tags back is exactly the radar question that makes players vanish outside the beam in the first place — a decision that belongs to the user.</li><li><strong>Edges are not anti-aliased.</strong> Texture filtering is in place (mip pyramid), triangle edges are not: a pillar against the night sky is still a staircase.</li><li><strong>Security Guard's cameras</strong> hang under the ship instead of at scene root and are missed by the world relay. Left open deliberately rather than guessed at.</li><li><strong>Sound and vents as walkable objects</strong> are still open.</li></ul><p class='note'>Nightfall is under active development and playtesting; the repository's README keeps the full, current list of findings and open points.</p>",
            de: "<ul><li><strong>Decken sind erfunden.</strong> Eine Draufsicht enthält keine, also sind es dunkle Paneele in einer stark entsättigten Ableitung der Raumfarbe.</li><li><strong>Fenster sind undurchsichtiges Dunkelblau.</strong> Der Rasterizer kann nicht mischen; ein Fenster bei Nacht ist ohnehin fast genau das.</li><li><strong>Namen über den Köpfen gibt es in der Ich-Perspektive nicht</strong>, und drei Fähigkeiten, die in den Namen schreiben (Bombenträger-Schild, Stumm-Markierung, roter Killername), sind deshalb nur im Meeting sichtbar. Namensschilder wieder einzublenden ist genau die Radar-Frage, wegen der Spieler außerhalb des Lichtkegels überhaupt verschwinden — eine Entscheidung, die dem Nutzer gehört.</li><li><strong>Kanten sind nicht geglättet.</strong> Die Texturfilterung sitzt (Mip-Pyramide), die Dreieckskanten nicht: eine Säulenkante gegen den Nachthimmel ist weiterhin eine Treppe.</li><li><strong>Die Kameras des Security Guard</strong> hängen unter dem Schiff statt auf Wurzelebene und fallen durch den Welt-Weiterleiter. Bewusst offen gelassen statt geraten.</li><li><strong>Ton und begehbare Lüftungen</strong> sind weiterhin offen.</li></ul><p class='note'>Nightfall wird aktiv weiterentwickelt und getestet; die README des Repos führt die vollständige, aktuelle Liste der Befunde und offenen Punkte.</p>"
          }
        }
      ]
    }
  ]
};

const MODS = { chance: CHANCE, useful: USEFUL, unknowns: UNKNOWNS, nightfall: NIGHTFALL };
