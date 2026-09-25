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
    nav_atlas: "Atlas",
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
    home_hero_title: "Five mods. One wiki.",
    home_hero_sub: "Randomized chaos, a pile of quality-of-life fixes, brand-new custom roles, a first-person view and new maps for The Other Roles 4.8.0. Click any feature to read what it does.",
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
    nav_atlas: "Atlas",
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
    home_hero_title: "Fünf Mods. Ein Wiki.",
    home_hero_sub: "Zufalls-Chaos, ein Haufen Komfort-Fixes, brandneue eigene Rollen, eine Ich-Perspektive und neue Karten für The Other Roles 4.8.0. Klick auf ein Feature, um zu lesen, was es macht.",
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

/* ----------------------------------------------------------------------------
 * Shield matrix — one data set, rendered per language.
 * Cell codes: b = the shield holds, p = the attack goes through,
 *             o = depends on an option, n = not applicable.
 * Row order inside a group is the order the wiki shows; the column order is
 * SHIELD_HEADS and must match the seven characters of every `v` string.
 * -------------------------------------------------------------------------- */
const SHIELD_HEADS = {
  en: ["Medic", "Time Master", "Armored", "Mini", "First kill", "Newcomer", "Spawn zone"],
  de: ["Medic", "Time Master", "Armored", "Mini", "Erstopfer", "Neuling", "Spawnschutz"]
};

const SHIELD_CELL = {
  b: `<span style="color:var(--task-green);font-weight:700" title="blocked">✓</span>`,
  p: `<span style="color:var(--crew-red);font-weight:700" title="goes through">✗</span>`,
  o: `<span style="color:var(--chance);font-weight:700" title="option">~</span>`,
  n: `<span style="color:var(--faint)">·</span>`
};

function shieldTbl(lang, rows) {
  const head = [lang === "de" ? "Interaktion" : "Interaction"].concat(SHIELD_HEADS[lang]);
  const body = rows.map(r => [`${r[lang]} <span style="color:var(--faint);font-size:.85em">${r.mod}</span>`]
    .concat(r.v.split("").map(c => SHIELD_CELL[c] || SHIELD_CELL.n)));
  return tbl(head, body);
}

const SHIELD_LEGEND = {
  en: `<p><span style="color:var(--task-green);font-weight:700">✓</span> the shield holds &nbsp; <span style="color:var(--crew-red);font-weight:700">✗</span> the attack goes through &nbsp; <span style="color:var(--chance);font-weight:700">~</span> depends on an option &nbsp; <span style="color:var(--faint)">·</span> not applicable</p>`,
  de: `<p><span style="color:var(--task-green);font-weight:700">✓</span> das Schild hält &nbsp; <span style="color:var(--crew-red);font-weight:700">✗</span> der Angriff geht durch &nbsp; <span style="color:var(--chance);font-weight:700">~</span> hängt an einer Option &nbsp; <span style="color:var(--faint)">·</span> nicht anwendbar</p>`
};

/* Group 1 — everything that goes through TOR's kill funnel (Helpers.checkMuderAttempt),
   where all seven shields apply at once. */
const SHIELD_FUNNEL = [
  { en: "Impostor kill button", de: "Impostor-Kill-Knopf", mod: "TOR", v: "bbbbbbb" },
  { en: "Sheriff shot", de: "Sheriff-Schuss", mod: "TOR", v: "bbbbbbb" },
  { en: "Jackal kill", de: "Jackal-Kill", mod: "TOR", v: "bbbbbbb" },
  { en: "Sidekick kill", de: "Sidekick-Kill", mod: "TOR", v: "bbbbbbb" },
  { en: "Vampire bite", de: "Vampire-Biss", mod: "TOR", v: "bbbbbbb" },
  { en: "Warlock curse kill", de: "Warlock-Fluch-Kill", mod: "TOR", v: "bbbbbbb" },
  { en: "Witch spell (cast and resolution)", de: "Witch-Zauber (Wurf und Auflösung)", mod: "TOR", v: "bbbbbbb" },
  { en: "Ninja marked kill", de: "Ninja-Markierungskill", mod: "TOR", v: "bbbbbbb" },
  { en: "Thief kill", de: "Thief-Kill", mod: "TOR", v: "bbbbbbb" },
  { en: "Bomber explosion", de: "Bomber-Explosion", mod: "TOR", v: "bbbbbbb" },
  { en: "Pelican swallow", de: "Pelican verschluckt", mod: "UC", v: "bbbbbbb" },
  { en: "Hunter shot", de: "Hunter-Schuss", mod: "UC", v: "bbbbbbb" },
  { en: "Copycat with a copied ability", de: "Copycat mit kopierter Fähigkeit", mod: "UC", v: "bbbbbbb" },
  { en: "Stalker strike (after 100%)", de: "Stalker-Schlag (nach 100%)", mod: "UC", v: "bbbbbbb" },
  { en: "Revenger kill after a partner's death", de: "Revenger-Kill nach Partnertod", mod: "FF", v: "bbbbbbb" },
  { en: "Sidekick kills the Jackal", de: "Sidekick tötet den Jackal", mod: "FF", v: "bbbbbbb" }
];

/* Group 2 — deaths with their own path; the funnel and therefore most shields never see them. */
const SHIELD_BYPASS = [
  { en: "Guesser shot in a meeting", de: "Guesser-Schuss im Meeting", mod: "TOR", v: "ooppppp" },
  { en: "Arsonist ignites", de: "Arsonist zündet", mod: "TOR", v: "ppppppp" },
  { en: "Lover cascade", de: "Lover-Kaskade", mod: "TOR", v: "ppppppp" },
  { en: "Lawyer or Pursuer dies with the client", de: "Lawyer oder Pursuer stirbt mit dem Klienten", mod: "TOR", v: "ppppppp" },
  { en: "Ejection by vote", de: "Rauswurf per Abstimmung", mod: "Vanilla", v: "ppppppp" },
  { en: "Tesla discharge", de: "Tesla-Entladung", mod: "UC", v: "ppppppp" },
  { en: "Saboteur task trap", de: "Saboteur-Taskfalle", mod: "UC", v: "ppppppp" },
  { en: "Poison death of the reporter", de: "Poisoner-Gifttod des Melders", mod: "UC", v: "ppppppp" },
  { en: "Maniac bomb (the blast)", de: "Maniac-Bombe (Explosion)", mod: "UC", v: "oopbbbb" },
  { en: "Thralls die with the Necromancer", de: "Thralls sterben mit dem Necromancer", mod: "UC", v: "ppppppp" }
];

/* Group 3 — abilities that target a player without killing. Since 2026-08-18 they announce
   themselves as peaceful, so both Forgotten Fixes shields let them through. */
const SHIELD_PEACEFUL = [
  { en: "Medic places a shield", de: "Medic schildet jemanden", mod: "TOR", v: "nnnnnpp" },
  { en: "Shifter swaps roles", de: "Shifter tauscht die Rolle", mod: "TOR", v: "nnnnnpp" },
  { en: "Morphling takes a sample", de: "Morphling nimmt eine Probe", mod: "TOR", v: "nnnnnpp" },
  { en: "Tracker attaches", de: "Tracker heftet sich an", mod: "TOR", v: "nnnnnpp" },
  { en: "Deputy handcuffs", de: "Deputy legt Handschellen an", mod: "TOR", v: "nnnnnpp" },
  { en: "Eraser erases a role", de: "Eraser löscht eine Rolle", mod: "TOR", v: "nnnbnpp" },
  { en: "Arsonist douses", de: "Arsonist begießt", mod: "TOR", v: "nnnbnpp" },
  { en: "Pursuer hands out a blank", de: "Pursuer gibt eine Platzpatrone", mod: "TOR", v: "nnnnnpp" },
  { en: "Silencer marks a target", de: "Silencer schaltet stumm", mod: "UC", v: "nnnnnpp" },
  { en: "Maniac plants or passes the bomb", de: "Maniac pflanzt oder übergibt die Bombe", mod: "UC", v: "nnnbnbb" }
];

/* ============================================================================
 * CHANCE MODIFIER
 * ==========================================================================*/
