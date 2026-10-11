import { freshCharacter, newEntry, parseProject } from "./model.js";
const names = { identity: "identidade", faction: "faccao", attributes: "atributos", vitals: "vitalidade", fame: "fama", influence: "influencia", skills: "pericias", berries: "berries", gems: "gemas", downtime: "inatividade", collections: "registros", capacityAttribute: "atributodecarga", capacityOverride: "cargamanual", name: "nome", nickname: "alcunha", age: "idade", species: "especie", generation: "geracao", crew: "tripulacao", bounty: "recompensa", dream: "classificacao", dreamText: "sonho", laugh: "risada", location: "localizacao", personality: "personalidade", appearance: "aparencia", history: "historia", territories: "territorios", cover: "capa", portrait: "retrato", value: "valor", recovery: "recuperacao", health: "saude", healthIncreases: "aumentosdesaude", movement: "deslocamento", swimming: "natacao", awakened: "despertou", grade: "grau", notes: "observacoes", owned: "possuido", spent: "gasto", pasts: "passados", professions: "oficios", styles: "estilos", masteries: "maestrias", complications: "complicacoes", extras: "extras", feats: "proezas", animalTraits: "tracosanimais", trails: "trilhas", techniques: "tecnicas", nakamas: "nakamas", backpack: "mochila", inventory: "inventario", fields: "dados", attributeBonus: "bonusdeatributos", category: "categoria", level: "nivel", special: "especial", level1: "nivel1", level2: "nivel2", level3: "nivel3", source: "origem", cost: "custo", effect: "efeito", rank: "rank", sources: "fontes", pa: "pa", range: "alcance", duration: "duracao", challenge: "desafio", damageDice: "dadosdedano", damageTypes: "tiposdedano", bond: "vinculo", traits: "tracos", quantity: "quantidade", load: "carga" };
const tag = (key) => names[key] || key.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const escape = (s) => s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replace(/\r\n|\r|\n/g, "&#10;");
function write(key, value) {
  if (Array.isArray(value) && !value.length) return "";
  const name = tag(key);
  if (value === null) return "<" + name + ' nulo=""></' + name + ">";
  const content = Array.isArray(value) ? value.map((item) => write("item", item)).join("") : typeof value === "object" ? Object.entries(value).map(([k, v]) => write(k, v)).join("") : escape(String(value));
  return "<" + name + ">" + content + "</" + name + ">";
}
function exportCompactHTML(project) {
  const clean = parseProject(JSON.stringify(project));
  return '<ficha versao="2">' + Object.entries(clean.character).map(([k, v]) => write(k, v)).join("") + "</ficha>";
}
function compactRoot(doc) {
  const roots = [...doc.querySelectorAll('ficha[versao="2"]')];
  for (const template of doc.querySelectorAll("template[data-rd-source]")) roots.push(...template.content.querySelectorAll('ficha[versao="2"]'));
  if (roots.length > 1) throw new Error("Cole uma \xFAnica ficha.");
  return roots[0] || null;
}
function importCompactHTML(root) {
  if (root.tagName.toLowerCase() !== "ficha" || root.getAttribute("versao") !== "2" || root.outerHTML.length > 5e6) throw new Error("Formato de ficha compacta inv\xE1lido.");
  function read(node, base, path) {
    if (node.hasAttribute("nulo")) return null;
    if (Array.isArray(base)) {
      const items = [...node.children].filter((n) => n.tagName.toLowerCase() === "item");
      if (items.length > 100) throw new Error("Lista com mais de 100 entradas.");
      return items.map((n, i) => read(n, path[0] === "haki" ? freshCharacter().haki[i] : newEntry(path[1]), path));
    }
    if (base && typeof base === "object") {
      const result = { ...base };
      for (const [key, value] of Object.entries(result)) {
        const matches = [...node.children].filter((n) => n.tagName.toLowerCase() === tag(key));
        if (matches.length > 1) throw new Error("Campo repetido: " + tag(key));
        if (matches[0]) result[key] = read(matches[0], value, [...path, key]);
      }
      return result;
    }
    if (typeof base === "boolean") {
      if (!["true", "false"].includes(node.textContent || "")) throw new Error("Valor de b\xF4nus inv\xE1lido.");
      return node.textContent === "true";
    }
    if (typeof base === "number" || base === null) return node.textContent?.trim() ? Number(node.textContent) : null;
    return node.textContent || "";
  }
  const defaults = freshCharacter();
  if (!root.querySelector(":scope>id")) throw new Error("Identificador da ficha ausente.");
  const character = read(root, defaults, []);
  for (const [key, base] of [["capacityAttribute", ""], ["capacityOverride", null]]) {
    const node = [...root.children].find((n) => n.tagName.toLowerCase() === tag(key));
    if (node) character[key] = read(node, base, [key]);
  }
  return parseProject(JSON.stringify({ format: "romance-dawn", version: 1, character, history: [] }));
}
export {
  compactRoot,
  exportCompactHTML,
  importCompactHTML
};
