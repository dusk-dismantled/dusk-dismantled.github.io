import { ATTRIBUTES, COLLECTIONS, DREAMS, GEMS, GRADES, HAKI_DICE, capacity, loadTotal, parseProject, validateCharacter } from "./model.js";
const NAVIGATION_CSS = Array.from({ length: 100 }, (_, i) => `
.rd-sheet .rd-app-selector>input:nth-of-type(${i + 1}):checked~.rd-talent-panels>:nth-child(${i + 1}){display:block}
.rd-sheet .rd-app-selector>input:nth-of-type(${i + 1}):checked~.rd-talent-list>label:nth-child(${i + 1}){background:linear-gradient(135deg,var(--rd-blue),var(--rd-wine));border-color:var(--rd-gold)}
.rd-sheet .rd-app-selector>input:nth-of-type(${i + 1}):focus-visible~.rd-talent-list>label:nth-child(${i + 1}){outline:2px solid var(--rd-gold);outline-offset:2px}
`).join("");
const APP_SHEET_CSS = `
.rd-update-summary{box-sizing:border-box;width:900px;margin:20px auto;padding:24px;border:1px solid #b79562;border-radius:12px;background:#272633;color:#f5eee1;font:13px/1.65 'Open Sans',Verdana,sans-serif}
.rd-update-summary pre{white-space:pre-wrap;overflow-wrap:anywhere;font:inherit}
.rd-sheet [data-attribute][data-threshold="0"]{--rd-attribute-tone:var(--rd-muted)}
.rd-sheet [data-attribute][data-threshold="4"]{--rd-attribute-tone:var(--rd-accent)}
.rd-sheet [data-attribute][data-threshold="8"]{--rd-attribute-tone:var(--rd-gold)}
.rd-sheet [data-attribute][data-threshold="12"]{--rd-attribute-tone:#c7a5e8}
body:not(.darkmode) .rd-sheet [data-attribute][data-threshold="12"]{--rd-attribute-tone:#75518f}
.rd-sheet .rd-app-narrative{height:auto!important;min-height:180px}
.rd-sheet .rd-app-narrative>.rd-column{flex:0 1 auto!important;justify-content:flex-start!important}
.rd-sheet .rd-narrative-text,.rd-sheet .rd-record-text{white-space:pre-wrap;overflow-wrap:anywhere}
.rd-sheet .rd-text,.rd-sheet h1,.rd-sheet h3{overflow-wrap:anywhere}
.rd-sheet .rd-entry-card+.rd-entry-card{margin-top:14px}
.rd-sheet .rd-app-past-rows{display:flex;flex-direction:column;gap:16px}
.rd-sheet .rd-app-selector>.rd-talent-panels>div>.rd-column>.rd-row:first-child{flex-wrap:wrap}
.rd-sheet .rd-app-selector .rd-text{max-width:100%}
.rd-sheet .rd-nickname{font-size:14px;max-height:none;overflow:visible}
.rd-sheet .rd-header h1{max-height:none;overflow:visible}
.rd-sheet .rd-dream-classification{font:400 13px/1.55 'Open Sans',Verdana,sans-serif;color:var(--rd-muted);white-space:pre-wrap;overflow-wrap:anywhere}
.rd-sheet .rd-dream-text{white-space:pre-wrap}
.rd-sheet .rd-app-empty{padding:16px;color:var(--rd-muted)}
` + NAVIGATION_CSS;
function el(tag, cls = "", value) {
  const node = document.createElement(tag);
  node.className = cls;
  if (value !== void 0) node.textContent = value || "\u2014";
  return node;
}
function put(root, selector, value) {
  const n = root.querySelector(selector);
  if (!n) throw new Error("Template incompat\xEDvel: " + selector);
  n.textContent = value === null || value === "" ? "\u2014" : String(value);
}
function note(root, title, value) {
  if (!value) return;
  const box = el("div", "rd-note");
  box.append(el("h3", "", title), el("p", "rd-record-text", value));
  root.append(box);
}
function field(root, label, value) {
  const box = el("div", "rd-record-field");
  box.append(el("span", "", label), el("strong", "", value === null ? "\u2014" : String(value)));
  root.append(box);
}
function record(root, label, value) {
  const n = [...root.querySelectorAll(".rd-record-field,.rd-gem-value")].find((n2) => n2.querySelector("span")?.textContent?.trim() === label);
  if (!n) throw new Error("Campo do template ausente: " + label);
  put(n, "strong", value);
}
function labeled(root, label, value) {
  const n = [...root.querySelectorAll(".rd-text")].find((n2) => n2.textContent?.trim() === label);
  if (!n?.nextElementSibling) throw new Error("Campo do template ausente: " + label);
  n.nextElementSibling.textContent = value || "\u2014";
}
function replaceEntries(root, selector, entries, render) {
  const samples = [...root.querySelectorAll(selector)];
  const sample = samples[0];
  if (!sample) throw new Error("Lista ausente: " + selector);
  const nodes = entries.length ? entries.map(render) : [el("p", "rd-app-empty", "\u2014")];
  for (const extra of samples.slice(1)) extra.remove();
  sample.replaceWith(...nodes);
}
function clone(node) {
  return node.cloneNode(true);
}
function talents(source, entries, kind, id, masterySource) {
  const root = clone(source);
  root.classList.add("rd-app-selector");
  const list = root.querySelector(".rd-talent-list"), panels = root.querySelector(".rd-talent-panels");
  const labelSample = clone(list.firstElementChild);
  const samples = [...source.querySelectorAll(".rd-talent-panels>div")];
  const masterySamples = [...masterySource.querySelectorAll(".rd-talent-panels>div")];
  const specialSample = masterySamples[1].querySelector(":scope>.rd-column>.rd-column");
  root.querySelectorAll(":scope>input").forEach((n) => n.remove());
  list.replaceChildren();
  panels.replaceChildren();
  for (const [i, e] of entries.entries()) {
    const input = el("input", "rd-talent-input");
    input.type = "radio";
    input.name = id + "-" + kind;
    input.id = input.name + "-" + i;
    input.setAttribute("aria-label", e.fields.name);
    input.checked = i === 0;
    if (i === 0) input.setAttribute("checked", "");
    root.insertBefore(input, list);
    const label = clone(labelSample);
    label.htmlFor = input.id;
    put(label, "strong", e.fields.name);
    put(label, "span", e.fields.category);
    list.append(label);
    const matching = masterySamples.find((n) => n.querySelector(".rd-text")?.textContent?.trim() === e.fields.name);
    const panel = clone(kind === "masteries" ? matching ?? masterySamples[0] : samples[0]);
    panel.className = kind === "masteries" ? "rd-talent-panel" : "rd-complication-panel";
    const card = panel.firstElementChild, header = card.firstElementChild;
    put(header, ":scope>.rd-text", e.fields.name);
    put(header, ".rd-row .rd-text", (kind === "masteries" ? "N\xCDVEL ADQUIRIDO: " : "") + (e.fields.level || String.fromCharCode(8212)));
    if (kind === "masteries") {
      card.querySelector(":scope>.rd-column")?.remove();
      if (e.fields.special) {
        const n = clone(specialSample);
        put(n, ":scope>.rd-text:last-child", e.fields.special);
        if (!matching) put(n, ":scope>.rd-text:first-child", "Especial");
        header.after(n);
      }
      const levels = [...card.querySelectorAll(":scope>.rd-row")].slice(1);
      levels.forEach((row, j) => {
        if (!matching) put(row, ".rd-column>.rd-text:first-child", "N\xEDvel " + (j + 1));
        put(row, ".rd-column>.rd-text:last-child", e.fields["level" + (j + 1)]);
      });
    } else {
      put(card, ":scope>.rd-text", e.fields.level1);
      card.querySelector(":scope>.rd-row:last-child")?.remove();
      for (const key of ["special", "level2", "level3"]) note(card, key === "special" ? "Especial" : "N\xEDvel " + key.slice(-1), e.fields[key]);
    }
    note(card, "Observa\xE7\xF5es", e.fields.notes);
    panels.append(panel);
  }
  if (!entries.length) list.append(el("p", "rd-app-empty", String.fromCharCode(8212)));
  return root;
}
function table(root, entries) {
  const body = root.querySelector("tbody");
  body.replaceChildren();
  for (const e of entries) {
    const row = el("tr");
    for (const key of ["name", "quantity", "load", "notes"]) row.append(el("td", "", e.fields[key]));
    body.append(row);
  }
  if (!entries.length) {
    const cell = el("td", "", "\u2014");
    cell.colSpan = 4;
    const row = el("tr");
    row.append(cell);
    body.append(row);
  }
}
function renderCharacter(c, template) {
  validateCharacter(c);
  const holder = document.createElement("template");
  holder.innerHTML = template.replaceAll("neriah-ficha", c.id);
  const root = holder.content.querySelector(".rd-sheet");
  if (!root) throw new Error("Modelo de ficha ausente.");
  root.dataset.faction = c.faction;
  put(root, "h1", c.identity.name);
  put(root, ".rd-nickname", c.identity.nickname);
  for (const [selector, key, variable] of [[".rd-header", "cover", "--rd-cover"], [".rd-portrait", "portrait", "--rd-portrait"]]) {
    const target = root.querySelector(selector);
    const value = c.identity[key];
    target.style.setProperty(variable, value ? "url(" + JSON.stringify(value) + ")" : "none");
  }
  const identity = root.querySelector(".rd-panel-identity");
  for (const [label, key] of [["ESP\xC9CIE", "species"], ["IDADE", "age"], ["GERA\xC7\xC3O", "generation"], ["FAC\xC7\xC3O / TRIPULA\xC7\xC3O", "crew"], ["TIER", "tier"], ["RECOMPENSA", "bounty"], ["SONHO", "dreamText"], ["RISADA", "laugh"], ["LOCALIZA\xC7\xC3O ATUAL", "location"]]) labeled(identity, label, c.identity[key]);
  const dreamLabel = [...identity.querySelectorAll(".rd-text")].find((n) => n.textContent?.trim() === "SONHO");
  dreamLabel.nextElementSibling.classList.add("rd-dream-text");
  if (c.identity.dream) dreamLabel.parentElement.append(el("p", "rd-dream-classification", c.identity.dream));
  return fill(root, c);
}
function fill(root, c) {
  const identity = root.querySelector(".rd-panel-identity");
  [...identity.querySelectorAll(".rd-narrative-text")].forEach((n, i) => {
    n.textContent = c.identity[["personality", "appearance", "history"][i]];
    n.parentElement.parentElement.classList.add("rd-app-narrative");
  });
  identity.querySelector(".rd-fame-thermometer").dataset.fame = c.fame === null ? "" : String(c.fame);
  identity.querySelector(".rd-meter").dataset.score = c.influence === null ? "" : String(c.influence);
  identity.querySelector(".rd-meter").setAttribute("aria-label", "Influ\xEAncia: " + (c.influence ?? "n\xE3o informada"));
  record(identity, "Reputa\xE7\xE3o / Influ\xEAncia", c.influence);
  put(identity, ".rd-territories-blank", c.identity.territories);
  replaceEntries(identity, ".rd-nakama-card", c.collections.nakamas, (e) => {
    const n = el("div", "rd-box rd-nakama-card");
    n.append(el("h3", "", e.fields.name));
    const grid = el("div", "rd-record-grid");
    for (const [key, title] of [["tier", "Tier"], ["challenge", "Desafio"], ["damageDice", "Dados de Dano"], ["health", "Sa\xFAde"], ["movement", "Deslocamento"], ["damageTypes", "Tipos de Dano"]]) field(grid, title, e.fields[key]);
    n.append(grid);
    note(n, "Descri\xE7\xE3o e v\xEDnculo", e.fields.bond);
    note(n, "Tra\xE7os", e.fields.traits);
    note(n, "Observa\xE7\xF5es", e.fields.notes);
    return n;
  });
  const diePaths = {
    4: "M12 2 22 21H2L12 2Zm0 0v12M2 21l10-7 10 7",
    6: "M12 2 22 7v10l-10 5-10-5V7l10-5ZM2 7l10 5 10-5M12 12v10",
    8: "M12 2 22 12 12 22 2 12 12 2ZM2 12l10-4 10 4-10 4-10-4ZM12 2v6m0 8v6",
    10: "M12 2 20 6 22 14 12 22 2 14 4 6 12 2ZM12 2 8 11l4 11 4-11-4-9ZM4 6l4 5-6 3m18-8-4 5 6 3M8 11l4 3 4-3M12 14v8",
    12: "M7 2h10l6 8-4 12H5L1 10 7 2ZM12 6l6 4-2 7H8l-2-7 6-4ZM7 2l5 4 5-4M1 10h5m12 0h5M5 22l3-5m8 0 3 5",
    20: "M12 2 22 7v10l-10 5-10-5V7l10-5ZM12 2 6 16h12L12 2ZM2 7l4 9-4 1m20-10-4 9 4 1M6 16l6 6 6-6"
  };
  [...root.querySelectorAll("[data-attribute]")].forEach((card, i) => {
    const a = c.attributes[ATTRIBUTES[i]], texts = card.querySelectorAll(".rd-text");
    const threshold = Math.floor(a.value / 4) * 4;
    card.dataset.threshold = String(threshold);
    card.title = ATTRIBUTES[i] + ": " + a.value + "/12";
    texts[1].textContent = String(a.value).padStart(2, "0");
    texts[1].style.color = "var(--rd-attribute-tone)";
    card.style.borderColor = threshold ? "var(--rd-attribute-tone)" : "var(--rd-border)";
    const svg = card.querySelector("svg");
    if (svg) {
      svg.setAttribute("stroke", "var(--rd-accent)");
      svg.setAttribute("stroke-width", "1.4");
    }
    if (a.recovery !== null) {
      texts[2].textContent = "d" + a.recovery;
      texts[2].style.color = "var(--rd-accent)";
      card.querySelector("path")?.setAttribute("d", diePaths[a.recovery]);
    }
    card.querySelectorAll(".rd-segments span").forEach((s, index) => s.style.background = index < a.value ? "var(--rd-attribute-tone)" : "var(--rd-border)");
  });
  const vitals = root.querySelector(".rd-vitals");
  for (const [i, k] of ["health", "healthIncreases", "movement", "swimming"].entries()) put(vitals, ".rd-record-field:nth-child(" + (i + 1) + ") strong", c.vitals[k]);
  const origins = root.querySelector(".rd-panel-origins"), pastRow = origins.firstElementChild, pastSample = pastRow.firstElementChild, pasts = el("div", "rd-app-past-rows");
  for (let i = 0; i < c.collections.pasts.length; i += 2) {
    const row = clone(pastRow);
    row.replaceChildren();
    for (const [j, e] of c.collections.pasts.slice(i, i + 2).entries()) {
      const card = clone(pastSample);
      put(card, ":scope>.rd-text:first-child", e.fields.name);
      put(card, ":scope>.rd-text:nth-child(2)", "PASSADO " + String(i + j + 1).padStart(2, "0"));
      const skills2 = card.querySelector(":scope>.rd-row"), pill = skills2.firstElementChild;
      skills2.replaceChildren(...e.fields.skills.split("\n").map((s) => s.trim()).filter(Boolean).map((s) => {
        const n = clone(pill);
        put(n, ".rd-text", s);
        return n;
      }));
      put(card, ":scope>.rd-column>.rd-text:last-child", e.fields.recovery ? e.fields.recovery + " " + String.fromCharCode(8593) : "");
      note(card, "Observa\xE7\xF5es", e.fields.notes);
      row.append(card);
    }
    pasts.append(row);
  }
  pastRow.replaceWith(pasts);
  const skills = [...new Set([...c.skills.split("\n"), ...c.collections.pasts.flatMap((e) => e.fields.skills.split("\n"))].map((s) => s.trim()).filter(Boolean))];
  origins.querySelector(".rd-skills ul").replaceChildren(...skills.map((s) => el("li", "", s)));
  for (const [i, k] of ["professions", "styles"].entries()) {
    const group = origins.querySelectorAll(".rd-professions>.rd-box")[i];
    replaceEntries(group, ".rd-entry-card", c.collections[k], (e) => {
      const n = el("div", "rd-entry-card");
      n.append(el("h3", "", e.fields.name));
      const grade = el("div", "rd-grade");
      grade.append(el("span", "", "Gradua\xE7\xE3o"), el("strong", "", e.fields.grade));
      n.append(grade);
      note(n, "Mec\xE2nicas e observa\xE7\xF5es", e.fields.notes);
      return n;
    });
  }
  const mastery = root.querySelector(".rd-panel-masteries"), masterySample = clone(mastery.querySelector(".rd-talents"));
  mastery.querySelector(".rd-talents").replaceWith(talents(masterySample, c.collections.masteries, "masteries", c.id, masterySample));
  const complicationSample = mastery.querySelector(".rd-complication-selector");
  complicationSample.replaceWith(talents(complicationSample, c.collections.complications, "complications", c.id, masterySample));
  for (const [i, k] of ["extras", "feats", "animalTraits"].entries()) {
    const fold = mastery.querySelectorAll(".rd-record-fold")[i], sample = clone(fold.querySelector(".rd-talent-record"));
    replaceEntries(fold, ".rd-talent-record", c.collections[k], (e) => {
      const n = clone(sample);
      put(n, ":scope>h3", e.fields.name);
      record(n, "Origem / requisito", e.fields.source);
      record(n, "Custo / uso", e.fields.cost);
      put(n, ".rd-record-text", e.fields.effect);
      return n;
    });
  }
  const combat = root.querySelector(".rd-panel-combat"), trailSample = clone(combat.querySelector(".rd-trail-card"));
  replaceEntries(combat, ".rd-trail-card", c.collections.trails, (e) => {
    const n = clone(trailSample);
    put(n, ":scope>.rd-text:first-child", e.fields.category.toLocaleUpperCase("pt-BR"));
    put(n, ":scope>.rd-text:nth-child(2)", e.fields.name);
    put(n, ":scope>.rd-row .rd-text", e.fields.grade.toLocaleUpperCase("pt-BR"));
    const rank = GRADES.indexOf(e.fields.grade);
    n.querySelectorAll(".rd-track span").forEach((bar, i) => bar.style.background = i < rank ? "var(--rd-gold)" : "var(--rd-border)");
    put(n, ".rd-record-text", e.fields.notes);
    return n;
  });
  const dice = HAKI_DICE[DREAMS.indexOf(c.identity.dream)];
  combat.querySelectorAll(".rd-haki-card").forEach((n, i) => {
    record(n, "Dado de Haki", dice ? "d" + dice[i] : "\u2014");
    record(n, "Despertou?", c.haki[i].awakened);
    record(n, "Grau", c.haki[i].grade);
    put(n, ".rd-record-text", c.haki[i].notes);
  });
  const techniqueSample = clone(combat.querySelector(".rd-technique-card"));
  replaceEntries(combat, ".rd-technique-card", c.collections.techniques, (e) => {
    const n = clone(techniqueSample);
    put(n, ":scope>h3", e.fields.name);
    for (const [k, label] of Object.entries(COLLECTIONS.techniques.fields)) if (!["name", "effect", "notes"].includes(k)) record(n, label, e.fields[k]);
    const texts = n.querySelectorAll(".rd-record-text");
    texts[0].textContent = e.fields.effect;
    texts[1].textContent = e.fields.notes;
    return n;
  });
  const backpack = root.querySelector(".rd-panel-backpack");
  put(backpack, ".rd-berry-balance strong", c.berries);
  backpack.querySelectorAll(".rd-gem-card").forEach((n, i) => {
    record(n, "Possu\xEDdo", c.gems[GEMS[i]].owned);
    record(n, "Gasto", c.gems[GEMS[i]].spent);
  });
  put(backpack, ".rd-carry-capacity strong:first-child", loadTotal(c));
  put(backpack, ".rd-carry-capacity span:nth-child(2) strong", capacity(c));
  backpack.querySelectorAll(".rd-inventory").forEach((n, i) => table(n, c.collections[i === 0 ? "backpack" : "inventory"]));
  return root;
}
function checksum(s) {
  let hash = 2166136261;
  for (let i = 0; i < s.length; i++) hash = Math.imul(hash ^ s.charCodeAt(i), 16777619);
  return (hash >>> 0).toString(16);
}
function encode(s) {
  return btoa(Array.from(new TextEncoder().encode(s), (b) => String.fromCharCode(b)).join(""));
}
function decode(s) {
  return new TextDecoder("utf-8", { fatal: true }).decode(Uint8Array.from(atob(s), (c) => c.charCodeAt(0)));
}
function oneLine(s) {
  return s.replace(/\r\n|\r|\n/g, "&#10;");
}
function exportHTML(project, template) {
  const root = renderCharacter(project.character, template);
  const data = JSON.stringify({ format: "romance-dawn", version: 1, character: project.character, history: [] });
  root.dataset.rdState = encode(data);
  root.dataset.rdChecksum = checksum(root.outerHTML);
  const html = oneLine(root.outerHTML);
  if (new TextEncoder().encode(html).length > 5e6) throw new Error("A ficha excede 5 MB. Reduza os textos antes de exportar.");
  return html;
}
function importHTML(raw, template) {
  if (new TextEncoder().encode(raw).length > 5e6) throw new Error("HTML maior que 5 MB.");
  const doc = new DOMParser().parseFromString(raw, "text/html"), sheets = doc.querySelectorAll(".rd-sheet[data-rd-state]");
  if (sheets.length !== 1) throw new Error("Cole uma \xFAnica ficha gerada pelo aplicativo. Para modelos anteriores, use o editor e preencha os dados.");
  const root = sheets[0], expected = root.dataset.rdChecksum, state = root.dataset.rdState;
  delete root.dataset.rdChecksum;
  if (!expected || checksum(root.outerHTML) !== expected) throw new Error("O HTML foi alterado depois da exporta\xE7\xE3o. Importe o backup JSON para n\xE3o perder edi\xE7\xF5es.");
  const project = parseProject(decode(state));
  renderCharacter(project.character, template);
  return project;
}
export {
  APP_SHEET_CSS,
  exportHTML,
  importHTML,
  renderCharacter
};
