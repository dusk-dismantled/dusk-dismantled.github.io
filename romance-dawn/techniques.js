import { forumTopic } from "./workflows.js";
import { TECHNIQUE_CONDITIONS } from "./technique-reference.js";
const GRADES = ["Inexperiente", "Novato", "Treinado", "Not\xE1vel", "Perito", "Ex\xEDmio", "Mestre", "\xC1pice"];
const LIMITS = [0, 2, 4, 6, 9, 12, 15, 18], REDUCERS = [0, 1, 2, 3, 4, 6, 8, 11], DAMAGE = [0, 2, 4, 6, 9, 12, 15, 21], SOURCES = [0, 1, 1, 2, 2, 2, 3, 3];
const DAMAGE_TYPES = ["Contundente", "Lacerante", "Ardente", "Fr\xEDgido", "El\xE9trico", "Corrosivo", "T\xF3xico", "S\xF4nico", "Laser"];
const POWERS = {
  "Paramecia \u2014 Corporal": ["Poder"],
  "Paramecia \u2014 Extracorporal": ["Poder"],
  "Paramecia \u2014 Manipula\xE7\xE3o": ["Poder"],
  "Paramecia \u2014 Espa\xE7o-Temporal": ["Poder"],
  "Paramecia \u2014 Cria\xE7\xE3o": ["Poder"],
  "Paramecia \u2014 Transforma\xE7\xE3o": ["Poder"],
  "Zoan Comum ou Ancestral": ["Estamina"],
  "Zoan Mitol\xF3gica": ["Estamina", "Poder"],
  "Logia": ["Poder"],
  "Poder Marcial": ["Estamina"],
  "Cyborguiza\xE7\xE3o": ["Combust\xEDvel"],
  "Fator de Linhagem": ["Poder", "Estamina"],
  "Ci\xEAncia Extraordin\xE1ria": ["Energia da Tecnologia", "Sagacidade"],
  "Rokushiki": ["Estamina"],
  "Habilidade Inerente": ["Estamina", "Poder"],
  "Guerrilheiro": ["Estamina"],
  "Busoshoku Haki": ["Ambi\xE7\xE3o"],
  "Kenbunshoku Haki": ["Ambi\xE7\xE3o"],
  "Haoshoku Haki": ["Ambi\xE7\xE3o"]
};
const d = (name, group, unit, cost, extra = {}) => ({ name, group, unit, cost, ...extra });
const EFFECTS = {
  critical: d("Adicionar Cr\xEDtico", "Ofensivos", "1 = 20; 2 = 18\u201320", (n) => n === 1 ? 1 : 3, { max: 2 }),
  damageType: d("Adicionar Tipo de Dano", "Ofensivos", "1 = comum; 2 = Laser", (n) => n === 1 ? 2 : 6, { max: 2, minute: 3, detail: true }),
  condition: d("Aplicar Condi\xE7\xE3o", "Ofensivos", "Aplica\xE7\xF5es da condi\xE7\xE3o (15+ no ataque)", (n) => n, { detail: true }),
  stealth: d("Ataque Sorrateiro", "Ofensivos", "Grupos de 2 dados de Aparar", (n) => n),
  damage: d("Aumentar Dano", "Ofensivos", "Dados adicionais", (n) => n),
  combo: d("Combo", "Ofensivos", "Ataques adicionais", (n) => n + 1),
  weapon: d("Criar Arma", "Ofensivos", "Dados d8 da arma (concentra\xE7\xE3o; 1 minuto)", (n) => n + 1, { max: 4 }),
  continuous: d("Dano Cont\xEDnuo", "Ofensivos", "Dados por turno; detalhe a jogada para encerrar", (n) => 6 + n, { detail: true }),
  destructive: d("Destrutivo", "Ofensivos", "Ignora RD de constru\xE7\xF5es", () => 1, { max: 1 }),
  force: d("For\xE7ar Movimento", "Ofensivos", "Grupos de 3 m (colis\xE3o: 2d8)", (n) => n),
  guided: d("Mira Teleguiada", "Ofensivos", "Metade do dano mesmo ap\xF3s esquiva", (_, r) => 2 * r, { max: 1 }),
  breakImmunity: d("Quebrar Imunidade", "Ofensivos", "Tipo de dano", () => 4, { max: 1, minute: 6, detail: true }),
  advantage: d("Aplicar Vantagem/Desvantagem", "Controle", "Quantidade de vantagens/desvantagens", (n) => n * (n + 1) / 2, { minute: 4, detail: true }),
  area: d("Ataque em \xC1rea", "Controle", "Detalhe Cone, C\xEDrculo ou outra forma", () => 3, { max: 1, detail: true }),
  range: d("Aumentar Alcance", "Controle", "Grupos de 6 m", (n) => n),
  surgical: d("Controle Cir\xFArgico", "Controle", "Grupos de 3 alvos ignorados", (n) => n),
  potency: d("Potencializar Aplica\xE7\xE3o", "Controle", "Redu\xE7\xF5es de 2 no m\xEDnimo (at\xE9 5)", (n) => n * (n + 3), { max: 5 }),
  posture: d("Quebrar Postura", "Controle", "Impede contra-ataque de Aparar", () => 1, { max: 1 }),
  fast: d("T\xE9cnica Acelerada", "Controle", "Reduz execu\xE7\xE3o em 1 PA", (_, r) => 1 + r, { max: 1 }),
  recovery: d("Acelerar Recupera\xE7\xE3o", "Suporte", "Passos de recupera\xE7\xE3o", (n) => n * (n + 3) / 2, { minute: 6, detail: true }),
  movement: d("Adicionar Deslocamento", "Suporte", "Grupos de 3 m de deslocamento/nado", (n) => n, { minute: 3, detail: true }),
  flight: d("Converter Deslocamento em Voo", "Suporte", "Converte o deslocamento atual", () => 2, { max: 1, minute: 3 }),
  immunity: d("Adquirir Imunidade", "Suporte", "Tipo de dano", () => 4, { max: 1, minute: 6, detail: true }),
  resistance: d("Adquirir Resist\xEAncia", "Suporte", "Tipo de dano", () => 2, { max: 1, minute: 4, detail: true }),
  heal: d("Aplicar Cura", "Suporte", "Dados d4 de cura (corpo a corpo)", (n) => n),
  contain: d("Conten\xE7\xE3o de Dano", "Suporte", "Dados d6 para aliados corpo a corpo", (n) => n),
  dispel: d("Dissipar Condi\xE7\xE3o", "Suporte", "Aplica\xE7\xF5es da condi\xE7\xE3o a dissipar", (n) => n + 2, { detail: true }),
  mitigate: d("Mitigar Dano", "Suporte", "Grupos de 2d8 de mitiga\xE7\xE3o", (n) => n),
  slow: d("Reduzir Movimento", "Suporte", "Grupos de 3 m", (n) => n),
  charge: d("Carregar Poder", "Redutores", "Aumenta execu\xE7\xE3o em 1 PA", () => 3, { max: 1, negative: true }),
  concentration: d("Concentra\xE7\xE3o Crucial", "Redutores", "Quebra com dano >10% da Sa\xFAde/turno", () => 2, { max: 1, negative: true }),
  side: d("Efeito Colateral", "Redutores", "Custo do efeito negativo recebido", (n) => n, { negative: true, detail: true }),
  limitType: d("Limitar Tipo de Dano", "Redutores", "Tipos de dano exclu\xEDdos (resta apenas um)", (n) => n + 1, { negative: true, detail: true }),
  resource: d("Queimar Recurso", "Redutores", "Capacidade m\xE1xima do recurso (1 unidade consumida)", (n) => Math.floor(n / 12), { negative: true, detail: true }),
  short: d("Reduzir \xC1rea", "Redutores", "Grupos de 3 m", (n) => n, { negative: true }),
  blood: d("Sacrif\xEDcio de Sangue", "Redutores", "% da Sa\xFAde total perdido", (n) => n * 2, { negative: true }),
  dependent: d("T\xE9cnica Dependente", "Redutores", "Custo da t\xE9cnica requisito", (n) => n / 2, { negative: true, detail: true }),
  exhaust: d("T\xE9cnica Desgastante", "Redutores", "Exaust\xE3o, Estressado ou Exaurido", () => 2, { max: 1, negative: true, detail: true }),
  devour: d("T\xE9cnica Devoradora", "Redutores", "Sem Haki por 1 minuto", () => 6, { max: 1, negative: true }),
  nonoffensive: d("T\xE9cnica N\xE3o-Ofensiva", "Redutores", "Sem dano ou condi\xE7\xF5es", (_, r) => r, { max: 1, negative: true })
};
function freshTechnique() {
  return { format: "romance-dawn-technique", version: 1, id: "rd-" + crypto.randomUUID(), name: "", character: "", sheetURL: "", topicURL: "", description: "", base: "", reach: 0, die: 6, sources: [], effects: [] };
}
function parseTechnique(value) {
  const t = structuredClone(value);
  if (!t || t.format !== "romance-dawn-technique" || t.version !== 1 || !/^rd-[\w-]{1,80}$/.test(t.id)) throw new Error("Backup de t\xE9cnica inv\xE1lido.");
  for (const key of ["name", "character", "sheetURL", "topicURL", "description", "base"]) if (typeof t[key] !== "string" || t[key].length > 1e4) throw new Error("Texto da t\xE9cnica inv\xE1lido.");
  if (!Number.isFinite(t.reach) || t.reach < 0 || t.reach > 1e5 || ![4, 6, 8, 10, 12].includes(t.die) || !Array.isArray(t.sources) || t.sources.length > 3 || !Array.isArray(t.effects) || t.effects.length > 50) throw new Error("Valores da t\xE9cnica inv\xE1lidos.");
  for (const s of t.sources) if (!POWERS[s.power]?.includes(s.attribute) || !Number.isInteger(s.grade) || s.grade < 0 || s.grade > 7) throw new Error("Fonte de poder inv\xE1lida.");
  const seen = /* @__PURE__ */ new Set();
  for (const e of t.effects) {
    const def = EFFECTS[e.id];
    if (!Object.hasOwn(EFFECTS, e.id) || seen.has(e.id) || !Number.isInteger(e.quantity) || e.quantity < 1 || e.quantity > (def.max ?? 1e3) || typeof e.minute !== "boolean" || e.minute && def.minute === void 0 || typeof e.detail !== "string" || e.detail.length > 5e3) throw new Error("Modificador inv\xE1lido.");
    if (e.condition !== void 0 && (typeof e.condition !== "string" || !Object.hasOwn(TECHNIQUE_CONDITIONS, e.condition))) throw new Error("Condi\xE7\xE3o inv\xE1lida.");
    if (e.damageType !== void 0 && !DAMAGE_TYPES.includes(e.damageType)) throw new Error("Tipo de dano inv\xE1lido.");
    seen.add(e.id);
  }
  if (t.sheetURL) forumTopic(t.sheetURL);
  if (t.topicURL) forumTopic(t.topicURL);
  return t;
}
function calculateTechnique(value) {
  const t = parseTechnique(value), issues = [];
  const costs = (rank2) => {
    let positive = 0, negative = t.sources.some((s) => s.power === "Poder Marcial") ? Math.ceil(rank2 / 2) : 0;
    for (const e of t.effects) {
      const def = EFFECTS[e.id], condition = ["condition", "dispel"].includes(e.id), n = condition ? (TECHNIQUE_CONDITIONS[e.condition || ""]?.cost || 0) * e.quantity + (e.id === "dispel" ? 2 : 0) : (e.id === "damageType" ? e.damageType === "Laser" ? 6 : 2 : def.cost(e.quantity, rank2)) + (e.minute ? def.minute || 0 : 0);
      if (def.negative) negative += n;
      else positive += n;
    }
    return { positive, negative, cost: positive - negative };
  };
  const classified = (cost) => LIMITS.findIndex((limit, index) => index > 0 && cost <= limit);
  let rank = LIMITS.findIndex((_, index) => index > 0 && classified(costs(index).cost) === index);
  if (rank < 1) {
    rank = Math.max(1, classified(costs(7).cost));
    issues.push("Os modificadores dependentes do Rank n\xE3o produzem um Rank est\xE1vel. Ajuste os efeitos ou redutores.");
  }
  const totals = costs(rank), has = (id) => t.effects.find((e) => e.id === id), pa = 2 + (has("charge") ? 1 : 0) - (has("fast") ? 1 : 0) + Math.max(0, (has("combo")?.quantity || 1) - 1);
  if (!t.name.trim() || !t.character.trim() || !t.description.trim() || !t.base.trim()) issues.push("Informe nome da t\xE9cnica, personagem, descri\xE7\xE3o e mec\xE2nica de base.");
  if (t.sources.length < 1 || t.sources.length > SOURCES[rank]) issues.push("Rank " + rank + " permite de 1 a " + SOURCES[rank] + " fontes.");
  const powerKey = (p) => /^(Paramecia|Zoan|Logia)/.test(p) ? "Akuma no Mi" : p;
  if (new Set(t.sources.map((s) => powerKey(s.power))).size !== t.sources.length) issues.push("N\xE3o repita a mesma Trilha de Poder.");
  if (t.sources.some((s) => s.grade < rank)) issues.push("Todas as Trilhas precisam de grau " + GRADES[rank] + " ou superior.");
  if (t.sources.length === 1 && /Haki$/.test(t.sources[0].power)) issues.push("Haki n\xE3o pode ser a \xFAnica fonte.");
  if (t.sources.some((s) => /^(Busoshoku|Kenbunshoku)/.test(s.power) && s.grade < 3 || s.power === "Haoshoku Haki" && s.grade < 5)) issues.push("Confira os graus iniciais do Haki: Not\xE1vel ou Ex\xEDmio para Haoshoku.");
  if (totals.cost < 0 || totals.cost > LIMITS[rank]) issues.push("Custo final fora dos limites de Rank (0 a 18).");
  if (totals.negative > REDUCERS[rank]) issues.push("Redutores somam " + totals.negative + "; o limite do Rank " + rank + " \xE9 " + REDUCERS[rank] + ".");
  if ((has("damage")?.quantity || 0) > DAMAGE[rank]) issues.push("Dados adicionais excedem o m\xE1ximo do Rank.");
  if (has("nonoffensive") && t.effects.some((e) => ["damage", "critical", "damageType", "condition", "combo", "weapon", "continuous", "destructive", "force", "guided", "breakImmunity", "stealth", "potency"].includes(e.id))) issues.push("T\xE9cnica N\xE3o-Ofensiva n\xE3o pode causar dano nem aplicar condi\xE7\xF5es.");
  if (has("surgical") && !has("area")) issues.push("Controle Cir\xFArgico exige Ataque em \xC1rea.");
  if (has("potency") && !has("condition")) issues.push("Potencializar Aplica\xE7\xE3o exige Aplicar Condi\xE7\xE3o.");
  if (has("dependent") && has("dependent").quantity / 2 > rank) issues.push("O redutor de T\xE9cnica Dependente n\xE3o pode superar o Rank.");
  for (const e of t.effects) if (EFFECTS[e.id].detail && !e.detail.trim()) issues.push("Detalhe " + EFFECTS[e.id].name + ".");
  for (const e of t.effects) if (["condition", "dispel"].includes(e.id)) {
    const condition = TECHNIQUE_CONDITIONS[e.condition || ""];
    if (!condition || condition.cost === null) issues.push("Escolha uma condi\xE7\xE3o reproduz\xEDvel para " + EFFECTS[e.id].name + ".");
    else if (e.quantity > condition.max) issues.push("A condi\xE7\xE3o " + e.condition + " permite no m\xE1ximo " + condition.max + " aplica\xE7\xE3o(\xF5es).");
  }
  for (const e of t.effects) if (["damageType", "breakImmunity", "immunity", "resistance"].includes(e.id) && !DAMAGE_TYPES.includes(e.damageType || "")) issues.push("Escolha o tipo de dano para " + EFFECTS[e.id].name + ".");
  if (t.sources.length === 1) {
    const power = t.sources[0].power, die2 = { "Paramecia \u2014 Extracorporal": 8, "Paramecia \u2014 Espa\xE7o-Temporal": 6, "Paramecia \u2014 Transforma\xE7\xE3o": 6, "Paramecia \u2014 Cria\xE7\xE3o": 10 }[power];
    if (die2 && t.die !== die2) issues.push(power + " exige dado base d" + die2 + ".");
    if (["Paramecia \u2014 Cria\xE7\xE3o", "Zoan Comum ou Ancestral"].includes(power) && t.reach !== 0) issues.push(power + " exige alcance base corpo a corpo.");
  }
  const reach = t.reach + 6 * (has("range")?.quantity || 0) - 3 * (has("short")?.quantity || 0);
  if (reach < 0) issues.push("A redu\xE7\xE3o de alcance supera o alcance da t\xE9cnica.");
  const area = has("area"), shape = area?.detail.toLocaleLowerCase() || "", finalReach = reach / (area ? shape.includes("cone") ? 2 : shape.includes("c\xEDrculo") || shape.includes("circulo") ? 4 : 1 : 1);
  const dice = [4, 6, 8, 10, 12, 20], die = area && !t.sources.some((s) => s.power === "Paramecia \u2014 Espa\xE7o-Temporal") ? dice[Math.max(0, dice.indexOf(t.die) - 2)] : t.die;
  return { rank, ...totals, pa, emeralds: 10 + totals.cost, days: 1, reach: finalReach, die, issues };
}
const esc = (s) => String(s).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replace(/\r?\n/g, "<br>");
function techniqueHTML(t) {
  const c = calculateTechnique(t);
  return '<section id="' + esc(t.id) + '" class="rd-technique"><h2>' + esc(t.name || "Sua t\xE9cnica") + "</h2><p>Personagem: " + esc(t.character) + " \xB7 Rank " + c.rank + "</p><p>" + esc(t.description) + "</p><p>Base: " + esc(t.base) + "</p><p>Fontes: " + t.sources.map((s) => esc(s.power) + " (" + esc(GRADES[s.grade]) + ", " + esc(s.attribute) + ")").join("; ") + "</p><p>Custo: " + c.cost + " pontos nos atributos das fontes \xB7 " + c.pa + " PA \xB7 Aprendizado: " + c.emeralds + " Esmeraldas e 1 dia</p><p>Alcance: " + c.reach + " m (0 = corpo a corpo) \xB7 Dado base ap\xF3s \xE1rea: d" + c.die + " \xB7 Dados adicionais: " + (t.effects.find((e) => e.id === "damage")?.quantity || 0) + "</p><ul>" + t.effects.map((e) => "<li>" + esc(EFFECTS[e.id].name) + " \xD7 " + e.quantity + (e.minute ? " (1 minuto)" : "") + ": " + (e.condition ? esc(e.condition) + " ? " : "") + (e.damageType ? esc(e.damageType) + " ? " : "") + esc(e.detail || EFFECTS[e.id].unit) + "</li>").join("") + "</ul><p>C\xE1lculo: " + c.positive + " \u2212 " + c.negative + " = " + c.cost + ".</p>" + (t.sheetURL ? '<p>Ficha: <a href="' + esc(t.sheetURL) + '">' + esc(t.sheetURL) + "</a></p>" : "") + "<p>A distribui\xE7\xE3o do custo entre fontes e as mec\xE2nicas espec\xEDficas ser\xE3o conferidas pela equipe. Aplicar Condi\xE7\xE3o exige 15+ no ataque (antes de Potencializar Aplica\xE7\xE3o). Cria\xE7\xE3o de arma exige concentra\xE7\xE3o. Esta solicita\xE7\xE3o n\xE3o concede aprova\xE7\xE3o nem desconta recursos da ficha.</p></section>";
}
function prepareTechniquePublication(value) {
  const t = parseTechnique(value?.technique), c = calculateTechnique(t);
  if (c.issues.length) throw new Error(c.issues.join("\n"));
  const target = t.topicURL ? forumTopic(t.topicURL) : void 0;
  return { key: "technique:" + t.id, title: "[T\xE9cnica] " + t.name + " \u2014 " + t.character, message: techniqueHTML(t), forum: 12, destination: "Cria\xE7\xE3o de Personagens" + (target ? " \u2014 " + target.href : ""), characterId: t.id, mode: target ? "reply" : "newtopic", topicId: target ? target.pathname.match(/^\/t(\d+)/)?.[1] || target.searchParams.get("t") : void 0 };
}
export {
  DAMAGE,
  DAMAGE_TYPES,
  EFFECTS,
  GRADES,
  LIMITS,
  POWERS,
  REDUCERS,
  SOURCES,
  calculateTechnique,
  freshTechnique,
  parseTechnique,
  prepareTechniquePublication,
  techniqueHTML
};
