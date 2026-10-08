const ATTRIBUTES = ["For\xE7a", "Destreza", "Agilidade", "Constitui\xE7\xE3o", "Estamina", "Reflexos", "Sagacidade", "Instintos", "Presen\xE7a", "Poder", "Ambi\xE7\xE3o", "Destino"];
const GEMS = ["Rubis", "Safiras", "Ametistas", "Esmeraldas", "Diamantes"];
const FACTIONS = { auto: "Grupo do autor no f\xF3rum", pirate: "Piratas", marine: "Marinha", government: "Governo Mundial", revolutionary: "Ex\xE9rcito Revolucion\xE1rio", mercenary: "Mercen\xE1rios / Ca\xE7adores", neutral: "Sem fac\xE7\xE3o" };
const GRADES = ["Inexperiente", "Novato", "Treinado", "Not\xE1vel", "Perito", "Ex\xEDmio", "Mestre", "\xC1pice"];
const GENERATIONS = ["Aspirantes", "Nova Gera\xE7\xE3o", "Lobo do Mar", "Apogeu", "Antiga Gera\xE7\xE3o"];
const DREAMS = ["Conhecimento pelo companheirismo", "Liberdade pelo companheirismo", "Poder pelo companheirismo", "Conhecimento pela for\xE7a", "Liberdade pela for\xE7a", "Poder pela for\xE7a", "Conhecimento pela engana\xE7\xE3o", "Liberdade pela engana\xE7\xE3o", "Poder pela engana\xE7\xE3o"];
const HAKI_DICE = [[8, 10, 6], [8, 8, 8], [10, 8, 6], [10, 10, 4], [10, 8, 6], [12, 8, 4], [12, 8, 4], [8, 10, 6], [10, 10, 4]];
const IDENTITY_FIELDS = { name: "Nome", nickname: "Alcunha", age: "Idade", species: "Esp\xE9cie", generation: "Gera\xE7\xE3o", crew: "Fac\xE7\xE3o / tripula\xE7\xE3o", tier: "Tier", bounty: "Recompensa", dream: "Classifica\xE7\xE3o do sonho", dreamText: "Sonho do personagem", laugh: "Risada", location: "Localiza\xE7\xE3o atual", personality: "Personalidade", appearance: "Apar\xEAncia", history: "Hist\xF3ria", territories: "Territ\xF3rios conquistados", cover: "Imagem de fundo (URL)", portrait: "Retrato (URL)" };
const VITAL_FIELDS = { health: "Sa\xFAde total", healthIncreases: "Aumentos de Sa\xFAde usados", movement: "Deslocamento padr\xE3o (m)", swimming: "Deslocamento de nata\xE7\xE3o (m)" };
const COLLECTIONS = {
  pasts: { label: "Passados", section: "origins", fields: { name: "Nome", skills: "Per\xEDcias escolhidas (uma por linha)", recovery: "Atributo de recupera\xE7\xE3o escolhido", notes: "Observa\xE7\xF5es" } },
  professions: { label: "Of\xEDcios", section: "origins", fields: { name: "Nome", grade: "Gradua\xE7\xE3o", notes: "Mec\xE2nicas e observa\xE7\xF5es" } },
  styles: { label: "Estilos de combate", section: "origins", fields: { name: "Nome", grade: "Gradua\xE7\xE3o", notes: "Mec\xE2nicas e observa\xE7\xF5es" } },
  masteries: { label: "Maestrias", section: "masteries", fields: { name: "Nome", category: "Origem / categoria", level: "N\xEDvel adquirido", special: "Especial / restri\xE7\xF5es", level1: "N\xEDvel 1", level2: "N\xEDvel 2", level3: "N\xEDvel 3", notes: "Observa\xE7\xF5es" } },
  complications: { label: "Complica\xE7\xF5es", section: "masteries", fields: { name: "Nome", category: "Origem / categoria", level: "N\xEDvel adquirido", special: "Especial / restri\xE7\xF5es", level1: "N\xEDvel 1 / \xFAnico", level2: "N\xEDvel 2", level3: "N\xEDvel 3", notes: "Observa\xE7\xF5es" } },
  extras: { label: "Extras", section: "masteries", fields: { name: "Nome", source: "Origem / requisito", cost: "Custo / uso", effect: "Efeitos e observa\xE7\xF5es" } },
  feats: { label: "Proezas", section: "masteries", fields: { name: "Nome", source: "Origem / requisito", cost: "Custo / uso", effect: "Efeitos e observa\xE7\xF5es" } },
  animalTraits: { label: "Tra\xE7os Animais", section: "masteries", fields: { name: "Nome", source: "Origem / requisito", cost: "Custo / uso", effect: "Efeitos e observa\xE7\xF5es" } },
  trails: { label: "Trilhas de Poder", section: "combat", fields: { name: "Nome da trilha", category: "Tipo / fonte de poder", grade: "Grau", notes: "Escolhas e mec\xE2nicas" } },
  techniques: { label: "T\xE9cnicas", section: "combat", fields: { name: "Nome", rank: "Rank", sources: "Fontes de Poder", attributes: "Custo em Atributos", pa: "Custo em PA", range: "Alcance / \xE1rea", duration: "Dura\xE7\xE3o", effect: "Efeito", notes: "Modificadores e limita\xE7\xF5es" } },
  nakamas: { label: "Nakamas", section: "identity", fields: { name: "Nome", tier: "Tier", challenge: "Desafio", damageDice: "Dados de Dano", health: "Sa\xFAde", movement: "Deslocamento", damageTypes: "Tipos de Dano", bond: "Descri\xE7\xE3o e v\xEDnculo", traits: "Tra\xE7os (nome, categoria, recarga / custo e efeito)", notes: "Observa\xE7\xF5es" } },
  backpack: { label: "Mochila", section: "backpack", fields: { name: "Item / equipamento", quantity: "Quantidade", load: "Carga ocupada pela linha", notes: "Estado / observa\xE7\xF5es" } },
  inventory: { label: "Invent\xE1rio", section: "backpack", fields: { name: "Item / equipamento", quantity: "Quantidade", load: "Carga ocupada pela linha", notes: "Local / observa\xE7\xF5es" } }
};
const clone = (value) => JSON.parse(JSON.stringify(value));
const newId = () => "rd-" + crypto.randomUUID();
function newEntry(kind) {
  return { id: newId(), fields: Object.fromEntries(Object.keys(COLLECTIONS[kind].fields).map((k) => [k, ""])), ...kind === "complications" ? { attributeBonus: false } : {} };
}
function freshCharacter() {
  return { id: newId(), identity: Object.fromEntries(Object.keys(IDENTITY_FIELDS).map((k) => [k, k === "generation" ? "Nova Gera\xE7\xE3o" : ""])), faction: "auto", attributes: Object.fromEntries(ATTRIBUTES.map((k) => [k, { value: 0, recovery: k === "Destino" ? null : 4 }])), vitals: { health: null, healthIncreases: 0, movement: null, swimming: null }, fame: 0, influence: 0, skills: "", haki: ["Armamento", "Observa\xE7\xE3o", "Conquistador"].map((name) => ({ name, awakened: "N\xE3o", grade: "", notes: "" })), berries: 0, gems: Object.fromEntries(GEMS.map((k) => [k, { owned: 0, spent: 0 }])), downtime: 0, collections: Object.fromEntries(Object.keys(COLLECTIONS).map((k) => [k, []])) };
}
function freshProject() {
  return { format: "romance-dawn", version: 1, character: freshCharacter(), history: [] };
}
function fail(message) {
  throw new Error(message);
}
function number(value, min, max, nullable = false) {
  if (nullable && value === null) return;
  if (typeof value !== "number" || !Number.isFinite(value) || value < min || value > max) fail("Valor num\xE9rico inv\xE1lido na ficha.");
}
function text(value) {
  if (typeof value !== "string" || value.length > 3e4) fail("Texto inv\xE1lido ou maior que 30.000 caracteres.");
}
function safeImage(value) {
  if (!value) return "";
  try {
    const url = new URL(value);
    if (url.protocol === "https:" && !url.username && !url.password) return url.href;
  } catch {
  }
  return fail("Use uma URL HTTPS v\xE1lida para a imagem.");
}
function validateCharacter(value) {
  if (!value || typeof value !== "object") fail("Ficha inv\xE1lida.");
  const c = value;
  if (!/^rd-[a-zA-Z0-9-]{1,80}$/.test(c.id)) fail("Identificador da ficha inv\xE1lido.");
  if (!Object.hasOwn(FACTIONS, c.faction)) fail("Fac\xE7\xE3o inv\xE1lida.");
  for (const key of Object.keys(IDENTITY_FIELDS)) text(c.identity?.[key]);
  safeImage(c.identity.cover);
  safeImage(c.identity.portrait);
  for (const k of ATTRIBUTES) {
    const a = c.attributes?.[k];
    number(a?.value, 0, 12);
    if (!Number.isInteger(a.value)) fail("Atributos devem ser inteiros.");
    if (k === "Destino") {
      if (a.recovery !== null) fail("Destino n\xE3o possui recupera\xE7\xE3o.");
    } else if (![4, 6, 8, 10, 12].includes(a.recovery)) fail("Dado de recupera\xE7\xE3o inv\xE1lido.");
  }
  for (const k of Object.keys(VITAL_FIELDS)) number(c.vitals?.[k], 0, 1e12, true);
  number(c.fame, -5, 5, true);
  number(c.influence, 0, 12, true);
  if (c.fame !== null && !Number.isInteger(c.fame) || c.influence !== null && !Number.isInteger(c.influence)) fail("Fama e Influ\xEAncia devem ser inteiras.");
  text(c.skills);
  number(c.berries, 0, Number.MAX_SAFE_INTEGER, true);
  number(c.downtime, 0, 1e9, true);
  for (const k of GEMS) {
    number(c.gems?.[k]?.owned, 0, Number.MAX_SAFE_INTEGER, true);
    number(c.gems?.[k]?.spent, 0, Number.MAX_SAFE_INTEGER, true);
  }
  if (!Array.isArray(c.haki) || c.haki.length !== 3) fail("Ficha precisa registrar os tr\xEAs Hakis.");
  for (const [i, h] of c.haki.entries()) {
    if (h.name !== ["Armamento", "Observa\xE7\xE3o", "Conquistador"][i]) fail("Tonalidade de Haki inv\xE1lida.");
    for (const v of Object.values(h)) text(v);
    if (!["", "Sim", "N\xE3o"].includes(h.awakened)) fail("Despertar de Haki inv\xE1lido.");
  }
  const ids = /* @__PURE__ */ new Set();
  for (const kind of Object.keys(COLLECTIONS)) {
    const entries = c.collections?.[kind];
    if (!Array.isArray(entries) || entries.length > 100) fail("Lista de " + COLLECTIONS[kind].label + " inv\xE1lida ou com mais de 100 entradas.");
    for (const e of entries) {
      if (!/^rd-[a-zA-Z0-9-]{1,80}$/.test(e.id) || ids.has(e.id)) fail("Identificador repetido ou inv\xE1lido.");
      ids.add(e.id);
      if (e.attributeBonus !== void 0 && (kind !== "complications" || typeof e.attributeBonus !== "boolean")) fail("B\xF4nus de Complica\xE7\xE3o inv\xE1lido.");
      for (const field of Object.keys(COLLECTIONS[kind].fields)) text(e.fields?.[field]);
      if (kind === "backpack" || kind === "inventory") {
        for (const f of ["quantity", "load"]) if (e.fields[f] !== "" && (!Number.isFinite(Number(e.fields[f])) || Number(e.fields[f]) < 0)) fail("Quantidade e carga devem ser n\xFAmeros positivos.");
      }
    }
  }
  const clean = freshCharacter();
  clean.id = c.id;
  clean.faction = c.faction;
  for (const key of Object.keys(clean.identity)) clean.identity[key] = c.identity[key];
  for (const k of ATTRIBUTES) clean.attributes[k] = { value: c.attributes[k].value, recovery: c.attributes[k].recovery };
  for (const k of Object.keys(clean.vitals)) clean.vitals[k] = c.vitals[k];
  clean.fame = c.fame;
  clean.influence = c.influence;
  clean.skills = c.skills;
  clean.berries = c.berries;
  clean.downtime = c.downtime;
  clean.haki = c.haki.map((h) => ({ name: h.name, awakened: h.awakened, grade: h.grade, notes: h.notes }));
  for (const k of GEMS) clean.gems[k] = { owned: c.gems[k].owned, spent: c.gems[k].spent };
  for (const k of Object.keys(COLLECTIONS)) clean.collections[k] = c.collections[k].map((e) => ({ id: e.id, fields: Object.fromEntries(Object.keys(COLLECTIONS[k].fields).map((f) => [f, e.fields[f]])), ...e.attributeBonus !== void 0 ? { attributeBonus: e.attributeBonus } : {} }));
  return clean;
}
function parseProject(raw) {
  if (new TextEncoder().encode(raw).length > 5e6) fail("Arquivo maior que 5 MB.");
  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    return fail("JSON inv\xE1lido.");
  }
  if (data.format !== "romance-dawn" || data.version !== 1) fail("Formato ou vers\xE3o de projeto n\xE3o suportados.");
  const character = validateCharacter(data.character);
  if (!Array.isArray(data.history) || data.history.length > 100) fail("Hist\xF3rico inv\xE1lido ou com mais de 100 registros.");
  const ids = /* @__PURE__ */ new Set();
  const history = data.history.map((h) => {
    for (const s of [h.id, h.date, h.title, h.reference]) text(s);
    if (typeof h.summary !== "string" || h.summary.length > 1e6) fail("Resumo de atualiza\xE7\xE3o inv\xE1lido.");
    if (Number.isNaN(Date.parse(h.date))) fail("Data de registro inv\xE1lida.");
    if (!h.id || ids.has(h.id)) fail("Registro de atualiza\xE7\xE3o repetido.");
    ids.add(h.id);
    const before = validateCharacter(h.before), after = validateCharacter(h.after);
    if (before.id !== character.id || after.id !== character.id) fail("Hist\xF3rico pertence a outra ficha.");
    return { id: h.id, date: h.date, title: h.title, reference: h.reference, summary: h.summary, before, after };
  });
  return { format: "romance-dawn", version: 1, character, history };
}
function loadTotal(c) {
  return c.collections.backpack.reduce((sum, e) => sum + Number(e.fields.load || 0), 0);
}
const capacity = (c) => 4 + c.attributes.For\u00E7a.value;
function creationLimits(c) {
  const index = GENERATIONS.indexOf(c.identity.generation);
  if (index < 0) fail("Escolha uma gera\xE7\xE3o v\xE1lida.");
  const bonus = [0, 0, 6, 8, 8][index], chosen = c.collections.complications.filter((e) => e.attributeBonus);
  if (chosen.length > 1) fail("Escolha apenas uma Complica\xE7\xE3o adicional para os pontos de Atributo.");
  if (chosen.length && (!bonus || !chosen[0].fields.name.trim())) fail("O b\xF4nus exige uma gera\xE7\xE3o eleg\xEDvel e uma Complica\xE7\xE3o adicional identificada.");
  return { total: (index === 0 ? 18 : 30) + (chosen.length ? bonus : 0), ceiling: [2, 4, 6, 6, 8][index], bonus };
}
function assertCreationAttributes(c) {
  const limits = creationLimits(c);
  if (ATTRIBUTES.some((k) => !Number.isInteger(c.attributes[k].value) || c.attributes[k].value < 0 || c.attributes[k].value > limits.ceiling)) fail("O teto inicial por Atributo para " + c.identity.generation + " \xE9 " + limits.ceiling + ".");
  const total = ATTRIBUTES.reduce((sum, k) => sum + c.attributes[k].value, 0);
  if (total > limits.total) fail("A distribui\xE7\xE3o n\xE3o pode ultrapassar " + limits.total + " pontos. Reduza outros Atributos antes de continuar.");
}
function syncCreationRecovery(c) {
  for (const k of ATTRIBUTES) c.attributes[k].recovery = k === "Destino" ? null : 4;
  syncPastRecovery(c);
}
function creationIssues(c) {
  const issues = [];
  if (!c.identity.name.trim()) issues.push("Informe o nome do personagem.");
  if (!c.identity.species.trim()) issues.push("Informe a esp\xE9cie.");
  if (!c.identity.dream.trim()) issues.push("Escolha a classifica\xE7\xE3o do sonho para definir os dados de Haki.");
  const index = GENERATIONS.indexOf(c.identity.generation), total = ATTRIBUTES.reduce((n, k) => n + c.attributes[k].value, 0), ceiling = [2, 4, 6, 6, 8][index];
  if (index < 0) issues.push("Escolha uma gera\xE7\xE3o v\xE1lida.");
  else {
    let base = index === 0 ? 18 : 30;
    try {
      base = creationLimits(c).total;
    } catch (e) {
      issues.push(e.message);
    }
    if (total !== base) issues.push("Distribui\xE7\xE3o: " + total + " pontos; a base da gera\xE7\xE3o \xE9 " + base + ". Pontos adicionais precisam de uma exce\xE7\xE3o registrada.");
    if (ATTRIBUTES.some((k) => c.attributes[k].value > ceiling)) issues.push("H\xE1 atributos acima do teto inicial " + ceiling + ". Confira benef\xEDcios e exce\xE7\xF5es.");
    const pasts = [0, 2, 2, 3, 4][index];
    if (c.collections.pasts.length !== pasts) issues.push("A gera\xE7\xE3o prev\xEA " + pasts + " Passados.");
  }
  for (const e of c.collections.pasts) {
    if (e.fields.skills.split("\n").filter((s) => s.trim()).length !== 2) issues.push("Escolha duas Per\xEDcias no Passado " + (e.fields.name || "sem nome") + ".");
    if (!ATTRIBUTES.slice(0, -1).includes(e.fields.recovery)) issues.push("Escolha a recupera\xE7\xE3o do Passado " + (e.fields.name || "sem nome") + ".");
  }
  if (c.vitals.health === null) issues.push("Informe a Sa\xFAde conforme a esp\xE9cie e os benef\xEDcios do personagem.");
  if (loadTotal(c) > capacity(c)) issues.push("Mochila acima da capacidade: aplica Exausto nas jogadas indicadas pela regra.");
  return issues;
}
function syncPastRecovery(c) {
  for (const e of c.collections.pasts) {
    const k = e.fields.recovery;
    if (k !== "Destino" && Object.hasOwn(c.attributes, k)) c.attributes[k].recovery = Math.max(c.attributes[k].recovery ?? 4, 6);
  }
}
function proposal() {
  return { id: newId(), title: "", reference: "", notes: "", gains: Object.fromEntries(GEMS.map((k) => [k, 0])), spending: Object.fromEntries(GEMS.map((k) => [k, 0])), berryGain: 0, berryCost: 0, daysGained: 0, daysSpent: 0, training: [] };
}
const RUBY_COST = [0, 2, 3, 4, 5, 7, 9, 12, 15, 18, 22, 30, 40];
function trainingCost(base, p) {
  const gems = Object.fromEntries(GEMS.map((k) => [k, 0]));
  let days = 0;
  const lines = [];
  const seen = /* @__PURE__ */ new Set();
  for (const t of p.training) {
    if (!ATTRIBUTES.includes(t.attribute)) fail("Atributo de treino inv\xE1lido.");
    const key = t.kind + ":" + t.attribute;
    if (seen.has(key)) fail("N\xE3o repita o mesmo treinamento.");
    seen.add(key);
    const a = base.attributes[t.attribute];
    if (t.kind === "attribute") {
      if (!Number.isInteger(t.target) || t.target <= a.value || t.target > 12) fail("Destino do treinamento de atributo inv\xE1lido.");
      const cost = RUBY_COST.slice(a.value + 1, t.target + 1).reduce((n, x) => n + x, 0);
      gems.Rubis += cost;
      days += 5 * (t.target - a.value);
      lines.push(t.attribute + ": " + a.value + " \u2192 " + t.target + " (" + cost + " Rubis)");
    } else if (t.kind === "recovery") {
      if (t.attribute === "Destino" || ![4, 6, 8, 10, 12].includes(t.target) || t.target <= (a.recovery ?? 4)) fail("Evolu\xE7\xE3o de recupera\xE7\xE3o inv\xE1lida.");
      let cost = 0;
      for (let d = a.recovery ?? 4; d < t.target; d += 2) cost += { 4: 40, 6: 60, 8: 90, 10: 120 }[d];
      gems.Safiras += cost;
      days += 25 * ((t.target - (a.recovery ?? 4)) / 2);
      lines.push("Recupera\xE7\xE3o de " + t.attribute + ": d" + a.recovery + " \u2192 d" + t.target + " (" + cost + " Safiras)");
    } else fail("Tipo de treino inv\xE1lido.");
  }
  return { gems, days, lines };
}
function planUpdate(project, draft, p) {
  const base = project.character;
  const next = validateCharacter(draft);
  if (next.id !== base.id) fail("A proposta pertence a outra ficha.");
  if (project.history.some((h) => h.id === p.id)) fail("Esta atualiza\xE7\xE3o j\xE1 foi confirmada.");
  if (!p.title.trim() || !p.reference.trim()) fail("Informe a aventura e a refer\xEAncia da aprova\xE7\xE3o.");
  for (const x of [...Object.values(p.gains), ...Object.values(p.spending), p.berryGain, p.berryCost, p.daysGained, p.daysSpent]) number(x, 0, Number.MAX_SAFE_INTEGER);
  const costs = trainingCost(base, p);
  const lines = ["Aventura: " + p.title, "Refer\xEAncia: " + p.reference];
  for (const k of GEMS) {
    const before = base.gems[k], cost = p.spending[k] + costs.gems[k];
    if (before.owned === null || before.spent === null) fail("Informe o saldo e o total gasto de " + k + " na ficha-base.");
    const owned = before.owned + p.gains[k] - cost;
    if (owned < 0) fail("Saldo insuficiente de " + k + ".");
    next.gems[k] = { owned, spent: before.spent + cost };
    if (p.gains[k] || cost) lines.push(k + ": " + before.owned + " + " + p.gains[k] + " \u2212 " + cost + " = " + owned + "; total gasto " + next.gems[k].spent);
  }
  if (base.berries === null || base.downtime === null) fail("Informe Berrys e Tempo de Inatividade na ficha-base.");
  next.berries = base.berries + p.berryGain - p.berryCost;
  next.downtime = base.downtime + p.daysGained - p.daysSpent - costs.days;
  if (next.berries < 0) fail("Saldo insuficiente de Berrys.");
  if (next.downtime < 0) fail("Tempo de Inatividade insuficiente.");
  lines.push("Berrys: " + base.berries + " \u2192 " + next.berries, "Tempo de Inatividade: " + base.downtime + " \u2192 " + next.downtime + " dias", ...costs.lines);
  for (const t of p.training) if (t.kind === "attribute") next.attributes[t.attribute].value = t.target;
  else next.attributes[t.attribute].recovery = t.target;
  const labels = { ...IDENTITY_FIELDS, ...VITAL_FIELDS, ...Object.fromEntries(Object.entries(COLLECTIONS).map(([key, spec]) => [key, spec.label])), identity: "Identidade", attributes: "Atributos", value: "M\xE1ximo", recovery: "Recupera\xE7\xE3o", vitals: "Sa\xFAde e deslocamentos", fame: "Inf\xE2mia / Honra", influence: "Influ\xEAncia", skills: "Per\xEDcias", haki: "Hakis", collections: "Registros", faction: "Paleta da fac\xE7\xE3o" };
  const describe = (value, path) => {
    if (Array.isArray(value)) {
      if (!value.length) return "nenhum registro";
      return value.map((item) => {
        if (item?.fields) {
          const kind = path.split(" / ").at(-1);
          const fields = COLLECTIONS[kind]?.fields;
          return Object.entries(item.fields).filter(([, v]) => v).map(([key, v]) => (fields?.[key] ?? key) + ": " + v).join("; ");
        }
        if (item?.name) return item.name + " \u2014 Despertou: " + (item.awakened || "\u2014") + "; Grau: " + (item.grade || "\u2014") + (item.notes ? "; " + item.notes : "");
        return String(item);
      }).join("\n");
    }
    return String(value ?? "\u2014") || "\u2014";
  };
  const compare = (a, b, path) => {
    if (JSON.stringify(a) === JSON.stringify(b)) return;
    if (a && b && typeof a === "object" && typeof b === "object" && !Array.isArray(a) && !Array.isArray(b)) {
      for (const key of Object.keys(b)) compare(a[key], b[key], path ? path + " / " + key : key);
    } else lines.push(path.split(" / ").map((key) => labels[key] ?? key).join(" / ") + ": " + describe(a, path) + " \u2192 " + describe(b, path));
  };
  for (const k of ["identity", "attributes", "vitals", "fame", "influence", "skills", "haki", "collections", "faction"]) compare(base[k], next[k], k);
  if (p.notes.trim()) lines.push("Observa\xE7\xF5es: " + p.notes);
  return { character: validateCharacter(next), summary: lines.join("\n") };
}
function confirmUpdate(project, draft, p) {
  if (project.history.length >= 100) fail("O di\xE1rio atingiu 100 registros. Guarde um backup e inicie um arquivo de continuidade sem o hist\xF3rico antigo.");
  const result = planUpdate(project, draft, p);
  const next = { format: "romance-dawn", version: 1, character: result.character, history: [...project.history, { id: p.id, date: (/* @__PURE__ */ new Date()).toISOString(), title: p.title, reference: p.reference, summary: result.summary, before: clone(project.character), after: clone(result.character) }] };
  if (new TextEncoder().encode(JSON.stringify(next)).length > 5e6) fail("O di\xE1rio excederia 5 MB. Guarde um backup e inicie um arquivo de continuidade.");
  return parseProject(JSON.stringify(next));
}
export {
  ATTRIBUTES,
  COLLECTIONS,
  DREAMS,
  FACTIONS,
  GEMS,
  GENERATIONS,
  GRADES,
  HAKI_DICE,
  IDENTITY_FIELDS,
  RUBY_COST,
  VITAL_FIELDS,
  assertCreationAttributes,
  capacity,
  clone,
  confirmUpdate,
  creationIssues,
  creationLimits,
  freshCharacter,
  freshProject,
  loadTotal,
  newEntry,
  newId,
  parseProject,
  planUpdate,
  proposal,
  safeImage,
  syncCreationRecovery,
  syncPastRecovery,
  trainingCost,
  validateCharacter
};
