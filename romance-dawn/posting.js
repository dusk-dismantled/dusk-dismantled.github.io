import { assertCreationAttributes, creationIssues, parseProject, syncCreationRecovery } from "./model.js";
import { catalogIssues, pastCatalog } from "./catalog.js";
import { exportHTML } from "./renderer.js";
const FORUM_ORIGIN = "https://romance-dawn-oprpg.forumeiros.com";
const escape = (s) => s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
function preparePublication(value, template, rules) {
  if (!value || typeof value !== "object") throw new Error("Pedido de publica\xE7\xE3o inv\xE1lido.");
  const request = value;
  if (!["creation", "update"].includes(request.kind)) throw new Error("Tipo de publica\xE7\xE3o inv\xE1lido.");
  const project = parseProject(JSON.stringify(request.project));
  const c = project.character;
  if (!c.identity.name.trim()) throw new Error("Informe o nome do personagem.");
  if (request.kind === "creation") {
    syncCreationRecovery(c);
    assertCreationAttributes(c);
    const issues = [...creationIssues(c), ...catalogIssues(c, pastCatalog(rules))];
    if (issues.length) throw new Error(issues.join("\n"));
  }
  const last = project.history.at(-1);
  if (request.kind === "update" && (!last || JSON.stringify(last.after) !== JSON.stringify(c))) throw new Error("Confira e registre a atualiza\xE7\xE3o antes de envi\xE1-la para avalia\xE7\xE3o.");
  const forum = request.kind === "creation" ? 12 : 22;
  const title = (request.kind === "creation" ? "[Ficha] " : "[Atualiza\xE7\xE3o] ") + c.identity.name.trim();
  const summary = request.kind === "update" ? '<section class="rd-update-summary"><h2>' + escape(last.title) + "</h2><p>Refer\xEAncia da aprova\xE7\xE3o: " + escape(last.reference) + "</p><pre>" + escape(last.summary) + "</pre></section>" : "";
  return { key: request.kind + ":" + (request.kind === "creation" ? c.id : last.id), title, message: (summary + exportHTML(project, template)).replace(/\r\n|\r|\n/g, "&#10;"), forum, destination: request.kind === "creation" ? "Cria\xE7\xE3o de Personagens" : "Atualiza\xE7\xF5es", characterId: c.id };
}
function postingForm(doc, forum, publication) {
  const form = [...doc.forms].find((f) => new URL(f.getAttribute("action") || "", FORUM_ORIGIN).pathname === "/post" && f.querySelector('textarea[name="message"]'));
  if (!form || form.method.toLowerCase() !== "post" || new URL(form.getAttribute("action") || "", FORUM_ORIGIN).origin !== FORUM_ORIGIN) throw new Error("Entre na sua conta do f\xF3rum e confira a permiss\xE3o para criar t\xF3picos nesta \xE1rea.");
  const mode = form.querySelector('[name="mode"]'), destination = form.querySelector('[name="f"]');
  if (mode?.value !== "newtopic" || destination?.value !== String(forum) || !form.querySelector('[name="post"]')) throw new Error("O formul\xE1rio do f\xF3rum n\xE3o corresponde \xE0 \xE1rea de avalia\xE7\xE3o.");
  const subject = form.querySelector('[name="subject"]');
  if (!subject) throw new Error("Campo de t\xEDtulo n\xE3o encontrado no f\xF3rum.");
  if (subject.maxLength > 0 && publication.title.length > subject.maxLength) throw new Error("O t\xEDtulo excede o limite de " + subject.maxLength + " caracteres do f\xF3rum. Encurte o nome do personagem.");
  const body = new URLSearchParams();
  for (const [key, value] of new FormData(form)) {
    if (typeof value === "string") body.append(key, value);
  }
  body.set("subject", publication.title);
  body.set("message", publication.message);
  body.set("mode", "newtopic");
  body.set("f", String(forum));
  body.set("topictype", "0");
  body.delete("preview");
  body.delete("disable_html");
  body.delete("disable_smilies");
  body.set("disable_smilies", "1");
  body.set("post", form.querySelector('[name="post"]').value || "Enviar");
  return body;
}
function publishedTopic(doc, responseURL, characterId) {
  const topic = (raw) => {
    try {
      const url = new URL(raw, FORUM_ORIGIN);
      return url.origin === FORUM_ORIGIN && (/^\/t\d+(?:-|$)/.test(url.pathname) || url.pathname === "/viewtopic" && /^\d+$/.test(url.searchParams.get("t") || url.searchParams.get("p") || "")) ? url.href : null;
    } catch {
      return null;
    }
  };
  const direct = topic(responseURL);
  if (direct && [...doc.querySelectorAll(".rd-sheet")].some((n) => n.id === characterId)) return direct;
  const text = doc.body?.textContent || "";
  if (doc.querySelector('form textarea[name="message"]') || /mensagem[\s\S]{0,30}não[\s\S]{0,40}(?:enviad|publicad|registrad)/i.test(text)) return null;
  if (!/(?:mensagem|message)[\s\S]{0,100}(?:enviad|publicad|registrad|posted|entered)|tópico[\s\S]{0,60}criado/i.test(text)) return null;
  const refresh = doc.querySelector('meta[http-equiv="refresh" i]')?.content.match(/url\s*=\s*['"]?([^'"\s]+)/i)?.[1];
  if (refresh && topic(refresh)) return topic(refresh);
  for (const a of doc.querySelectorAll("a[href]")) if (/^(?:clique aqui|ver (?:a |o |sua )?(?:mensagem|tópico)|visualizar|click here|view (?:your )?(?:message|topic))/i.test(a.textContent?.trim() || "")) {
    const url = topic(a.getAttribute("href"));
    if (url) return url;
  }
  return null;
}
export {
  FORUM_ORIGIN,
  postingForm,
  preparePublication,
  publishedTopic
};