const CHANCE = {
  key: "chance",
  name: "Chance Modifier",
  fullName: { en: "TOR — Unknown Chaos (Chance Modifier)", de: "TOR — Unknown Chaos (Chance Modifier)" },
  version: "1.2.22",
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
  version: "1.4.8",
  allClients: true,
  repo: "https://github.com/DaUnknown-0/Useful-TOR-stuff",
  download: "https://github.com/DaUnknown-0/Useful-TOR-stuff/releases/latest",
  tagline: {
    en: "A bundle of quality-of-life fixes and new role options for TOR 4.8.0, plus a cross-mod Mod Manager, a 25-language localization engine, mod sync, a newcomer kill shield and a browser settings editor.",
    de: "Ein Bündel aus Komfort-Fixes und neuen Rollen-Optionen für TOR 4.8.0, plus ein Mod-übergreifender Mod Manager, eine 25-Sprachen-Lokalisierung, Mod-Abgleich, ein Newcomer-Kill-Schild und ein Browser-Einstellungs-Editor."
  },
  intro: {
    en: "TOR - Forgotten Fixes (formerly Useful TOR Stuff) adds new options to TOR 4.8.0 and fixes bugs without touching TOR's source. It resolves TOR types via reflection, so every patch degrades to a no-op (with a log warning) rather than crashing if TOR's internals change. Most win-checks and meeting overrides are host-authoritative — they apply regardless of who has the mod. Recent releases added a localization engine for the whole mod family, a meeting map ping, mod sync in the lobby, a kill shield for session newcomers, a random Impostor count, Multi-Jester, true modifier chances, the WebConfig browser settings page and a fairness gate for hosts without the mod.",
    de: "TOR - Forgotten Fixes (früher Useful TOR Stuff) fügt TOR 4.8.0 neue Optionen hinzu und behebt Bugs ohne Änderung an TORs Quellcode. Es löst TOR-Typen per Reflection auf, sodass jeder Patch zu einem No-Op (mit Log-Warnung) degradiert, statt abzustürzen, wenn sich TORs Interna ändern. Die meisten Win-Checks und Meeting-Overrides sind host-autoritativ — sie wirken unabhängig davon, wer den Mod hat. Die letzten Releases brachten eine Lokalisierungs-Engine für die ganze Mod-Familie, einen Meeting-Map-Ping, Mod-Abgleich in der Lobby, ein Kill-Schild für Session-Neulinge, eine zufällige Impostor-Anzahl, Multi-Jester, echte Modifier-Chancen, die WebConfig-Browser-Einstellungsseite und ein Fairness-Gate für Hosts ohne den Mod."
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
        },
        {
          id: "armored-bomber",
          title: { en: "Armored Bomber fix", de: "Armored-Bomber-Fix" },
          summary: {
            en: "An armored Bomber no longer loses his armor (and his bomb) just by planting one.",
            de: "Ein gepanzerter Bomber verliert seine Panzerung (und seine Bombe) nicht mehr allein durchs Legen."
          },
          body: {
            en: "<p><strong>Problem:</strong> planting a bomb runs a kill self-probe against the Bomber himself; with the Armored modifier, that probe consumed the armor and locked the bomb.</p><p><strong>Fix:</strong> the self-probe skips the armor, so an armored Bomber keeps both his protection and his bomb.</p>",
            de: "<p><strong>Problem:</strong> Das Legen einer Bombe führt eine Kill-Selbstprobe gegen den Bomber selbst aus; mit dem Armored-Modifier verbrauchte diese Probe die Panzerung und sperrte die Bombe.</p><p><strong>Fix:</strong> Die Selbstprobe überspringt die Panzerung, ein gepanzerter Bomber behält Schutz und Bombe.</p>"
          }
        },
        {
          id: "sound-buttons",
          title: { en: "Dead end-screen buttons after bomb sounds", de: "Tote End-Screen-Buttons nach Bomben-Sounds" },
          summary: {
            en: "Positional sound playback no longer destroys the game's own audio sources, which used to kill the Play Again / Leave buttons.",
            de: "Positionale Sound-Wiedergabe zerstört nicht mehr die spieleigenen Audio-Quellen, was vorher die Play-Again-/Leave-Buttons lahmlegte."
          },
          body: {
            en: "<p><strong>Problem:</strong> TOR's <code>playAtPosition</code> destroyed AudioSources owned by the game's SoundManager; after bomb sounds the end screen's Play Again and Leave buttons went dead.</p><p><strong>Fix:</strong> the playback no longer tears down SoundManager-owned sources.</p>",
            de: "<p><strong>Problem:</strong> TORs <code>playAtPosition</code> zerstörte AudioSources, die dem SoundManager des Spiels gehören; nach Bomben-Sounds waren die Play-Again- und Leave-Buttons des End-Screens tot.</p><p><strong>Fix:</strong> Die Wiedergabe reißt keine SoundManager-eigenen Quellen mehr ab.</p>"
          }
        },
        {
          id: "lobby-leaks",
          title: { en: "Lobby leak guard", de: "Lobby-Leak-Guard" },
          summary: {
            en: "Phantom Mini / Armored / Tiebreaker holders no longer leak from your last game into a foreign lobby.",
            de: "Phantom-Mini-/Armored-/Tiebreaker-Träger leaken nicht mehr aus deinem letzten Spiel in eine fremde Lobby."
          },
          body: {
            en: "<p><strong>Problem:</strong> per-round player lists were only cleared by TOR's round reset. Joining a different lobby without playing a round first left stale player IDs behind, so random players in the new lobby appeared as Mini, Armored or Tiebreaker holders.</p><p><strong>Fix:</strong> a lobby-leak guard additionally clears all such lists when joining a game, so state can never travel between lobbies.</p>",
            de: "<p><strong>Problem:</strong> Per-Runden-Spielerlisten wurden nur von TORs Runden-Reset geleert. Wer ohne gespielte Runde in eine andere Lobby wechselte, nahm alte PlayerIds mit, und zufällige Spieler der neuen Lobby galten plötzlich als Mini-, Armored- oder Tiebreaker-Träger.</p><p><strong>Fix:</strong> Ein Lobby-Leak-Guard leert alle solchen Listen zusätzlich beim Lobby-Beitritt, sodass Zustand nie zwischen Lobbys wandern kann.</p>"
          }
        },
        {
          id: "medic-shift-shield",
          title: { en: "Medic shield survives the Shifter", de: "Medic-Schild überlebt den Shifter" },
          summary: {
            en: "A medic who dies with a shield still queued no longer takes the charge with them.",
            de: "Ein Medic, der mit vorgemerktem Schild stirbt, nimmt die Ladung nicht mehr mit."
          },
          body: {
            en: "<p><strong>Problem:</strong> with <em>Set Shield After Meeting</em> on, pressing the shield button spends the charge immediately but places the shield only at the exile screen, and only while the medic is alive. A medic killed in between therefore never delivers it — and <code>usedShield</code> is a static that belongs to the ROLE, reset only at round start. The Shifter moves the medic pointer and nothing else, so whoever is shifted into the role inherits a used-up shield for a shield nobody ever received. Quieter second half: the queued target stayed set, so at the NEXT exile the medic pointer is a living player again and TOR places that stale shield — one the new medic never chose.</p><p><strong>Fix:</strong> both are cleared. Only the undelivered charge is refunded; a shield that was really placed stays spent, so a successor does not get a second one.</p>",
            de: "<p><strong>Problem:</strong> Mit <em>Set Shield After Meeting</em> verbraucht der Knopfdruck die Ladung sofort, legt das Schild aber erst beim Exile — und nur, solange der Medic lebt. Stirbt er dazwischen, wird es nie gelegt, und <code>usedShield</code> ist ein Statik-Flag der ROLLE, das nur beim Rundenstart zurückgesetzt wird. Der Shifter verschiebt nur den Medic-Zeiger, also erbt der Nachrücker ein verbrauchtes Schild für ein Schild, das nie jemand bekommen hat. Leisere zweite Hälfte: das vorgemerkte Ziel blieb stehen, sodass beim NÄCHSTEN Exile wieder ein lebender Medic da ist und TOR dieses alte Schild legt — eines, das der neue Medic nie gewählt hat.</p><p><strong>Fix:</strong> Beides wird geräumt. Zurückgegeben wird nur die nie gelieferte Ladung; ein wirklich gelegtes Schild bleibt verbraucht, der Nachfolger bekommt also kein zweites.</p>"
          }
        },
        {
          id: "settings-popup-name",
          title: { en: "Settings popup names the setting", de: "Settings-Popup nennt die Einstellung" },
          summary: {
            en: "Changing a modded option showed only the value, never which setting it belonged to.",
            de: "Beim Ändern einer Mod-Option stand nur der Wert da, nie die zugehörige Einstellung."
          },
          body: {
            en: "<p><strong>Problem:</strong> the notification in the lobby\'s bottom-left corner read just <code>3</code> or <code>On</code>. TOR passes <code>(StringNames)(id + 6000)</code> as the name key, and the vanilla method builds its line as <em>name: value</em>. That key is not a real <code>StringNames</code> — the offset exists precisely so it collides with nothing — so the lookup finds nothing and only the value survives.</p><p><strong>Fix:</strong> the name was never lost, it was never asked for. The option is resolved from TOR\'s own option list under that id and the whole line is written out. Vanilla settings and ids with no option behind them fall through untouched.</p>",
            de: "<p><strong>Problem:</strong> Die Meldung unten links in der Lobby zeigte nur <code>3</code> oder <code>On</code>. TOR übergibt <code>(StringNames)(id + 6000)</code> als Namensschlüssel, und die Vanilla-Methode baut ihre Zeile als <em>Name: Wert</em>. Dieser Schlüssel ist kein echter <code>StringNames</code> — der Versatz existiert gerade, damit er mit nichts kollidiert — also findet die Suche nichts und nur der Wert bleibt übrig.</p><p><strong>Fix:</strong> Der Name war nie verloren, er wurde nie erfragt. Die Option wird unter dieser ID aus TORs eigener Optionsliste geholt und die ganze Zeile geschrieben. Vanilla-Einstellungen und IDs ohne Option laufen unangetastet durch.</p>"
          }
        },
        {
          id: "trapper-freeze",
          title: { en: "Trapper log meeting freeze", de: "Trapper-Log-Meeting-Freeze" },
          summary: {
            en: "The Trapper's trap log no longer freezes the meeting for every ghost.",
            de: "Das Fallen-Log des Trappers friert das Meeting für Geister nicht mehr ein."
          },
          body: {
            en: "<p><strong>Problem:</strong> rendering the Trapper's trap information at meeting start could throw for dead players and freeze their meeting UI.</p><p><strong>Fix:</strong> the log is built defensively, so ghosts get their meeting like everyone else.</p>",
            de: "<p><strong>Problem:</strong> Der Aufbau der Trapper-Fallen-Info beim Meeting-Start konnte für tote Spieler eine Exception werfen und ihr Meeting-UI einfrieren.</p><p><strong>Fix:</strong> Das Log wird defensiv gebaut, Geister bekommen ihr Meeting wie alle anderen.</p>"
          }
        },
        {
          id: "modmanager-disabled",
          title: { en: "Mod Manager survives being disabled", de: "Mod Manager überlebt das Deaktivieren" },
          summary: {
            en: "Disabling Forgotten Fixes in the Mod Manager no longer takes the Mod Manager down with it.",
            de: "Forgotten Fixes im Mod Manager zu deaktivieren nimmt den Mod Manager nicht mehr mit."
          },
          body: {
            en: "<p><strong>Problem:</strong> disabling the mod also disabled the Mod Manager UI it provides, and with it the only switch to turn the mod back on.</p><p><strong>Fix:</strong> the Mod Manager keeps running while the rest of the mod is disabled. Unknown's Collection got the same treatment for its own entry.</p>",
            de: "<p><strong>Problem:</strong> Das Deaktivieren des Mods deaktivierte auch die von ihm gestellte Mod-Manager-UI, und damit den einzigen Schalter, um den Mod wieder einzuschalten.</p><p><strong>Fix:</strong> Der Mod Manager läuft weiter, während der Rest des Mods deaktiviert ist. Unknown's Collection bekam dieselbe Behandlung für seinen eigenen Eintrag.</p>"
          }
        }
      ]
    },
    {
      id: "crewmate",
      title: { en: "New options — Crewmate", de: "Neue Optionen — Crewmate" },
      entries: [
        {
          id: "trapper-extras",
          title: { en: "Trapper: find your traps, keep the log", de: "Trapper: Fallen finden, Log behalten" },
          badges: [{ en: "Crewmate → Trapper", de: "Crewmate → Trapper" }],
          summary: {
            en: "The traps are numbered on the map, and the trap log stays reachable in the chat after the meeting.",
            de: "Die Fallen sind auf der Karte nummeriert, und das Fallen-Log bleibt nach dem Meeting im Chat erreichbar."
          },
          body: {
            en: "<p>Two gaps, both about information the trapper already owns but cannot reach. Each is a host option, default on.</p><p><strong>The traps are numbered on the map.</strong> TOR\'s log says <em>Trap 3:</em> using a counter that already runs 1..X, and never says where trap 3 is: the traps are drawn in the world but only on the screen the trapper is standing on, so on Airship or Polus the number answers a question they cannot ask. The markers use TOR\'s own here-point and the same world-to-map transform its trapped-player markers use, so a trap marker lands where a player marker for the same spot would.</p><p><strong>The log survives the meeting.</strong> It is written into the meeting chat, and the traps that produced it are destroyed a few lines later, so afterwards there is no way back to it. A button of the trapper\'s own (<kbd>L</kbd>) reopens the chat and writes in whatever they have not been shown yet; reopening adds nothing, and each meeting\'s entries appear the next time. The entries carry TOR\'s own shuffle of who walked into which trap, rather than the true trigger order it shuffles precisely to hide. Two narrow concessions make that work: the in-round chat clamp gains one more exemption for as long as the view is open, and sending is refused for exactly as long — the trapper reads, and cannot start talking mid-round.</p>",
            de: "<p>Zwei Lücken, beide über Wissen, das der Trapper längst besitzt, aber nicht erreicht. Je eine Host-Option, Standard an.</p><p><strong>Die Fallen sind auf der Karte nummeriert.</strong> TORs Log sagt <em>Trap 3:</em> über einen Zähler, der ohnehin 1..X läuft, und sagt nie, wo Falle 3 ist: die Fallen sind in der Welt gezeichnet, aber nur auf dem Bildschirm, auf dem der Trapper gerade steht — auf Airship oder Polus beantwortet die Nummer also eine Frage, die er nicht stellen kann. Die Marker benutzen TORs eigenen Here-Point und dieselbe Welt-zu-Karte-Umrechnung wie seine Marker für gefangene Spieler, damit ein Fallen-Marker dort landet, wo ein Spielermarker für denselben Punkt läge.</p><p><strong>Das Log überlebt das Meeting.</strong> Es wird in den Meeting-Chat geschrieben, und die Fallen, die es erzeugt haben, werden wenige Zeilen später zerstört — danach führt kein Weg mehr dorthin zurück. Ein eigener Knopf (<kbd>L</kbd>) öffnet den Chat wieder und schreibt nach, was der Trapper noch nicht gesehen hat; erneutes Öffnen fügt nichts hinzu, und die Einträge jedes Meetings erscheinen beim nächsten Mal. Die Einträge tragen TORs eigene Mischung, wer in welche Falle gelaufen ist, statt der echten Reihenfolge, die TOR gerade deshalb mischt. Zwei enge Zugeständnisse machen das möglich: die Chat-Sperre der laufenden Runde bekommt eine Ausnahme mehr, solange die Ansicht offen ist, und Senden ist genauso lange gesperrt — der Trapper liest, und kann nicht mitten in der Runde zu reden anfangen.</p>"
          }
        },
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
            de: "Erlaubt dem Spy, wie ein Engineer durch Vents zu reisen, nicht nur betreten/verlassen."
          },
          body: {
            en: tbl(["Option", "Values", "What it does"], [
              ["Spy Can Fully Vent", "Off / On", "Spy can not only enter/exit vents but travel inside them like an Engineer."]
            ]) + "<p class='note'>TOR only allows enter/exit; this option unlocks the directional arrows.</p>",
            de: tbl(["Option", "Werte", "Funktion"], [
              ["Spy Can Fully Vent", "Off / On", "Spy kann Vents nicht nur betreten/verlassen, sondern wie ein Engineer darin reisen."]
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
            ]) + "<p class='note'>Nur der direkt erratene Spieler zählt; ein mitsterbender Lover-Partner nicht.</p>"
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
          title: { en: "Lawyer / Lover position tracking", de: "Lawyer- / Lover-Positionsanzeige" },
          badges: [{ en: "Neutral → Lawyer · Modifier → Lover", de: "Neutral → Lawyer · Modifier → Lover" }],
          summary: {
            en: "Lets the Lawyer see their target, and a Lover see their partner, on the map.",
            de: "Lässt den Lawyer sein Ziel und einen Lover seinen Partner auf der Karte sehen."
          },
          body: {
            en: tbl(["Option", "Values", "What it does"], [
              ["Lawyer Knows Target Position", "Off / On", "Lawyer sees their target on the map."],
              ["…Last Position Visible In Meeting", "Off / On", "Marker stays at the last known position during meetings."],
              ["Lover Knows Partner Position", "Off / On", "Lover sees their partner on the map."],
              ["…Last Position Visible In Meeting", "Off / On", "Marker stays at the last known position during meetings."]
            ]),
            de: tbl(["Option", "Werte", "Funktion"], [
              ["Lawyer Knows Target Position", "Off / On", "Lawyer sieht sein Ziel auf der Karte."],
              ["…Last Position Visible In Meeting", "Off / On", "Marker bleibt im Meeting auf der letzten bekannten Position."],
              ["Lover Knows Partner Position", "Off / On", "Lover sieht seinen Partner auf der Karte."],
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
      id: "assignment",
      title: { en: "Role assignment", de: "Rollenzuweisung" },
      intro: {
        en: "Three host-side features that change how roles and modifiers are handed out: a secret random Impostor count, up to three solo Jesters, and modifier chances that finally mean what they say.",
        de: "Drei host-seitige Features, die verändern, wie Rollen und Modifier vergeben werden: eine geheime zufällige Impostor-Anzahl, bis zu drei Solo-Jester und Modifier-Chancen, die endlich bedeuten, was sie sagen."
      },
      entries: [
        {
          id: "impostor-count-range",
          title: { en: "Random Impostor count (Min/Max)", de: "Zufällige Impostor-Anzahl (Min/Max)" },
          badges: [{ en: "Host-authoritative", de: "Host-autoritativ" }],
          summary: {
            en: "The host rolls the Impostor count once per game between Min and Max; every visible surface shows the maximum, so the real number stays secret.",
            de: "Der Host würfelt die Impostor-Anzahl einmal pro Spiel zwischen Min und Max; jede sichtbare Fläche zeigt das Maximum, die echte Zahl bleibt geheim."
          },
          body: {
            en: "<p>With <em>Random Impostor Count</em> on, the host rolls the actual Impostor count once per game between the configured minimum and maximum (each 1–3), right before roles are assigned. Secrecy is the point: lobby and intro always display the <strong>maximum</strong>, and the intro team view is additionally obscured when a single Impostor plus a possible Spy would give the number away. Because TOR normally enables the Spy only with 2+ Impostors (which itself would leak the roll), the Spy stays in the pool whenever the configured maximum is at least 2. Two mutually exclusive Sidekick modes hook in when TOR's \"Jackal Can Create A Sidekick\" is on: <em>Sidekick Only Fills A Missing Impostor</em> guarantees the Jackal the button exactly when fewer Impostors spawned than the maximum, and <em>Chance That The Jackal Can Create A Sidekick</em> rolls a per-game percentage instead.</p>" + tbl(["Option", "Default", "What it does"], [
              ["Random Impostor Count", "Off", "Enables the random roll."],
              ["Minimum Impostors", "1", "Lower bound of the roll (1–3)."],
              ["Maximum Impostors", "2", "Upper bound of the roll and the number everyone sees (1–3)."],
              ["Sidekick Only Fills A Missing Impostor", "Off", "Jackal gets the Sidekick button exactly when Impostors < Max."],
              ["Chance That The Jackal Can Create A Sidekick", "100%", "Per-game rolled chance (0–100); 100% = pure TOR behaviour."]
            ]),
            de: "<p>Mit <em>Random Impostor Count</em> würfelt der Host die tatsächliche Impostor-Anzahl einmal pro Spiel zwischen konfiguriertem Minimum und Maximum (je 1–3), direkt bevor die Rollen vergeben werden. Die Geheimhaltung ist der Kern: Lobby und Intro zeigen immer das <strong>Maximum</strong>, und die Intro-Team-Anzeige wird zusätzlich verschleiert, wenn ein einzelner Impostor plus möglicher Spy die Zahl verraten würde. Weil TOR den Spy normalerweise nur bei 2+ Impostoren aktiviert (was selbst schon den Wurf leaken würde), bleibt der Spy im Pool, sobald das konfigurierte Maximum mindestens 2 ist. Zwei sich ausschließende Sidekick-Modi greifen, wenn TORs \"Jackal Can Create A Sidekick\" an ist: <em>Sidekick Only Fills A Missing Impostor</em> garantiert dem Jackal den Button genau dann, wenn weniger Impostoren gespawnt sind als das Maximum, und <em>Chance That The Jackal Can Create A Sidekick</em> würfelt stattdessen eine Pro-Spiel-Prozentchance.</p>" + tbl(["Option", "Standard", "Funktion"], [
              ["Random Impostor Count", "Off", "Aktiviert den Zufalls-Wurf."],
              ["Minimum Impostors", "1", "Untergrenze des Wurfs (1–3)."],
              ["Maximum Impostors", "2", "Obergrenze des Wurfs und die Zahl, die alle sehen (1–3)."],
              ["Sidekick Only Fills A Missing Impostor", "Off", "Jackal bekommt den Sidekick-Button genau dann, wenn Impostoren < Max."],
              ["Chance That The Jackal Can Create A Sidekick", "100%", "Pro Spiel gewürfelte Chance (0–100); 100% = pures TOR-Verhalten."]
            ])
          }
        },
        {
          id: "multi-jester",
          title: { en: "Multi-Jester", de: "Multi-Jester" },
          summary: {
            en: "Up to three Jesters per round, each winning alone. Extra Jesters are drawn from the leftover plain crewmates.",
            de: "Bis zu drei Jester pro Runde, jeder gewinnt allein. Zusätzliche Jester kommen aus den übrigen reinen Crewmates."
          },
          body: {
            en: "<p><em>Jester Quantity</em> (1–3, default 1) allows extra Jesters, drawn randomly from the remaining plain crewmates after TOR's role assignment (only when TOR spawned a Jester at all; in Role Draft rounds extra Jester picks are enabled through a placeholder-role trick). Every Jester wins <strong>alone</strong>: whoever gets voted out is the sole winner, and every other Jester is removed from the winner list at any other game end. The mod patches every spot where TOR asks \"is this the Jester?\" (role display, fake tasks, Impostor vision, killer status, ejection text, win trigger), so extra Jesters behave exactly like the original. The feature automatically falls back to a single Jester when not all players have the mod.</p>",
            de: "<p><em>Jester Quantity</em> (1–3, Default 1) erlaubt zusätzliche Jester, zufällig aus den verbleibenden reinen Crewmates nach TORs Rollenzuweisung gezogen (nur wenn TOR überhaupt einen Jester gespawnt hat; in Role-Draft-Runden werden weitere Jester-Picks über einen Platzhalter-Rollen-Trick ermöglicht). Jeder Jester gewinnt <strong>allein</strong>: Wer rausgewählt wird, ist alleiniger Sieger, und jeder andere Jester wird bei jedem anderen Spielende aus der Siegerliste entfernt. Der Mod flickt jede Stelle, an der TOR \"ist das der Jester?\" fragt (Rollenanzeige, Fake-Tasks, Impostor-Sicht, Killer-Status, Verbannungstext, Sieg-Auslösung), sodass sich zusätzliche Jester exakt wie das Original verhalten. Das Feature fällt automatisch auf einen einzelnen Jester zurück, wenn nicht alle Spieler den Mod haben.</p>"
          }
        },
        {
          id: "true-modifier-chances",
          title: { en: "True modifier chances", de: "Echte Modifier-Chancen" },
          badges: [{ en: "Host-authoritative", de: "Host-autoritativ" }],
          summary: {
            en: "10% finally means 10%: every modifier is rolled once per round against its real percentage instead of TOR's relative ticket lottery.",
            de: "10% heißt endlich 10%: Jeder Modifier wird einmal pro Runde echt gegen seinen Prozentsatz gewürfelt, statt TORs relativer Ticket-Lotterie."
          },
          body: {
            en: "<p><strong>Problem:</strong> TOR treats modifier percentages as relative lottery tickets, not probabilities. With enough free modifier slots even a 10% modifier spawns almost every round, and with few slots a 90% modifier is often missing.</p><p><strong>Fix:</strong> with <em>True Modifier Chances</em> on, every modifier (and every copy of quantity modifiers) is rolled once per round against its actual configured percentage before TOR assigns. Winners go through TOR's own assignment machinery as guaranteed, losers are dropped for the round; the Min/Max modifier limit then acts as a pure upper cap with random trimming. The Lover is untouched (TOR already rolls it correctly). Host-side only and compatible with plain TOR clients.</p>",
            de: "<p><strong>Problem:</strong> TOR behandelt Modifier-Prozente als relative Lose, nicht als Wahrscheinlichkeiten. Mit genug freien Modifier-Slots spawnt selbst ein 10%-Modifier fast jede Runde, mit wenigen Slots fehlt oft sogar ein 90%-Modifier.</p><p><strong>Fix:</strong> Mit <em>True Modifier Chances</em> wird jeder Modifier (und jede Kopie von Mengen-Modifiern) einmal pro Runde echt gegen seinen konfigurierten Prozentsatz gewürfelt, bevor TOR zuweist. Gewinner laufen als garantiert durch TORs eigene Zuweisungsmaschinerie, Verlierer setzen die Runde aus; das Min/Max-Modifier-Limit wirkt dann als reine Obergrenze mit zufälligem Kürzen. Der Lover bleibt unangetastet (TOR würfelt ihn bereits korrekt). Rein host-seitig und kompatibel mit reinen TOR-Clients.</p>"
          }
        }
      ]
    },
    {
      id: "newcomer-shield",
      title: { en: "Kill shields", de: "Kill-Schilde" },
      intro: {
        en: "Two shields of our own — a free first round for newcomers, and a safe spawn zone — plus the full table of which shield stops which interaction.",
        de: "Zwei eigene Schilde — eine freie erste Runde für Neulinge und eine sichere Spawnzone — plus die vollständige Tabelle, welches Schild welche Interaktion aufhält."
      },
      entries: [
        {
          id: "newcomer-shield-core",
          title: { en: "How the shield works", de: "Wie das Schild funktioniert" },
          badges: [{ en: "Host-authoritative", de: "Host-autoritativ" }],
          summary: {
            en: "Players new to the session cannot be killed or even targeted until the first meeting, by vanilla kills and TOR role kills alike. A gold outline marks them.",
            de: "Session-Neulinge können bis zum ersten Meeting weder getötet noch überhaupt anvisiert werden, von Vanilla-Kills wie von TOR-Rollen-Kills. Eine goldene Outline markiert sie."
          },
          body: {
            en: "<p>With <em>Protect Players New To This Session</em> on, a player joining the host's session for the first time gets a shield for their very first round: they cannot be killed, neither by vanilla Impostor kills nor by TOR role kills (Sheriff, Jackal, Vampire and friends). Attackers cannot even pick them as a target, so a role that suicides on a failed kill never fires in the first place. <strong>Peaceful abilities are exempt</strong>: the Medic can still shield them, the Tracker still tracks them, the Shifter still shifts. <strong>Being recruited is not being killed</strong>, so the Jackal can still pick a shielded newcomer as his Sidekick — his kill on that same player stays refused, on the host and on his own client, and the exception closes again the moment his sidekick exists. The shield ends exactly at the first meeting, never later, so it can never decide a game. Shielded players carry a <strong>gold</strong> outline (deliberately neither the Medic cyan nor the first-kill blue), and the killer optionally learns why the kill failed. Lover cascades are deliberately not suppressed: the shield guards against being killed, not against the lover bond.</p>",
            de: "<p>Mit <em>Protect Players New To This Session</em> bekommt ein Spieler, der zum ersten Mal in der Session des Hosts mitspielt, ein Schild für seine allererste Runde: Er kann nicht getötet werden, weder von Vanilla-Impostor-Kills noch von TOR-Rollen-Kills (Sheriff, Jackal, Vampire und Co.). Angreifer können ihn nicht einmal als Ziel auswählen, eine Rolle mit Selbstmord bei Fehlkill schießt also gar nicht erst. <strong>Friedliche Fähigkeiten sind ausgenommen</strong>: Der Medic kann ihn weiterhin schilden, der Tracker ihn verfolgen, der Shifter mit ihm tauschen. <strong>Rekrutiert zu werden ist nicht getötet zu werden</strong>, deshalb kann der Jackal einen geschützten Neuling weiterhin als Sidekick anwerben — sein Kill auf denselben Spieler bleibt abgelehnt, auf dem Host wie auf seinem eigenen Client, und die Ausnahme schließt sich wieder, sobald sein Sidekick existiert. Das Schild endet exakt beim ersten Meeting, nie später, damit es nie ein Spiel entscheidet. Geschützte tragen eine <strong>goldene</strong> Outline (bewusst weder Medic-Cyan noch Erste-Kill-Blau), und der Killer erfährt optional, warum der Kill fehlschlug. Lover-Kaskaden werden bewusst nicht unterdrückt: Das Schild schützt vor dem Getötetwerden, nicht vor der Lover-Bindung.</p>"
          }
        },
        {
          id: "newcomer-shield-session",
          title: { en: "Session rules & host control", de: "Session-Regeln & Host-Kontrolle" },
          summary: {
            en: "\"New\" is tracked per friend code across the session, the very first lobby counts as the regular group, and the host can mark or unmark anyone by hand.",
            de: "\"Neu\" wird pro Friend-Code über die Session verfolgt, die allererste Lobby gilt als Stammgruppe, und der Host kann jeden von Hand markieren oder demarkieren."
          },
          body: {
            en: "<p>The host tracks who has already played this session by <strong>friend code</strong> (with a name fallback on servers without accounts). The very first lobby of a session is the grace period: nobody counts as new there, that is the regular group. From the second round on, an unknown friend code means protection. The host can also mark players as new or revoke the shield manually in a lobby panel, and the hand mark beats the automatic in both directions. The session state survives a restart or crash for 10 minutes, after which the session genuinely starts over.</p>",
            de: "<p>Der Host verfolgt per <strong>Friend-Code</strong>, wer in dieser Session schon gespielt hat (mit Namens-Fallback auf Servern ohne Accounts). Die allererste Lobby einer Session ist die Gnadenfrist: Dort zählt niemand als neu, das ist die Stammgruppe. Ab der zweiten Runde bedeutet ein unbekannter Friend-Code Schutz. Der Host kann Spieler außerdem in einem Lobby-Panel von Hand als neu markieren oder das Schild entziehen, und die Handmarkierung schlägt die Automatik in beide Richtungen. Der Session-Zustand übersteht einen Neustart oder Crash für 10 Minuten, danach beginnt die Session wirklich von vorn.</p>"
          }
        },
        {
          id: "anti-start-kill",
          title: { en: "Anti Start Kill: the spawn is a safe zone", de: "Anti Start Kill: Der Spawn ist eine Schutzzone" },
          badges: [{ en: "Host-authoritative", de: "Host-autoritativ" }],
          summary: {
            en: "Nobody kills (or sidekicks) until both sides have left the spawn area once. A green outline marks who is still protected.",
            de: "Niemand tötet (oder sidekickt), bis beide Seiten den Startbereich einmal verlassen haben. Eine grüne Outline zeigt, wer noch geschützt ist."
          },
          body: {
            en: "<p>The classic start kill decides a round before it begins: somebody camps the Dropship and stabs a player who is still reading their role card. With <em>Anti Start Kill</em> on, every player carries one flag — <em>has left the spawn area once</em> — and a kill needs both flags, the killer's and the victim's. The zone is the spawn <strong>room</strong> itself (Dropship, Cafeteria, Launchpad), read from the map at round start, so nothing is hard-coded per map; only a spawn that resolves to no room at all (the Fungle beach) falls back to a circle. Teleport-style jumps in the opening seconds re-record the spawn instead of counting as leaving, so an Airship spawn select or a vent hop never hands out a free kill.</p><p>Any meeting ends all remaining protection for good — the rule covers the round opening, never the mid-game. Two optional global caps answer the spawn camper: protection can also end after a time limit or after a number of fixed sabotages. As with the newcomer shield, peaceful abilities are exempt, and the whole feature is off by default.</p>",
            de: "<p>Der klassische Start-Kill entscheidet eine Runde, bevor sie beginnt: Jemand campt das Dropship und ersticht einen Spieler, der noch seine Rollenkarte liest. Mit <em>Anti Start Kill</em> trägt jeder Spieler ein Flag — <em>hat den Startbereich einmal verlassen</em> — und ein Kill braucht beide Flags, das des Killers und das des Opfers. Die Zone ist der Spawn-<strong>Raum</strong> selbst (Dropship, Cafeteria, Launchpad), beim Rundenstart aus der Map gelesen, also nichts pro Map fest verdrahtet; nur ein Spawn, der gar keinen Raum auflöst (der Fungle-Strand), fällt auf einen Kreis zurück. Teleport-Sprünge in den ersten Sekunden zeichnen den Spawn neu auf, statt als Verlassen zu zählen, damit ein Airship-Spawn-Select oder ein Vent-Hop nie einen Freikill verschenkt.</p><p>Jedes Meeting beendet allen verbliebenen Schutz endgültig — die Regel deckt die Rundeneröffnung ab, nie die Spielmitte. Zwei optionale globale Deckel beantworten den Spawn-Camper: Der Schutz kann zusätzlich nach einem Zeitlimit oder nach einer Anzahl behobener Sabotagen enden. Wie beim Newcomer-Schild sind friedliche Fähigkeiten ausgenommen, und das ganze Feature ist standardmäßig aus.</p>"
          }
        },
        {
          id: "shield-matrix",
          title: { en: "Which shield stops what", de: "Welches Schild hält was" },
          summary: {
            en: "The full matrix: every kill and every targeted ability against all seven shields in TOR, Unknown's Collection and Forgotten Fixes.",
            de: "Die vollständige Matrix: jeder Kill und jede Zielaktion gegen alle sieben Schilde aus TOR, Unknown's Collection und Forgotten Fixes."
          },
          body: {
            en: "<p>Seven shields can protect a player at once, and whether one applies comes down to a single question: does the kill go through TOR's shared kill check, or does it have a path of its own? Everything in the first table asks that check, so <strong>all seven shields hold at once</strong>. Everything in the second table has its own death path and asks no shield at all, unless it brings its own check.</p>"
              + SHIELD_LEGEND.en
              + "<p><strong>Kills through TOR's kill check</strong></p>" + shieldTbl("en", SHIELD_FUNNEL)
              + "<p><strong>Kills that bypass the check</strong></p>" + shieldTbl("en", SHIELD_BYPASS)
              + "<p><strong>Abilities that target without killing</strong> — since 2026-08-18 these announce themselves as peaceful, so both of our shields let them through. Planting the Maniac's bomb stays blocked: that one is the attack, the blast is only its delay.</p>"
              + shieldTbl("en", SHIELD_PEACEFUL)
              + "<p><strong>Notes.</strong> Armored does not cleanly abort a kill, it blanks it: the victim survives, the armor breaks, the attacker still loses their cooldown. The Guesser only knows the Medic shield (TOR option <em>Guesser Kills Through Shield</em>); our own <em>Unguessable After Shield Saved A Kill</em> additionally takes the Time Master out of the guess list once his time shield has saved him. The Maniac's <em>Pierces Shield</em> option reaches the Medic and Time Master shields only. The Poisoner is answered by the Medic's antidote, not by a shield. Roles that never offer the not-grown-up Mini as a target fail before the check even runs.</p>"
              + "<p><strong>Outside the matrix.</strong> The Werewolf survives one Sheriff bullet in wolf form (the Hunter always kills him, traps only wound); the Illusionist's clone wears a fake shield and never dies; the Hide'n'Seek prey has its own rewinding time shield; a Submerged elevator suppresses kills while you ride it; and the Deputy's handcuffs block the attacker rather than protecting the victim. Only the newcomer shield and the spawn zone are additionally enforced host-side, so they hold even against a client without the mods.</p>",
            de: "<p>Sieben Schilde können einen Spieler gleichzeitig schützen, und ob eines greift, hängt an einer einzigen Frage: Läuft die Tötung durch TORs gemeinsame Kill-Prüfung oder hat sie einen eigenen Weg? Alles in der ersten Tabelle fragt diese Prüfung, dort halten <strong>alle sieben Schilde gleichzeitig</strong>. Alles in der zweiten Tabelle hat einen eigenen Todespfad und fragt gar kein Schild, sofern es keine eigene Prüfung mitbringt.</p>"
              + SHIELD_LEGEND.de
              + "<p><strong>Tötungen durch TORs Kill-Prüfung</strong></p>" + shieldTbl("de", SHIELD_FUNNEL)
              + "<p><strong>Tötungen an der Prüfung vorbei</strong></p>" + shieldTbl("de", SHIELD_BYPASS)
              + "<p><strong>Aktionen mit Ziel, aber ohne Tötung</strong> — seit dem 18.08.2026 melden sie sich als friedlich an, beide eigenen Schilde lassen sie durch. Das Pflanzen der Maniac-Bombe bleibt gesperrt: Das ist der Angriff, die Explosion nur seine Verzögerung.</p>"
              + shieldTbl("de", SHIELD_PEACEFUL)
              + "<p><strong>Anmerkungen.</strong> Armored bricht einen Kill nicht sauber ab, sie macht ihn zur Platzpatrone: Das Opfer überlebt, die Panzerung zerbricht, der Angreifer verliert trotzdem seinen Cooldown. Der Guesser kennt nur das Medic-Schild (TOR-Option <em>Guesser Kills Through Shield</em>); unser <em>Unguessable After Shield Saved A Kill</em> nimmt den Time Master zusätzlich aus der Guesser-Liste, sobald sein Zeitschild ihn einmal gerettet hat. Die <em>Pierces Shield</em>-Option des Maniac erreicht nur das Medic- und das Time-Master-Schild. Gegen Gift hilft das Gegenmittel des Medics, kein Schild. Rollen, die ein nicht ausgewachsenes Mini gar nicht erst als Ziel anbieten, scheitern schon vor der Prüfung.</p>"
              + "<p><strong>Außerhalb der Matrix.</strong> Der Werewolf überlebt in Wolfsform eine Sheriff-Kugel (der Hunter tötet ihn immer, Fallen verwunden nur); der Klon des Illusionist trägt ein Schein-Schild und stirbt nie; der Hunted im Hide'n'Seek hat sein eigenes zurückspulendes Zeitschild; ein Submerged-Aufzug unterdrückt Kills während der Fahrt; und die Handschellen des Deputy blockieren den Angreifer, statt das Opfer zu schützen. Nur Newcomer-Schild und Spawnzone sind zusätzlich host-seitig abgesichert und halten damit auch gegen einen Client ohne die Mods.</p>"
          }
        }
      ]
    },
    {
      id: "early-death",
      title: { en: "Early-death shield", de: "Frühtod-Schild" },
      intro: { en: "A pink shield for players who get killed much earlier than the rest of the lobby, and statistics everyone can look at.", de: "Ein pinkes Schild für Spieler, die viel früher sterben als der Rest der Lobby, und eine Statistik, die jeder ansehen kann." },
      entries: [
        {
          id: "early-death-core",
          title: { en: "How the shield works", de: "So funktioniert das Schild" },
          summary: { en: "Every client records how much of each round a player survives. Players far below the lobby average cannot be killed before the first meeting.", de: "Jeder Client zeichnet auf, wie viel jeder Runde ein Spieler überlebt. Wer weit unter dem Lobby-Schnitt liegt, kann vor dem ersten Meeting nicht getötet werden." },
          body: {
            en: "<p>Per round the survived share of the playing time is recorded (meetings not counted), over the last 20 rounds per player. Only kills by someone else count: kills, guesses, bombs, arson and witch exiles; other deaths leave the round out. The host compares every player with the average of all qualified players in the lobby; whoever is below the threshold gets the pink shield for the next round, the same protection as the newcomer shield. Shielded rounds keep counting, so the shield regulates itself instead of sticking forever. The host can force the shield on or off per player; these decisions are saved.</p>" + tbl(["Option", "Default", "What it does"], [
              ["Protect Players Who Often Die Early", "Off", "Turns the shield on."],
              ["Tell The Killer Why The Kill Failed", "On", "The killer sees a short explanation."],
              ["Shield During The First Meeting", "Ends Before The Meeting", "Or it also blocks votes, guesses or both."],
              ["Shield Below % Of The Lobby Average", "60%", "40% to 80%."],
              ["Minimum Recorded Rounds", "5", "Fewer rounds and a player is not compared yet."],
              ["Maximum Shielded Players", "1", "Up to 3 per round."]
            ]),
            de: "<p>Pro Runde wird der überlebte Anteil der Spielzeit aufgezeichnet (Meetings nicht mitgezählt), über die letzten 20 Runden je Spieler. Es zählen nur Tode durch andere: Kills, Guesses, Bomben, Brandstiftung und Witch-Exiles; andere Tode lassen die Runde aus. Der Host vergleicht jeden Spieler mit dem Schnitt aller qualifizierten Spieler der Lobby; wer unter der Schwelle liegt, bekommt für die nächste Runde das pinke Schild, derselbe Schutz wie beim Neulings-Schild. Geschützte Runden zählen weiter mit, das Schild regelt sich also selbst, statt ewig zu bleiben. Der Host kann das Schild pro Spieler erzwingen oder ausschließen; diese Entscheidungen werden gespeichert.</p>" + tbl(["Option", "Standard", "Funktion"], [
              ["Protect Players Who Often Die Early", "Off", "Schaltet das Schild ein."],
              ["Tell The Killer Why The Kill Failed", "On", "Der Killer sieht eine kurze Erklärung."],
              ["Shield During The First Meeting", "Ends Before The Meeting", "Oder es sperrt auch Stimmen, Guesses oder beides."],
              ["Shield Below % Of The Lobby Average", "60%", "40% bis 80%."],
              ["Minimum Recorded Rounds", "5", "Mit weniger Runden wird ein Spieler noch nicht verglichen."],
              ["Maximum Shielded Players", "1", "Bis zu 3 pro Runde."]
            ])
          }
        },
        {
          id: "early-death-stats",
          title: { en: "Statistics for everyone", de: "Statistik für alle" },
          summary: { en: "In the lobby every player can see everyone's numbers, their own and the lobby average included, plus how each compares.", de: "In der Lobby kann jeder die Zahlen aller sehen, seine eigenen und den Lobby-Schnitt eingeschlossen, samt Vergleich." },
          body: {
            en: "<p>Players who are not the host get an <strong>Early-death stats</strong> button in the lower left. It lists every player with recorded rounds, survived share and percentage of the lobby average, the average and the threshold, and one sentence just for you (\"You survive 62% of a round, that is 125% of the lobby average\"); your own row is highlighted. The numbers are the host's, because only the host's records decide the shield: the host sends them whenever they change and when someone opens the view. Host decisions are shown openly as <em>forced by host</em> or <em>excluded by host</em>, the same as in the host's own panel, which now also shows the percentage of the average.</p>",
            de: "<p>Wer nicht Host ist, bekommt unten links einen Knopf <strong>Frühtod-Statistik</strong>. Er listet jeden Spieler mit aufgezeichneten Runden, überlebtem Anteil und Prozent vom Lobby-Schnitt, dazu Schnitt und Schwelle und einen Satz nur für dich (\"Du überlebst 62% einer Runde, das sind 125% vom Lobby-Schnitt\"); deine Zeile ist hervorgehoben. Es sind die Zahlen des Hosts, weil nur seine Aufzeichnung über das Schild entscheidet: Der Host schickt sie, sobald sie sich ändern und wenn jemand die Ansicht öffnet. Host-Entscheidungen stehen offen als <em>forced by host</em> bzw. <em>excluded by host</em> da, genau wie im Host-Panel, das jetzt ebenfalls das Verhältnis zum Schnitt zeigt.</p>"
          }
        }
      ]
    },
    {
      id: "submerged",
      title: { en: "Submerged", de: "Submerged" },
      intro: { en: "The Submerged map (its own mod, v2025.1.30) runs with TOR and the mod family. A full test on the map found three problems, fixed here.", de: "Die Karte Submerged (eigener Mod, v2025.1.30) läuft mit TOR und der Mod-Familie. Ein Gesamttest auf der Karte hat drei Fehler gefunden, die hier behoben sind." },
      entries: [
        {
          id: "submerged-fixes",
          title: { en: "Fixes on Submerged", de: "Fixes auf Submerged" },
          summary: { en: "Oxygen sabotage works with Sabotage Tuning, the Engineer's remote O2 repair no longer throws, and Mod Sync knows Submerged.", de: "Die Sauerstoff-Sabotage funktioniert mit Sabotage Tuning, die Engineer-Fernreparatur bei O2 wirft keinen Fehler mehr, und Mod-Sync kennt Submerged." },
          body: {
            en: "<ul><li><strong>Oxygen did nothing:</strong> Sabotage Tuning recognised the sabotage buttons by their room number, and Submerged uses its own. The button looked ready during its cooldown and the click was dropped silently. Buttons are now recognised by what they do, on every modded map, and Submerged's own oxygen system counts as an active sabotage with the set Oxygen Duration.</li><li><strong>Engineer:</strong> TOR's remote oxygen repair on Submerged threw an error on every use and on every client; it is replaced by the same logic with the right data type.</li><li><strong>Mod Sync</strong> can install Submerged, pinned to v2025.1.30, the version that works with TOR.</li><li>A self test (<code>[Diagnostics] Submerged Self Test</code>, off by default) checks all of this on the map.</li></ul>",
            de: "<ul><li><strong>O2 tat nichts:</strong> Sabotage Tuning erkannte die Sabotage-Knöpfe an ihrer Raumnummer, und Submerged nutzt eigene. Der Knopf sah während seines Cooldowns bereit aus, der Klick wurde still verworfen. Knöpfe werden jetzt an ihrer Funktion erkannt, auf jeder Modkarte, und das eigene Sauerstoff-System von Submerged zählt als aktive Sabotage mit der eingestellten Oxygen Duration.</li><li><strong>Engineer:</strong> TORs Fernreparatur bei O2 auf Submerged warf bei jedem Einsatz und auf jedem Client einen Fehler; sie ist durch denselben Ablauf mit dem richtigen Datentyp ersetzt.</li><li><strong>Mod-Sync</strong> kann Submerged installieren, festgelegt auf v2025.1.30, die Version, die mit TOR läuft.</li><li>Ein Selbsttest (<code>[Diagnostics] Submerged Self Test</code>, standardmäßig aus) prüft das alles auf der Karte.</li></ul>"
          }
        }
      ]
    },
    {
      id: "stability",
      title: { en: "Memory and crash diagnostics", de: "Speicher und Absturz-Diagnose" },
      intro: { en: "Less memory in the lobby, and tools to track down rare hard crashes.", de: "Weniger Speicher in der Lobby und Werkzeuge, um seltene harte Abstürze aufzuspüren." },
      entries: [
        {
          id: "hat-textures",
          title: { en: "Lighter hat textures", de: "Leichtere Hut-Texturen" },
          summary: { en: "TOR's 1032 hats used about 600 MB per player; compressed they need 27 MB.", de: "TORs 1032 Hüte belegten etwa 600 MB pro Spieler; komprimiert brauchen sie 27 MB." },
          body: {
            en: "<p>TOR loads every custom hat uncompressed and keeps a CPU copy of each. Forgotten Fixes compresses them when they are loaded and drops the copy: measured in the lobby, the game went from 1251 to 646 MB. Among Us is a 32-bit process, so this leaves much more room before it runs out of memory.</p>",
            de: "<p>TOR lädt jeden eigenen Hut unkomprimiert und behält von jedem eine CPU-Kopie. Forgotten Fixes komprimiert sie beim Laden und wirft die Kopie weg: In der Lobby gemessen sank das Spiel von 1251 auf 646 MB. Among Us ist ein 32-Bit-Prozess, das lässt also deutlich mehr Luft, bevor der Speicher ausgeht.</p>"
          }
        },
        {
          id: "crash-diagnostics",
          title: { en: "Crash diagnostics", de: "Absturz-Diagnose" },
          summary: { en: "Crash logs survive a restart, a memory heartbeat, optional crash dumps and a Perf HUD on F10.", de: "Absturz-Logs überleben den Neustart, ein Speicher-Herzschlag, optionale Absturz-Dumps und ein Perf-HUD auf F10." },
          body: {
            en: "<ul><li>The BepInEx log is appended instead of overwritten, so the lines before a hard crash are still there after the restart.</li><li>A memory heartbeat logs Unity's counters and, at scene changes, the largest textures, clips and meshes.</li><li><code>[CrashDiagnostics] WriteCrashDumps</code> lets Windows write a crash dump; <code>FullCrashDumps</code> writes a full one (about 1.5 GB, only the newest two kept), from which a crash in generated code can be traced to its method.</li><li>The detour watchdog only reports dropped patches now and no longer repairs them while the game runs; the repairs had caused hard crashes.</li><li><strong>Perf HUD (F10):</strong> frame time tail and allocation rate, with a comparison line in the log.</li></ul>",
            de: "<ul><li>Das BepInEx-Log wird angehängt statt überschrieben, die Zeilen vor einem harten Absturz sind also nach dem Neustart noch da.</li><li>Ein Speicher-Herzschlag loggt Unitys Zähler und bei Szenenwechseln die größten Texturen, Clips und Meshes.</li><li><code>[CrashDiagnostics] WriteCrashDumps</code> lässt Windows einen Absturz-Dump schreiben; <code>FullCrashDumps</code> einen vollständigen (etwa 1,5 GB, nur die neuesten zwei bleiben), aus dem sich ein Absturz in erzeugtem Code seiner Methode zuordnen lässt.</li><li>Der Detour-Watchdog meldet ausgefallene Patches nur noch und repariert sie nicht mehr im laufenden Spiel; die Reparaturen hatten harte Abstürze ausgelöst.</li><li><strong>Perf-HUD (F10):</strong> Frametime-Ausreißer und Allokationsrate, mit einer Vergleichszeile im Log.</li></ul>"
          }
        }
      ]
    },
    {
      id: "modsync",
      title: { en: "Mod sync", de: "Mod-Abgleich" },
      intro: {
        en: "The lobby compares your mods against the host's and fetches what is missing, over a catalog of trusted IDs, never over URLs from the network.",
        de: "Die Lobby vergleicht deine Mods mit denen des Hosts und lädt Fehlendes nach, über einen Katalog vertrauenswürdiger IDs, nie über URLs aus dem Netz."
      },
      entries: [
        {
          id: "modsync-compare",
          title: { en: "Compare & fetch", de: "Vergleichen & Nachladen" },
          summary: {
            en: "A lobby button appears when the host has mods you are missing (or newer versions); one click installs everything uncritical, single clicks handle the rest.",
            de: "Ein Lobby-Button erscheint, wenn der Host Mods hat, die dir fehlen (oder neuere Versionen); ein Klick installiert alles Unkritische, Einzelklicks den Rest."
          },
          body: {
            en: "<p>Every client with the mod reports its installed companion mods (missing / active / disabled, exact version) in the lobby. Non-hosts compare their inventory against the <strong>host's</strong> and get a button in the lower left, only when there is something actionable: install what is missing, upgrade what is older, a hint when a mod is merely disabled, and an info line for things you have that the host lacks. A collect button runs all uncritical actions in one go; after downloads a restart applies them. The catalog covers the family mods (Forgotten Fixes, Chance, Unknown's Collection, TOR - Hostfix, Nightfall, Unknown's Atlas) and Submerged, pinned to v2025.1.30.</p>",
            de: "<p>Jeder Client mit dem Mod meldet in der Lobby seine installierten Begleit-Mods (fehlend / aktiv / deaktiviert, exakte Version). Nicht-Hosts vergleichen ihr Inventar mit dem des <strong>Hosts</strong> und bekommen unten links einen Button, nur wenn es etwas zu tun gibt: Fehlendes installieren, Älteres aktualisieren, ein Hinweis, wenn ein Mod nur deaktiviert ist, und eine Info-Zeile für Dinge, die du hast und der Host nicht. Ein Sammel-Button führt alle unkritischen Aktionen in einem Rutsch aus; nach Downloads übernimmt ein Neustart sie. Der Katalog deckt die Familien-Mods ab (Forgotten Fixes, Chance, Unknown's Collection, TOR - Hostfix, Nightfall, Unknown's Atlas) und Submerged, festgelegt auf v2025.1.30.</p>"
          }
        },
        {
          id: "modsync-safety",
          title: { en: "Safety rules & rejoin", de: "Sicherheitsregeln & Rejoin" },
          summary: {
            en: "Only a catalog ID ever crosses the wire, downloads are whitelisted GitHub releases only, downgrades need an explicit single click, and a main-menu button rejoins the lobby after the restart.",
            de: "Über die Leitung geht nur eine Katalog-ID, Downloads sind ausschließlich whitelisted GitHub-Releases, Downgrades brauchen einen expliziten Einzelklick, und ein Hauptmenü-Button bringt dich nach dem Neustart zurück in die Lobby."
          },
          body: {
            en: "<p>The wire format is deliberately minimal: the host only ever sends a numeric catalog ID, never a name, repo or URL. Everything security-relevant (repo owner, repo name, file name, target path) is fixed in the local catalog, downloads must match the host's exact release version, and the URL is checked against a strict GitHub-releases whitelist before a byte is fetched. Only the host's inventory produces suggestions, and the sender is taken from the transport layer, so nobody can spoof being the host. <strong>Downgrades and test builds are excluded from the collect action</strong> and need an explicit per-mod click, so an outdated host cannot drag the whole lobby backwards. After the restart, a main-menu button offers to rejoin the last lobby by its code.</p>",
            de: "<p>Das Leitungsformat ist bewusst minimal: Der Host sendet immer nur eine numerische Katalog-ID, nie Name, Repo oder URL. Alles Sicherheitsrelevante (Repo-Besitzer, Repo-Name, Dateiname, Zielpfad) steht fest im lokalen Katalog, Downloads müssen exakt der vom Host gemeldeten Release-Version entsprechen, und die URL wird vor dem ersten Byte gegen eine strikte GitHub-Releases-Whitelist geprüft. Nur das Inventar des Hosts erzeugt Vorschläge, und der Absender kommt aus der Transportschicht, niemand kann sich als Host ausgeben. <strong>Downgrades und Test-Builds sind von der Sammel-Aktion ausgeschlossen</strong> und brauchen einen expliziten Klick pro Mod, damit ein veralteter Host nicht die ganze Lobby zurückzieht. Nach dem Neustart bietet ein Hauptmenü-Button an, der letzten Lobby per Code wieder beizutreten.</p>"
          }
        }
      ]
    },
    {
      id: "localization",
      title: { en: "Languages & communication", de: "Sprachen & Kommunikation" },
      intro: {
        en: "A 25-language localization engine for the whole mod family, plus a meeting map ping that lets you literally point at the map.",
        de: "Eine 25-Sprachen-Lokalisierungs-Engine für die ganze Mod-Familie, plus ein Meeting-Map-Ping, mit dem du buchstäblich auf die Karte zeigen kannst."
      },
      entries: [
        {
          id: "localization-engine",
          title: { en: "Localization engine (25 languages)", de: "Lokalisierungs-Engine (25 Sprachen)" },
          summary: {
            en: "Translates TOR's roles and options plus all Forgotten Fixes surfaces; 15 languages follow the game language, 10 extra ones are a per-client mod setting. Role names stay English on purpose.",
            de: "Übersetzt TORs Rollen und Optionen plus alle Forgotten-Fixes-Oberflächen; 15 Sprachen folgen der Spielsprache, 10 weitere sind eine Per-Client-Mod-Einstellung. Rollennamen bleiben absichtlich englisch."
          },
          body: {
            en: "<p>The engine translates TOR's role descriptions, intros and the entire options tree, plus every Forgotten Fixes surface. The 15 languages the game itself ships follow the game language automatically; 10 extra languages (Turkish, Polish, Czech, Hungarian, Romanian, Swedish, Finnish, Ukrainian, Indonesian, Vietnamese) are selectable per client in the BepInEx config, deliberately not a host-synced option, since language is personal. For the extra languages even vanilla strings are translated via a one-time dump. Community overrides are supported: a JSON per language in the config folder wins over the built-in tables. The other family mods (Unknown's Collection, TOR - Hostfix) follow the active language over a shared contract. <strong>Role names stay English in every language</strong>, so mixed-language lobbies keep a common vocabulary. A language toggle sits on the map view; left and right click cycle through auto plus all languages.</p>",
            de: "<p>Die Engine übersetzt TORs Rollenbeschreibungen, Intros und den kompletten Options-Baum, plus jede Forgotten-Fixes-Oberfläche. Die 15 Sprachen des Spiels folgen automatisch der Spielsprache; 10 weitere (Türkisch, Polnisch, Tschechisch, Ungarisch, Rumänisch, Schwedisch, Finnisch, Ukrainisch, Indonesisch, Vietnamesisch) sind pro Client in der BepInEx-Config wählbar, bewusst keine host-gesyncte Option, denn Sprache ist persönlich. Für die Extra-Sprachen werden per einmaligem Dump sogar Vanilla-Strings übersetzt. Community-Overrides werden unterstützt: Ein JSON pro Sprache im Config-Ordner schlägt die eingebauten Tabellen. Die anderen Familien-Mods (Unknown's Collection, TOR - Hostfix) folgen der aktiven Sprache über einen geteilten Kontrakt. <strong>Rollennamen bleiben in jeder Sprache englisch</strong>, damit gemischtsprachige Lobbys ein gemeinsames Vokabular behalten. Ein Sprach-Umschalter sitzt auf der Kartenansicht; Links- und Rechtsklick zyklieren durch Auto plus alle Sprachen.</p>"
          }
        },
        {
          id: "meeting-map-ping",
          title: { en: "Meeting map ping", de: "Meeting-Map-Ping" },
          summary: {
            en: "During meetings, click the minimap to drop a marker in your player colour that everyone sees. One marker per player, 2 s cooldown, gone after 10 s.",
            de: "Klicke während Meetings auf die Minimap, um einen Marker in deiner Spielerfarbe zu setzen, den alle sehen. Ein Marker pro Spieler, 2 s Cooldown, nach 10 s weg."
          },
          body: {
            en: "<p>\"Where did you find the body?\" finally has a better answer than room names: during a meeting, every living player can left-click the minimap to drop a marker that all players (ghosts included) see, a here-point icon tinted in the sender's player colour with a red outline and a short pop-and-pulse animation. Each player has one marker at a time (a new click moves it), with a 2-second cooldown and a 10-second lifetime. Clients without the mod simply ignore the ping. Deliberately exempt from the settings gate: it is pure communication and gives nobody a rules advantage.</p>",
            de: "<p>\"Wo hast du die Leiche gefunden?\" hat endlich eine bessere Antwort als Raumnamen: Während eines Meetings kann jeder lebende Spieler per Linksklick auf die Minimap einen Marker setzen, den alle Spieler (auch Geister) sehen, ein Here-Point-Icon in der Spielerfarbe des Senders mit rotem Rand und kurzer Pop-und-Puls-Animation. Jeder Spieler hat einen Marker gleichzeitig (ein neuer Klick verschiebt ihn), mit 2 Sekunden Cooldown und 10 Sekunden Lebensdauer. Clients ohne den Mod ignorieren den Ping einfach. Bewusst vom Settings-Gate ausgenommen: reines Kommunikationsmittel, verschafft niemandem einen Regelvorteil.</p>"
          }
        }
      ]
    },
    {
      id: "settings-list",
      title: { en: "The settings list (F1)", de: "Die Einstellungsliste (F1)" },
      intro: {
        en: "The overlay behind F1 — and the settings text in the lobby — rebuilt so you can find something in it.",
        de: "Das Overlay hinter F1 — und der Einstellungstext in der Lobby — neu gebaut, damit man darin etwas findet."
      },
      entries: [
        {
          id: "settings-list-colours",
          title: { en: "Every role in its own colour", de: "Jede Rolle in ihrer eigenen Farbe" },
          badges: [{ en: "Local only", de: "Nur lokal" }],
          summary: {
            en: "Roles and modifiers appear in their role colour, sub-options in a dimmed version of it, and roles at 0% collapse into a single line.",
            de: "Rollen und Modifier erscheinen in ihrer Rollenfarbe, Unteroptionen in einer gedimmten Variante davon, und Rollen bei 0% fallen in eine einzige Zeile zusammen."
          },
          body: {
            en: "<p>TOR prints the settings list almost entirely in white: sub-options are hard-coded to white, and a role only gets colour because TOR bakes a colour tag into the option name — something the companion mods never did, and something the localization strips the moment you leave English. So the list is rebuilt from the option data instead of being patched as text.</p><ul><li><strong>Colour by role</strong>, for the roles of every mod, with sub-options in a dimmed mix of the same colour so a block reads as one unit. Colours are read by option ID before the language layer touches the names, so they survive a translation.</li><li><strong>Values in a column</strong>: numbers neutral, <em>On</em> green, <em>Off</em> and 0% dimmed. Off is deliberately not red — that is the impostor colour.</li><li><strong>Shorter pages</strong>: the repeated role name is dropped from sub-options (\"Tesla Charge Countdown\" becomes \"Charge Countdown\"), blocks are sorted by spawn chance, and everything at 0% is gathered into one dimmed <code>Off: …</code> line.</li><li><strong>Where a role comes from</strong>: entries from a sibling mod carry a short tag, read from the assembly that owns the option.</li><li>Impostor roles all share one red in TOR's code, so they alternate between two shades of red — display only, the role colour itself is untouched.</li></ul><p class='note'>Purely local: it changes the text on your own screen and nothing else. The vanilla settings page, Hide N Seek and Prop Hunt are left exactly as TOR builds them, and any error falls back to TOR's original text. Five switches in the <code>SettingsOverlay</code> config section turn the layout, the mod tags, the red shades, the value column and the 0% handling on or off.</p>",
            de: "<p>TOR schreibt die Einstellungsliste fast vollständig in Weiß: Unteroptionen sind fest auf Weiß gesetzt, und eine Rolle bekommt nur deshalb Farbe, weil TOR ein Farb-Tag in den Optionsnamen einbackt — was die Begleitmods nie taten und was die Lokalisierung entfernt, sobald man Englisch verlässt. Die Liste wird deshalb aus den Optionsdaten neu gebaut statt als Text repariert.</p><ul><li><strong>Farbe nach Rolle</strong>, für die Rollen jedes Mods, mit Unteroptionen in einer gedimmten Mischung derselben Farbe, damit ein Block als Einheit lesbar bleibt. Die Farben werden per Options-ID gelesen, bevor die Sprachschicht die Namen anfasst, und überstehen so eine Übersetzung.</li><li><strong>Werte in einer Spalte</strong>: Zahlen neutral, <em>On</em> grün, <em>Off</em> und 0% gedimmt. Off ist bewusst nicht rot — das ist die Impostor-Farbe.</li><li><strong>Kürzere Seiten</strong>: Der wiederholte Rollenname fällt aus den Unteroptionen weg (\"Tesla Charge Countdown\" wird zu \"Charge Countdown\"), Blöcke sind nach Spawn-Chance sortiert, und alles bei 0% sammelt sich in einer gedimmten <code>Off: …</code>-Zeile.</li><li><strong>Woher eine Rolle kommt</strong>: Einträge aus einem Begleitmod tragen ein kurzes Kürzel, gelesen aus der Assembly, der die Option gehört.</li><li>Impostor-Rollen teilen sich in TORs Code alle ein Rot, deshalb wechseln sie zwischen zwei Rot-Tönen — reine Anzeige, die Rollenfarbe selbst bleibt unangetastet.</li></ul><p class='note'>Rein lokal: Es ändert den Text auf dem eigenen Bildschirm und sonst nichts. Die Vanilla-Seite, Hide N Seek und Prop Hunt bleiben genau so, wie TOR sie baut, und jeder Fehler fällt auf TORs Originaltext zurück. Fünf Schalter im Config-Abschnitt <code>SettingsOverlay</code> schalten Layout, Mod-Kürzel, Rot-Töne, Wertespalte und 0%-Behandlung einzeln ab.</p>"
          }
        }
      ]
    },
    {
      id: "webconfig",
      title: { en: "WebConfig — settings in the browser", de: "WebConfig — Einstellungen im Browser" },
      intro: {
        en: "A local, host-only browser page that edits every mod option and the curated vanilla options, with search, instead of scrolling in-game menus.",
        de: "Eine lokale, host-only Browser-Seite, die jede Mod-Option und die kuratierten Vanilla-Optionen editierbar macht, mit Suche, statt In-Game-Menü-Gescrolle."
      },
      entries: [
        {
          id: "webconfig-page",
          title: { en: "The settings page", de: "Die Einstellungs-Seite" },
          badges: [{ en: "Host only", de: "Nur Host" }],
          summary: {
            en: "http://127.0.0.1:32200 serves all TOR + mod options and the vanilla game settings, live-editable while the lobby is open. Local machine only, never reachable from the LAN.",
            de: "http://127.0.0.1:32200 liefert alle TOR- + Mod-Optionen und die Vanilla-Einstellungen, live editierbar bei offener Lobby. Nur der eigene Rechner, nie aus dem LAN erreichbar."
          },
          body: {
            en: "<p>While the game runs, a tiny local web server (default <code>http://127.0.0.1:32200</code>, bound strictly to the local machine, never to the LAN) serves a settings page with every custom option of TOR and all loaded mods plus a curated set of vanilla options (meetings and voting, roles, tasks), searchable and grouped like the in-game menus. Changes go through TOR's canonical option setter and the game's own options sync, so all clients receive them exactly as if the host had clicked in-game. Only the host can write: without host status the page is read-only and write requests are rejected. Controlled via the BepInEx config (<code>WebConfig.Enabled</code>, <code>WebConfig.Port</code>).</p>",
            de: "<p>Während das Spiel läuft, liefert ein winziger lokaler Webserver (Standard <code>http://127.0.0.1:32200</code>, strikt an den eigenen Rechner gebunden, nie ans LAN) eine Einstellungs-Seite mit jeder Custom-Option von TOR und allen geladenen Mods plus einem kuratierten Satz Vanilla-Optionen (Meetings und Voting, Rollen, Tasks), durchsuchbar und gruppiert wie die In-Game-Menüs. Änderungen laufen über TORs kanonischen Options-Setter und den Options-Sync des Spiels, alle Clients erhalten sie exakt so, als hätte der Host im Spiel geklickt. Nur der Host darf schreiben: Ohne Host-Status ist die Seite eine reine Leseansicht, Schreib-Requests werden abgelehnt. Gesteuert über die BepInEx-Config (<code>WebConfig.Enabled</code>, <code>WebConfig.Port</code>).</p>"
          }
        }
      ]
    },
    {
      id: "gate",
      title: { en: "The settings gate", de: "Das Settings-Gate" },
      intro: {
        en: "If the host does not run Forgotten Fixes, all option-based features fall back to pure TOR behaviour, so nobody plays by private rules.",
        de: "Hat der Host Forgotten Fixes nicht, fallen alle options-basierten Features auf pures TOR-Verhalten zurück, damit niemand nach privaten Regeln spielt."
      },
      entries: [
        {
          id: "gate-fallback",
          title: { en: "No host, no house rules", de: "Kein Host, keine Hausregeln" },
          summary: {
            en: "As a client under a host without the mod, every option-based feature returns its default: pure TOR. Cosmetic and communication features stay on.",
            de: "Als Client unter einem Host ohne den Mod liefert jedes options-basierte Feature seinen Default: pures TOR. Kosmetik- und Kommunikations-Features bleiben an."
          },
          body: {
            en: "<p>TOR's options sync is host-driven: the host only shares options it owns. Under a host without Forgotten Fixes, a client's own option values would silently stay active, a one-sided rule change (shorter cooldowns, extra modifiers, extra buttons) nobody else sees. The gate closes that hole: as a client under such a host, every option-based feature returns its default and behaves like pure TOR. Gated is exactly what could grant an advantage others do not share; purely cosmetic or communicative features (like the map ping) and option-less bugfixes stay active. The gate opens when you are the host or the host is confirmed to run the mod.</p>",
            de: "<p>TORs Options-Sync ist host-getrieben: Der Host teilt nur Optionen, die er besitzt. Unter einem Host ohne Forgotten Fixes blieben die eigenen Optionswerte eines Clients stillschweigend aktiv, eine einseitige Regeländerung (kürzere Cooldowns, extra Modifier, extra Buttons), die sonst niemand sieht. Das Gate schließt dieses Loch: Als Client unter so einem Host liefert jedes options-basierte Feature seinen Default und verhält sich wie pures TOR. Gegated ist genau das, was einen Vorteil verschaffen könnte, den andere nicht teilen; rein kosmetische oder kommunikative Features (wie der Map-Ping) und optionslose Bugfixes bleiben aktiv. Das Gate öffnet, wenn du selbst Host bist oder der Host den Mod nachweislich hat.</p>"
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
  version: "1.2.7",
  allClients: true,
  repo: "https://github.com/DaUnknown-0/UnknownsCollection",
  download: "https://github.com/DaUnknown-0/UnknownsCollection/releases/latest",
  tagline: {
    en: "Brand-new custom roles for The Other Roles, layered on without touching TOR's source. Impostor: The Tesla, The Saboteur, The Silencer, The Poisoner, The Illusionist, The Maniac, The Shade, The Manipulator, The Werewolf & The Auditor. Crewmate: The Siphoner, The Witness, The Scout, The Beacon & The Hunter. Neutral: The Bug, The Follower, The Copycat, The Collector & The Pelican. Ghost: The Poltergeist. Modifier: The Gambler. Plus kill cutscenes, custom hats and a 26-language role guide.",
    de: "Brandneue eigene Rollen für The Other Roles, aufgesetzt ohne Änderung an TORs Quellcode. Impostor: The Tesla, The Saboteur, The Silencer, The Poisoner, The Illusionist, The Maniac, The Shade, The Manipulator, The Werewolf & The Auditor. Crewmate: The Siphoner, The Witness, The Scout, The Beacon & The Hunter. Neutral: The Bug, The Follower, The Copycat, The Collector & The Pelican. Geist: The Poltergeist. Modifier: The Gambler. Dazu Kill-Cutscenes, eigene Hüte und ein Rollen-Guide in 26 Sprachen."
  },
  intro: {
    en: "Unknown's Collection is a separate plugin that adds <strong>new roles</strong> to TOR 4.8.0 purely through Harmony patches — TOR's source is never modified, and the only hard dependency is The Other Roles. The roles are client-side, so the lobby can only be started when every player runs the same Unknown's Collection version. Current roles — Impostor: <strong>The Tesla</strong>, <strong>The Saboteur</strong>, <strong>The Silencer</strong>, <strong>The Poisoner</strong>, <strong>The Illusionist</strong>, <strong>The Maniac</strong>, <strong>The Shade</strong>, <strong>The Manipulator</strong>, <strong>The Werewolf</strong> and <strong>The Auditor</strong>; Crewmate: <strong>The Siphoner</strong>, <strong>The Witness</strong>, <strong>The Scout</strong>, <strong>The Beacon</strong> and <strong>The Hunter</strong> (a mid-round promotion in Werewolf rounds); Neutral: <strong>The Bug</strong>, <strong>The Follower</strong>, <strong>The Copycat</strong>, <strong>The Collector</strong> and <strong>The Pelican</strong>; plus <strong>The Poltergeist</strong> — a ghost role the first dead player rises into — and <strong>The Gambler</strong>, a crew modifier that bets on the round. All Impostor roles, the Collector, the Pelican and the Werewolf are pickable in TOR's Role Draft. Beyond roles, 1.2.0 adds custom kill cutscenes, three custom hats and a searchable role guide in 26 languages; since 1.0.1.60 every ability comes with dedicated particle effects and positional stereo sound.",
    de: "Unknown's Collection ist ein eigenständiges Plugin, das TOR 4.8.0 <strong>neue Rollen</strong> rein über Harmony-Patches hinzufügt — TORs Quellcode wird nie verändert, einzige harte Abhängigkeit ist The Other Roles. Die Rollen sind client-seitig, daher kann die Lobby nur gestartet werden, wenn alle Spieler dieselbe Unknown's-Collection-Version haben. Aktuelle Rollen — Impostor: <strong>The Tesla</strong>, <strong>The Saboteur</strong>, <strong>The Silencer</strong>, <strong>The Poisoner</strong>, <strong>The Illusionist</strong>, <strong>The Maniac</strong>, <strong>The Shade</strong>, <strong>The Manipulator</strong>, <strong>The Werewolf</strong> und <strong>The Auditor</strong>; Crewmate: <strong>The Siphoner</strong>, <strong>The Witness</strong>, <strong>The Scout</strong>, <strong>The Beacon</strong> und <strong>The Hunter</strong> (eine Beförderung mitten in Werewolf-Runden); Neutral: <strong>The Bug</strong>, <strong>The Follower</strong>, <strong>The Copycat</strong>, <strong>The Collector</strong> und <strong>The Pelican</strong>; dazu <strong>The Poltergeist</strong> — eine Geist-Rolle, in die der erste Tote aufsteigt — und <strong>The Gambler</strong>, ein Crew-Modifier, der auf die Runde wettet. Alle Impostor-Rollen, der Collector, der Pelican und der Werewolf sind im Role Draft von TOR wählbar. Über Rollen hinaus bringt 1.2.0 eigene Kill-Cutscenes, drei eigene Hüte und einen durchsuchbaren Rollen-Guide in 26 Sprachen; seit 1.0.1.60 hat jede Fähigkeit eigene Partikeleffekte und positionalen Stereo-Sound."
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
          title: { en: "Sole-witness sighting", de: "Witness allein am Tatort" },
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
        de: "Ein Neutraler auf Reliktjagd. Versteckte Relikte sind über die Map verteilt — nur der Collector sieht sie klar. Wer genug sammelt, gewinnt allein."
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
      id: "werewolf",
      title: { en: "The Werewolf (Impostor)", de: "The Werewolf (Impostor)" },
      intro: {
        en: "An Impostor with a second shape. While the lights are sabotaged, an alpha charge builds; as the last living Impostor the Werewolf can then transform and plunge the whole map into wolf darkness, where everyone else is down to a flashlight beam.",
        de: "Ein Impostor mit einer zweiten Gestalt. Während die Lichter sabotiert sind, baut sich eine Alpha-Ladung auf; als letzter lebender Impostor kann sich der Werewolf dann verwandeln und die ganze Map in Wolfsdunkelheit stürzen, in der alle anderen nur noch einen Taschenlampen-Kegel haben."
      },
      entries: [
        {
          id: "werewolf-alpha",
          title: { en: "The alpha charge", de: "Die Alpha-Ladung" },
          summary: {
            en: "The charge only builds while the lights are sabotaged; transforming requires a full charge, lights out, and (by default) being the last living Impostor.",
            de: "Die Ladung wächst nur, während die Lichter sabotiert sind; die Verwandlung braucht volle Ladung, Licht aus und (standardmäßig) den Status als letzter lebender Impostor."
          },
          body: {
            en: "<p>The alpha charge (default 8 s) builds exclusively while the lights sabotage is active. Fixing the lights pauses the charge by default; an option resets it instead. Transforming is only possible when the charge is full, the lights are still out, no meeting is running and, with <em>Only As Last Impostor</em> on (default), every other Impostor is dead (the Spy optionally counts as one). The wolf form lasts a configured duration (default 12 s), ends early at meeting start or on the Werewolf's death, and afterwards the charge starts over from zero. In wolf form the Werewolf is faster (default 140%) and kills with a reduced cooldown (default 30% less); an optional howl announces the transformation and an optional exhaustion slow punishes the reversion. The button label shows the remaining form time.</p>",
            de: "<p>Die Alpha-Ladung (Default 8 s) wächst ausschließlich, während die Licht-Sabotage aktiv ist. Ein Licht-Fix pausiert die Ladung standardmäßig; eine Option setzt sie stattdessen zurück. Verwandeln geht nur mit voller Ladung, weiterhin ausgeschaltetem Licht, außerhalb von Meetings und, mit <em>Only As Last Impostor</em> an (Default), wenn jeder andere Impostor tot ist (der Spy zählt optional als Impostor). Die Wolfsform hält eine konfigurierte Dauer (Default 12 s), endet vorzeitig beim Meeting-Start oder mit dem Tod des Werewolfs, und danach beginnt die Ladung wieder bei null. In Wolfsform ist der Werewolf schneller (Default 140%) und tötet mit reduziertem Cooldown (Default 30% weniger); ein optionales Heulen kündigt die Verwandlung an, und ein optionaler Erschöpfungs-Slow bestraft die Rückverwandlung. Der Button zeigt die verbleibende Formdauer.</p>"
          }
        },
        {
          id: "werewolf-darkness",
          title: { en: "Wolf darkness & flashlights", de: "Wolfsdunkelheit & Taschenlampen" },
          summary: {
            en: "During the wolf form everyone is reduced to a real flashlight cone and a tiny vision radius; the lights cannot be fixed until the form ends. The wolf, the Lighter and the Hunter see more.",
            de: "Während der Wolfsform haben alle nur einen echten Taschenlampen-Kegel und einen winzigen Sichtradius; die Lichter sind bis zum Ende der Form nicht reparierbar. Wolf, Lighter und Hunter sehen mehr."
          },
          body: {
            en: "<p>For the duration of the wolf form the darkness is unfixable and every player gets a Lighter-style flashlight cone plus a configurable vision radius (default 0.5x of normal crew vision, up to <em>Infinite</em>). Three exceptions: the <strong>Werewolf</strong> keeps full Impostor vision, the <strong>Lighter</strong> keeps their own light, and the <strong>Hunter</strong> gets a scaled crew radius instead of the fixed value (see the Hunter section). <em>Wolf Form Restrictions</em> optionally locks other actions during the darkness.</p>",
            de: "<p>Für die Dauer der Wolfsform ist die Dunkelheit nicht reparierbar, und jeder Spieler bekommt einen Lighter-artigen Taschenlampen-Kegel plus einen konfigurierbaren Sichtradius (Default 0.5x der normalen Crew-Sicht, bis hin zu <em>Infinite</em>). Drei Ausnahmen: Der <strong>Werewolf</strong> behält volle Impostor-Sicht, der <strong>Lighter</strong> behält sein eigenes Licht, und der <strong>Hunter</strong> bekommt einen skalierten Crew-Radius statt des Fixwerts (siehe Hunter-Sektion). <em>Wolf Form Restrictions</em> sperrt optional weitere Aktionen während der Dunkelheit.</p>"
          }
        },
        {
          id: "werewolf-silver",
          title: { en: "The silver rules", de: "Die Silber-Regeln" },
          summary: {
            en: "The Hunter always kills the wolf. The Sheriff's shot is survivable once per game against the wolf form. Traps wound but never kill. Deputy handcuffs force the wolf back into human shape.",
            de: "Der Hunter tötet den Wolf immer. Der Sheriff-Schuss gegen die Wolfsform ist einmal pro Spiel überlebbar. Fallen verwunden, töten aber nie. Deputy-Handschellen zwingen den Wolf zurück in Menschengestalt."
          },
          body: {
            en: "<p>A fixed interaction matrix governs who can hurt the beast:</p>" + tbl(["Source", "Effect on the wolf form"], [
              ["<strong>Hunter</strong>", "Always lethal, in every form and every silver mode."],
              ["<strong>Sheriff</strong>", "Kills the human form. Against the wolf form (silver mode <em>Wounds The Wolf</em>, default) the first shot is survivable once per game: forced reversion, 0.8x slow for 10 s, kill cooldown set to maximum, charge restarts. The next hit kills. Mode <em>Kills The Wolf</em> removes the exception, <em>No Silver Effect</em> disables it."],
              ["<strong>Traps</strong> (Trapper / UC Saboteur)", "Always wound, never kill, and do not consume the once-per-game toughness (a trap is iron, not silver). Each toggleable."],
              ["<strong>Deputy handcuffs</strong>", "Force the reversion regardless of the silver mode; they do not count as silver damage."]
            ]),
            de: "<p>Eine feste Interaktions-Matrix regelt, wer dem Biest etwas anhaben kann:</p>" + tbl(["Quelle", "Wirkung auf die Wolfsform"], [
              ["<strong>Hunter</strong>", "Immer tödlich, in jeder Form und jedem Silber-Modus."],
              ["<strong>Sheriff</strong>", "Tötet die Menschenform. Gegen die Wolfsform (Silber-Modus <em>Wounds The Wolf</em>, Default) ist der erste Schuss einmal pro Spiel überlebbar: Zwangs-Rückverwandlung, 0.8x Slow für 10 s, Kill-Cooldown auf Maximum, Ladung startet neu. Der nächste Treffer tötet. Modus <em>Kills The Wolf</em> entfernt die Ausnahme, <em>No Silver Effect</em> deaktiviert sie."],
              ["<strong>Fallen</strong> (Trapper / UC-Saboteur)", "Verwunden immer, töten nie und verbrauchen die Einmal-pro-Spiel-Zähigkeit nicht (eine Falle ist Eisen, kein Silber). Jeweils abschaltbar."],
              ["<strong>Deputy-Handschellen</strong>", "Erzwingen die Rückverwandlung unabhängig vom Silber-Modus; sie zählen nicht als Silberschaden."]
            ])
          }
        },
        {
          id: "werewolf-look",
          title: { en: "The look of the beast", de: "Der Look des Biests" },
          summary: {
            en: "A short camo-black beat, then a full-body werewolf costume at 1.5x player size with glowing eyes. With Nightfall installed, the transformation even switches the wolf into first person.",
            de: "Ein kurzer Kamo-schwarzer Beat, dann ein Ganzkörper-Werewolf-Kostüm bei 1.5x Spielergröße mit glühenden Augen. Mit installiertem Nightfall wechselt die Verwandlung den Wolf sogar in die Ich-Perspektive."
          },
          body: {
            en: "<p>The transformation plays a short camo-black beat (like TOR's Camouflager) and then dresses the wolf in the full-body <em>Werewolf</em> hat (visor, skin and pet hidden) at <strong>1.5x player size</strong>, with animated glowing eyes. While the Werewolf role is enabled, the Werewolf hat is locked in the wardrobe so nobody can impersonate the beast; a previously worn hat is restored afterwards. With the separate <a href='nightfall.html'>Nightfall</a> plugin installed, the transformation additionally switches the Werewolf into a real first-person view.</p>",
            de: "<p>Die Verwandlung spielt einen kurzen Kamo-schwarzen Beat (wie TORs Camouflager) und steckt den Wolf dann in den Ganzkörper-Hut <em>Werewolf</em> (Visor, Skin und Pet ausgeblendet) bei <strong>1.5x Spielergröße</strong>, mit animiert glühenden Augen. Solange die Werewolf-Rolle aktiviert ist, ist der Werewolf-Hut in der Garderobe gesperrt, damit niemand das Biest imitieren kann; ein zuvor getragener Hut wird danach wiederhergestellt. Mit dem separaten Plugin <a href='nightfall.html'>Nightfall</a> wechselt die Verwandlung den Werewolf zusätzlich in eine echte Ich-Perspektive.</p>"
          }
        },
        {
          id: "werewolf-options",
          title: { en: "Options (Impostor tab)", de: "Optionen (Impostor-Tab)" },
          summary: {
            en: "Spawn rate, charge and form timing, silver mode, flashlight radius and the trap/handcuff toggles.",
            de: "Spawnrate, Lade- und Form-Timing, Silber-Modus, Taschenlampen-Radius und die Fallen-/Handschellen-Toggles."
          },
          body: {
            en: tbl(["Option", "Default", "What it does"], [
              ["Werewolf", "Off", "Spawn chance of the role."],
              ["Werewolf Minimum Players To Spawn", "6", "The role is not assigned below this lobby size."],
              ["Wolf Kill Cooldown Reduction (%)", "30%", "Kill cooldown reduction in wolf form (0–75)."],
              ["Wolf Speed Multiplier (%)", "140%", "Movement speed in wolf form (100–200)."],
              ["Alpha Charge Time In Darkness (s)", "8", "Lights-out time needed for a full charge (3–30)."],
              ["Wolf Form Duration (s)", "12", "How long the wolf form and the darkness last (5–30)."],
              ["Silver Interaction", "Wounds The Wolf", "Wounds The Wolf / Kills The Wolf / No Silver Effect."],
              ["Howl On Transform", "On", "Audible howl when the wolf transforms."],
              ["Charge Reset On Lights Fix", "Off", "Whether a lights fix resets the charge instead of pausing it."],
              ["Only As Last Impostor", "On", "Transformation only as the last living Impostor."],
              ["Spy Counts As Impostor", "Off", "Whether a living Spy blocks the last-Impostor check."],
              ["Flashlight Radius For Everyone", "0.5x", "Vision radius during wolf darkness (Infinite, 2.0x–0.5x)."],
              ["Wolf Form Restrictions", "On", "Extra action locks during the wolf form."],
              ["Exhaustion Slow After Revert", "On", "Slow after reverting to human shape."],
              ["Trapper Trap Wounds The Wolf", "On", "Whether Trapper traps wound the wolf."],
              ["Saboteur Trap Wounds The Wolf", "On", "Whether UC Saboteur traps wound the wolf."],
              ["Deputy Handcuffs Force Revert", "On", "Whether handcuffs force the wolf back into human shape."]
            ]),
            de: tbl(["Option", "Standard", "Funktion"], [
              ["Werewolf", "Off", "Spawn-Chance der Rolle."],
              ["Werewolf Minimum Players To Spawn", "6", "Die Rolle wird unter dieser Lobby-Größe nicht vergeben."],
              ["Wolf Kill Cooldown Reduction (%)", "30%", "Kill-Cooldown-Reduktion in Wolfsform (0–75)."],
              ["Wolf Speed Multiplier (%)", "140%", "Bewegungstempo in Wolfsform (100–200)."],
              ["Alpha Charge Time In Darkness (s)", "8", "Benötigte Licht-aus-Zeit für volle Ladung (3–30)."],
              ["Wolf Form Duration (s)", "12", "Dauer der Wolfsform und der Dunkelheit (5–30)."],
              ["Silver Interaction", "Wounds The Wolf", "Wounds The Wolf / Kills The Wolf / No Silver Effect."],
              ["Howl On Transform", "On", "Hörbares Heulen bei der Verwandlung."],
              ["Charge Reset On Lights Fix", "Off", "Ob ein Licht-Fix die Ladung zurücksetzt statt pausiert."],
              ["Only As Last Impostor", "On", "Verwandlung nur als letzter lebender Impostor."],
              ["Spy Counts As Impostor", "Off", "Ob ein lebender Spy den Letzter-Impostor-Check blockiert."],
              ["Flashlight Radius For Everyone", "0.5x", "Sichtradius während der Wolfsdunkelheit (Infinite, 2.0x–0.5x)."],
              ["Wolf Form Restrictions", "On", "Zusätzliche Aktions-Sperren während der Wolfsform."],
              ["Exhaustion Slow After Revert", "On", "Slow nach der Rückverwandlung."],
              ["Trapper Trap Wounds The Wolf", "On", "Ob Trapper-Fallen den Wolf verwunden."],
              ["Saboteur Trap Wounds The Wolf", "On", "Ob UC-Saboteur-Fallen den Wolf verwunden."],
              ["Deputy Handcuffs Force Revert", "On", "Ob Handschellen den Wolf in die Menschenform zwingen."]
            ])
          }
        }
      ]
    },
    {
      id: "hunter",
      title: { en: "The Hunter (Crewmate)", de: "The Hunter (Crewmate)" },
      intro: {
        en: "Not a rolled role but an event inside a Werewolf round: once every non-Werewolf Impostor is dead, the living original Sheriff rises to become the Hunter, the one crewmate the beast should fear.",
        de: "Keine ausgeloste Rolle, sondern ein Ereignis in einer Werewolf-Runde: Sobald jeder Nicht-Werewolf-Impostor tot ist, steigt der lebende Original-Sheriff zum Hunter auf, dem einen Crewmate, den das Biest fürchten muss."
      },
      entries: [
        {
          id: "hunter-promotion",
          title: { en: "The promotion", de: "Die Beförderung" },
          summary: {
            en: "When all non-Werewolf Impostors are dead, the living original Sheriff becomes the Hunter, exactly once per round. A living Deputy can be promoted to Sheriff to fill the gap.",
            de: "Sind alle Nicht-Werewolf-Impostor tot, wird der lebende Original-Sheriff zum Hunter, genau einmal pro Runde. Ein lebender Deputy kann zum Sheriff nachrücken."
          },
          body: {
            en: "<p>The host checks the condition on every murder and exile plus a once-per-second poll (which also catches disconnects): as soon as every non-Werewolf Impostor is dead and the original Sheriff is still alive, the promotion fires, exactly once per round. By default only the <em>original</em> Sheriff qualifies, not a Deputy who inherited the badge. Optionally a living Deputy is promoted to the new Sheriff at the same moment, so the crew does not lose its lawman. The Hunter is deliberately <strong>not</strong> in the Role Draft: it is an event, not a starting role.</p>",
            de: "<p>Der Host prüft die Bedingung bei jedem Mord und Exile plus einem 1-Hz-Poll (der auch Disconnects abfängt): Sobald jeder Nicht-Werewolf-Impostor tot ist und der Original-Sheriff noch lebt, feuert die Beförderung, genau einmal pro Runde. Standardmäßig qualifiziert sich nur der <em>originale</em> Sheriff, kein Deputy, der den Stern geerbt hat. Optional wird im selben Moment ein lebender Deputy zum neuen Sheriff befördert, damit die Crew ihren Gesetzeshüter behält. Der Hunter ist bewusst <strong>nicht</strong> im Role Draft: Er ist ein Ereignis, keine Startrolle.</p>"
          }
        },
        {
          id: "hunter-abilities",
          title: { en: "Silver bullets & hunter's sight", de: "Silberkugeln & Hunter-Sicht" },
          summary: {
            en: "An own kill button that always kills the Werewolf (in any form) and other Impostors, optionally neutral killers too; a miss kills the Hunter. In wolf darkness the Hunter sees farther than everyone else.",
            de: "Ein eigener Kill-Button, der den Werewolf (in jeder Form) und andere Impostoren immer tötet, optional auch neutrale Killer; ein Fehlschuss tötet den Hunter. In der Wolfsdunkelheit sieht der Hunter weiter als alle anderen."
          },
          body: {
            en: "<p>The Hunter gets an own animated kill button on the Sheriff's cooldown. His shot <strong>always</strong> kills the Werewolf, in human or wolf form, regardless of the silver mode, and kills other Impostors like a Sheriff shot; optionally it also works on neutral killers. A wrong target kills the Hunter himself. During wolf darkness the Hunter is exempt from the fixed flashlight value and instead keeps a scaled crew radius (default 160%). His guessing behaviour is configurable: full guesser menu if he already was a Guesser, only the Werewolf, or no guessing. An optional public <em>Monster Hunter</em> hat makes him recognizable, which in turn removes him from everyone's guess menus (except knowledge shared by Lovers or the Jackal team).</p>",
            de: "<p>Der Hunter bekommt einen eigenen animierten Kill-Button mit dem Cooldown des Sheriffs. Sein Schuss tötet den Werewolf <strong>immer</strong>, in Menschen- wie Wolfsform, unabhängig vom Silber-Modus, und tötet andere Impostoren wie ein Sheriff-Schuss; optional wirkt er auch gegen neutrale Killer. Ein falsches Ziel tötet den Hunter selbst. Während der Wolfsdunkelheit ist der Hunter vom fixen Taschenlampen-Wert ausgenommen und behält stattdessen einen skalierten Crew-Radius (Default 160%). Sein Guess-Verhalten ist konfigurierbar: volles Guesser-Menü, falls er schon Guesser war, nur der Werewolf, oder gar kein Guessen. Ein optionaler öffentlicher <em>Monster-Hunter</em>-Hut macht ihn erkennbar, was ihn im Gegenzug aus den Guess-Menüs aller entfernt (außer bei geteiltem Wissen von Lovers oder Jackal-Team).</p>"
          }
        },
        {
          id: "hunter-options",
          title: { en: "Options (under the Werewolf)", de: "Optionen (unter dem Werewolf)" },
          summary: {
            en: "All Hunter options live under the Werewolf spawn rate, since the Hunter only exists in Werewolf rounds.",
            de: "Alle Hunter-Optionen hängen unter der Werewolf-Spawnrate, da es den Hunter nur in Werewolf-Runden gibt."
          },
          body: {
            en: tbl(["Option", "Default", "What it does"], [
              ["Hunter Enabled", "On", "Whether the promotion event exists at all."],
              ["Hunter Only From The Original Sheriff", "On", "Only the original Sheriff can rise, not a Deputy successor."],
              ["Hunter Flashlight Multiplier (%)", "160%", "Vision radius in wolf darkness relative to crew vision (100–250)."],
              ["Hunter Can Kill Neutral Killers", "On", "Whether the silver bullets also work on neutral killers."],
              ["Deputy Promotes To Sheriff When The Hunter Rises", "On", "A living Deputy fills the empty Sheriff seat."],
              ["Hunter Guessing", "Full Menu If Already Guesser", "Full Menu If Already Guesser / Only The Werewolf / No Hunter Guessing."],
              ["Hunter Wears The Monster Hunter Hat", "On", "Public hunter costume; removes him from guess menus of everyone who sees it."]
            ]),
            de: tbl(["Option", "Standard", "Funktion"], [
              ["Hunter Enabled", "On", "Ob es das Beförderungs-Ereignis überhaupt gibt."],
              ["Hunter Only From The Original Sheriff", "On", "Nur der Original-Sheriff kann aufsteigen, kein Deputy-Nachfolger."],
              ["Hunter Flashlight Multiplier (%)", "160%", "Sichtradius in der Wolfsdunkelheit relativ zur Crew-Sicht (100–250)."],
              ["Hunter Can Kill Neutral Killers", "On", "Ob die Silberkugeln auch gegen neutrale Killer wirken."],
              ["Deputy Promotes To Sheriff When The Hunter Rises", "On", "Ein lebender Deputy rückt auf den leeren Sheriff-Posten nach."],
              ["Hunter Guessing", "Full Menu If Already Guesser", "Full Menu If Already Guesser / Only The Werewolf / No Hunter Guessing."],
              ["Hunter Wears The Monster Hunter Hat", "On", "Öffentliches Hunter-Kostüm; entfernt ihn aus den Guess-Menüs aller, die es sehen."]
            ])
          }
        }
      ]
    },
    {
      id: "pelican",
      title: { en: "The Pelican (Neutral)", de: "The Pelican (Neutral)" },
      intro: {
        en: "A neutral killer that does not kill: it swallows. Victims vanish into the belly and can still come back, until the first meeting digests them. At two survivors the round turns into an open hunt with its own countdown.",
        de: "Ein neutraler Killer, der nicht tötet: Er verschluckt. Opfer verschwinden im Bauch und können noch zurückkommen, bis das erste Meeting sie verdaut. Bei zwei Überlebenden kippt die Runde in eine offene Jagd mit eigenem Countdown."
      },
      entries: [
        {
          id: "pelican-swallow",
          title: { en: "Swallowing instead of killing", de: "Verschlucken statt Töten" },
          summary: {
            en: "A swallowed player counts as dead, but the body is only hidden: no ghost info, no movement, camera locked on the Pelican. Vitals still shows them as alive.",
            de: "Ein Verschluckter zählt als tot, aber die Leiche ist nur versteckt: keine Geister-Infos, keine Bewegung, Kamera fest auf dem Pelican. Vitals zeigt ihn weiter als lebendig."
          },
          body: {
            en: "<p>The swallow runs through the full kill chain, so the victim technically dies, but the body is hidden instead of destroyed. Swallowed players cannot move, get no ghost information or roles, and their camera stays locked on the Pelican: they watch the belly that carries them around. The Vitals panel keeps showing them as alive, which quietly corrupts its information value in Pelican rounds.</p>",
            de: "<p>Der Schluck durchläuft die volle Kill-Kette, das Opfer stirbt also technisch, aber die Leiche wird versteckt statt zerstört. Verschluckte können sich nicht bewegen, bekommen keine Geister-Informationen oder Rollen, und ihre Kamera bleibt auf den Pelican gerichtet: Sie schauen dem Bauch zu, der sie herumträgt. Das Vitals-Panel zeigt sie weiterhin als lebendig, was dessen Informationswert in Pelican-Runden leise untergräbt.</p>"
          }
        },
        {
          id: "pelican-release",
          title: { en: "Digestion & release", de: "Verdauung & Befreiung" },
          summary: {
            en: "The first meeting digests everyone in the belly for good. But if the Pelican dies before a meeting, all swallowed players return alive in a ring around its corpse.",
            de: "Das erste Meeting verdaut alle im Bauch endgültig. Stirbt der Pelican aber vor einem Meeting, kehren alle Verschluckten lebendig im Ring um seine Leiche zurück."
          },
          body: {
            en: "<p>Swallowed players are in limbo until one of two things happens. If a meeting is called, the hidden bodies are destroyed and everyone in the belly is finally dead. If the Pelican dies first, and no meeting has passed since the swallow, every swallowed player comes back alive, placed in a ring around the Pelican's corpse. Killing the bird in time is therefore a real rescue mission.</p>",
            de: "<p>Verschluckte hängen in der Schwebe, bis eins von zwei Dingen passiert. Wird ein Meeting einberufen, werden die versteckten Leichen zerstört, und alle im Bauch sind endgültig tot. Stirbt der Pelican zuerst, und seit dem Schluck gab es kein Meeting, kehrt jeder Verschluckte lebendig zurück, platziert im Ring um die Leiche des Pelicans. Den Vogel rechtzeitig zu erlegen ist damit eine echte Rettungsmission.</p>"
          }
        },
        {
          id: "pelican-hunt",
          title: { en: "The hunt phase & winning", de: "Die Jagdphase & der Sieg" },
          summary: {
            en: "At two survivors including the Pelican, a public countdown starts: meetings, reports, the emergency button and venting are locked for everyone. Eat the last survivor before it ends, or lose.",
            de: "Bei zwei Überlebenden inklusive Pelican startet ein öffentlicher Countdown: Meetings, Reports, Notfallknopf und Venten sind für alle gesperrt. Friss den letzten Überlebenden, bevor er abläuft, oder verliere."
          },
          body: {
            en: "<p>As soon as exactly two players are left and one is the Pelican, the hunt phase begins with a public countdown (default 60 s). For <strong>all</strong> players, meetings, body reports, the emergency button and venting are locked; sabotage is locked too by default (toggleable), while ability buttons deliberately stay usable. If the Pelican swallows the last survivor, it wins alone (an own game-over reason). If the countdown runs out, the survivor wins with their own win condition and the Pelican loses. An endgame guard prevents the crew from winning via \"no killers left\" while the Pelican lives, and blocks other team wins during the two-player phase until the countdown resolves.</p>",
            de: "<p>Sobald genau zwei Spieler übrig sind und einer der Pelican ist, beginnt die Jagdphase mit einem öffentlichen Countdown (Default 60 s). Für <strong>alle</strong> Spieler sind Meetings, Leichen-Reports, der Notfallknopf und das Venten gesperrt; Sabotage standardmäßig ebenfalls (abschaltbar), während Fähigkeiten-Buttons bewusst nutzbar bleiben. Verschluckt der Pelican den letzten Überlebenden, gewinnt er allein (eigener Game-Over-Reason). Läuft der Countdown ab, gewinnt der Überlebende mit seiner eigenen Win-Condition, und der Pelican verliert. Ein Endspiel-Guard verhindert, dass die Crew per \"keine Killer mehr übrig\" gewinnt, solange der Pelican lebt, und blockt andere Team-Siege in der Zwei-Spieler-Phase, bis der Countdown entschieden ist.</p>"
          }
        },
        {
          id: "pelican-options",
          title: { en: "Options (Neutral tab)", de: "Optionen (Neutral-Tab)" },
          summary: {
            en: "Spawn rate, swallow cooldown, hunt countdown, tasks and the sabotage lock.",
            de: "Spawnrate, Schluck-Cooldown, Jagd-Countdown, Tasks und die Sabotage-Sperre."
          },
          body: {
            en: tbl(["Option", "Default", "What it does"], [
              ["Pelican", "Off", "Spawn chance of the role."],
              ["Pelican Minimum Players To Spawn", "6", "The role is not assigned below this lobby size."],
              ["Pelican Swallow Cooldown", "27.5 s", "Cooldown between swallows (10–60)."],
              ["Pelican Hunt Countdown (s)", "60", "Length of the final hunt phase (15–180)."],
              ["Pelican Has Tasks", "Off", "Whether the Pelican carries fake tasks."],
              ["Hunt Phase Also Blocks Sabotage", "On", "Whether sabotage is locked during the hunt."]
            ]),
            de: tbl(["Option", "Standard", "Funktion"], [
              ["Pelican", "Off", "Spawn-Chance der Rolle."],
              ["Pelican Minimum Players To Spawn", "6", "Die Rolle wird unter dieser Lobby-Größe nicht vergeben."],
              ["Pelican Swallow Cooldown", "27.5 s", "Cooldown zwischen Schlucken (10–60)."],
              ["Pelican Hunt Countdown (s)", "60", "Länge der finalen Jagdphase (15–180)."],
              ["Pelican Has Tasks", "Off", "Ob der Pelican Fake-Tasks trägt."],
              ["Hunt Phase Also Blocks Sabotage", "On", "Ob Sabotage während der Jagd gesperrt ist."]
            ])
          }
        }
      ]
    },
    {
      id: "auditor",
      title: { en: "The Auditor (Impostor)", de: "The Auditor (Impostor)" },
      intro: {
        en: "An Impostor who undoes progress: every task a living crewmate completes lands as a real, playable copy in the Auditor's own task list. Finishing that copy reverts the task at its original owner, for real, including the server-side task bar.",
        de: "Ein Impostor, der Fortschritt zurückdreht: Jede Task, die ein lebender Crewmate abschließt, landet als echte, spielbare Kopie in der eigenen Task-Liste des Auditors. Schließt er die Kopie ab, wird die Task beim ursprünglichen Besitzer real zurückgesetzt, inklusive server-seitigem Task-Balken."
      },
      entries: [
        {
          id: "auditor-steal",
          title: { en: "Stealing completed tasks", de: "Erledigte Tasks stehlen" },
          summary: {
            en: "Completed crew tasks queue up (default 3 at once) as playable tasks for the Auditor; each stolen copy has a limited lifetime that pauses in meetings and while he is working on it.",
            de: "Erledigte Crew-Tasks landen in einer Warteschlange (Default 3 gleichzeitig) als spielbare Tasks des Auditors; jede gestohlene Kopie hat eine begrenzte Lebensdauer, die in Meetings und beim aktiven Bearbeiten pausiert."
          },
          body: {
            en: "<p>Whenever a living crewmate completes a task that counts toward crew progress (never fake tasks), it is queued and appears as a genuine task in the Auditor's list. The queue holds a configured number of stolen tasks at once (default 3); when it is full, further completions simply pass by. Each entry expires after a configurable lifetime (default 90 s), paused during meetings and frozen while the Auditor is actively inside that task's minigame, so a task never expires mid-play. Entries also disappear when the original owner is recognised dead at the end of a meeting or when the Auditor dies. Normally consoles refuse Impostors entirely; for exactly the consoles of his stolen tasks the Auditor gets crew-style access so he can actually play them.</p>",
            de: "<p>Immer wenn ein lebender Crewmate eine Task abschließt, die zum Crew-Fortschritt zählt (nie Fake-Tasks), wird sie eingereiht und erscheint als echte Task in der Liste des Auditors. Die Warteschlange hält eine konfigurierte Zahl gestohlener Tasks gleichzeitig (Default 3); ist sie voll, laufen weitere Abschlüsse einfach vorbei. Jeder Eintrag verfällt nach einer konfigurierbaren Lebensdauer (Default 90 s), pausiert während Meetings und eingefroren, solange der Auditor aktiv im Minigame dieser Task steckt, damit eine Task nie mitten im Spielen abläuft. Einträge verschwinden auch, wenn der ursprüngliche Besitzer am Ende eines Meetings als tot erkannt wird oder der Auditor stirbt. Normalerweise verweigern Konsolen Impostoren komplett; genau für die Konsolen seiner gestohlenen Tasks bekommt der Auditor Crew-Zugriff, damit er sie wirklich spielen kann.</p>"
          }
        },
        {
          id: "auditor-revert",
          title: { en: "The revert is real", de: "Die Rücknahme ist echt" },
          summary: {
            en: "Completing a stolen task rebuilds the victim's task list server-side, so exactly that one task is open again and the crew task bar genuinely drops.",
            de: "Das Abschließen einer gestohlenen Task baut die Task-Liste des Opfers server-seitig neu auf, sodass genau diese eine Task wieder offen ist und der Crew-Task-Balken wirklich sinkt."
          },
          body: {
            en: "<p>When the Auditor finishes a stolen task, the host rebuilds the original owner's task list through the game's real task assignment (the only path the server also sees) and then has the victim's client automatically re-complete all its other finished tasks. Net effect: exactly the stolen task is open again, and the crew progress bar drops for real, so a crew task win moves genuinely out of reach. The victim is notified that a task was reset, never by whom; the timing is configurable (immediately, at the next meeting, or off). Optionally the Auditor sees who completed the stolen task, but that name is automatically suppressed whenever a Spy could be in the game: the Spy is the only player on the Auditor's Impostor list who completes real tasks and would be instantly exposed.</p>",
            de: "<p>Schließt der Auditor eine gestohlene Task ab, baut der Host die Task-Liste des ursprünglichen Besitzers über die echte Task-Zuweisung des Spiels neu auf (der einzige Weg, den auch der Server sieht) und lässt den Client des Opfers danach alle übrigen erledigten Tasks automatisch erneut abhaken. Nettoeffekt: Genau die gestohlene Task ist wieder offen, und der Crew-Fortschrittsbalken sinkt real, ein Crew-Task-Sieg rückt also wirklich in die Ferne. Das Opfer wird benachrichtigt, dass eine Task zurückgesetzt wurde, nie von wem; der Zeitpunkt ist konfigurierbar (sofort, beim nächsten Meeting, oder aus). Optional sieht der Auditor, wer die gestohlene Task erledigt hat, aber dieser Name wird automatisch unterdrückt, sobald ein Spy im Spiel sein könnte: Der Spy ist der einzige Spieler auf der Impostor-Liste des Auditors, der echte Tasks abschließt, und wäre sofort enttarnt.</p>"
          }
        },
        {
          id: "auditor-cooldown",
          title: { en: "Kill cooldown scales with audits", de: "Kill-Cooldown skaliert mit Rücknahmen" },
          summary: {
            en: "The Auditor starts slow (default 2.0x kill cooldown) and speeds up linearly with every successful revert, down to 0.5x at the configured target.",
            de: "Der Auditor startet langsam (Default 2.0x Kill-Cooldown) und wird mit jeder erfolgreichen Rücknahme linear schneller, bis 0.5x am konfigurierten Ziel."
          },
          body: {
            en: "<p>The Auditor's kill cooldown interpolates linearly between two multipliers based on his successful reverts this round: at zero reverts he kills at the slow end (default 2.0x), at the configured target count (default 8) he reaches the fast end (default 0.5x), after which it stays there. Paperwork first, murder later.</p>",
            de: "<p>Der Kill-Cooldown des Auditors interpoliert linear zwischen zwei Multiplikatoren, abhängig von seinen erfolgreichen Rücknahmen in dieser Runde: Bei null Rücknahmen tötet er am langsamen Ende (Default 2.0x), beim konfigurierten Zielwert (Default 8) erreicht er das schnelle Ende (Default 0.5x), danach bleibt es dort. Erst der Papierkram, dann der Mord.</p>"
          }
        },
        {
          id: "auditor-options",
          title: { en: "Options (Impostor tab)", de: "Optionen (Impostor-Tab)" },
          summary: {
            en: "Queue size, task lifetime, the cooldown curve and the information toggles.",
            de: "Queue-Größe, Task-Lebensdauer, die Cooldown-Kurve und die Informations-Toggles."
          },
          body: {
            en: tbl(["Option", "Default", "What it does"], [
              ["Auditor", "Off", "Spawn chance of the role."],
              ["Auditor Minimum Players To Spawn", "6", "The role is not assigned below this lobby size."],
              ["Stolen Tasks Kept At Once", "3", "Queue size for stolen tasks (1–8)."],
              ["Stolen Task Lifetime", "90 s", "How long a stolen task stays playable (30–300)."],
              ["Kill Cooldown Multiplier At 0 Reverts", "2.0x", "Cooldown at the start of the round (0.5–3.0)."],
              ["Kill Cooldown Multiplier At Full Reverts", "0.5x", "Cooldown once the target count is reached (0.25–2.0)."],
              ["Reverts For Full Effect", "8", "Successful reverts needed for the full bonus (1–20)."],
              ["Auditor Sees Who Completed The Task", "On", "Shows the completer's name (auto-suppressed while a Spy could exist)."],
              ["Auditor Cannot Guess The Snitch", "On", "Removes the Snitch from the Auditor's guess menu."],
              ["Victim Notification", "Immediately", "Immediately / At The Next Meeting / Off."]
            ]),
            de: tbl(["Option", "Standard", "Funktion"], [
              ["Auditor", "Off", "Spawn-Chance der Rolle."],
              ["Auditor Minimum Players To Spawn", "6", "Die Rolle wird unter dieser Lobby-Größe nicht vergeben."],
              ["Stolen Tasks Kept At Once", "3", "Queue-Größe für gestohlene Tasks (1–8)."],
              ["Stolen Task Lifetime", "90 s", "Wie lange eine gestohlene Task spielbar bleibt (30–300)."],
              ["Kill Cooldown Multiplier At 0 Reverts", "2.0x", "Cooldown zu Rundenbeginn (0.5–3.0)."],
              ["Kill Cooldown Multiplier At Full Reverts", "0.5x", "Cooldown ab Erreichen des Zielwerts (0.25–2.0)."],
              ["Reverts For Full Effect", "8", "Nötige erfolgreiche Rücknahmen für den vollen Bonus (1–20)."],
              ["Auditor Sees Who Completed The Task", "On", "Zeigt den Namen des Erledigers (automatisch unterdrückt, solange ein Spy existieren könnte)."],
              ["Auditor Cannot Guess The Snitch", "On", "Entfernt den Snitch aus dem Guess-Menü des Auditors."],
              ["Victim Notification", "Immediately", "Immediately / At The Next Meeting / Off."]
            ])
          }
        }
      ]
    },
    {
      id: "gambler",
      title: { en: "The Gambler (Modifier)", de: "The Gambler (Modifier)" },
      intro: {
        en: "A crew modifier that bets on the round itself: place wagers on kills, votes, tasks and deaths during the round, and collect (or pay) when the meeting settles them.",
        de: "Ein Crew-Modifier, der auf die Runde selbst wettet: Schließe während der Runde Wetten auf Kills, Votes, Tasks und Tode ab, und kassiere (oder zahle), wenn das Meeting sie auflöst."
      },
      entries: [
        {
          id: "gambler-bets",
          title: { en: "Placing bets", de: "Wetten platzieren" },
          summary: {
            en: "A HUD button opens a picker with 14 bet kinds in 6 tiers, some requiring a target player. Bets can only be placed outside meetings, limited by a cooldown and an open-bet cap.",
            de: "Ein HUD-Button öffnet einen Picker mit 14 Wettarten in 6 Tiers, manche mit Zielspieler. Wetten gehen nur außerhalb von Meetings, begrenzt durch Cooldown und ein Limit offener Wetten."
          },
          body: {
            en: "<p>The Gambler is assigned as a modifier on top of a regular crew role. A HUD button (default key F) opens a two-step picker: one of 14 bet kinds across 6 tiers (someone gets voted out, a kill happens within a time window, a tie vote, a chosen player dies next, a chosen player finishes N tasks, and more), then a target player where the bet needs one (never yourself). Placing bets requires being alive and outside a meeting, an elapsed cooldown (default 45 s) and a free slot under the open-bet cap (default 2). If the Gambler dies, all still-open bets are void.</p>",
            de: "<p>Der Gambler wird als Modifier auf eine reguläre Crew-Rolle aufgesetzt. Ein HUD-Button (Standard-Taste F) öffnet einen zweistufigen Picker: eine von 14 Wettarten in 6 Tiers (jemand wird rausgevotet, ein Kill passiert in einem Zeitfenster, ein Tie-Vote, ein gewählter Spieler stirbt als nächster, ein gewählter Spieler schafft N Tasks, und mehr), dann ein Zielspieler, wo die Wette einen braucht (nie man selbst). Wetten platzieren erfordert Leben, kein laufendes Meeting, abgelaufenen Cooldown (Default 45 s) und einen freien Slot unter dem Limit offener Wetten (Default 2). Stirbt der Gambler, verfallen alle noch offenen Wetten.</p>"
          }
        },
        {
          id: "gambler-settle",
          title: { en: "Meetings settle the bets", de: "Meetings lösen die Wetten auf" },
          summary: {
            en: "Bets never resolve mid-round: round facts settle at meeting start, voting facts after the vote. The Gambler's own vote is excluded from vote-count bets, and some bets can end in a push.",
            de: "Wetten lösen sich nie mitten in der Runde auf: Rundenfakten beim Meeting-Start, Abstimmungsfakten nach dem Vote. Die eigene Stimme des Gamblers zählt bei Stimmenzahl-Wetten nicht, und manche Wetten enden als Push."
          },
          body: {
            en: "<p>Deliberately, nothing settles during the round: a result popping up mid-round would be private insider knowledge, while a settlement in the meeting becomes table talk. Round facts (kills, deaths, tasks, sabotage) are evaluated when the meeting starts, voting facts (who got ejected, tie, vote counts) when voting completes. Bets that count votes exclude the Gambler's own vote so he cannot push his own bet through; bets on the plain voting result count the real outcome including his vote. Some bets can end in a push (no win, no loss), for example a kill-window bet interrupted by a meeting mid-window.</p>",
            de: "<p>Bewusst löst sich nichts während der Runde auf: Ein Ergebnis mitten in der Runde wäre privates Insiderwissen, eine Auflösung im Meeting wird dagegen Gesprächsstoff. Rundenfakten (Kills, Tode, Tasks, Sabotage) werden beim Meeting-Start ausgewertet, Abstimmungsfakten (wer rausflog, Tie, Stimmenzahlen) nach dem Vote. Wetten, die Stimmen zählen, schließen die eigene Stimme des Gamblers aus, damit er seine Wette nicht selbst durchdrückt; Wetten auf das reine Abstimmungsergebnis zählen das echte Ergebnis inklusive seiner Stimme. Manche Wetten können als Push enden (kein Gewinn, kein Verlust), etwa eine Kill-Fenster-Wette, die ein Meeting mitten im Fenster unterbricht.</p>"
          }
        },
        {
          id: "gambler-stakes",
          title: { en: "Winnings & losses", de: "Gewinne & Verluste" },
          summary: {
            en: "Stakes scale with the bet tier: speed changes, a task credited or reverted, up to a kill-cooldown change for all Impostors, who are only ever told that \"a Gambler\" did it.",
            de: "Der Einsatz skaliert mit dem Tier: Tempo-Änderungen, eine gutgeschriebene oder zurückgenommene Task, bis hin zur Kill-Cooldown-Änderung aller Impostoren, die höchstens erfahren, dass \"ein Gambler\" es war."
          },
          body: {
            en: "<p>What a bet is worth depends on its tier:</p>" + tbl(["Tier", "Win", "Loss"], [
              ["1–2", "Temporary speed boost for the Gambler (default +15% for 30 s).", "Temporary slow of the same size."],
              ["3–4", "One of his tasks is credited as completed.", "One of his completed tasks is reverted server-side (same technique as the Auditor). Without a matching task, the speed effect applies instead."],
              ["5", "The kill cooldown of <strong>all Impostors</strong> gets longer (default 5 s) until the next meeting.", "It gets shorter by the same amount: a lost bet arms the enemy."],
              ["6 (death bet)", "Both: 2 tasks plus the cooldown change.", "Both, in the Impostors' favour."]
            ]) + "<p class='note'>Optionally the Impostors are told in chat that a Gambler changed their cooldown, but never who it is.</p>",
            de: "<p>Was eine Wette wert ist, hängt vom Tier ab:</p>" + tbl(["Tier", "Gewinn", "Verlust"], [
              ["1–2", "Temporärer Speed-Boost für den Gambler (Default +15% für 30 s).", "Temporärer Slow in gleicher Höhe."],
              ["3–4", "Eine seiner Tasks wird als erledigt gutgeschrieben.", "Eine seiner erledigten Tasks wird server-seitig zurückgenommen (gleiche Technik wie beim Auditor). Ohne passende Task greift ersatzweise der Speed-Effekt."],
              ["5", "Der Kill-Cooldown <strong>aller Impostoren</strong> wird länger (Default 5 s), bis zum nächsten Meeting.", "Er wird um denselben Wert kürzer: Eine verlorene Wette rüstet den Feind."],
              ["6 (Todes-Wette)", "Beides: 2 Tasks plus die Cooldown-Änderung.", "Beides, zugunsten der Impostoren."]
            ]) + "<p class='note'>Optional erfahren die Impostoren im Chat, dass ein Gambler ihren Cooldown verändert hat, aber nie, wer es ist.</p>"
          }
        },
        {
          id: "gambler-options",
          title: { en: "Options (Modifier tab)", de: "Optionen (Modifier-Tab)" },
          summary: {
            en: "Spawn rate, cooldown, open-bet cap, bet thresholds and the effect sizes.",
            de: "Spawnrate, Cooldown, Limit offener Wetten, Wett-Schwellen und die Effektgrößen."
          },
          body: {
            en: tbl(["Option", "Default", "What it does"], [
              ["Gambler", "Off", "Spawn chance of the modifier."],
              ["Gambler Minimum Players To Spawn", "6", "Not assigned below this lobby size."],
              ["Gambler Bet Cooldown", "45 s", "Cooldown between placed bets (10–180)."],
              ["Gambler Open Bets At Once", "2", "Maximum simultaneous open bets (1–5)."],
              ["Gambler Kill Bet Window", "30 s", "Time window for kill-window bets (10–120)."],
              ["Gambler Task Bet Threshold", "4", "Task count for task bets (2–10)."],
              ["Gambler Vote Bet Threshold", "3", "Vote count for vote bets (2–8)."],
              ["Gambler Speed Change", "15%", "Size of the speed win/loss effect (5–50)."],
              ["Gambler Speed Effect Duration", "30 s", "How long the speed effect lasts (10–120)."],
              ["Gambler Kill Cooldown Change", "5 s", "Size of the Impostor cooldown change (1–20)."],
              ["Impostors Are Told About Cooldown Changes", "On", "Anonymous chat notice to the Impostors."]
            ]),
            de: tbl(["Option", "Standard", "Funktion"], [
              ["Gambler", "Off", "Spawn-Chance des Modifiers."],
              ["Gambler Minimum Players To Spawn", "6", "Wird unter dieser Lobby-Größe nicht vergeben."],
              ["Gambler Bet Cooldown", "45 s", "Cooldown zwischen platzierten Wetten (10–180)."],
              ["Gambler Open Bets At Once", "2", "Maximal gleichzeitig offene Wetten (1–5)."],
              ["Gambler Kill Bet Window", "30 s", "Zeitfenster für Kill-Fenster-Wetten (10–120)."],
              ["Gambler Task Bet Threshold", "4", "Task-Anzahl für Task-Wetten (2–10)."],
              ["Gambler Vote Bet Threshold", "3", "Stimmenzahl für Vote-Wetten (2–8)."],
              ["Gambler Speed Change", "15%", "Größe des Speed-Gewinn/Verlust-Effekts (5–50)."],
              ["Gambler Speed Effect Duration", "30 s", "Dauer des Speed-Effekts (10–120)."],
              ["Gambler Kill Cooldown Change", "5 s", "Größe der Impostor-Cooldown-Änderung (1–20)."],
              ["Impostors Are Told About Cooldown Changes", "On", "Anonymer Chat-Hinweis an die Impostoren."]
            ])
          }
        }
      ]
    },
    {
      id: "stalker",
      title: { en: "The Stalker (Neutral)", de: "The Stalker (Neutral)" },
      intro: {
        en: "A neutral with one target. Watch them from a narrow torch cone without anyone being able to see you; once the clock is full, strike. Any death of the target after that wins the game for the Stalker alone.",
        de: "Ein Neutraler mit einem Ziel. Beobachte es aus einem schmalen Lichtkegel, ohne dass dich jemand sehen könnte; ist die Uhr voll, schlag zu. Jeder Tod des Ziels danach gewinnt das Spiel für den Stalker allein."
      },
      entries: [
        {
          id: "stalker-cone",
          title: { en: "The cone & the clock", de: "Der Kegel & die Uhr" },
          summary: {
            en: "Normal crew vision plus a narrow torch cone that reaches 1.5–2× crew vision. The clock runs only while the target is inside the cone and nobody alive could see the Stalker with standard crew vision.",
            de: "Normale Crew-Sicht plus ein schmaler Lichtkegel mit 1,5- bis 2-facher Crew-Reichweite. Die Uhr läuft nur, solange das Ziel im Kegel steht und niemand Lebendes den Stalker mit Standard-Crew-Sicht sehen könnte."
          },
          body: {
            en: "<p>The Stalker keeps his normal vision and carries a second light: a narrow flashlight cone aimed with the mouse (or stick), reaching a configurable multiple of crew vision. His target has to stand inside that cone with a clear line of sight. At the same time the stalking clock only advances while <strong>nobody</strong> alive, the target included, could see him: every living player is checked against the standard crew light radius plus a wall raycast. Impostors usually see further, but the rule deliberately uses the crew radius so the Stalker can reason about it, and sabotaged lights shrink that radius for everyone: a blackout is his best friend. The sweet spot is the ring between crew vision and cone reach, in line of sight.</p><p>The button label tells him what the clock is doing: <em>STALK</em> (idle), <em>WATCHING</em> (the target is in the cone and the clock runs), <em>SEEN</em> (someone could see him, the clock stands).</p>",
            de: "<p>Der Stalker behält seine normale Sicht und trägt ein zweites Licht: einen schmalen Taschenlampen-Kegel, der mit der Maus (oder dem Stick) gerichtet wird und ein einstellbares Vielfaches der Crew-Sicht erreicht. Sein Ziel muss in diesem Kegel stehen, mit freier Sichtlinie. Gleichzeitig läuft die Stalk-Uhr nur, solange <strong>niemand</strong> Lebendes, das Ziel eingeschlossen, ihn sehen könnte: Jeder lebende Spieler wird gegen den Standard-Crew-Lichtradius plus einen Wand-Raycast geprüft. Impostoren sehen meist weiter, die Regel nutzt aber bewusst den Crew-Radius, damit der Stalker damit planen kann, und sabotierte Lichter verkleinern diesen Radius für alle: Ein Blackout ist sein bester Freund. Die Komfortzone ist der Ring zwischen Crew-Sicht und Kegel-Reichweite, in Sichtlinie.</p><p>Die Button-Beschriftung verrät ihm, was die Uhr tut: <em>STALKEN</em> (Leerlauf), <em>IM BLICK</em> (Ziel im Kegel, die Uhr läuft), <em>GESEHEN</em> (jemand könnte ihn sehen, die Uhr steht).</p>"
          }
        },
        {
          id: "stalker-meter",
          title: { en: "The stalk meter", de: "Das Stalk-Meter" },
          summary: {
            en: "Every 15 seconds the target sees how much stalking time is left. An option shows it never, only from 50%, or always.",
            de: "Alle 15 Sekunden sieht das Ziel, wie viel Stalk-Zeit noch fehlt. Eine Option zeigt es nie, erst ab 50% oder immer."
          },
          body: {
            en: "<p>The Stalker's client broadcasts the remaining time every 15 seconds; only the target displays it, as a line at the bottom of the screen. Because the meter only moves while the Stalker is close and unseen, a drop since the last tick is itself a clue (\"who was near me just now?\"), which is exactly the counterplay the role is built around. The option <em>Target Sees The Stalk Meter</em> decides whether the target learns about the stalking at all, only once half the time is done, or from the first tick. When the clock is full the meter changes to a warning that the stalker is ready to strike.</p>",
            de: "<p>Der Client des Stalkers sendet alle 15 Sekunden die Restzeit; nur das Ziel zeigt sie an, als Zeile am unteren Bildschirmrand. Weil das Meter nur sinkt, solange der Stalker nah und ungesehen ist, ist ein Rückgang seit dem letzten Tick selbst ein Hinweis (\"wer war gerade in meiner Nähe?\"), und genau darauf ist das Counterplay der Rolle gebaut. Die Option <em>Target Sees The Stalk Meter</em> entscheidet, ob das Ziel überhaupt vom Stalken erfährt, erst ab der Hälfte der Zeit oder ab dem ersten Tick. Ist die Uhr voll, wechselt das Meter zur Warnung, dass der Stalker bereit zum Zuschlagen ist.</p>"
          }
        },
        {
          id: "stalker-strike",
          title: { en: "Strike, win & fallback", de: "Zuschlagen, Sieg & Fallback" },
          summary: {
            en: "At 100% the Stalker gets a kill button for his target (own cooldown). Any death of the target afterwards, by his strike, an ejection or a guess, ends the game with a Stalker win. If the target dies before 100%, he becomes the Pursuer (or gets a new target, option).",
            de: "Bei 100% bekommt der Stalker einen Kill-Button für sein Ziel (eigener Cooldown). Jeder Tod des Ziels danach, durch seinen Schlag, einen Rauswurf oder einen Guess, beendet das Spiel mit einem Stalker-Sieg. Stirbt das Ziel vor 100%, wird er zum Pursuer (oder bekommt ein neues Ziel, Option)."
          },
          body: {
            en: "<p>The strike goes through TOR's regular kill funnel, so every shield (Medic, Time Master, Armored, …) applies exactly as for a Sheriff shot. The button only ever targets the one legal victim; the cone light goes out once the clock is full. The win is checked by the host: the moment the target is dead after 100%, while the Stalker himself is still alive, the game ends with an own game-over reason and the Stalker as sole winner. A target who dies too early ends the stalking: by default the Stalker is promoted to TOR's Pursuer (the Lawyer's fallback path), optionally he is handed a fresh target and keeps his progress. A target who merely disconnects is replaced either way.</p>",
            de: "<p>Der Schlag läuft durch TORs regulären Kill-Trichter, jedes Schild (Medic, Time Master, Armored, …) greift also genau wie bei einem Sheriff-Schuss. Der Button zielt immer nur auf das eine erlaubte Opfer; der Kegel erlischt, sobald die Uhr voll ist. Den Sieg prüft der Host: Sobald das Ziel nach 100% tot ist und der Stalker selbst noch lebt, endet das Spiel mit eigenem Game-Over-Reason und dem Stalker als Alleinsieger. Stirbt das Ziel zu früh, ist das Stalken vorbei: Standardmäßig wird der Stalker zu TORs Pursuer befördert (der Fallback-Pfad des Lawyers), optional bekommt er ein frisches Ziel und behält seinen Fortschritt. Ein Ziel, das nur die Verbindung verliert, wird in jedem Fall ersetzt.</p>"
          }
        },
        {
          id: "stalker-options",
          title: { en: "Options (Neutral tab)", de: "Optionen (Neutral-Tab)" },
          summary: {
            en: "Spawn rate, stalking time, cone reach and width, meter visibility, strike cooldown, early-death fallback, tasks and vents.",
            de: "Spawnrate, Stalk-Zeit, Kegel-Reichweite und -Breite, Meter-Sichtbarkeit, Schlag-Cooldown, Fallback bei frühem Tod, Tasks und Vents."
          },
          body: {
            en: tbl(["Option", "Default", "What it does"], [
              ["Stalker", "Off", "Spawn chance of the role."],
              ["Stalker Minimum Players To Spawn", "7", "The role is not assigned below this lobby size."],
              ["Stalking Time Needed", "90 s", "Unseen watching time until the strike is unlocked (30–300)."],
              ["Stalk Cone Reach (x Crew Vision)", "1.75", "Cone length as a multiple of crew vision (1.5–2.0)."],
              ["Stalk Cone Width", "0.2", "Vanilla flashlight width (0.1–0.5); the clock treats it as the fraction of a full circle."],
              ["Target Sees The Stalk Meter", "Always", "Always / From 50% / Never."],
              ["Strike Cooldown", "10 s", "Cooldown of the kill button after 100% (5–60)."],
              ["If The Target Dies Before 100%", "Stalker Becomes Pursuer", "Or: New Target, Progress Kept."],
              ["Stalker Has Tasks", "Off", "Whether his tasks count for the crew."],
              ["Stalker Can Use Vents", "Off", "Vent access."]
            ]),
            de: tbl(["Option", "Standard", "Funktion"], [
              ["Stalker", "Off", "Spawn-Chance der Rolle."],
              ["Stalker Minimum Players To Spawn", "7", "Unter dieser Lobby-Größe wird die Rolle nicht vergeben."],
              ["Stalking Time Needed", "90 s", "Ungesehene Beobachtungszeit bis zum freigeschalteten Schlag (30–300)."],
              ["Stalk Cone Reach (x Crew Vision)", "1,75", "Kegellänge als Vielfaches der Crew-Sicht (1,5–2,0)."],
              ["Stalk Cone Width", "0,2", "Vanilla-Taschenlampenbreite (0,1–0,5); die Uhr wertet sie als Anteil eines Vollkreises."],
              ["Target Sees The Stalk Meter", "Always", "Always / From 50% / Never."],
              ["Strike Cooldown", "10 s", "Cooldown des Kill-Buttons nach 100% (5–60)."],
              ["If The Target Dies Before 100%", "Stalker Becomes Pursuer", "Oder: New Target, Progress Kept."],
              ["Stalker Has Tasks", "Off", "Ob seine Tasks für die Crew zählen."],
              ["Stalker Can Use Vents", "Off", "Vent-Zugang."]
            ])
          }
        }
      ]
    },
    {
      id: "void",
      title: { en: "The Void (Modifier)", de: "The Void (Modifier)" },
      intro: {
        en: "A crew modifier the vote cannot reach, once: the first ejection that would hit the Void simply does not happen. In return, his own vote never counts.",
        de: "Ein Crew-Modifier, den die Abstimmung nicht erreicht, einmal: Der erste Rauswurf, der den Void treffen würde, findet schlicht nicht statt. Dafür zählt seine eigene Stimme nie."
      },
      entries: [
        {
          id: "void-immunity",
          title: { en: "One ejection passes through", de: "Ein Rauswurf geht durch ihn hindurch" },
          summary: {
            en: "Everyone votes normally and the tally is shown. If the Void would be ejected, the host swaps the verdict for \"nobody\": no death, no lover cascade, no Jester or Lawyer bookkeeping. The immunity is spent afterwards.",
            de: "Alle voten normal, das Ergebnis wird gezeigt. Würde der Void rausfliegen, tauscht der Host das Urteil gegen \"niemand\": kein Tod, keine Lover-Kaskade, keine Jester- oder Lawyer-Buchführung. Danach ist die Immunität verbraucht."
          },
          body: {
            en: "<p>The cut is made at the host's vote result: TOR's vote counting decides who is exiled, and right before that verdict leaves the host it is rewritten to a skip when the Void is the one. Nothing in TOR ever believes the Void died, so no secondary effect fires. It works exactly once per game; after that the Void is a normal, votable crewmate. The Void is crew-only, so an exposed Void is confirmed crew: that is the design's intent, the immunity is his one shield and it is public the moment it is used.</p><p>The Void is an <strong>after-death modifier</strong>, the same family as TOR's VIP, Bait and Bloody: while \"VIP, Bait & Bloody Are Hidden\" is on, the tag is hidden from everyone, its carrier included, until they die or the game ends. A player usually learns they were the Void the moment the vote fails to eject them. Its spawn option sits under its own \"After Death Modifier\" heading in the Modifier tab.</p>",
            de: "<p>Der Schnitt sitzt beim Abstimmungsergebnis des Hosts: TORs Stimmenzählung bestimmt, wer rausfliegt, und unmittelbar bevor dieses Urteil den Host verlässt, wird es zu einem Skip umgeschrieben, wenn es den Void trifft. Nichts in TOR glaubt je, der Void sei gestorben, also feuert kein Folgeeffekt. Es wirkt genau einmal pro Spiel; danach ist der Void ein normaler, rauswählbarer Crewmate. Der Void ist Crew-only, ein enttarnter Void ist also bestätigte Crew: Das ist so gewollt, die Immunität ist sein einziger Schild, und sie ist öffentlich, sobald sie benutzt wurde.</p><p>Der Void ist ein <strong>After-Death-Modifier</strong>, dieselbe Familie wie TORs VIP, Bait und Bloody: Solange \"VIP, Bait & Bloody Are Hidden\" an ist, bleibt der Tag vor allen verborgen, auch vor dem Träger selbst, bis er stirbt oder das Spiel endet. Meist erfährt ein Spieler erst in dem Moment, dass er der Void war, in dem die Abstimmung ihn nicht rauswirft. Seine Spawn-Option steht im Modifier-Tab unter einer eigenen Überschrift \"After Death Modifier\".</p>"
          }
        },
        {
          id: "void-animation",
          title: { en: "The exile scene", de: "Die Rauswurf-Szene" },
          summary: {
            en: "Since 1.2.6.1 a full scene: the Void drifts into a violet nothing, the ballots fly through them into a rift that swallows them, and the Void drifts back. With the scene off, the skip screen shows the glitching line \"The vote vanished into the void.\"",
            de: "Seit 1.2.6.1 eine ganze Szene: Der Void treibt in ein violettes Nichts, die Stimmzettel fliegen durch ihn hindurch in einen Riss, der sie verschluckt, und der Void treibt zurück. Ist die Szene aus, zeigt der Skip-Bildschirm die glitchende Zeile \"Die Stimme verschwand im Nichts.\"",
          },
          body: {
            en: "<p>The scene: the Void drifts into a violet nothing, a rift opens behind them, the ballots fly at them and straight through them (the Void glitches, half transparent, with interference stripes) into the rift, which swallows them and collapses. The Void stays, looks around and drifts back. The option <strong>Void Exile Scene</strong> chooses All Maps (default), Atlas Maps Only or Off. It uses the same scene engine as Unknown's Atlas, and Atlas keeps its own skip scene out of that ejection.</p><p>With the scene off: purely cosmetic and driven on every client from a host message that arrives right before the vote result. No figure flies by: the vanilla \"No one was ejected\" typewriter line is kept and only re-textured in the void's colours, styled after Tower Defense Simulator's void theme. Two tinted copies of the text ride slightly offset behind it like chromatic aberration; every few hundred milliseconds a short burst shoves them apart, flickers the colour towards magenta and replaces a couple of the ghost characters with ASCII noise. The meeting then ends like a skipped vote.</p>",
            de: "<p>Die Szene: Der Void treibt in ein violettes Nichts, hinter ihm öffnet sich ein Riss, die Stimmzettel fliegen auf ihn zu und glatt durch ihn hindurch (der Void glitcht, halb durchsichtig, mit Störstreifen) in den Riss, der sie verschluckt und in sich zusammenfällt. Der Void bleibt, schaut sich um und treibt zurück. Die Option <strong>Void Exile Scene</strong> wählt All Maps (Standard), Atlas Maps Only oder Off. Sie nutzt dieselbe Szenen-Engine wie Unknown's Atlas, und Atlas hält seine eigene Skip-Szene aus diesem Rauswurf heraus.</p><p>Mit ausgeschalteter Szene: rein kosmetisch und auf jedem Client durch eine Host-Nachricht ausgelöst, die direkt vor dem Abstimmungsergebnis eintrifft. Es fliegt keine Figur vorbei: Die Vanilla-Schreibmaschinenzeile \"Niemand wurde rausgeworfen\" bleibt und wird nur in den Farben des Nichts eingefärbt, angelehnt an das Void-Thema von Tower Defense Simulator. Zwei getönte Kopien des Textes liegen leicht versetzt dahinter wie eine Farbverschiebung; alle paar hundert Millisekunden schiebt ein kurzer Ruck sie auseinander, lässt die Farbe Richtung Magenta flackern und ersetzt ein paar Zeichen der Geisterkopien durch ASCII-Rauschen. Das Meeting endet danach wie ein Skip.</p>"
          }
        },
        {
          id: "void-options",
          title: { en: "Options (Modifier tab)", de: "Optionen (Modifier-Tab)" },
          summary: {
            en: "Spawn rate, minimum players and whether his own vote counts.",
            de: "Spawnrate, Mindestspieler und ob seine eigene Stimme zählt."
          },
          body: {
            en: tbl(["Option", "Default", "What it does"], [
              ["Void", "Off", "Spawn chance of the modifier (crew only)."],
              ["Void Minimum Players To Spawn", "5", "Not assigned below this lobby size."],
              ["Void's Own Vote Counts", "Off", "Off: his vote is accepted but weighs nothing (the icon still shows where it landed)."],
              ["Void Exile Scene", "All Maps", "All Maps, Atlas Maps Only or Off (plain skip screen with the glitch line)."]
            ]),
            de: tbl(["Option", "Standard", "Funktion"], [
              ["Void", "Off", "Spawn-Chance des Modifiers (nur Crew)."],
              ["Void Minimum Players To Spawn", "5", "Wird unter dieser Lobby-Größe nicht vergeben."],
              ["Void's Own Vote Counts", "Off", "Off: Seine Stimme wird angenommen, wiegt aber nichts (das Icon zeigt weiter, wo sie landete)."],
              ["Void Exile Scene", "All Maps", "All Maps, Atlas Maps Only oder Off (normaler Skip-Bildschirm mit Glitch-Zeile)."]
            ])
          }
        }
      ]
    },
    {
      id: "king",
      title: { en: "The King (Crewmate)", de: "The King (Crewmate)" },
      intro: {
        en: "A crewmate with no tasks and no powers, but a court: the King knows his advisor's role from the start, and while TOR's VIP modifier is enabled, the crown is the VIP.",
        de: "Ein Crewmate ohne Tasks und ohne Fähigkeiten, aber mit Hofstaat: Der King kennt von Anfang an die Rolle seines Ratgebers, und solange TORs VIP-Modifier aktiv ist, trägt die Krone den VIP."
      },
      entries: [
        {
          id: "king-advisor",
          title: { en: "The advisor", de: "Der Ratgeber" },
          summary: {
            en: "The host appoints one other crewmate. The King sees that player's starting role under their name for the whole game, in the world and in meetings. The advisor is never told; later role changes are not tracked.",
            de: "Der Host ernennt einen anderen Crewmate. Der King sieht dessen Startrolle das ganze Spiel unter dem Namen, in der Welt und in Meetings. Der Ratgeber erfährt nichts; spätere Rollenwechsel werden nicht verfolgt."
          },
          body: {
            en: "<p>The advisor is preferably a crew player (no Impostor, no neutral). The King's client captures the role text once, shortly after the roles are final (after the draft and the random promotions), and keeps showing exactly that: a Sidekick recruitment, a shift or an erase later on is deliberately invisible to him. A King who dies loses the line to TOR's regular ghost information.</p>",
            de: "<p>Der Ratgeber ist bevorzugt ein Crew-Spieler (kein Impostor, kein Neutraler). Der Client des Kings erfasst den Rollentext einmal, kurz nachdem die Rollen final sind (nach Draft und Zufallsbeförderungen), und zeigt genau das weiter: Eine spätere Sidekick-Rekrutierung, ein Shift oder ein Erase bleiben ihm bewusst verborgen. Stirbt der King, geht die Zeile in TORs reguläre Geister-Information über.</p>"
          }
        },
        {
          id: "king-vip",
          title: { en: "The crown is the VIP", de: "Die Krone trägt den VIP" },
          summary: {
            en: "Option (on by default): the King is always a VIP, on top of the VIPs TOR rolls. His murder notifies everyone with a royal flash and a line of text. While the option is on, TOR's VIP rate cannot be parked at 0.",
            de: "Option (standardmäßig an): Der King ist immer ein VIP, zusätzlich zu den VIPs, die TOR auslost. Sein Mord benachrichtigt alle mit einem königlichen Flash und einer Textzeile. Solange die Option an ist, lässt sich TORs VIP-Rate nicht auf 0 stellen."
          },
          body: {
            en: "<p>TOR's own VIPs keep their tag (rate and quantity decide how many there are); the King simply is one more. He is not put into TOR's VIP list (that would fire TOR's yellow blink on top): the VIP tag is appended to his role info, and the flash is the mod's own, gold by default or the killer's team colour when TOR's \"Show Team Color\" is on, with the message \"The King has fallen!\". A forced VIP with the modifier switched off would contradict itself, so while the option is on and the King can spawn, the host's VIP rate is held at 10–100 %. The King carries no tasks: they are removed server-side at the assignment, so the crew's task total shrinks by his share.</p>",
            de: "<p>TORs eigene VIPs behalten ihren Tag (Rate und Anzahl bestimmen, wie viele es sind); der King ist schlicht ein weiterer. Er landet nicht in TORs VIP-Liste (das würde TORs gelbes Blinken obendrauf auslösen): Der VIP-Tag wird an seine Rolleninfo angehängt, und der Flash ist der mod-eigene, standardmäßig gold oder in der Teamfarbe des Killers, wenn TORs \"Show Team Color\" an ist, mit der Meldung \"Der King ist gefallen!\". Ein erzwungener VIP bei abgeschaltetem Modifier wäre ein Widerspruch, deshalb wird die VIP-Rate des Hosts bei aktiver Option und spawnfähigem King auf 10–100 % gehalten. Der King trägt keine Tasks: Sie werden bei der Zuweisung server-seitig entfernt, die Task-Summe der Crew schrumpft also um seinen Anteil.</p>"
          }
        },
        {
          id: "king-options",
          title: { en: "Options (Crewmate tab)", de: "Optionen (Crewmate-Tab)" },
          summary: {
            en: "Spawn rate, minimum players and the VIP coupling.",
            de: "Spawnrate, Mindestspieler und die VIP-Kopplung."
          },
          body: {
            en: tbl(["Option", "Default", "What it does"], [
              ["King", "Off", "Spawn chance of the role."],
              ["King Minimum Players To Spawn", "6", "The role is not assigned below this lobby size."],
              ["King Is Always The VIP", "On", "The King is a VIP in addition to TOR's rolled VIPs; holds TOR's VIP rate at 10–100 %."]
            ]),
            de: tbl(["Option", "Standard", "Funktion"], [
              ["King", "Off", "Spawn-Chance der Rolle."],
              ["King Minimum Players To Spawn", "6", "Unter dieser Lobby-Größe wird die Rolle nicht vergeben."],
              ["King Is Always The VIP", "On", "Der King ist zusätzlich zu TORs ausgelosten VIPs ein VIP; hält TORs VIP-Rate auf 10–100 %."]
            ])
          }
        }
      ]
    },
    {
      id: "necromancer",
      title: { en: "The Necromancer (Neutral)", de: "The Necromancer (Neutral)" },
      intro: {
        en: "A neutral who raises fresh corpses into thralls and wins once enough of the living belong to him.",
        de: "Ein Neutraler, der frische Leichen zu Thralls erweckt und gewinnt, sobald genug Lebende ihm gehören."
      },
      entries: [
        {
          id: "necromancer-how",
          title: { en: "How it works", de: "So funktioniert es" },
          summary: {
            en: "Raise a fresh corpse (only between a kill and the next meeting). Thralls look like anyone else, but their vote weighs nothing and they cannot guess.",
            de: "Eine frische Leiche erwecken (nur zwischen Kill und nächstem Meeting). Thralls sehen aus wie jeder andere, aber ihre Stimme wiegt nichts und sie können nicht guessen."
          },
          body: {
            en: "<p>A body only exists between a kill and the next meeting, and only a fresh one can be raised (Corpse Freshness Window). A raised player, a thrall, walks, talks and plays like anyone else, keeps their role, and nobody else can tell. Their vote weighs nothing and they cannot guess; they do not hold up the meeting either (a thrall who does not vote skips automatically). Their tasks are taken away on the server, so they never block the crew's task win. The Necromancer wins at a meeting once more than two thirds (or more than half) of the living belong to him with at least the minimum number of thralls. If he dies or leaves, every thrall dies with him.</p>",
            de: "<p>Eine Leiche gibt es nur zwischen einem Kill und dem nächsten Meeting, und nur eine frische lässt sich erwecken (Corpse Freshness Window). Ein Erweckter, ein Thrall, läuft, redet und spielt wie jeder andere, behält seine Rolle, und niemand sonst kann es erkennen. Seine Stimme wiegt nichts und er kann nicht guessen; das Meeting hält er auch nicht auf (ein Thrall, der nicht abstimmt, skippt automatisch). Seine Aufgaben werden auf dem Server entzogen, er blockiert also nie den Aufgabensieg der Crew. Der Necromancer gewinnt in einem Meeting, sobald mehr als zwei Drittel (oder mehr als die Hälfte) der Lebenden ihm gehören, mit mindestens der Mindestzahl Thralls. Stirbt er oder geht er, sterben alle Thralls mit ihm.</p>"
          }
        },
        {
          id: "necromancer-options",
          title: { en: "Options", de: "Optionen" },
          summary: {
            en: "Raising, freshness window, win threshold, minimum thralls, vents, tasks.",
            de: "Erwecken, Frische-Fenster, Siegschwelle, Mindest-Thralls, Vents, Aufgaben."
          },
          body: {
            en: tbl(["Option", "Default", "What it does"], [
              ["Necromancer", "Off", "Spawn chance (neutral)."],
              ["Necromancer Minimum Players To Spawn", "7", "Not assigned below this lobby size."],
              ["Raising Duration", "3 s", "How long raising takes."],
              ["Raise Cooldown", "20 s", "Time between two raises."],
              ["Corpse Freshness Window", "60 s", "Older bodies cannot be raised."],
              ["Necromancer Win Threshold", "More Than Two Thirds", "Or more than half of the living."],
              ["Minimum Thralls To Win", "2", "At least this many thralls."],
              ["Necromancer Can Use Vents", "Off", ""],
              ["Necromancer Has Tasks", "Off", "Fake tasks for cover."],
              ["Necromancer And Poltergeist Exclude Each Other", "On", "Only one of the two per game."]
            ]),
            de: tbl(["Option", "Standard", "Funktion"], [
              ["Necromancer", "Off", "Spawn-Chance (neutral)."],
              ["Necromancer Minimum Players To Spawn", "7", "Wird unter dieser Lobby-Größe nicht vergeben."],
              ["Raising Duration", "3 s", "Wie lange das Erwecken dauert."],
              ["Raise Cooldown", "20 s", "Zeit zwischen zwei Erweckungen."],
              ["Corpse Freshness Window", "60 s", "Ältere Leichen lassen sich nicht erwecken."],
              ["Necromancer Win Threshold", "More Than Two Thirds", "Oder mehr als die Hälfte der Lebenden."],
              ["Minimum Thralls To Win", "2", "Mindestens so viele Thralls."],
              ["Necromancer Can Use Vents", "Off", ""],
              ["Necromancer Has Tasks", "Off", "Fake-Tasks zur Tarnung."],
              ["Necromancer And Poltergeist Exclude Each Other", "On", "Nur einer der beiden pro Spiel."]
            ])
          }
        }
      ]
    },
    {
      id: "sleepwalker",
      title: { en: "The Sleepwalker (Modifier)", de: "The Sleepwalker (Modifier)" },
      intro: {
        en: "Dozes off in the meeting and wakes up somewhere on the map instead of at the table.",
        de: "Nickt im Meeting ein und wacht irgendwo auf der Karte auf statt am Tisch."
      },
      entries: [
        {
          id: "sleepwalker-how",
          title: { en: "How it works", de: "So funktioniert es" },
          summary: {
            en: "After a meeting they wake up at a random reachable spot on the map, with no cue for anyone else.",
            de: "Nach einem Meeting wacht er an einem zufälligen, erreichbaren Platz der Karte auf, ohne Hinweis für die anderen."
          },
          body: {
            en: "<p>After an ejection the host picks a random spot for the Sleepwalker: inside a room, on floor that can actually be reached, at least the set distance away from the table. Only the Sleepwalker's own screen shows that they wake up there, with a short wake-up effect; everyone else gets no cue. Since 1.2.6.2 a reach grid flooded from every living player makes sure the spot is never behind a railing or outside the map. On Submerged the Sleepwalker stays at the table (two decks joined only by elevators).</p>",
            de: "<p>Nach einem Rauswurf wählt der Host für den Sleepwalker einen zufälligen Platz: in einem Raum, auf wirklich erreichbarem Boden, mindestens den eingestellten Abstand vom Tisch entfernt. Nur beim Sleepwalker selbst erscheint, dass er dort aufwacht, mit einem kurzen Aufwach-Effekt; alle anderen bekommen keinen Hinweis. Seit 1.2.6.2 sorgt ein Erreichbarkeitsraster, das von jedem lebenden Spieler aus geflutet wird, dafür, dass der Platz nie hinter einem Geländer oder außerhalb der Karte liegt. Auf Submerged bleibt der Sleepwalker am Tisch (zwei Decks, nur per Aufzug verbunden).</p>"
          }
        },
        {
          id: "sleepwalker-options",
          title: { en: "Options", de: "Optionen" },
          summary: {
            en: "Who can get it, chance per meeting, distance from the table, at game start.",
            de: "Wer ihn bekommen kann, Chance pro Meeting, Abstand vom Tisch, zum Spielstart."
          },
          body: {
            en: tbl(["Option", "Default", "What it does"], [
              ["Sleepwalker", "Off", "Spawn chance of the modifier."],
              ["Sleepwalker Minimum Players To Spawn", "5", "Not assigned below this lobby size."],
              ["Sleepwalker Can Be", "Crew Only", "Crew Only, Crew & Impostor or Anyone."],
              ["Wake-Up Chance Per Meeting", "100%", "How often it happens."],
              ["Minimum Distance From The Table", "10", "How far from the meeting table."],
              ["Also Sleepwalks At Game Start", "Off", "Also at the very start."]
            ]),
            de: tbl(["Option", "Standard", "Funktion"], [
              ["Sleepwalker", "Off", "Spawn-Chance des Modifiers."],
              ["Sleepwalker Minimum Players To Spawn", "5", "Wird unter dieser Lobby-Größe nicht vergeben."],
              ["Sleepwalker Can Be", "Crew Only", "Crew Only, Crew & Impostor oder Anyone."],
              ["Wake-Up Chance Per Meeting", "100%", "Wie oft es passiert."],
              ["Minimum Distance From The Table", "10", "Wie weit vom Meeting-Tisch."],
              ["Also Sleepwalks At Game Start", "Off", "Auch direkt zum Spielstart."]
            ])
          }
        }
      ]
    },
    {
      id: "last-words",
      title: { en: "Last Words (Modifier)", de: "Last Words (Modifier)" },
      intro: {
        en: "One sentence that survives its author.",
        de: "Ein Satz, der seinen Verfasser überlebt."
      },
      entries: [
        {
          id: "last-words-how",
          title: { en: "How it works", de: "So funktioniert es" },
          summary: {
            en: "Write one sentence with N; if you die, it shows up anonymously in the next meeting.",
            de: "Mit N einen Satz schreiben; stirbst du, erscheint er anonym im nächsten Meeting."
          },
          body: {
            en: "<p>During the round the carrier presses N and writes one sentence. If they die, it appears in the next meeting as an anonymous chat bubble named Last Words. If chat censoring is on, the receiving side censors it like normal chat.</p>",
            de: "<p>Während der Runde drückt der Träger N und schreibt einen Satz. Stirbt er, erscheint der Satz im nächsten Meeting als anonyme Chatblase mit dem Namen Last Words. Ist die Chat-Zensur an, zensiert die Empfängerseite ihn wie normalen Chat.</p>"
          }
        },
        {
          id: "last-words-options",
          title: { en: "Options", de: "Optionen" },
          summary: {
            en: "Who can get it and the maximum length.",
            de: "Wer ihn bekommen kann und die Höchstlänge."
          },
          body: {
            en: tbl(["Option", "Default", "What it does"], [
              ["Last Words", "Off", "Spawn chance of the modifier."],
              ["Last Words Minimum Players To Spawn", "5", "Not assigned below this lobby size."],
              ["Last Words Can Be", "Crew Only", "Or Anyone."],
              ["Last Words Maximum Length", "120", "Characters, 40 to 200."]
            ]),
            de: tbl(["Option", "Standard", "Funktion"], [
              ["Last Words", "Off", "Spawn-Chance des Modifiers."],
              ["Last Words Minimum Players To Spawn", "5", "Wird unter dieser Lobby-Größe nicht vergeben."],
              ["Last Words Can Be", "Crew Only", "Oder Anyone."],
              ["Last Words Maximum Length", "120", "Zeichen, 40 bis 200."]
            ])
          }
        }
      ]
    },
    {
      id: "sixth-sense",
      title: { en: "The Sixth Sense (Modifier)", de: "The Sixth Sense (Modifier)" },
      intro: {
        en: "A crew modifier that feels danger without knowing where it comes from.",
        de: "Ein Crew-Modifier, der Gefahr spürt, ohne zu wissen, woher sie kommt."
      },
      entries: [
        {
          id: "sixth-sense-how",
          title: { en: "How it works", de: "So funktioniert es" },
          summary: {
            en: "The screen edge pulses while a killer with a ready kill is near; never who or where.",
            de: "Der Bildschirmrand pulsiert, solange ein Killer mit bereitem Kill in der Nähe ist; nie wer oder wo."
          },
          body: {
            en: "<p>Whenever a killer whose kill is ready stands within range, the screen edge pulses like a heartbeat, stronger the closer they are. It never says who or where. Every killer's client reports when its own kill becomes ready, so it also works for the Jackal and the Sidekick if the option allows.</p>",
            de: "<p>Steht ein Killer mit bereitem Kill in Reichweite, pulsiert der Bildschirmrand wie ein Herzschlag, stärker, je näher er ist. Es verrät nie wer oder wo. Der Client jedes Killers meldet, wann sein eigener Kill bereit ist, deshalb funktioniert es auch für Jackal und Sidekick, wenn die Option es erlaubt.</p>"
          }
        },
        {
          id: "sixth-sense-options",
          title: { en: "Options", de: "Optionen" },
          summary: {
            en: "Range, neutral killers, pulse strength.",
            de: "Reichweite, neutrale Killer, Pulsstärke."
          },
          body: {
            en: tbl(["Option", "Default", "What it does"], [
              ["Sixth Sense", "Off", "Spawn chance (crew only)."],
              ["Sixth Sense Minimum Players To Spawn", "5", "Not assigned below this lobby size."],
              ["Sixth Sense Range", "3", "Distance, 1 to 8."],
              ["Sixth Sense Detects Jackal And Sidekick", "On", "Also counts neutral killers."],
              ["Pulse Grows With Proximity", "On", "Stronger the closer the killer."]
            ]),
            de: tbl(["Option", "Standard", "Funktion"], [
              ["Sixth Sense", "Off", "Spawn-Chance (nur Crew)."],
              ["Sixth Sense Minimum Players To Spawn", "5", "Wird unter dieser Lobby-Größe nicht vergeben."],
              ["Sixth Sense Range", "3", "Abstand, 1 bis 8."],
              ["Sixth Sense Detects Jackal And Sidekick", "On", "Zählt auch neutrale Killer."],
              ["Pulse Grows With Proximity", "On", "Stärker, je näher der Killer."]
            ])
          }
        }
      ]
    },
    {
      id: "colorblind",
      title: { en: "The Colorblind (Modifier)", de: "The Colorblind (Modifier)" },
      intro: {
        en: "Plays the round in black and white, the map included, like an old television.",
        de: "Spielt die Runde in Schwarz-Weiß, die Karte eingeschlossen, wie ein alter Fernseher."
      },
      entries: [
        {
          id: "colorblind-how",
          title: { en: "How it works", de: "So funktioniert es" },
          summary: {
            en: "Black and white screen, map included; the MedBay scan cures it.",
            de: "Schwarz-weißer Bildschirm samt Karte; der MedBay-Scan heilt es."
          },
          body: {
            en: "<p>The whole picture is drawn in black and white; menus and overlays stay untouched. Task minigames can stay in colour. The MedBay scan cures it: the host adds a Submit Scan task, and the scan shows a short diagnosis. One scan length applies to everyone, so a scan's duration gives nobody away.</p>",
            de: "<p>Das ganze Bild wird in Schwarz-Weiß gezeichnet; Menüs und Overlays bleiben unberührt. Aufgaben-Minispiele können farbig bleiben. Der MedBay-Scan heilt es: Der Host fügt eine Submit-Scan-Aufgabe hinzu, und der Scan zeigt eine kurze Diagnose. Für alle gilt dieselbe Scan-Dauer, die Dauer eines Scans verrät also niemanden.</p>"
          }
        },
        {
          id: "colorblind-options",
          title: { en: "Options", de: "Optionen" },
          summary: {
            en: "Who can get it, tasks in colour, the MedBay cure.",
            de: "Wer ihn bekommen kann, farbige Aufgaben, die MedBay-Heilung."
          },
          body: {
            en: tbl(["Option", "Default", "What it does"], [
              ["Colorblind", "Off", "Spawn chance of the modifier."],
              ["Colorblind Minimum Players To Spawn", "5", "Not assigned below this lobby size."],
              ["Colorblind Can Be", "Crew Only", "Or Anyone."],
              ["Colorblind Sees Tasks In Colour", "On", "Minigames stay in colour."],
              ["MedBay Scan Cures The Colorblind", "On", "Adds a Submit Scan task that cures it."],
              ["Neutral And Impostor Cure", "On", "Also for neutrals and impostors (as a fake task)."],
              ["Cure Scan Length", "Long", "Normal, Long or Very Long, the same for everyone."]
            ]),
            de: tbl(["Option", "Standard", "Funktion"], [
              ["Colorblind", "Off", "Spawn-Chance des Modifiers."],
              ["Colorblind Minimum Players To Spawn", "5", "Wird unter dieser Lobby-Größe nicht vergeben."],
              ["Colorblind Can Be", "Crew Only", "Oder Anyone."],
              ["Colorblind Sees Tasks In Colour", "On", "Minispiele bleiben farbig."],
              ["MedBay Scan Cures The Colorblind", "On", "Fügt eine Submit-Scan-Aufgabe hinzu, die heilt."],
              ["Neutral And Impostor Cure", "On", "Auch für Neutrale und Impostor (als Fake-Task)."],
              ["Cure Scan Length", "Long", "Normal, Long oder Very Long, für alle gleich."]
            ])
          }
        }
      ]
    },
    {
      id: "uc-killcutscenes",
      title: { en: "Kill cutscenes", de: "Kill-Cutscenes" },
      intro: {
        en: "Custom full-screen kill cutscenes: every UC special kill and ten TOR special-kill roles get their own animated death scene instead of the generic knife-and-tongue animation. Audience rules stay exactly vanilla: only killer and victim see them.",
        de: "Eigene Vollbild-Kill-Cutscenes: Jeder UC-Spezialkill und zehn TOR-Spezialkill-Rollen bekommen eine eigene animierte Todesszene statt der generischen Messer-und-Zunge-Animation. Die Publikums-Regeln bleiben exakt vanilla: Nur Killer und Opfer sehen sie."
      },
      entries: [
        {
          id: "uc-killcutscenes-uc",
          title: { en: "UC role cutscenes", de: "UC-Rollen-Cutscenes" },
          summary: {
            en: "Tesla, Saboteur task kills, Poisoner, Shade and the Maniac bomb each play their own scene, built from the roles' real sprites and sounds.",
            de: "Tesla, Saboteur-Task-Kills, Poisoner, Shade und die Maniac-Bombe spielen je eine eigene Szene, gebaut aus den echten Sprites und Sounds der Rollen."
          },
          body: {
            en: "<p>Five UC kills carry their own cutscene: the Tesla's lethal pull, the Saboteur's task kill (deliberately only task kills), the Poisoner's delayed poison death, the Shade swallowing a body into the shadows, and the Maniac's bomb. Crew figures are rendered in the real player colours; the Saboteur and Poisoner scenes deliberately show <strong>no</strong> killer figure, because those kills are anonymous in-game too. The audience is identical to vanilla (killer and victim only), and scenes queue politely until meeting or exile UI is gone. The Poisoner's meeting-time poison death, which normally has no death animation at all, finally gets one.</p>",
            de: "<p>Fünf UC-Kills tragen eine eigene Cutscene: der tödliche Zug der Tesla, der Task-Kill des Saboteurs (bewusst nur Task-Kills), der verzögerte Gifttod des Poisoners, der Shade, der eine Leiche in die Schatten schluckt, und die Bombe des Maniacs. Crew-Figuren werden in den echten Spielerfarben gerendert; die Saboteur- und Poisoner-Szenen zeigen bewusst <strong>keine</strong> Killer-Figur, weil diese Kills auch im Spiel anonym sind. Das Publikum ist identisch zu vanilla (nur Killer und Opfer), und Szenen warten höflich in einer Queue, bis Meeting- oder Exile-UI verschwunden ist. Der Poisoner-Gifttod zur Meeting-Zeit, der normalerweise gar keine Todesanimation hat, bekommt endlich eine.</p>"
          }
        },
        {
          id: "uc-killcutscenes-tor",
          title: { en: "TOR role cutscenes (12 scenes)", de: "TOR-Rollen-Cutscenes (12 Szenen)" },
          summary: {
            en: "Sheriff duel & misfire, vampire bite, warlock sigil, witch spell, ninja dash, rolling bomb, guesser shot in the meeting, thief steal & fail, jackal claw and a bounty-hunter wanted poster.",
            de: "Sheriff-Duell & Fehlzündung, Vampirbiss, Warlock-Sigil, Hexenspruch, Ninja-Dash, rollende Bombe, Guesser-Schuss im Meeting, Thief-Steal & -Fail, Jackal-Kralle und ein Bounty-Hunter-Steckbrief."
          },
          body: {
            en: "<p>Ten TOR special-kill roles get twelve dedicated scenes: a western duel for the Sheriff (plus a misfire scene when the shot backfires), fangs and garlic for the Vampire, a burning sigil for the Warlock, hat and spark stream for the Witch, a katana streak with teleport for the Ninja, a bomb that audibly rolls in for the Bomber (killer stays anonymous), a target-icon shot for the Guesser that plays inside the meeting, a role card being stolen (or the fail) for the Thief, a claw strike for Jackal and Sidekick, and a wanted poster with the victim's portrait plus a rain of coins for the Bounty Hunter. Wherever possible the scenes reuse TOR's own sounds and sprites, so they feel native. For delayed kills (vampire bite, warlock curse, witch spell) the scene plays at the actual death, never at the marking moment, so a still-living marked player is never tipped off; those death scenes show the killer figure in the real player colour, since ghosts see all roles anyway.</p>",
            de: "<p>Zehn TOR-Spezialkill-Rollen bekommen zwölf eigene Szenen: ein Western-Duell für den Sheriff (plus eine Fehlzündungs-Szene, wenn der Schuss nach hinten losgeht), Fangzähne und Knoblauch für den Vampire, ein brennendes Sigil für den Warlock, Hut und Funkenstrom für die Witch, ein Katana-Streich mit Teleport für den Ninja, eine hörbar heranrollende Bombe für den Bomber (der Killer bleibt anonym), ein Zielscheiben-Schuss für den Guesser, der im Meeting spielt, eine gestohlene Rollenkarte (oder der Fehlschlag) für den Thief, ein Krallenhieb für Jackal und Sidekick und ein Steckbrief mit dem Porträt des Opfers plus Münzregen für den Bounty Hunter. Wo möglich nutzen die Szenen TORs eigene Sounds und Sprites, damit sie sich nativ anfühlen. Bei verzögerten Kills (Vampirbiss, Warlock-Fluch, Hexenspruch) spielt die Szene beim tatsächlichen Tod, nie beim Markieren, damit ein noch lebender Markierter nie vorgewarnt wird; diese Todesszenen zeigen die Killer-Figur in der echten Spielerfarbe, da Tote ohnehin alle Rollen sehen.</p>"
          }
        },
        {
          id: "uc-killcutscenes-toggles",
          title: { en: "Local toggles", de: "Lokale Toggles" },
          summary: {
            en: "Two local switches in the UC options popup: UC scenes default on, TOR scenes default off. Deliberately not host-synced, it is a per-player viewing preference.",
            de: "Zwei lokale Schalter im UC-Options-Popup: UC-Szenen standardmäßig an, TOR-Szenen standardmäßig aus. Bewusst nicht host-synced, es ist eine Per-Spieler-Sichtpräferenz."
          },
          body: {
            en: "<p>Both groups have their own toggle in the UC options popup: <em>UC kill animations</em> (default on) and <em>TOR kill animations</em> (default off). The toggles are local per player and deliberately not host-synced: whether you want to watch cutscenes changes nothing about the game state, so it stays your own choice. Note that the toggle must be enabled on the <em>viewer's</em> client; a victim with the toggle off simply gets the vanilla animation.</p>",
            de: "<p>Beide Gruppen haben einen eigenen Schalter im UC-Options-Popup: <em>UC-Kill-Animationen</em> (standardmäßig an) und <em>TOR-Kill-Animationen</em> (standardmäßig aus). Die Schalter sind lokal pro Spieler und bewusst nicht host-synced: Ob du Cutscenes sehen willst, ändert nichts am Spielzustand, also bleibt es deine eigene Wahl. Der Schalter muss auf dem Client des <em>Zuschauers</em> an sein; ein Opfer mit abgeschaltetem Toggle bekommt einfach die Vanilla-Animation.</p>"
          }
        }
      ]
    },
    {
      id: "uc-hats",
      title: { en: "Cosmetics", de: "Kosmetik" },
      intro: {
        en: "Three UC-exclusive hats appear in TOR's hat shop without touching TOR — Virus, an animated billboard and the full-body Werewolf costume — plus one more player colour.",
        de: "Drei UC-exklusive Hüte erscheinen in TORs Hut-Shop, ohne TOR anzufassen — Virus, eine animierte Werbetafel und das Ganzkörper-Werewolf-Kostüm — dazu eine weitere Spielerfarbe."
      },
      entries: [
        {
          id: "uc-colour-grant",
          title: { en: "The host can ask for a colour change", de: "Der Host kann um einen Farbwechsel bitten" },
          summary: {
            en: "A host-side list of the lobby, a colour grid, and a question the player has to say yes to.",
            de: "Eine Host-Liste der Lobby, ein Farbraster, und eine Frage, zu der der Spieler ja sagen muss."
          },
          body: {
            en: "<p>In the lobby the host gets a panel listing everyone, each as a small crewmate in their current colour. Picking a player opens the full palette — including the colours this mod adds — with every entry drawn as a crewmate rather than a square, because a bean is what anybody will actually be looking at. Choosing one sends that player a question, and the question shows their crewmate as it is now beside the one they would become.</p><p><strong>Consent is the design, not a courtesy.</strong> A colour is the one thing in a lobby that belongs to the player rather than to the round, and a host who can simply reassign it can grief with it, with no undo the player controls. So the host never sets a colour here: he asks. The request goes to the target, the target answers, and only an accepted answer is carried out — by the host, because colour assignment is host-authoritative in Among Us. A declined or unanswered request changes nothing.</p><p>Two things the list says out loud rather than leaving the host to wonder about: a player <em>without</em> this mod cannot be asked at all (the prompt is this mod), and a colour that exists only here is offered only while everybody in the room has it — an index other clients cannot resolve is exactly the problem the colour fallback exists for. Both are re-checked when the answer arrives, because the room can change while somebody is deciding.</p>",
            de: "<p>In der Lobby bekommt der Host eine Liste aller Spieler, jeder als kleiner Crewmate in seiner aktuellen Farbe. Ein Klick auf einen Spieler öffnet die volle Palette — inklusive der Farben, die dieser Mod ergänzt — jeder Eintrag als Crewmate gezeichnet statt als Quadrat, denn eine Bohne ist das, was am Ende alle ansehen. Die Auswahl schickt diesem Spieler eine Frage, und die Frage zeigt seinen Crewmate wie er jetzt ist neben dem, der er würde.</p><p><strong>Die Zustimmung ist der Entwurf, keine Höflichkeit.</strong> Die Farbe ist das Einzige in einer Lobby, das dem Spieler gehört und nicht der Runde, und ein Host, der sie einfach umsetzen kann, kann damit ärgern — ohne Rückgängig, das der Spieler in der Hand hätte. Der Host setzt hier also nie eine Farbe: er fragt. Die Anfrage geht ans Ziel, das Ziel antwortet, und nur eine angenommene Antwort wird ausgeführt — vom Host, weil Farbvergabe in Among Us host-autoritativ ist. Eine abgelehnte oder unbeantwortete Anfrage ändert nichts.</p><p>Zwei Dinge sagt die Liste ausdrücklich, statt den Host rätseln zu lassen: Ein Spieler <em>ohne</em> diesen Mod kann gar nicht gefragt werden (die Rückfrage ist dieser Mod), und eine Farbe, die es nur hier gibt, wird nur angeboten, solange alle im Raum sie haben — ein Index, den andere Clients nicht auflösen können, ist genau das Problem, für das der Farb-Fallback existiert. Beides wird beim Eintreffen der Antwort erneut geprüft, weil sich der Raum ändern kann, während jemand überlegt.</p>"
          }
        },
        {
          id: "uc-colour-purpur",
          title: { en: "Purpur, and the fallback behind it", de: "Purpur, und der Fallback dahinter" },
          summary: {
            en: "One more player colour — which nobody may wear while somebody in the lobby is missing the mod.",
            de: "Eine weitere Spielerfarbe — die niemand tragen darf, solange jemand in der Lobby den Mod nicht hat."
          },
          body: {
            en: "<p><strong>Purpur</strong> (#9D00FF) is a vivid violet, added to the palette the way TOR adds its own colours. The nearest colour already in that palette is TOR's Fuchsia (#A41181), far enough away to tell the two apart on a crewmate.</p><p>It needed a guard, and the reason is worth stating plainly: a player colour is an <em>index</em> into the colour array, and that array is only as long as the mods present made it — vanilla ends at 17, TOR appends up to 41, this adds one more at 42. The index is what travels over the network, so a client whose array stops at 41 and is told <em>colour 42</em> reads past the end of it while drawing. The version handshake blocks the game from STARTING when somebody is missing the mod, but it does not stop them JOINING, and the colour is already on screen in the lobby.</p><p>So two things happen the moment such a client is in the room. <strong>Nobody keeps the colour:</strong> the host moves anyone wearing it to the nearest colour that exists without this mod, worked out at runtime rather than hard-coded, and skipping onwards if that one is taken. <strong>Nobody can pick it:</strong> the chip disappears from the colour tab, using the mechanism TOR\'s own tab builder already has — it lays out only the chips it knows about and switches off the rest. In the main menu there is no lobby to be unsafe in, so the colour is selectable there as normal.</p>",
            de: "<p><strong>Purpur</strong> (#9D00FF) ist ein kräftiges Violett, der Palette auf demselben Weg hinzugefügt, auf dem TOR seine eigenen Farben ergänzt. Die nächstgelegene Farbe, die es dort schon gibt, ist TORs Fuchsia (#A41181) — weit genug weg, um beide auf einem Crewmate zu unterscheiden.</p><p>Es brauchte eine Absicherung, und der Grund gehört klar gesagt: Eine Spielerfarbe ist ein <em>Index</em> in das Farb-Array, und das ist nur so lang, wie die vorhandenen Mods es gemacht haben — Vanilla endet bei 17, TOR hängt bis 41 an, hier kommt eine weitere bei 42 dazu. Über das Netz geht der Index, also liest ein Client, dessen Array bei 41 endet und dem <em>Farbe 42</em> gesagt wird, beim Zeichnen daneben. Der Versions-Handshake blockiert den START, wenn jemandem der Mod fehlt, aber nicht das BEITRETEN — und in der Lobby ist die Farbe längst zu sehen.</p><p>Deshalb passieren zwei Dinge, sobald so ein Client im Raum ist. <strong>Niemand behält die Farbe:</strong> Der Host schiebt jeden, der sie trägt, auf die nächstgelegene Farbe, die es auch ohne diesen Mod gibt — zur Laufzeit ermittelt statt fest verdrahtet, und weitergesucht, falls sie belegt ist. <strong>Niemand kann sie wählen:</strong> Der Farbchip verschwindet aus dem Tab, über den Mechanismus, den TORs eigener Tab-Aufbau schon mitbringt — er legt nur die Chips aus, die er kennt, und schaltet den Rest ab. Im Hauptmenü gibt es keine Lobby, in der etwas unsicher sein könnte, dort ist die Farbe also ganz normal wählbar.</p>"
          }
        },
        {
          id: "uc-hats-set",
          title: { en: "Virus, Werbetafel & Werewolf", de: "Virus, Werbetafel & Werewolf" },
          summary: {
            en: "A spiked virus silhouette, a six-frame blinking billboard worn on the back, and the werewolf full-body costume with glowing eyes, calibrated against the real in-game silhouette.",
            de: "Eine Stachel-Virus-Silhouette, eine sechs Frames blinkende Werbetafel auf dem Rücken und das Ganzkörper-Werewolf-Kostüm mit Glüh-Augen, kalibriert an der echten In-Game-Silhouette."
          },
          body: {
            en: "<p><strong>Virus</strong> wraps the whole crewmate in a ring of spikes and pustules; <strong>Werbetafel</strong> is an animated billboard blinking through six frames behind the player; <strong>Werewolf</strong> is the full side-profile beast with six animated eye-glow frames, including a proper climb pose. All three were calibrated against the game's real crewmate silhouette (measured from in-game screenshots), so they sit exactly on the body instead of floating around it. Technically the plugin extracts the sprites to TOR's hat folder and registers them through TOR's own custom-hat pipeline via reflection: TOR's source stays untouched, and the hats behave like any other custom hat in the shop. While the Werewolf role is enabled in the lobby, the Werewolf hat is locked in the wardrobe so the transformation stays unambiguous.</p>",
            de: "<p><strong>Virus</strong> hüllt den ganzen Crewmate in einen Ring aus Stacheln und Pusteln; die <strong>Werbetafel</strong> ist eine animierte Reklametafel, die hinter dem Spieler durch sechs Frames blinkt; <strong>Werewolf</strong> ist die volle Bestie im Seitenprofil mit sechs animierten Augen-Glüh-Frames, inklusive echter Kletter-Pose. Alle drei wurden an der echten Crewmate-Silhouette des Spiels kalibriert (aus In-Game-Screenshots vermessen), sodass sie exakt auf dem Körper sitzen statt darum zu schweben. Technisch extrahiert das Plugin die Sprites in TORs Hut-Ordner und registriert sie per Reflection über TORs eigene Custom-Hat-Pipeline: TORs Quellcode bleibt unangetastet, und die Hüte verhalten sich wie jeder andere Custom-Hut im Shop. Solange die Werewolf-Rolle in der Lobby aktiviert ist, ist der Werewolf-Hut in der Garderobe gesperrt, damit die Verwandlung eindeutig bleibt.</p>"
          }
        }
      ]
    },
    {
      id: "uc-localization",
      title: { en: "Localization & role guide", de: "Lokalisierung & Rollen-Guide" },
      intro: {
        en: "The whole plugin speaks 26 languages, and a searchable in-game role guide explains every UC and TOR role with its own hand-choreographed demo scene.",
        de: "Das ganze Plugin spricht 26 Sprachen, und ein durchsuchbarer In-Game-Rollen-Guide erklärt jede UC- und TOR-Rolle mit einer eigenen handchoreografierten Demo-Szene."
      },
      entries: [
        {
          id: "uc-localization-langs",
          title: { en: "26 languages", de: "26 Sprachen" },
          summary: {
            en: "All UC texts follow the game language (15 vanilla languages) or the shared mod language from Forgotten Fixes (10 extra ones). Role names deliberately stay English.",
            de: "Alle UC-Texte folgen der Spielsprache (15 Vanilla-Sprachen) oder der geteilten Mod-Sprache aus Forgotten Fixes (10 weitere). Rollennamen bleiben bewusst englisch."
          },
          body: {
            en: "<p>Every UC surface (options, buttons, HUD lines, help texts) is translated into 26 languages: the 15 languages the game itself offers follow the game language automatically, 10 extra languages (Turkish, Polish, Czech, Hungarian, Romanian, Swedish, Finnish, Ukrainian, Indonesian, Vietnamese) are available through the shared mod-language setting provided by <a href='useful.html'>Forgotten Fixes</a>. UC follows that shared setting when Forgotten Fixes is installed and works standalone with the vanilla game language otherwise. Role names deliberately stay English in every language, so players in mixed-language lobbies still talk about the same roles.</p>",
            de: "<p>Jede UC-Oberfläche (Optionen, Buttons, HUD-Zeilen, Hilfetexte) ist in 26 Sprachen übersetzt: Die 15 Sprachen des Spiels folgen automatisch der Spielsprache, 10 weitere (Türkisch, Polnisch, Tschechisch, Ungarisch, Rumänisch, Schwedisch, Finnisch, Ukrainisch, Indonesisch, Vietnamesisch) sind über die geteilte Mod-Sprach-Einstellung aus <a href='useful.html'>Forgotten Fixes</a> verfügbar. UC folgt dieser geteilten Einstellung, wenn Forgotten Fixes installiert ist, und läuft sonst standalone mit der Vanilla-Spielsprache. Rollennamen bleiben in allen Sprachen bewusst englisch, damit Spieler in gemischtsprachigen Lobbys über dieselben Rollen reden.</p>"
          }
        },
        {
          id: "uc-localization-guide",
          title: { en: "The role guide", de: "Der Rollen-Guide" },
          summary: {
            en: "An in-game help menu covering all 17 UC and 56 TOR roles, each with its own animated demo vignette, plus live search and a language toggle.",
            de: "Ein In-Game-Hilfemenü über alle 17 UC- und 56 TOR-Rollen, jede mit eigener animierter Demo-Vignette, plus Live-Suche und Sprach-Umschalter."
          },
          body: {
            en: "<p>The help menu covers every role in the lobby: 17 UC roles and 56 TOR roles, each entry with a description and a <strong>hand-choreographed demo vignette</strong>, a tiny animated scene of crewmates acting out the role's mechanic. A live search filters the list as you type (the search field requires a click to focus and only blocks player movement while you are actually typing), the list scrolls with the mouse wheel, and a toggle switches the guide between English and the active language on the fly.</p>",
            de: "<p>Das Hilfemenü deckt jede Rolle der Lobby ab: 17 UC-Rollen und 56 TOR-Rollen, jeder Eintrag mit Beschreibung und einer <strong>handchoreografierten Demo-Vignette</strong>, einer kleinen animierten Szene, in der Crewmates die Mechanik der Rolle vorspielen. Eine Live-Suche filtert die Liste beim Tippen (das Suchfeld braucht einen Klick zum Fokussieren und blockiert die Spielerbewegung nur, während du wirklich tippst), die Liste scrollt mit dem Mausrad, und ein Umschalter wechselt den Guide fliegend zwischen Englisch und der aktiven Sprache.</p>"
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
        en: "All Unknown's Collection impostor roles plus the Collector and the Pelican are pickable in TOR's Role Draft — integrated entirely from the plugin without touching TOR's source.",
        de: "Alle Unknown's-Collection-Impostor-Rollen plus der Collector und der Pelican sind in TORs Role Draft wählbar — komplett aus dem Plugin integriert, ohne TORs Quellcode anzufassen."
      },
      entries: [
        {
          id: "uc-roledraft-pick",
          title: { en: "All impostor roles + Collector & Pelican draftable", de: "Alle Impostor-Rollen + Collector & Pelican draftbar" },
          badges: [{ en: "Draftable", de: "Draftbar" }],
          summary: {
            en: "With Role Draft on, all ten Unknown's Collection impostor roles — Tesla, Saboteur, Silencer, Poisoner, Illusionist, Maniac, Shade, Manipulator, Werewolf and Auditor — plus the neutral Collector and Pelican appear as picks instead of being assigned by the usual random promotion.",
            de: "Mit aktivem Role Draft erscheinen alle zehn Unknown's-Collection-Impostor-Rollen — Tesla, Saboteur, Silencer, Poisoner, Illusionist, Maniac, Shade, Manipulator, Werewolf und Auditor — plus die neutralen Collector und Pelican als Picks, statt über die übliche Zufalls-Beförderung vergeben zu werden."
          },
          body: {
            en: "<p>When TOR's <strong>Role Draft</strong> is enabled, all enabled Unknown's Collection impostor roles — <strong>The Tesla</strong>, <strong>The Saboteur</strong>, <strong>The Silencer</strong>, <strong>The Poisoner</strong>, <strong>The Illusionist</strong>, <strong>The Maniac</strong>, <strong>The Shade</strong>, <strong>The Manipulator</strong>, <strong>The Werewolf</strong> and <strong>The Auditor</strong> — plus the neutral <strong>Collector</strong> and <strong>Pelican</strong> become regular picks (max one each per game), and the random promotion is suppressed so the draft decides. The Poltergeist and the Hunter are deliberately not draftable — neither is a starting role. The integration lives entirely in the plugin via Harmony patches — TOR's source is untouched. (In the draft list the impostor buttons use the impostor red so the faction filter shows them; each role's own colour returns in-game.)</p>",
            de: "<p>Ist TORs <strong>Role Draft</strong> aktiv, werden alle aktivierten Unknown's-Collection-Impostor-Rollen — <strong>The Tesla</strong>, <strong>The Saboteur</strong>, <strong>The Silencer</strong>, <strong>The Poisoner</strong>, <strong>The Illusionist</strong>, <strong>The Maniac</strong>, <strong>The Shade</strong>, <strong>The Manipulator</strong>, <strong>The Werewolf</strong> und <strong>The Auditor</strong> — plus die neutralen <strong>Collector</strong> und <strong>Pelican</strong> zu normalen Picks (max. je einer pro Spiel), und die Zufalls-Beförderung wird unterdrückt, damit der Draft entscheidet. Poltergeist und Hunter sind bewusst nicht draftbar — beides sind keine Startrollen. Die Integration liegt komplett im Plugin via Harmony-Patches — TORs Quellcode bleibt unangetastet. (In der Draft-Liste sind die Impostor-Buttons impostor-rot, damit der Fraktionsfilter sie zeigt; im Spiel kehrt die jeweilige Eigenfarbe zurück.)</p>"
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
  version: "0.3.2",
  allClients: true,
  repo: "https://github.com/DaUnknown-0/Nightfall",
  download: "https://github.com/DaUnknown-0/Nightfall/releases/latest",
  tagline: {
    en: "When Unknown's Collection's werewolf transforms, the top-down view is gone: real walls in perspective, a flashlight in your hand — and the beast gets red predator sight and its own claws.",
    de: "Sobald sich der Werewolf aus Unknown's Collection verwandelt, ist die Draufsicht weg: perspektivische Wände, eine Taschenlampe in der Hand — und das Biest bekommt rote Raubtiersicht und seine eigenen Krallen."
  },
  intro: {
    en: "Nightfall is a standalone BepInEx plugin. It changes neither The Other Roles nor Unknown's Collection, it only reads their state by reflection — without Unknown's Collection it loads anyway and stays quiet. The picture is drawn by a software renderer that contains no Unity at all, and is put on screen as one full-screen sprite under the HUD. <strong>Polus, Mira HQ and the Skeld have a described world</strong>; on the remaining maps the view deliberately stays off (see <em>World &amp; maps</em>).",
    de: "Nightfall ist ein eigenständiges BepInEx-Plugin. Es verändert weder The Other Roles noch Unknown's Collection, sondern liest deren Zustand nur per Reflection mit — ohne Unknown's Collection lädt es trotzdem und hält still. Das Bild zeichnet ein Software-Renderer, der überhaupt kein Unity enthält, und landet als ein einziges Vollbild-Sprite unter dem HUD auf dem Schirm. <strong>Polus, Mira HQ und die Skeld haben eine beschriebene Welt</strong>; auf den übrigen Karten bleibt die Sicht bewusst aus (siehe <em>Welt &amp; Karten</em>)."
  },
  install: {
    en: "<ol><li>Install <a href='https://github.com/TheOtherRolesAU/TheOtherRoles'>The Other Roles</a> into your Among Us BepInEx setup. <a href='https://github.com/DaUnknown-0/UnknownsCollection'>Unknown's Collection</a> is optional, but it is what supplies the Werewolf whose transformation triggers Nightfall.</li><li>Download the latest <code>Nightfall.dll</code> from the releases page.</li><li>Copy it into <code>&lt;Among Us&gt;/BepInEx/plugins/</code>.</li><li>Start the game.</li></ol><p>After the first install, the built-in updater checks this repo's GitHub releases on the main menu and offers an update button — manual downloads are only needed for the initial setup.</p>",
    de: "<ol><li>Installiere <a href='https://github.com/TheOtherRolesAU/TheOtherRoles'>The Other Roles</a> in dein Among-Us-BepInEx-Setup. <a href='https://github.com/DaUnknown-0/UnknownsCollection'>Unknown's Collection</a> ist optional, liefert aber den Werewolf, dessen Verwandlung Nightfall auslöst.</li><li>Lade die neueste <code>Nightfall.dll</code> von der Releases-Seite.</li><li>Kopiere sie nach <code>&lt;Among Us&gt;/BepInEx/plugins/</code>.</li><li>Starte das Spiel.</li></ol><p>Nach der ersten Installation prüft der eingebaute Updater die GitHub-Releases dieses Repos im Hauptmenü und bietet einen Update-Button an — manuelle Downloads sind nur für die Erstinstallation nötig.</p>"
  },
  deps: {
    en: "<ul><li><strong>The Other Roles 4.8.0</strong> (hard dependency)</li><li><strong>Unknown's Collection</strong> (optional) — supplies the Werewolf whose transformation is the default trigger. Without it, the view is only reachable via the <em>Always</em> mode and the debug key.</li></ul>",
    de: "<ul><li><strong>The Other Roles 4.8.0</strong> (harte Abhängigkeit)</li><li><strong>Unknown's Collection</strong> (optional) — liefert den Werewolf, dessen Verwandlung der Standard-Auslöser ist. Ohne UC ist die Sicht nur über den Modus <em>Always</em> und die Debug-Taste erreichbar.</li></ul>"
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
            de: "Die Verwandlung des Werewolfs ist der Standard-Auslöser; vier harte Sperren stehen vor allem anderen."
          },
          body: {
            en: "<p>By default the view begins when Unknown's Collection's werewolf transforms and ends when it reverts. The host can widen or switch that off entirely with the <strong>3D Mode</strong> option (see <em>Configuration</em>).</p><p>Four blocks sit <strong>before</strong> everything else, including the debug key and the mode:</p>" + tbl(["Block", "Why"], [
              ["Ghosts", "The rest of a ghost's game is tasks and watching, and neither survives being put into a corridor."],
              ["Meeting, voting, exile", "The head must not follow the cursor that is currently voting."],
              ["Round end", "Between the win condition firing and the actual scene change the game already draws its end screen — the view has to be gone by then."],
              ["Maps without a described world", "Polus, Mira HQ and the Skeld are built. On Airship and Fungle the view never comes up at all."]
            ]),
            de: "<p>Standardmäßig beginnt die Sicht mit dem Verwandeln des Werewolfs aus Unknown's Collection und endet mit dem Zurückverwandeln. Der Host kann das mit der Option <strong>3D Mode</strong> ausweiten oder ganz abschalten (siehe <em>Einstellungen</em>).</p><p>Vier Sperren stehen <strong>vor</strong> allem anderen, auch vor der Debug-Taste und vor dem Modus:</p>" + tbl(["Sperre", "Warum"], [
              ["Geist", "Das Restspiel eines Geistes sind Aufgaben und Zusehen, und beides überlebt es nicht, in einen Gang gesteckt zu werden."],
              ["Besprechung, Abstimmung, Ausschluss", "Der Kopf darf nicht dem Zeiger folgen, der gerade abstimmt."],
              ["Rundenende", "Zwischen dem Auslösen der Siegbedingung und dem Szenenwechsel zeichnet das Spiel schon seinen Endbildschirm — die Sicht muss da weg sein."],
              ["Karten ohne beschriebene Welt", "Gebaut sind Polus, Mira HQ und die Skeld. Auf Airship und Fungle kommt die Sicht gar nicht erst hoch."]
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
            de: "<p>Ein Mensch außerhalb des Kegels muss weg, sonst ist der Blackout ein Radar. Spielerfiguren werden gegen einen eigenen, engen Kegel bewertet (voll bei 22°, null bei 33°) plus eine Reichweitengrenze, mit einer bewussten Armlängen-Ausnahme: näher als ein Meter ist nie jemand unsichtbar, aber höchstens halb — wer durch einen hindurchläuft, sieht eine Gestalt, keine Identität. Wände dürfen dunkel-aber-lesbar sein, Menschen nicht.</p><p>Der Werewolf bekommt die Gegenseite: keine Lampe, eine rote Nachtsicht, die weiter reicht, lebende Beute auf volle Helligkeit gehoben (eine Wärmesignatur gegen den kalten Raum), blutroter Distanznebel und seine eigenen Vorderpfoten im Bild. Diese Asymmetrie macht die Verwandlung spielbar.</p>"
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
              ["<strong>Werewolf only</strong> (Standard)", "Die Sicht beginnt mit dem Verwandeln des Werewolfs aus Unknown's Collection und endet mit dem Zurückverwandeln."],
              ["Always", "Ich-Perspektive die ganze Runde, unabhängig vom Werewolf."],
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
              ["<code>Nightfall / Enabled</code>", "true", "Schaltet die Ich-Perspektive ein, wenn sich der Werewolf aus Unknown's Collection verwandelt."],
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
        en: "Three maps are hand-built and complete: Polus, Mira HQ and the Skeld. Airship and Fungle are switched off on purpose — the honest state of the project, not a promise.",
        de: "Drei Karten sind von Hand gebaut und fertig: Polus, Mira HQ und die Skeld. Airship und Fungle sind bewusst abgeschaltet — der ehrliche Stand des Projekts, kein Versprechen."
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
          id: "mira",
          title: { en: "Mira HQ, and what it cost", de: "Mira HQ, und was es gekostet hat" },
          summary: {
            en: "17 areas and 215 drawn materials — and the first build of it ran a 32-bit Among Us out of memory.",
            de: "17 Bereiche und 215 gezeichnete Materialien — und der erste Aufbau davon hat ein 32-Bit-Among-Us den Speicher gekostet."
          },
          body: {
            en: "<p>Mira HQ is described the same way Polus is: <strong>17 areas, 161 floors, 129 walls (18 openings), 109 ceilings and 615 pieces of furniture</strong>. What makes it different is the surfaces. Mira gives almost every room its own palette, so it needs <strong>215 drawn materials</strong> against Polus\' 32 — and that is what broke it.</p><p>The first round ever played on it killed the client. The log ends mid-write, and the line before it is an <code>OutOfMemoryException</code> thrown right after the world was built. Among Us is a 32-bit process, so its address space is the budget, and the catalogue was spending it: <strong>72 MB of retained textures and 304 MB allocated to draw them</strong>, against 11 MB and 47 MB for Polus.</p><p>Two changes fixed it, and both help every map. The drawing buffer is a megabyte-sized scratch pad that nothing keeps afterwards, so there is now <em>one</em> of it, reused, instead of one per material. And texture resolution follows how much world a texture covers rather than habit: the same 256-pixel tile is 177 texels per unit on a wall panel and 1280 on a gem, so anything below a threshold is drawn at half size. Mira now retains 46 MB and allocates 63 MB. Across the offline renderer\'s 67 viewpoints the pictures differ by a mean absolute error of 0.02 of 255 — which is to say the change is invisible.</p><p>Three drawing bugs surfaced while porting it, all of them in the prototype and all invisible in a plan view: nine calls using a function signature that does not exist, which meant the SkyBridge parapet band, the roof light strips and the Door Log\'s red rings were never painted at all; a missing colour argument that silently reset a brace to hairline width; and a window carrying its glass tint on the opening, where nothing reads it. Room signs are drawn for the first time too — STORAGE, DECONTAMINATION, REACTOR and LABORATORY — through a 5x7 stencil alphabet, because the renderer\'s canvas has no text.</p>",
            de: "<p>Mira HQ ist genauso beschrieben wie Polus: <strong>17 Bereiche, 161 Böden, 129 Wände (18 Öffnungen), 109 Decken und 615 Einrichtungsstücke</strong>. Der Unterschied sind die Oberflächen. Mira gibt fast jedem Raum eine eigene Palette und braucht deshalb <strong>215 gezeichnete Materialien</strong> gegen 32 bei Polus — und daran ist es zerbrochen.</p><p>Die erste Runde darauf hat den Client getötet. Der Log endet mitten im Schreiben, und die Zeile davor ist eine <code>OutOfMemoryException</code>, geworfen direkt nach dem Weltaufbau. Among Us ist ein 32-Bit-Prozess, sein Adressraum ist also das Budget, und der Katalog hat es ausgegeben: <strong>72 MB behaltene Texturen und 304 MB alloziert, um sie zu zeichnen</strong>, gegen 11 MB und 47 MB bei Polus.</p><p>Zwei Änderungen haben es behoben, und beide helfen jeder Karte. Der Zeichenpuffer ist ein megabytegroßer Notizzettel, den danach niemand behält — es gibt jetzt <em>einen</em>, wiederverwendet, statt einen pro Material. Und die Texturauflösung folgt der Weltfläche, die eine Textur abdeckt, statt der Gewohnheit: dieselbe 256er-Kachel sind 177 Texel pro Einheit auf einer Wandplatte und 1280 auf einem Edelstein, also wird alles unterhalb einer Schwelle halb so groß gezeichnet. Mira behält jetzt 46 MB und alloziert 63 MB. Über die 67 Blickpunkte des Offline-Renderers unterscheiden sich die Bilder um einen mittleren absoluten Fehler von 0,02 von 255 — der Unterschied ist also unsichtbar.</p><p>Beim Portieren kamen drei Zeichenfehler ans Licht, alle im Prototyp und alle in der Draufsicht unsichtbar: neun Aufrufe mit einer Signatur, die es nicht gibt, wodurch das Geländerband der SkyBridge, die Dachlichtstreifen und die roten Ringe des Door Logs nie gemalt wurden; ein fehlendes Farbargument, das eine Strebe still auf Haarbreite zurücksetzte; und ein Fenster, das seine Glastönung an der Öffnung trug, wo sie niemand liest. Zum ersten Mal gibt es außerdem Raumschilder — STORAGE, DECONTAMINATION, REACTOR und LABORATORY — über ein 5x7-Schablonenalphabet, weil die Zeichenfläche des Renderers keinen Text kann.</p>"
          }
        },
        {
          id: "nf-030",
          title: { en: "New in 0.3.0", de: "Neu in 0.3.0" },
          summary: {
            en: "Decontamination doors finally open in first person, and player avatars are photographed completely instead of as empty suits.",
            de: "Dekontaminations-Türen öffnen sich endlich auch in der Ich-Perspektive, und Spieler-Avatare werden komplett fotografiert statt als leere Anzüge."
          },
          body: {
            en: "<ul><li><strong>Decon doors open now.</strong> Polus' decontamination doors are a different door type that never appears in the game's regular door list, so the world builder had baked them into the walls: the button sound played, the real door opened, the first-person wall stayed shut. Their colliders are now tracked as door sources of their own and synced from the real collider state every frame.</li><li><strong>Whole avatars, not empty suits.</strong> The body, visor and skin of a crewmate only render inside the game's sight mask, and the isolated capture camera had no mask in view, so avatar photos came out as a hat and a suit floating with nobody inside. Masking is now suspended for the duration of the capture and restored right after.</li></ul>",
            de: "<ul><li><strong>Decon-Türen öffnen jetzt.</strong> Die Dekontaminations-Türen von Polus sind ein anderer Türtyp, der nie in der regulären Türliste des Spiels auftaucht, deshalb hatte der Welt-Bau sie in die Wände eingebacken: Der Knopf-Sound spielte, die echte Tür öffnete, die Ich-Perspektiven-Wand blieb zu. Ihre Collider werden jetzt als eigene Tür-Quellen geführt und jeden Frame vom echten Collider-Zustand synchronisiert.</li><li><strong>Ganze Avatare, keine leeren Anzüge.</strong> Körper, Visor und Skin eines Crewmates rendern nur innerhalb der Sichtmaske des Spiels, und die isolierte Foto-Kamera hatte keine Maske im Blick, also kamen Avatar-Fotos als Hut und Anzug heraus, in denen niemand steckt. Die Maskierung wird jetzt für die Dauer der Aufnahme ausgesetzt und direkt danach wiederhergestellt.</li></ul>"
          }
        },
        {
          id: "other-maps",
          title: { en: "Airship and Fungle are off", de: "Airship und Fungle sind aus" },
          badges: [{ en: "In progress", de: "In Arbeit" }],
          summary: {
            en: "The two remaining maps: the view deliberately never comes up until they have a described world.",
            de: "Die beiden verbliebenen Karten: Die Sicht kommt bewusst gar nicht erst hoch, bis sie eine beschriebene Welt haben."
          },
          body: {
            en: "<p>Airship and Fungle have no built world yet. They still run through the older collider-and-map-photograph path, and that path was never good enough to play on — it <em>renders</em>, and that is exactly the problem, because “it renders” reads to a player as “this is the mod”, and they would judge Polus by Airship.</p><p>So the map block sits <strong>before</strong> everything, including the debug key: on a map without a described world there is nothing worth forcing on. One line goes into the log per map, so that “nothing happens” does not happen silently. The old path stays in the code and remains reachable from the offline render tool.</p><p>Which maps count as described is decided in ONE place, a registry of (map key, build function). Adding the next one is an entry there plus its two generated files — that is how Mira HQ and the Skeld arrived, and it is why this list keeps getting shorter.</p><p>A side effect that saves more than the block itself: on an undescribed map the map photograph and the sprite harvest are skipped entirely — those exist only to feed a picture that is never drawn there.</p>",
            de: "<p>Airship und Fungle haben noch keine gebaute Welt. Sie laufen weiter über den älteren Weg aus Collidern und Kartenfotografie, und der war nie gut genug zum Spielen — er <em>rendert</em>, und genau das ist das Problem, denn „es rendert“ liest sich für einen Spieler als „so ist die Mod“, und er beurteilt Polus dann nach Airship.</p><p>Deshalb steht die Karten-Sperre <strong>vor</strong> allem anderen, auch vor der Debug-Taste: auf einer Karte ohne beschriebene Welt gibt es nichts, das zu erzwingen sich lohnt. Ins Log geht eine Zeile je Karte, damit „nichts passiert“ nicht schweigend passiert. Der alte Weg bleibt im Code und ist aus dem Offline-Render-Werkzeug weiter erreichbar.</p><p>Welche Karten als beschrieben gelten, entscheidet EINE Stelle, eine Liste aus (Kartenschlüssel, Bau-Funktion). Die nächste Karte ist ein Eintrag dort plus ihre zwei generierten Dateien — so kamen Mira HQ und die Skeld dazu, und deshalb wird diese Liste immer kürzer.</p><p>Ein Nebeneffekt, der mehr spart als die Sperre selbst: auf einer nicht beschriebenen Karte entfallen Kartenfotografie und Sprite-Ernte ganz — beide gibt es nur, um ein Bild zu füttern, das dort nie gezeichnet wird.</p>"
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

/** Bildreihe fuer Atlas-Eintraege: [[datei in assets/img, Bildunterschrift], ...]. */
function shots(list) {
  return "<div class='shots'>" + list.map(([src, cap]) =>
    `<figure><img src="assets/img/${src}" loading="lazy" alt="${cap}"><figcaption>${cap}</figcaption></figure>`).join("") + "</div>";
}

const ATLAS = {
  key: "atlas",
  name: "Unknown's Atlas",
  fullName: { en: "Unknown's Atlas: new maps for Among Us", de: "Unknown's Atlas: neue Karten für Among Us" },
  version: "0.3.0.15",
  allClients: true,
  repo: "https://github.com/DaUnknown-0/UnknownsAtlas",
  download: "https://github.com/DaUnknown-0/UnknownsAtlas/releases",
  tagline: {
    en: "Three brand-new maps: the Vesper Museum after closing time, the Nadelkamm forest station and the Moonlight Carnival. Pick them next to the vanilla maps, in Freeplay and in the lobby.",
    de: "Drei brandneue Karten: das Vesper-Museum nach Feierabend, die Forststation Nadelkamm und der Moonlight Carnival. Auswählbar neben den Vanilla-Karten, im Freeplay und in der Lobby."
  },
  intro: {
    en: "Unknown's Atlas is a standalone BepInEx plugin. Its maps are built on top of the Skeld: every task, vent, door, camera and sabotage of the Skeld is moved to its new place. On top come new scenery, a minigame for every task, map-specific sabotages with their own repairs, and living maps with weather, lightning and laser barriers. Tasks and sabotages keep the Skeld rules, so everything works online like vanilla; the maps need <strong>every player</strong> to have Atlas installed. <strong>Test version:</strong> all three maps are playable but still being polished.",
    de: "Unknown's Atlas ist ein eigenständiges BepInEx-Plugin. Seine Karten sitzen auf der Skeld: jede Aufgabe, jeder Vent, jede Tür, jede Kamera und jede Sabotage der Skeld wird an ihren neuen Platz gesetzt. Dazu kommen neue Kulisse, ein Minispiel für jede Aufgabe, eigene Sabotagen mit eigenen Reparaturen und lebendige Karten mit Wetter, Blitzen und Laserschranken. Aufgaben und Sabotagen behalten die Regeln der Skeld, online läuft also alles wie in Vanilla; die Karten brauchen <strong>alle Spieler</strong> mit Atlas. <strong>Testversion:</strong> alle drei Karten sind spielbar, werden aber noch poliert."
  },
  install: {
    en: "<ol><li>Download <code>UnknownsAtlas.dll</code> from the latest release.</li><li>Put it into <code>BepInEx\\plugins</code> next to your other mods (Reactor is required, The Other Roles is optional).</li><li>Start the game. In <strong>Freeplay</strong> the new maps appear below the vanilla maps; in a <strong>lobby</strong> the host picks them in the map selection of the game settings.</li></ol>",
    de: "<ol><li>Lade <code>UnknownsAtlas.dll</code> aus dem neuesten Release.</li><li>Leg sie nach <code>BepInEx\\plugins</code> zu deinen anderen Mods (Reactor wird benötigt, The Other Roles ist optional).</li><li>Starte das Spiel. Im <strong>Freeplay</strong> stehen die neuen Karten unter den Vanilla-Karten; in einer <strong>Lobby</strong> wählt der Host sie in der Kartenauswahl der Spieleinstellungen.</li></ol>"
  },
  deps: {
    en: "<ul><li><strong>Reactor 2.3.1</strong> and BepInEx 6 (be.697), Among Us 2024.11.26</li><li><strong>All players</strong> need Atlas. The lobby checks it: while a player is missing Atlas or runs another version, the host cannot start on an Atlas map and sees who it is.</li><li>Works alongside The Other Roles and the rest of the mod family.</li></ul>",
    de: "<ul><li><strong>Reactor 2.3.1</strong> und BepInEx 6 (be.697), Among Us 2024.11.26</li><li><strong>Alle Spieler</strong> brauchen Atlas. Die Lobby prüft das: Solange jemandem Atlas fehlt oder er eine andere Version hat, kann der Host nicht auf einer Atlas-Karte starten und sieht, wer es ist.</li><li>Läuft zusammen mit The Other Roles und dem Rest der Mod-Familie.</li></ul>"
  },
  sections: [
    {
      id: "maps",
      title: { en: "The maps", de: "Die Karten" },
      intro: { en: "Three maps with all Skeld tasks, their own vent networks and the full set of sabotages. Since 0.3.0.14 all of them are about the size of Polus: from the spawn, the farthest point takes 14 to 15 seconds.", de: "Drei Karten mit allen Skeld-Aufgaben, eigenen Vent-Netzen und allen Sabotagen. Seit 0.3.0.14 sind alle etwa so groß wie Polus: Vom Spawn aus erreicht man den weitesten Punkt in 14 bis 15 Sekunden." },
      entries: [
        {
          id: "museum",
          title: { en: "Vesper Museum", de: "Vesper-Museum" },
          summary: { en: "A natural history and technology museum after closing time: dinosaur rotunda, gallery, planetarium, machine hall and more.", de: "Ein Museum für Naturkunde und Technik nach Feierabend: Dinosaurier-Rotunde, Galerie, Planetarium, Technikhalle und mehr." },
          body: {
            en: "<p>The night shift (the crew) tidies up while the impostors pose as staff. 51 x 30 m around a central rotunda. Its T. rex stands on the podium like a real museum mount: the feet on the podium, neck and head reaching about 3.5 m out into the room. Showcases block movement but not sight, while partition walls and shelves block both. Fire shutters (the doors) can be seen through.</p>" + tbl(["Sabotage", "In the museum"], [["Reactor", "Security Alarm: two hand scanners at the same time"], ["Oxygen", "Climate Failure: two sensor keypads"], ["Critical, extra", "Rex Awake: music box and night light (see Sabotages)"], ["Lights", "Replace the Fuses: fuse box in the utilities room"], ["Comms", "Restore the CCTV: picture hold knobs"], ["Doors", "Fire shutters, see-through; also during other sabotages"]]),
            de: "<p>Die Nachtschicht (die Crew) räumt auf, während sich die Impostor als Personal ausgeben. 51 x 30 m rund um eine Rotunde. Ihr T. rex steht auf dem Podest wie in einem echten Museum: die Füße auf dem Podest, Hals und Kopf ragen rund 3,5 m in den Raum. Vitrinen sperren den Weg, aber nicht die Sicht, Stellwände und Regale sperren beides. Durch die Brandschutz-Rollgitter (die Türen) sieht man hindurch.</p>" + tbl(["Sabotage", "Im Museum"], [["Reaktor", "Security Alarm: zwei Handscanner gleichzeitig"], ["Sauerstoff", "Climate Failure: zwei Sensor-Tastenfelder"], ["Kritisch, zusätzlich", "Rex Awake: Spieluhr und Nachtlicht (siehe Sabotagen)"], ["Licht", "Replace the Fuses: Sicherungskasten in der Haustechnik"], ["Comms", "Restore the CCTV: Bildfang-Knöpfe"], ["Türen", "Brandschutz-Rollgitter, durchsichtig; auch während anderer Sabotagen"]])
          }
        },
        {
          id: "forest",
          title: { en: "Forest Station", de: "Forststation" },
          summary: { en: "A remote forestry and research station: log cabins with doors, grassy clearings and forest paths.", de: "Eine abgelegene Forst- und Forschungsstation: Blockhütten mit Türen, Lichtungen und Waldwege." },
          body: {
            en: "<p>52 x 34 m: eight walk-in log cabins (mess hall, field station, lab, sawmill, storehouse, boathouse, ranger office, generator shed) and clearings (lookout rock, radio mast, water works, hunting stand), connected by forest paths. The dense forest is the wall. The mess hall bell calls the meeting. You can climb the hunting stand to look out over the map (see Living maps).</p>" + tbl(["Sabotage", "In the forest"], [["Reactor", "Forest Fire: water tower and lookout rock"], ["Oxygen", "Water Supply Failure: field lab and creek dock"], ["Lights", "Reset the Breakers: generator shed"], ["Comms", "Realign the Radio Mast"], ["Doors", "Cabin doors; also during other sabotages"]]),
            de: "<p>52 x 34 m: acht begehbare Blockhütten (Messe, Feldstation, Labor, Sägewerk, Lagerhaus, Bootshaus, Försterstube, Generatorschuppen) und Lichtungen (Aussichtsfels, Funkmast, Wasserwerk, Hochsitz), verbunden durch Waldwege. Der dichte Wald ist die Wand. Die Glocke in der Messe ruft das Meeting. Auf den Hochsitz kann man klettern und über die Karte schauen (siehe Lebendige Karten).</p>" + tbl(["Sabotage", "Im Wald"], [["Reaktor", "Forest Fire: Wasserturm und Aussichtsfels"], ["Sauerstoff", "Water Supply Failure: Labor und Bachsteg"], ["Licht", "Reset the Breakers: Generatorschuppen"], ["Comms", "Realign the Radio Mast"], ["Türen", "Hüttentüren; auch während anderer Sabotagen"]])
          }
        },
        {
          id: "carnival",
          title: { en: "Moonlight Carnival", de: "Moonlight Carnival" },
          summary: { en: "An amusement park after closing time: rides that keep running, one-way turnstiles and a pitch-dark ghost train.", de: "Ein Freizeitpark nach Ladenschluss: Fahrgeschäfte, die weiterlaufen, Einbahn-Drehkreuze und eine stockdunkle Geisterbahn." },
          body: {
            en: "<p>44 x 39 m, cheerful and a bit creepy. The 14 Skeld areas plus four attractions of its own: ghost train, hall of mirrors, log flume and main gate. The map is about distraction and paths that change: every half minute a ride starts and briefly blocks a way (see Living maps). The turnstiles at the main gate only let you through in one direction, and the ghost train is dark inside. Fourteen vents in three rings, lanterns along the paths that go out in a blackout while the neon signs keep glowing.</p>" + tbl(["Sabotage", "In the carnival"], [["Reactor", "Coaster Brake Failure: follow the moving brake at both consoles"], ["Oxygen", "Ammonia Leak: set the valves by plan, at both consoles"], ["Lights", "Park Blackout: replace the blown bulbs"], ["Comms", "Speaker Feedback: aim and gain until the sound is clean"], ["Extra", "Ride Override: an impostor starts a coaster run at once"]]),
            de: "<p>44 x 39 m, heiter und ein bisschen gruselig. Die 14 Skeld-Bereiche plus vier eigene Attraktionen: Geisterbahn, Spiegelkabinett, Wildwasserbahn und Haupteingang. Die Karte lebt von Ablenkung und Wegen, die sich ändern: Etwa alle halbe Minute startet ein Fahrgeschäft und sperrt kurz einen Weg (siehe Lebendige Karten). Die Drehkreuze am Haupteingang lassen nur in eine Richtung durch, und in der Geisterbahn ist es dunkel. Vierzehn Vents in drei Ringen, Laternen an den Wegen, die bei einem Blackout ausgehen, während die Neonschilder weiterleuchten.</p>" + tbl(["Sabotage", "Im Park"], [["Reaktor", "Coaster Brake Failure: an beiden Konsolen der wandernden Bremse folgen"], ["Sauerstoff", "Ammonia Leak: Ventile nach Plan stellen, an beiden Konsolen"], ["Licht", "Park Blackout: durchgebrannte Glühbirnen tauschen"], ["Comms", "Speaker Feedback: Richtung und Pegel, bis der Ton sauber ist"], ["Zusätzlich", "Ride Override: ein Impostor startet sofort eine Achterbahnfahrt"]])
          }
        }
      ]
    },
    {
      id: "tasks",
      title: { en: "Minigames", de: "Minispiele" },
      intro: { en: "Every map task has its own minigame. Underneath it rides on one Skeld task, so task bar, TOR's task options and the crew task win stay exactly as in vanilla.", de: "Jede Karten-Aufgabe hat ein eigenes Minispiel. Darunter steckt jeweils eine Skeld-Aufgabe, deshalb bleiben Taskleiste, TORs Aufgaben-Optionen und der Crew-Aufgabensieg genau wie in Vanilla." },
      entries: [
        {
          id: "tasks-museum",
          title: { en: "Museum tasks", de: "Aufgaben im Museum" },
          summary: { en: "17 minigames from the till to the tomb lock. Authenticity X-Ray stays the vanilla scan, because others watch it.", de: "17 Minispiele von der Kasse bis zum Grabschloss. Der Echtheits-Röntgenscan bleibt der Vanilla-Scan, weil andere zusehen." },
          body: {
            en: tbl(["Task", "What you do"], [
              ["Repair Showcase Lighting", "Turn light-guide tiles until all three showcase spots glow; new solvable layout each step."],
              ["Close Out the Till", "Drag coins and notes into the tray until the receipt total matches. One too many and the change flap returns everything."],
              ["Stabilise Climate Control", "Keep three drifting gauges in the green band for 3 seconds."],
              ["Trace a Constellation", "Connect the stars of the reference card in one stroke; a decoy star starts over."],
              ["Dust the Skeleton", "Wipe the dust off the T. rex."],
              ["Restore Exhibit Power", "Replace the blown fuse, then throw the hall switch."],
              ["Arm the Vault Showcase", "Turn the mirrors until the laser hits all four receivers."],
              ["Focus the Dome Projector", "Coarse and fine focus ring."],
              ["Hieroglyph Sequence", "Press ten cartouches in the order of the legend."],
              ["Sync the Audio Guide", "Pick the track that matches the exhibit, then dock the device."],
              ["Align the Flywheel", "Hold the sluggish speed in the green band."],
              ["Chase the Moths", "Catch 12 moths with the torch."],
              ["Empty the Bins", "Sort paper, glass and the rest, then hold the container lever."],
              ["Stoke the Steam Engine", "Fill the can to the line without overflowing, then pour it into the boiler."],
              ["Pigment Analysis", "Start the 60-second analysis, come back, pick the anomaly."],
              ["Tomb Lock", "Three coupled hieroglyph rings: turning one also turns the next."]
            ]),
            de: tbl(["Aufgabe", "Was du tust"], [
              ["Repair Showcase Lighting", "Lichtleiter-Kacheln drehen, bis alle drei Vitrinenspots leuchten; jede Stufe ein neues, lösbares Muster."],
              ["Close Out the Till", "Münzen und Scheine in die Schale ziehen, bis die Bon-Summe stimmt. Einer zu viel, und die Wechselklappe gibt alles zurück."],
              ["Stabilise Climate Control", "Drei driftende Anzeigen 3 Sekunden lang im grünen Band halten."],
              ["Trace a Constellation", "Die Sterne der Vorlage in einem Zug verbinden; ein Köderstern setzt zurück."],
              ["Dust the Skeleton", "Den Staub vom T. rex wischen."],
              ["Restore Exhibit Power", "Die durchgebrannte Sicherung tauschen, dann den Saalschalter umlegen."],
              ["Arm the Vault Showcase", "Spiegel drehen, bis der Laser alle vier Empfänger trifft."],
              ["Focus the Dome Projector", "Grob- und Feinfokus-Ring."],
              ["Hieroglyph Sequence", "Zehn Kartuschen in der Reihenfolge der Legende drücken."],
              ["Sync the Audio Guide", "Die passende Spur zum Exponat wählen, dann das Gerät andocken."],
              ["Align the Flywheel", "Die träge Drehzahl im grünen Band halten."],
              ["Chase the Moths", "12 Motten mit der Taschenlampe fangen."],
              ["Empty the Bins", "Papier, Glas und Rest sortieren, dann den Container-Hebel halten."],
              ["Stoke the Steam Engine", "Die Kanne bis zum Strich füllen, ohne überzulaufen, dann in den Kessel gießen."],
              ["Pigment Analysis", "Die 60-Sekunden-Analyse starten, zurückkommen, die Auffälligkeit wählen."],
              ["Tomb Lock", "Drei gekoppelte Hieroglyphenringe: wer einen dreht, dreht den nächsten mit."]
            ])
          }
        },
        {
          id: "tasks-forest",
          title: { en: "Forest tasks", de: "Aufgaben im Wald" },
          summary: { en: "17 minigames from the time card to the wildlife census. Tick Check stays the vanilla scan.", de: "17 Minispiele von der Stempelkarte bis zur Wildzählung. Der Zeckencheck bleibt der Vanilla-Scan." },
          body: {
            en: tbl(["Task", "What you do"], [
              ["Splice Field Cable", "Connect three wires to the matching clamps and screw them tight."],
              ["Punch the Time Card", "Take your own card and punch it exactly on the full hour."],
              ["Tune the Generator", "Choke into the green field, then pull the cord; a wrong choke floods it."],
              ["Plot the Patrol Route", "Drag the marker along the trail through every flag."],
              ["Route Generator Power", "Plug the cable into the socket of the target area, then flip the toggle."],
              ["Light the Dock Lanterns", "Strike a match and light four lanterns before a gust blows it out."],
              ["Focus the Binoculars", "Pan to the deer, then focus."],
              ["Open the Valves", "Open five wheels in number order; a wrong one vents steam and closes all."],
              ["Collect Trail Cam Footage", "Find the photo with the animal, then insert the SD card."],
              ["Wildlife Census", "Count 12 deer and boars; clicking an owl costs two."],
              ["Water Sample Analysis", "Start the 60-second analysis, come back, pick the anomaly."],
              ["Prime the Pump", "Pump the handle in a steady rhythm; too fast means overpressure."],
              ["More", "Clear the Intake Grate, Align the Saw Blade, Trim the Outboard, Haul the Compost, Refuel the Machines."]
            ]),
            de: tbl(["Aufgabe", "Was du tust"], [
              ["Splice Field Cable", "Drei Drähte an die passenden Klemmen und festschrauben."],
              ["Punch the Time Card", "Die eigene Karte nehmen und genau zur vollen Stunde stempeln."],
              ["Tune the Generator", "Choke ins grüne Feld, dann am Seil ziehen; falscher Choke säuft ab."],
              ["Plot the Patrol Route", "Die Markierung den Pfad entlang durch alle Fähnchen ziehen."],
              ["Route Generator Power", "Das Kabel in die Buchse des Zielbereichs, dann den Kippschalter."],
              ["Light the Dock Lanterns", "Ein Streichholz anreißen und vier Laternen anzünden, bevor eine Böe es ausbläst."],
              ["Focus the Binoculars", "Zum Reh schwenken, dann scharfstellen."],
              ["Open the Valves", "Fünf Räder in Zahlenreihenfolge öffnen; ein falsches lässt Dampf ab und schließt alle."],
              ["Collect Trail Cam Footage", "Das Foto mit dem Tier finden, dann die SD-Karte einstecken."],
              ["Wildlife Census", "12 Rehe und Wildschweine zählen; eine angeklickte Eule kostet zwei."],
              ["Water Sample Analysis", "Die 60-Sekunden-Analyse starten, zurückkommen, die Auffälligkeit wählen."],
              ["Prime the Pump", "Den Schwengel im gleichmäßigen Takt pumpen; zu schnell gibt Überdruck."],
              ["Weitere", "Clear the Intake Grate, Align the Saw Blade, Trim the Outboard, Haul the Compost, Refuel the Machines."]
            ])
          }
        },
        {
          id: "tasks-carnival",
          title: { en: "Carnival tasks", de: "Aufgaben im Park" },
          summary: { en: "15 minigames from the light strings to the coaster brakes. Height Check stays the vanilla scan.", de: "15 Minispiele von den Lichterketten bis zu den Achterbahnbremsen. Der Größencheck bleibt der Vanilla-Scan." },
          body: {
            en: tbl(["Task", "What you do"], [
              ["Fix the Light Strings", "Connect the wires of the light strings to their clamps."],
              ["Badge Through the Turnstile", "Swipe your staff badge at the right speed."],
              ["Balance the Carousel Motors", "Keep speed, organ and lights in the green band."],
              ["Plan the Parade Route", "Drag the marker through every stop of the parade."],
              ["Clean the Cotton Candy Machine", "Wipe the sugar off the machine."],
              ["Power a Ride", "Plug the cable into the ride's socket, then flip the switch."],
              ["Aim the Tower Spotlights", "Turn the mirrors until the beam hits every receiver."],
              ["Spot the Runaway Balloon", "Pan the binoculars to the balloon and focus."],
              ["Unlock the Ride Keys", "Press the keys in the order of the legend."],
              ["Collect the Ride Photos", "Find the photo with the screamer, then insert the photo card."],
              ["Tune the Ride Motors", "Carousel gear, then the bumper car motor: hold them in the green band."],
              ["Shooting Gallery", "Hit the targets that pop up."],
              ["More", "Clear the Popcorn Bins, Refuel the Ride Generators, Allergen Test, Pump the Coaster Brakes."]
            ]),
            de: tbl(["Aufgabe", "Was du tust"], [
              ["Fix the Light Strings", "Die Drähte der Lichterketten an ihre Klemmen."],
              ["Badge Through the Turnstile", "Den Mitarbeiterausweis im richtigen Tempo durchziehen."],
              ["Balance the Carousel Motors", "Tempo, Orgel und Licht im grünen Band halten."],
              ["Plan the Parade Route", "Die Markierung durch alle Stationen der Parade ziehen."],
              ["Clean the Cotton Candy Machine", "Den Zucker von der Maschine wischen."],
              ["Power a Ride", "Das Kabel in die Buchse des Fahrgeschäfts, dann den Schalter."],
              ["Aim the Tower Spotlights", "Spiegel drehen, bis der Strahl alle Empfänger trifft."],
              ["Spot the Runaway Balloon", "Mit dem Fernglas zum Ballon schwenken und scharfstellen."],
              ["Unlock the Ride Keys", "Die Schlüssel in der Reihenfolge der Legende drücken."],
              ["Collect the Ride Photos", "Das Foto mit dem Schreihals finden, dann die Fotokarte einstecken."],
              ["Tune the Ride Motors", "Karussell-Getriebe, dann Autoscooter-Motor im grünen Band halten."],
              ["Shooting Gallery", "Die auftauchenden Ziele treffen."],
              ["Weitere", "Clear the Popcorn Bins, Refuel the Ride Generators, Allergen Test, Pump the Coaster Brakes."]
            ])
          }
        },
        {
          id: "tasks-colorblind",
          title: { en: "Colourblind symbols", de: "Farbenblind-Symbole" },
          summary: { en: "The wire tasks of the forest and the carnival show a shape on every colour.", de: "Die Kabel-Aufgaben in Wald und Park zeigen auf jeder Farbe eine Form." },
          body: {
            en: "<p>Like the vanilla wire task, every wire and clamp in Splice Field Cable and Fix the Light Strings carries a symbol (triangle, square, circle, diamond, cross), so the task can be solved without telling the colours apart.</p>",
            de: "<p>Wie beim Vanilla-Kabeltask trägt in Splice Field Cable und Fix the Light Strings jeder Draht und jede Klemme ein Symbol (Dreieck, Quadrat, Kreis, Raute, Kreuz), so lässt sich die Aufgabe lösen, ohne die Farben zu unterscheiden.</p>"
          }
        }
      ]
    },
    {
      id: "sabotages",
      title: { en: "Sabotages", de: "Sabotagen" },
      intro: { en: "Own names, own repairs, same rules: underneath they are the Skeld reactor, oxygen, lights and comms, so timers, the critical win and TOR's options behave as before.", de: "Eigene Namen, eigene Reparaturen, gleiche Regeln: darunter stecken Reaktor, Sauerstoff, Licht und Comms der Skeld, Timer, kritischer Sieg und TORs Optionen verhalten sich wie gewohnt." },
      entries: [
        {
          id: "sab-museum",
          title: { en: "Museum sabotages", de: "Sabotagen im Museum" },
          summary: { en: "Security Alarm, Climate Failure, Replace the Fuses, Restore the CCTV.", de: "Security Alarm, Climate Failure, Replace the Fuses, Restore the CCTV." },
          body: {
            en: tbl(["Sabotage", "Skeld system", "Repair"], [
              ["Security Alarm", "Reactor", "Keep your hand on the scanner at both consoles at the same time; letting go interrupts it."],
              ["Climate Failure", "Oxygen", "Type the sensor reset code into a shuffled keypad, at both consoles."],
              ["Replace the Fuses", "Lights", "Drag the spare into every blown fuse slot."],
              ["Restore the CCTV", "Comms", "Turn the horizontal and vertical hold knobs until the picture is stable."]
            ]) + shots([["atlas_sab_alarm.webp", "Security Alarm"], ["atlas_sab_climatefail.webp", "Climate Failure"], ["atlas_sab_fusebox.webp", "Replace the Fuses"], ["atlas_sab_cctv.webp", "Restore the CCTV"]]),
            de: tbl(["Sabotage", "Skeld-System", "Reparatur"], [
              ["Security Alarm", "Reaktor", "An beiden Konsolen gleichzeitig die Hand auf dem Scanner halten; Loslassen unterbricht."],
              ["Climate Failure", "Sauerstoff", "Den Sensor-Reset-Code in ein gemischtes Tastenfeld tippen, an beiden Konsolen."],
              ["Replace the Fuses", "Licht", "Die Ersatzsicherung in jeden durchgebrannten Platz ziehen."],
              ["Restore the CCTV", "Comms", "Horizontal- und Vertikal-Knopf drehen, bis das Bild steht."]
            ]) + shots([["atlas_sab_alarm.webp", "Security Alarm"], ["atlas_sab_climatefail.webp", "Climate Failure"], ["atlas_sab_fusebox.webp", "Replace the Fuses"], ["atlas_sab_cctv.webp", "Restore the CCTV"]])
          }
        },
        {
          id: "sab-forest",
          title: { en: "Forest sabotages", de: "Sabotagen im Wald" },
          summary: { en: "Forest Fire, Water Supply Failure, Reset the Breakers, Realign the Radio Mast.", de: "Forest Fire, Water Supply Failure, Reset the Breakers, Realign the Radio Mast." },
          body: {
            en: tbl(["Sabotage", "Skeld system", "Repair"], [
              ["Forest Fire", "Reactor", "Keep the hose on the moving flame at both consoles at the same time."],
              ["Water Supply Failure", "Oxygen", "Set four valves to the pattern on your console's plan, at both consoles."],
              ["Reset the Breakers", "Lights", "Flip every breaker back to ON."],
              ["Realign the Radio Mast", "Comms", "Turn azimuth and frequency until the signal locks."]
            ]) + shots([["atlas_sab_fire.webp", "Forest Fire"], ["atlas_sab_waterworks.webp", "Water Supply Failure"], ["atlas_sab_breakers.webp", "Reset the Breakers"], ["atlas_sab_antenna.webp", "Realign the Radio Mast"]]),
            de: tbl(["Sabotage", "Skeld-System", "Reparatur"], [
              ["Forest Fire", "Reaktor", "An beiden Konsolen gleichzeitig den Schlauch auf der wandernden Flamme halten."],
              ["Water Supply Failure", "Sauerstoff", "Vier Ventile nach dem Plan der eigenen Konsole stellen, an beiden Konsolen."],
              ["Reset the Breakers", "Licht", "Alle Schutzschalter wieder auf ON."],
              ["Realign the Radio Mast", "Comms", "Azimut und Frequenz drehen, bis das Signal steht."]
            ]) + shots([["atlas_sab_fire.webp", "Forest Fire"], ["atlas_sab_waterworks.webp", "Water Supply Failure"], ["atlas_sab_breakers.webp", "Reset the Breakers"], ["atlas_sab_antenna.webp", "Realign the Radio Mast"]])
          }
        },
        {
          id: "sab-rex",
          title: { en: "Rex Awake (museum, extra critical sabotage)", de: "Rex Awake (Museum, zusätzliche kritische Sabotage)" },
          summary: { en: "The impostors wake the T. rex. The crew has 50 seconds to put it back to sleep with a music box and a night light, or the impostors win.", de: "Die Impostor wecken den T. rex. Die Crew hat 50 Sekunden, ihn mit Spieluhr und Nachtlicht wieder einzuschläfern, sonst gewinnen die Impostor." },
          body: {
            en: "<p>A third critical sabotage next to Security Alarm and Climate Failure, started from the dino button in the Rotunda on the sabotage map. The skeleton comes alive: the head sways, the jaw snaps, the eye sockets glow red, and every 10 to 13 seconds it roars (it opens its jaw 1.6 seconds before). Red alarm like the reactor, red arrows to both stations, a <strong>Rex Awake!</strong> line with countdown and sleep progress in the task list, and the emergency button is locked.</p>" + tbl(["Station", "What you do"], [["Music box (Rotunda, in front of the podium)", "Turn the crank clockwise. The lullaby plays exactly as fast as you crank; only the green tempo zone (0.75 to 1.35 turns per second) counts."], ["Night light (Security Office)", "Keep the star projector's constellation inside the drifting target rings, at most 9 degrees off. A small live view of camera K1 shows how the Rex reacts."]]) + "<p>The sleep bar fills by <strong>+2 per second</strong> while one station is in time and <strong>+6 per second</strong> while both are; with nobody in time it drops by 1 per second. Each roar costs 6 points, knocks the crank back and throws the constellation off target. Alone it is deliberately impossible (about 67 seconds), two players need about 20 seconds plus the walk. Impostors can join in at the stations but can only help: wrong input counts as zero, and several players can use the same station. A reported body ends the sabotage like the reactor.</p>" + shots([["atlas_rex_awake.webp", "Rex Awake"], ["atlas_rex_music.webp", "The music box"], ["atlas_rex_light.webp", "The night light with camera K1"]]),
            de: "<p>Eine dritte kritische Sabotage neben Security Alarm und Climate Failure, gestartet über den Dino-Knopf in der Rotunde auf der Sabotage-Karte. Das Skelett erwacht: Der Kopf pendelt, der Kiefer schnappt, die Augenhöhlen glühen rot, und alle 10 bis 13 Sekunden brüllt es (1,6 Sekunden vorher reißt es das Maul auf). Roter Alarm wie beim Reaktor, rote Pfeile zu beiden Stationen, eine Zeile <strong>Rex Awake!</strong> mit Countdown und Schlaffortschritt in der Aufgabenliste, und der Notfallknopf ist gesperrt.</p>" + tbl(["Station", "Was du tust"], [["Spieluhr (Rotunde, vor dem Podest)", "Die Kurbel im Uhrzeigersinn drehen. Das Wiegenlied spielt genau so schnell, wie du kurbelst; es zählt nur das grüne Tempofeld (0,75 bis 1,35 Umdrehungen pro Sekunde)."], ["Nachtlicht (Security Office)", "Das Sternbild des Projektors in den wandernden Zielringen halten, höchstens 9 Grad daneben. Ein kleines Livebild der Kamera K1 zeigt, wie der Rex reagiert."]]) + "<p>Der Schlafbalken füllt sich mit <strong>+2 pro Sekunde</strong>, solange eine Station im Takt ist, und mit <strong>+6 pro Sekunde</strong>, wenn beide es sind; ist niemand im Takt, fällt er um 1 pro Sekunde. Jedes Brüllen kostet 6 Punkte, lässt die Kurbel zurückschlagen und das Sternbild wegspringen. Allein ist es mit Absicht nicht zu schaffen (etwa 67 Sekunden), zu zweit dauert es etwa 20 Sekunden plus Laufweg. Impostor können an den Stationen mitmachen, aber nur helfen: Fehlbedienung zählt null, und mehrere Spieler können dieselbe Station bedienen. Eine gemeldete Leiche beendet die Sabotage wie beim Reaktor.</p>" + shots([["atlas_rex_awake.webp", "Rex Awake"], ["atlas_rex_music.webp", "Die Spieluhr"], ["atlas_rex_light.webp", "Das Nachtlicht mit Kamera K1"]])
          }
        },
        {
          id: "sab-carnival",
          title: { en: "Carnival sabotages", de: "Sabotagen im Park" },
          summary: { en: "Coaster Brake Failure, Ammonia Leak, Park Blackout, Speaker Feedback, plus the Ride Override button.", de: "Coaster Brake Failure, Ammonia Leak, Park Blackout, Speaker Feedback, dazu der Ride-Override-Knopf." },
          body: {
            en: tbl(["Sabotage", "Skeld system", "Repair"], [
              ["Coaster Brake Failure", "Reactor", "Follow the moving brake at both consoles at the same time."],
              ["Ammonia Leak", "Oxygen", "Set the valves to the plan of your console, at both consoles."],
              ["Park Blackout", "Lights", "Replace every blown bulb. The lanterns go out, the neon signs stay on."],
              ["Speaker Feedback", "Comms", "Turn aim and gain until the sound is clean."],
              ["Ride Override", "Extra", "Button on the sabotage map: starts a coaster run at once, the level crossings close (30 s cooldown)."]
            ]),
            de: tbl(["Sabotage", "Skeld-System", "Reparatur"], [
              ["Coaster Brake Failure", "Reaktor", "An beiden Konsolen gleichzeitig der wandernden Bremse folgen."],
              ["Ammonia Leak", "Sauerstoff", "Die Ventile nach dem Plan der eigenen Konsole stellen, an beiden Konsolen."],
              ["Park Blackout", "Licht", "Jede durchgebrannte Glühbirne tauschen. Die Laternen gehen aus, die Neonschilder bleiben an."],
              ["Speaker Feedback", "Comms", "Richtung und Pegel drehen, bis der Ton sauber ist."],
              ["Ride Override", "Zusätzlich", "Knopf auf der Sabotage-Karte: startet sofort eine Achterbahnfahrt, die Bahnübergänge schließen (30 s Abklingzeit)."]
            ])
          }
        },
        {
          id: "sab-doors",
          title: { en: "Doors during sabotages", de: "Türen während Sabotagen" },
          summary: { en: "Doors can be closed while another sabotage runs, like on Polus and the Airship.", de: "Türen lassen sich schließen, während eine andere Sabotage läuft, wie auf Polus und dem Airship." },
          body: {
            en: "<p>The Skeld locks the door buttons as long as a sabotage is active, and closed doors block new sabotages. The Atlas maps are technically the Skeld, so both rules are lifted there: Impostors can combine doors with any other sabotage.</p>",
            de: "<p>Die Skeld sperrt die Türknöpfe, solange eine Sabotage läuft, und geschlossene Türen blockieren neue Sabotagen. Die Atlas-Karten sind technisch die Skeld, deshalb sind dort beide Regeln aufgehoben: Impostor können Türen mit jeder anderen Sabotage kombinieren.</p>"
          }
        }
      ]
    },
    {
      id: "world",
      title: { en: "Living maps", de: "Lebendige Karten" },
      intro: { en: "Weather, lightning, fallen trees and laser barriers. The host decides and sends it to everyone.", de: "Wetter, Blitze, umgestürzte Bäume und Laserschranken. Der Host entscheidet und schickt es an alle." },
      entries: [
        {
          id: "weather",
          title: { en: "Weather (forest)", de: "Wetter (Wald)" },
          summary: { en: "Rain, fog and storms come and go; rain buys time against the Forest Fire.", de: "Regen, Nebel und Sturm kommen und gehen; Regen verschafft Zeit gegen den Waldbrand." },
          body: {
            en: "<p>Every round starts clear. After 40 to 70 seconds rain, fog or a storm moves in for a while and clears again. Fog and storms shorten everyone's view. <strong>Rain and storms slow the Forest Fire countdown to half speed</strong> and visibly shrink the flames, so a fire during a downpour gives the crew twice the time.</p>",
            de: "<p>Jede Runde beginnt klar. Nach 40 bis 70 Sekunden zieht Regen, Nebel oder Sturm auf und verzieht sich wieder. Nebel und Sturm verkürzen die Sicht aller Spieler. <strong>Regen und Sturm lassen den Waldbrand-Countdown halb so schnell laufen</strong> und die Flammen sichtbar kleiner werden, ein Brand im Regen gibt der Crew also doppelt so viel Zeit.</p>"
          }
        },
        {
          id: "lightning",
          title: { en: "Lightning and Forest Fire", de: "Blitz und Waldbrand" },
          summary: { en: "A strike can set the forest on fire, even on top of a lights or comms sabotage.", de: "Ein Einschlag kann den Wald in Brand setzen, auch zusätzlich zu einer Licht- oder Comms-Sabotage." },
          body: {
            en: "<p>In a storm lightning strikes every few seconds: a flash, a bolt, thunder that arrives later the further away it hit. A strike can start a <strong>Forest Fire</strong> even while the lights or comms are sabotaged, so two sabotages run at the same time. It never starts one while another critical sabotage is active. While the fire burns, flames and smoke fill the reactor area.</p>" + shots([["atlas_world_firestorm.webp", "Forest Fire and breakers at once"], ["atlas_world_fire.webp", "Forest Fire"]]),
            de: "<p>Im Sturm schlagen alle paar Sekunden Blitze ein: ein Aufleuchten, ein Blitz, Donner, der umso später kommt, je weiter weg er einschlug. Ein Einschlag kann einen <strong>Waldbrand</strong> auslösen, auch während Licht oder Comms sabotiert sind, dann laufen zwei Sabotagen gleichzeitig. Neben einer anderen kritischen Sabotage zündet er nie. Solange es brennt, stehen Flammen und Rauch im Reaktorbereich.</p>" + shots([["atlas_world_firestorm.webp", "Waldbrand und Schutzschalter zugleich"], ["atlas_world_fire.webp", "Waldbrand"]])
          }
        },
        {
          id: "trees",
          title: { en: "Fallen Trees (forest)", de: "Sturmholz (Wald)" },
          summary: { en: "Trees fall across paths; click and saw them through, or wait 45 seconds.", de: "Bäume fallen quer über Wege; anklicken und durchsägen, oder 45 Sekunden warten." },
          body: {
            en: "<p>Lightning, or an Impostor through the tree button on the sabotage map, throws up to three trees across forest paths. A tree blocks the path. Walk up to it, click it and saw it through in a short minigame; otherwise it disappears after 45 seconds. Impostors can use it to cut off escape routes or split the crew.</p>" + shots([["atlas_world_trees.webp", "A fallen tree across the path"]]),
            de: "<p>Ein Blitz, oder ein Impostor über den Baum-Knopf auf der Sabotage-Karte, wirft bis zu drei Bäume quer über Waldwege. Ein Baum sperrt den Weg. Hingehen, anklicken und in einem kurzen Minispiel durchsägen; sonst verschwindet er nach 45 Sekunden. Impostor schneiden damit Fluchtwege ab oder trennen die Crew.</p>" + shots([["atlas_world_trees.webp", "Ein umgestürzter Baum über dem Weg"]])
          }
        },
        {
          id: "lasers",
          title: { en: "Laser barriers (museum)", de: "Laserschranken (Museum)" },
          summary: { en: "Every second passage has a laser barrier; each crossing lands in the log on the cameras.", de: "Jeder zweite Durchgang hat eine Laserschranke; jeder Durchgang landet im Protokoll an den Kameras." },
          body: {
            en: "<p>Thin red beams run across every second passage. Walking through makes the beam flash and adds an entry to the <strong>laser log</strong> under the security cameras: the last four crossings with room and seconds ago. It does not say who, but it tells you where someone just went.</p>" + shots([["atlas_world_laser.webp", "Laser barrier in a passage"]]),
            de: "<p>Dünne rote Strahlen laufen quer durch jeden zweiten Durchgang. Wer hindurchgeht, lässt den Strahl aufleuchten und erzeugt einen Eintrag im <strong>Laserprotokoll</strong> unter den Überwachungskameras: die letzten vier Durchgänge mit Raum und Sekunden. Es verrät nicht wer, aber wo gerade jemand langging.</p>" + shots([["atlas_world_laser.webp", "Laserschranke in einem Durchgang"]])
          }
        },
        {
          id: "lookout",
          title: { en: "The hunting stand (forest)", de: "Der Hochsitz (Wald)" },
          summary: { en: "Climb the stand to look out over the map; climbing down brings everything back to normal.", de: "Auf den Hochsitz klettern und über die Karte schauen; runterklettern macht alles wieder normal." },
          body: {
            en: "<p>Next to the ladder the Use button shows its own icon and <strong>CLIMB</strong>, like the cameras; up there it says <strong>CLIMB DOWN</strong> (the E key and any movement key work too). Up there the camera zooms out and moves west, where the map is (east of the stand there is only forest), and your vision radius triples. Your crewmate stands inside the cabin, shrunk to the size of TOR's Mini, head in the window, and everyone sees you up there. You can still be killed as usual, because your real position stays at the foot of the ladder; a meeting, your death or a minigame brings you down at once. While you are up, the on-screen buttons get smaller, like TOR's zoom for ghosts.</p>" + shots([["atlas_lookout.webp", "The view from the hunting stand"]]),
            de: "<p>Neben der Leiter zeigt der Use-Knopf ein eigenes Symbol und <strong>CLIMB</strong>, wie an den Kameras; oben steht dort <strong>CLIMB DOWN</strong> (die Taste E und jede Bewegungstaste gehen auch). Oben zoomt die Kamera heraus und rückt nach Westen, wo die Karte liegt (östlich des Hochsitzes ist nur Wald), und dein Sichtradius verdreifacht sich. Deine Figur steht in der Kabine, auf die Größe von TORs Mini verkleinert, den Kopf im Fenster, und alle sehen dich dort oben. Du bleibst normal killbar, weil deine echte Position am Fuß der Leiter bleibt; ein Meeting, dein Tod oder ein Minispiel holen dich sofort herunter. Solange du oben bist, werden die Knöpfe auf dem Bildschirm kleiner, wie bei TORs Zoom für Geister.</p>" + shots([["atlas_lookout.webp", "Der Blick vom Hochsitz"]])
          }
        },
        {
          id: "rides",
          title: { en: "Rides (carnival)", de: "Fahrgeschäfte (Park)" },
          summary: { en: "Every 22 to 38 seconds a ride starts and briefly blocks a path. A bell and blinking lamps warn two seconds before.", de: "Alle 22 bis 38 Sekunden startet ein Fahrgeschäft und sperrt kurz einen Weg. Glocke und blinkende Lampen warnen zwei Sekunden vorher." },
          body: {
            en: tbl(["Ride", "What happens"], [
              ["Coaster Run", "The barriers at the three level crossings close for 6 seconds while the train goes round."],
              ["Carousel Spin", "The carousel turns for 10 seconds; ropes block the north and west openings."],
              ["Ghost Flash", "A car rides through the dark tunnel and the flash photographs everyone inside; the monitor at the north exit shows the photo until the next flash."],
              ["Log Flume Drop", "A boat comes down the channel; the east bridge is wet and blocked for 4 seconds."],
              ["Turnstile Jam", "Both turnstiles at the main gate jam for 5 seconds."]
            ]) + "<p>Never during a meeting, an ejection or a critical sabotage. The turnstiles are one-way all the time (west only into the park, east only out), and the ghost train is dark inside.</p>" + shots([["atlas_ride_coaster.webp", "Coaster Run"], ["atlas_ride_carousel.webp", "Carousel Spin"], ["atlas_ride_ghost.webp", "Ghost Flash"], ["atlas_ride_flume.webp", "Log Flume Drop"]]),
            de: tbl(["Fahrgeschäft", "Was passiert"], [
              ["Coaster Run", "Die Schranken an den drei Bahnübergängen schließen 6 Sekunden, während der Zug seine Runde fährt."],
              ["Carousel Spin", "Das Karussell dreht sich 10 Sekunden; Seile sperren die Nord- und Westöffnung."],
              ["Ghost Flash", "Ein Wagen fährt durch den dunklen Tunnel, der Blitz fotografiert alle darin; der Monitor am Nordausgang zeigt das Foto bis zum nächsten Blitz."],
              ["Log Flume Drop", "Ein Boot kommt den Kanal herunter; die Ostbrücke ist 4 Sekunden nass und gesperrt."],
              ["Turnstile Jam", "Beide Drehkreuze am Haupteingang klemmen 5 Sekunden."]
            ]) + "<p>Nie während eines Meetings, eines Rauswurfs oder einer kritischen Sabotage. Die Drehkreuze sind immer Einbahn (West nur in den Park hinein, Ost nur hinaus), und die Geisterbahn ist innen dunkel.</p>" + shots([["atlas_ride_coaster.webp", "Coaster Run"], ["atlas_ride_carousel.webp", "Carousel Spin"], ["atlas_ride_ghost.webp", "Ghost Flash"], ["atlas_ride_flume.webp", "Log Flume Drop"]])
          }
        },
        {
          id: "sound",
          title: { en: "Sound and mood", de: "Klang und Stimmung" },
          summary: { en: "Ambient sound generated in code, a weather tint and rain on screen.", de: "Im Code erzeugter Umgebungsklang, Wetter-Tönung und Regen im Bild." },
          body: {
            en: "<p>The forest has wind, crickets, an owl and snapping twigs; the museum has ventilation, mains hum, a ticking clock and creaking floors. Rain, thunder and a crackling fire join in when they happen. All of it is generated in code instead of shipped as audio files, and it fades out during meetings and ejections. On screen, the forest night is slightly blue, and rain, fog and storms tint the picture.</p>",
            de: "<p>Im Wald gibt es Wind, Grillen, einen Kauz und knackende Zweige; im Museum Lüftung, Netzbrummen, eine tickende Uhr und knarzende Dielen. Regen, Donner und knisterndes Feuer kommen dazu, wenn sie passieren. Alles wird im Code erzeugt statt als Audiodatei mitgeliefert und blendet in Meetings und beim Rauswurf aus. Im Bild ist die Waldnacht leicht blau, Regen, Nebel und Sturm tönen das Bild.</p>"
          }
        }
      ]
    },
    {
      id: "ejections",
      title: { en: "Ejection scenes", de: "Rauswurf-Szenen" },
      intro: { en: "Each map replaces the flight through space with its own short scenes, for ejections and for skipped votes.", de: "Jede Karte ersetzt den Flug durchs All durch eigene kurze Szenen, für Rauswürfe und für übersprungene Abstimmungen." },
      entries: [
        {
          id: "eject-scenes",
          title: { en: "Scenes per map", de: "Szenen je Karte" },
          summary: { en: "Museum 4 + 2, forest 3 + 2, carnival 5 + 2 (ejection + skip). The host picks one at the start of every meeting, never the same twice in a row.", de: "Museum 4 + 2, Wald 3 + 2, Park 5 + 2 (Rauswurf + Skip). Der Host wählt zu Beginn jedes Meetings eine aus, nie zweimal dieselbe hintereinander." },
          body: {
            en: tbl(["Map", "Ejection", "Skip"], [
              ["Vesper Museum", "Sarcophagus, trapdoor into the depot, T. rex, thrown out", "Empty showcase, night shift"],
              ["Forest Station", "White water, dragged into the forest, off the hunting stand", "Quiet campfire, by the river"],
              ["Moonlight Carnival", "Human cannonball, Ferris wheel, log flume, ghost train, loop", "Empty carousel, popcorn and cardboard clown"]
            ]) + "<p>The scenes are data played by a small engine, with their sounds generated in code; the ejection text shows as usual. If Unknown's Collection plays its own scene for the Void, Atlas stays out of that ejection.</p>",
            de: tbl(["Karte", "Rauswurf", "Skip"], [
              ["Vesper-Museum", "Sarkophag, Falltür ins Depot, T. rex, hinausgeworfen", "Leere Vitrine, Nachtschicht"],
              ["Forststation", "Wildwasser, in den Wald gezerrt, vom Hochsitz", "Stilles Lagerfeuer, am Fluss"],
              ["Moonlight Carnival", "Menschenkanone, Riesenrad, Wildwasserbahn, Geisterbahn, Looping", "Leeres Karussell, Popcorn und Pappclown"]
            ]) + "<p>Die Szenen sind Daten, die eine kleine Engine abspielt, ihre Klänge entstehen im Code; der Rauswurf-Text erscheint wie gewohnt. Spielt Unknown's Collection seine eigene Szene für den Void, hält sich Atlas bei diesem Rauswurf heraus.</p>"
          }
        }
      ]
    },
    {
      id: "selection",
      title: { en: "Choosing a map", de: "Karte wählen" },
      intro: { en: "Next to the vanilla maps, no config file needed.", de: "Neben den Vanilla-Karten, ohne Config-Datei." },
      entries: [
        {
          id: "pick",
          title: { en: "Freeplay and lobby", de: "Freeplay und Lobby" },
          summary: { en: "Extra map buttons in the Freeplay menu and in the host's map picker; the host's choice is sent to everyone.", de: "Zusätzliche Kartenknöpfe im Freeplay-Menü und in der Kartenauswahl des Hosts; die Wahl des Hosts geht an alle." },
          body: {
            en: "<p>In <strong>Freeplay</strong> the buttons of the three Atlas maps sit below the vanilla maps. In a <strong>lobby</strong> the host finds them in the map picker of the game settings; picking a vanilla map switches back. The choice is sent to all players whenever it changes, when someone joins, every few seconds in the lobby and right before the game starts. With Submerged installed, the lobby picker shows all maps.</p><p>Before the start every client reports its Atlas version. If someone is missing Atlas or runs another version, the host cannot start on an Atlas map and a warning above the start button names the player; after the build every client checks that its map really was built.</p>",
            de: "<p>Im <strong>Freeplay</strong> stehen die Knöpfe der drei Atlas-Karten unter den Vanilla-Karten. In einer <strong>Lobby</strong> findet der Host sie in der Kartenauswahl der Spieleinstellungen; eine Vanilla-Karte schaltet zurück. Die Wahl geht an alle Spieler, sobald sie sich ändert, wenn jemand beitritt, alle paar Sekunden in der Lobby und direkt vor dem Spielstart. Mit installiertem Submerged zeigt die Lobby-Auswahl alle Karten.</p><p>Vor dem Start meldet jeder Client seine Atlas-Version. Fehlt jemandem Atlas oder hat er eine andere Version, kann der Host nicht auf einer Atlas-Karte starten, und eine Warnung über dem Startknopf nennt den Spieler; nach dem Bau prüft jeder Client, ob seine Karte wirklich gebaut wurde.</p>"
          }
        }
      ]
    }
  ]
};

const MODS = { chance: CHANCE, useful: USEFUL, unknowns: UNKNOWNS, nightfall: NIGHTFALL, atlas: ATLAS };
