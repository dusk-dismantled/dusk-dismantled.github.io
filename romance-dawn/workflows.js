import { ATTRIBUTES, clone, parseProject, planUpdate, proposal, validateCharacter } from "./model.js";
import { exportCompactHTML } from "./compact.js";
const REQUEST_PREFIX = "RD-UPDATE:";
function forumTopic(value) {
  const url = new URL(value);
  if (url.origin !== "https://romance-dawn-oprpg.forumeiros.com" || url.username || url.password || !(/^\/t\d+(?:p\d+)?(?:-|$)/.test(url.pathname) || url.pathname === "/viewtopic" && /^\d+$/.test(url.searchParams.get("t") || ""))) throw new Error("Use o link de um t\xF3pico do Romance Dawn.");
  for (const key of [...url.searchParams.keys()]) if (!["t", "p", "start"].includes(key)) url.searchParams.delete(key);
  return url;
}
async function fingerprint(character) {
  const bytes = new TextEncoder().encode(JSON.stringify(validateCharacter(character), (_key, value) => typeof value === "string" ? value.replace(/\r\n/g, "\n").replace(/\u00a0/g, " ").replace(/[ \t]+$/gm, "") : value));
  return [...new Uint8Array(await crypto.subtle.digest("SHA-256", bytes))].map((n) => n.toString(16).padStart(2, "0")).join("");
}
function requestPlan(request) {
  if (request.format !== "romance-dawn-request" || request.version !== 1 || !/^rd-[\w-]{1,80}$/.test(request.id)) throw new Error("Solicita\xE7\xE3o inv\xE1lida.");
  forumTopic(request.sourceURL);
  if (request.topicURL) forumTopic(request.topicURL);
  const base = parseProject(JSON.stringify(request.base)), draft = validateCharacter(request.draft), p = { ...proposal(), ...clone(request.proposal) };
  if (p.id !== request.id) throw new Error("O identificador da solicita\xE7\xE3o n\xE3o corresponde \xE0 proposta.");
  const links = p.reference.match(/https:\/\/[^\s<>]+/g) || [];
  if (!links.length) throw new Error("Informe os links dos comprovantes das recompensas.");
  links.forEach((link) => forumTopic(link));
  if (draft.id !== base.character.id) throw new Error("A proposta pertence a outra ficha.");
  const trainings = /* @__PURE__ */ new Set();
  for (const training of p.training) {
    const keyId = training.kind + ":" + training.attribute;
    if (trainings.has(keyId)) throw new Error("N\xE3o repita o mesmo treinamento.");
    trainings.add(keyId);
    if (!["attribute", "recovery"].includes(training.kind)) throw new Error("Tipo de treinamento inv\xE1lido.");
    if (!ATTRIBUTES.includes(training.attribute)) throw new Error("Atributo de treino inv\xE1lido.");
    const key = training.kind === "attribute" ? "value" : "recovery", old = base.character.attributes[training.attribute][key], current = draft.attributes[training.attribute][key];
    if (current !== old && current !== training.target) throw new Error("A edi\xE7\xE3o e o treinamento informam valores diferentes para " + training.attribute + ".");
    draft.attributes[training.attribute][key] = training.target;
  }
  p.training = [];
  for (const k of ATTRIBUTES) {
    const before = base.character.attributes[k], after = draft.attributes[k];
    if (after.value < before.value || (after.recovery ?? 0) < (before.recovery ?? 0)) throw new Error("Redu\xE7\xF5es de Atributos ou Recupera\xE7\xE3o devem ser feitas pela Staff.");
    if (after.value > before.value) p.training.push({ kind: "attribute", attribute: k, target: after.value });
    if ((after.recovery ?? 0) > (before.recovery ?? 0)) p.training.push({ kind: "recovery", attribute: k, target: after.recovery });
  }
  return planUpdate(base, draft, p);
}
async function encodeRequest(request) {
  requestPlan(request);
  const raw = JSON.stringify(request);
  if (new TextEncoder().encode(raw).length > 5e6) throw new Error("Solicita\xE7\xE3o maior que 5 MB.");
  const compressed = new Uint8Array(await new Response(new Blob([raw]).stream().pipeThrough(new CompressionStream("gzip"))).arrayBuffer());
  let binary = "";
  for (const byte of compressed) binary += String.fromCharCode(byte);
  return REQUEST_PREFIX + btoa(binary);
}
async function decodeRequest(raw) {
  const match = raw.trim().match(/^RD-UPDATE:([A-Za-z0-9+/=]+)$/);
  if (!match || raw.length > 7e6) throw new Error("C\xF3digo de solicita\xE7\xE3o inv\xE1lido.");
  const bytes = Uint8Array.from(atob(match[1]), (c) => c.charCodeAt(0)), reader = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("gzip")).getReader();
  const chunks = [];
  let size = 0;
  try {
    for (; ; ) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > 5e6) throw new Error("Solicita\xE7\xE3o maior que 5 MB.");
      chunks.push(value);
    }
  } finally {
    await reader.cancel();
  }
  const data = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    data.set(chunk, offset);
    offset += chunk.length;
  }
  const request = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(data));
  requestPlan(request);
  return request;
}
const escape = (s) => s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
async function requestHTML(request) {
  const result = requestPlan(request), code = await encodeRequest(request);
  return '<section class="rd-update-summary"><h2>Solicita\xE7\xE3o de atualiza\xE7\xE3o \u2014 ' + escape(result.character.identity.name) + '</h2><p>Ficha oficial: <a href="' + escape(forumTopic(request.sourceURL).href) + '">' + escape(result.character.identity.name) + "</a></p><p>Pendente de confer\xEAncia da Staff. A ficha oficial ainda n\xE3o foi alterada.</p><pre>" + escape(result.summary).replace(/\r\n|\r|\n/g, "<br>") + '</pre><details><summary>C\xF3digo para o m\xF3dulo de Edi\xE7\xE3o de Ficha</summary><pre class="rd-request-code">' + code + "</pre></details></section>";
}
function staffHTML(character) {
  return exportCompactHTML({ format: "romance-dawn", version: 1, character: validateCharacter(character), history: [] });
}
export {
  REQUEST_PREFIX,
  decodeRequest,
  encodeRequest,
  fingerprint,
  forumTopic,
  requestHTML,
  requestPlan,
  staffHTML
};
