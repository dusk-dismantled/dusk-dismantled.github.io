import { ATTRIBUTES, COLLECTIONS, DREAMS, FACTIONS, GEMS, GENERATIONS, GRADES, IDENTITY_FIELDS, VITAL_FIELDS, capacity, clone, confirmUpdate, creationIssues, creationLimits, assertCreationAttributes, syncCreationRecovery, freshProject, loadTotal, newEntry, parseProject, planUpdate, proposal, syncPastRecovery, validateCharacter } from "./model.js";
import { APP_SHEET_CSS, importHTML, renderCharacter } from "./renderer.js";
import { FORUM_ORIGIN, preparePublication } from "./posting.js";
import { catalogIssues, pastCatalog } from "./catalog.js";
const $ = (selector) => {
  const node = document.querySelector(selector);
  if (!node) throw new Error("Elemento ausente: " + selector);
  return node;
};
const escape = (s) => String(s ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
const STORAGE = "romance-dawn:diario:v1";
const steps = [["identity", "Identidade"], ["attributes", "Atributos"], ["origins", "Origens"], ["masteries", "Talentos"], ["combat", "Trilhas"], ["backpack", "Mochila"], ["review", "Revis\xE3o"]];
let project = freshProject(), draft = clone(project.character), update = proposal(), mode = "create", step = 0, template = "", sheetCSS = "", previewFaction = "neutral", timer, storageAvailable = true, confirmAction = null, confirmNeedsApproval = false;
let rules = null, pasts = [];
let forumConnected = false, publicationPending = null, publicationStatus = "", publicationURL = "";
const rootURL = "https://romance-dawn-oprpg.forumeiros.com";
const ruleURLs = { identity: "/t57-01-geracao", attributes: "/t67-04-atributos", origins: "/t68-05-passados", masteries: "/t78-09-maestrias", combat: "/t77-14-trilhas-de-poder", backpack: "/t75-17-mochila", update: "/t4-02-gemas" };
function toast(message) {
  $("#toast").textContent = message;
  $("#toast").hidden = false;
  setTimeout(() => $("#toast").hidden = true, 5500);
}
function persist() {
  try {
    localStorage.setItem(STORAGE, JSON.stringify({ version: 1, project, draft, update, mode, step }));
    storageAvailable = true;
    $("#save-status").textContent = "\u2713 Rascunho guardado neste porto";
  } catch {
    storageAvailable = false;
    $("#save-status").textContent = "Salvamento indispon\xEDvel \u2014 guarde um backup";
  }
}
function restore() {
  try {
    const raw = localStorage.getItem(STORAGE);
    if (!raw) return;
    const saved = JSON.parse(raw), nextProject = parseProject(JSON.stringify(saved.project)), nextDraft = validateCharacter(saved.draft);
    if (nextDraft.id !== nextProject.character.id) throw new Error("Rascunho pertence a outra ficha.");
    const nextMode = saved.mode === "update" ? "update" : "create";
    if (nextMode === "update") {
      const previous = update;
      update = saved.update;
      try {
        planUpdateForRestore();
      } finally {
        update = previous;
      }
    }
    project = nextProject;
    draft = nextDraft;
    mode = nextMode;
    update = nextMode === "update" ? saved.update : proposal();
    step = Number.isInteger(saved.step) && saved.step >= 0 && saved.step < steps.length ? saved.step : 0;
    $("#save-status").textContent = "\u2713 Rascunho recuperado";
  } catch {
    toast("O rascunho n\xE3o p\xF4de ser recuperado. O arquivo anterior foi preservado; use seu backup.");
    storageAvailable = false;
    $("#save-status").textContent = "Rascunho inv\xE1lido \u2014 importe um backup";
  }
}
function planUpdateForRestore() {
  if (!update || typeof update.id !== "string" || !Array.isArray(update.training) || !update.gains || !update.spending) throw new Error("Proposta inv\xE1lida.");
  for (const s of [update.title, update.reference, update.notes]) if (typeof s !== "string") throw new Error("Proposta inv\xE1lida.");
  for (const n of [...Object.values(update.gains), ...Object.values(update.spending), update.berryGain, update.berryCost, update.daysGained, update.daysSpent]) if (typeof n !== "number" || !Number.isFinite(n) || n < 0) throw new Error("Proposta inv\xE1lida.");
}
function download(name, data, type) {
  const url = URL.createObjectURL(new Blob([data], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1e3);
}
function currentCharacter() {
  if (mode === "update") {
    try {
      return planUpdate(project, draft, update).character;
    } catch {
      return draft;
    }
  }
  const c = clone(draft);
  syncCreationRecovery(c);
  return c;
}
function currentProject() {
  return { format: "romance-dawn", version: 1, character: clone(currentCharacter()), history: clone(project.history) };
}
function setPreview() {
  try {
    const c = clone(currentCharacter());
    if (c.faction === "auto") c.faction = previewFaction;
    const node = renderCharacter(c, template), body = $("#preview").contentDocument?.body;
    if (!body) return;
    const active = body.querySelector(".rd-tab-input:checked")?.getAttribute("aria-label");
    const opened = [...body.querySelectorAll("details[open]")].map((n) => n.querySelector("summary")?.textContent?.trim());
    body.className = document.body.className;
    body.replaceChildren(node);
    body.style.margin = "0";
    body.style.background = getComputedStyle(document.body).getPropertyValue("--inset");
    const tab = node.querySelectorAll(".rd-tab-input");
    tab.forEach((n) => n.checked = n.getAttribute("aria-label") === (steps[step][0] === "review" ? active : steps[step][1]));
    if (![...tab].some((n) => n.checked)) tab[0].checked = true;
    node.querySelectorAll("details").forEach((n) => n.open = opened.includes(n.querySelector("summary")?.textContent?.trim()));
    $("#preview-name").textContent = c.identity.name || "Seu personagem";
    const load = document.querySelector("#load-summary");
    if (load) load.textContent = "Carga: " + loadTotal(c) + " / " + capacity(c) + " espa\xE7os" + (loadTotal(c) > capacity(c) ? " \u2014 acima da capacidade" : "");
    const total = document.querySelector("#attribute-summary"), spent = ATTRIBUTES.reduce((n, k) => n + c.attributes[k].value, 0);
    if (mode === "create") {
      const limits = creationLimits(c);
      if (total) total.textContent = spent + " / " + limits.total + " pontos distribu\xEDdos \xB7 " + (limits.total - spent) + " restantes \xB7 teto por Atributo: " + limits.ceiling;
      for (const k of ATTRIBUTES) {
        const input = document.querySelector('[data-path="character.attributes.' + k + '.value"]');
        if (input) {
          input.max = String(Math.min(limits.ceiling, Math.max(0, limits.total - spent + c.attributes[k].value)));
          input.step = "1";
        }
      }
    } else if (total) total.textContent = spent + " pontos distribu\xEDdos \xB7 capacidade da Mochila: " + capacity(c);
  } catch (e) {
    $("#save-status").textContent = e.message;
  }
}
function options(values, selected, labels) {
  return ["", ...values].map((v) => '<option value="' + escape(v) + '"' + (v === selected ? " selected" : "") + ">" + escape(v ? labels?.[v] ?? v : "Selecionar") + "</option>").join("");
}
function field(label, path, value, type = "text", values) {
  const attrs = ' data-path="' + escape(path) + '" aria-label="' + escape(label) + '"' + (/collections\.pasts\.\d+\.fields\.name$/.test(path) ? ' list="past-options"' : "");
  const labels = path === "character.faction" ? FACTIONS : path.endsWith(".kind") ? { attribute: "Aumentar atributo", recovery: "Melhorar recupera\xE7\xE3o" } : path.endsWith(".recovery") && path.includes(".attributes.") ? Object.fromEntries(values?.map((v) => [v, "d" + v]) || []) : void 0;
  const input = values ? "<select" + attrs + ">" + options(values, String(value ?? ""), labels) + "</select>" : type === "textarea" ? "<textarea" + attrs + ' rows="3" maxlength="30000">' + escape(value) + "</textarea>" : "<input" + attrs + ' type="' + type + '" value="' + escape(value) + '"' + (type === "number" ? ' min="0" step="any"' : ' maxlength="30000"') + ">";
  return '<label class="field">' + escape(label) + input + "</label>";
}
function readPath(path) {
  const bits = path.split(".");
  let node = bits.shift() === "update" ? update : draft;
  for (const b of bits) node = node[b];
  return node;
}
function writePath(path, value) {
  const bits = path.split(".");
  let node = bits.shift() === "update" ? update : draft;
  for (const b of bits.slice(0, -1)) {
    if (!Object.hasOwn(node, b)) throw new Error("Campo inv\xE1lido.");
    node = node[b];
  }
  const last = bits.at(-1);
  if (!Object.hasOwn(node, last)) throw new Error("Campo inv\xE1lido.");
  node[last] = value;
}
function ruleLink(key) {
  return '<p class="hint"><a href="' + rootURL + (ruleURLs[key] || ruleURLs.identity) + '" target="_blank" rel="noopener">Consultar regra no f\xF3rum \u2197</a></p>';
}
function collection(kind) {
  const spec = COLLECTIONS[kind], entries = draft.collections[kind];
  let html = "<h3>" + spec.label + "</h3>";
  for (const [index, e] of entries.entries()) {
    html += '<details class="entry" open><summary><span>' + escape(e.fields.name || spec.label + " " + (index + 1)) + '</span></summary><div class="fields">';
    for (const [key, label] of Object.entries(spec.fields)) {
      let choices;
      let type = ["notes", "skills", "special", "level1", "level2", "level3", "effect", "traits", "bond"].includes(key) ? "textarea" : "text";
      if (key === "recovery") {
        const match = pasts.find((p) => p.name.toLocaleLowerCase("pt-BR") === e.fields.name.trim().toLocaleLowerCase("pt-BR"));
        choices = match?.recovery.length ? [.../* @__PURE__ */ new Set([...match.recovery, ...e.fields.recovery ? [e.fields.recovery] : []])] : ATTRIBUTES.slice(0, -1);
      }
      if (key === "grade") choices = kind === "professions" ? ["Treinado", "Proficiente", "Competente", "Perito", "Mestre"] : kind === "styles" ? ["Treinado", "Not\xE1vel", "Perito", "Ex\xEDmio", "Mestre"] : GRADES;
      if (["quantity", "load"].includes(key)) type = "number";
      html += field(label, "character.collections." + kind + "." + index + ".fields." + key, e.fields[key], type, choices);
    }
    if (kind === "complications" && mode === "create" && [2, 3, 4].includes(GENERATIONS.indexOf(draft.identity.generation))) {
      if (e.attributeBonus === void 0) e.attributeBonus = false;
      html += '<label class="field"><input type="checkbox" data-path="character.collections.complications.' + index + '.attributeBonus"' + (e.attributeBonus ? " checked" : "") + "> Complica\xE7\xE3o adicional por +" + [0, 0, 6, 8, 8][GENERATIONS.indexOf(draft.identity.generation)] + " pontos de Atributo</label>";
    }
    const past = kind === "pasts" ? pasts.find((p) => p.name.toLocaleLowerCase("pt-BR") === e.fields.name.trim().toLocaleLowerCase("pt-BR")) : null;
    html += "</div>" + (past ? '<p class="hint">Per\xEDcias: ' + escape(past.skills.join(", ")) + ". Recupera\xE7\xE3o: " + escape(past.recovery.join(" ou ")) + ".</p>" : "") + '<div class="entry-tools"><button data-action="move" data-kind="' + kind + '" data-index="' + index + '" data-direction="-1"' + (index === 0 ? " disabled" : "") + '>\u2191</button><button data-action="move" data-kind="' + kind + '" data-index="' + index + '" data-direction="1"' + (index === entries.length - 1 ? " disabled" : "") + '>\u2193</button><button data-action="duplicate" data-kind="' + kind + '" data-index="' + index + '">Duplicar</button><button data-action="remove" data-kind="' + kind + '" data-index="' + index + '">Remover</button></div></details>';
  }
  return html + '<div class="section-actions"><button data-action="add" data-kind="' + kind + '">+ Adicionar ' + spec.label + "</button></div>";
}
function identity() {
  let html = '<div class="fields">';
  for (const [key, label] of Object.entries(IDENTITY_FIELDS)) {
    if (key === "territories") continue;
    const choices = key === "generation" ? GENERATIONS : key === "dream" ? DREAMS : void 0;
    html += field(label, "character.identity." + key, draft.identity[key], ["dreamText", "personality", "appearance", "history"].includes(key) ? "textarea" : "text", choices);
  }
  html += field("Paleta na ficha publicada", "character.faction", draft.faction, "text", Object.keys(FACTIONS));
  html += '</div><p class="hint">A op\xE7\xE3o auto usa o grupo do autor na postagem. A paleta da pr\xE9via n\xE3o altera a fac\xE7\xE3o publicada. Idade e longevidade seguem a esp\xE9cie; confira a fase da vida na regra.</p>';
  if (mode === "update") html += '<h3>O que dizem nos portos</h3><div class="fields">' + field("Inf\xE2mia \u2190 \u22125 a 5 \u2192 Honra", "character.fame", draft.fame, "text") + field("Influ\xEAncia (0 a 12)", "character.influence", draft.influence, "number") + "</div>" + collection("nakamas") + field("Territ\xF3rios conquistados", "character.identity.territories", draft.identity.territories, "textarea");
  return html;
}
function attributes() {
  let html = '<p class="hint">' + (mode === "create" ? "Distribua os pontos da sua gera\xE7\xE3o. A recupera\xE7\xE3o come\xE7a em d4 e acompanha automaticamente os Passados." : "Atributos de 0 a 12. A ficha guarda os m\xE1ximos, n\xE3o os pontos gastos em combate.") + "</p>";
  for (const k of ATTRIBUTES) html += '<div class="attribute-row"><strong>' + k + "</strong>" + field("M\xE1ximo de " + k, "character.attributes." + k + ".value", draft.attributes[k].value, "number") + (k === "Destino" ? '<span class="hint">Sem dado</span>' : mode === "create" ? '<span class="hint">d' + draft.attributes[k].recovery + "</span>" : field("Recupera\xE7\xE3o de " + k, "character.attributes." + k + ".recovery", draft.attributes[k].recovery, "text", ["4", "6", "8", "10", "12"])) + "</div>";
  html += '<div id="attribute-summary" class="meter-summary" aria-live="polite"></div><div class="fields">';
  for (const [k, label] of Object.entries(VITAL_FIELDS)) html += field(label, "character.vitals." + k, draft.vitals[k], "number");
  return html + '</div><p class="hint"><a class="rule-link" href="' + rootURL + '/t56-02-especies" target="_blank" rel="noopener">Sa\xFAde e deslocamentos por esp\xE9cie \u2197</a></p>';
}
function origins() {
  return '<datalist id="past-options">' + pasts.map((p) => '<option value="' + escape(p.name) + '"></option>').join("") + "</datalist>" + collection("pasts") + (mode === "create" ? '<p class="hint">Na cria\xE7\xE3o, cada escolha melhora o dado de d4 para d6, sem acumular no mesmo atributo. Confira se a escolha e as Per\xEDcias pertencem \xE0s op\xE7\xF5es do Passado.</p>' : "") + field("Outras Per\xEDcias (uma por linha)", "character.skills", draft.skills, "textarea") + collection("professions") + collection("styles");
}
function talents() {
  return ["masteries", "complications", "extras", "feats", "animalTraits"].map(collection).join("");
}
function combat() {
  let html = collection("trails") + '<h3>Haki \u2014 a for\xE7a da sua ambi\xE7\xE3o</h3><p class="hint">Os dados seguem a classifica\xE7\xE3o do Sonho. O despertar depende da narra\xE7\xE3o e \xE9 registrado separadamente do treinamento.</p>';
  draft.haki.forEach((h, i) => {
    html += '<details class="entry" open><summary>' + h.name + "</summary>" + field("Despertou?", "character.haki." + i + ".awakened", h.awakened, "text", ["N\xE3o", "Sim"]) + field("Grau de " + h.name, "character.haki." + i + ".grade", h.grade, "text", GRADES) + field("Escolhas e efeitos de " + h.name, "character.haki." + i + ".notes", h.notes, "textarea") + "</details>";
  });
  return html + collection("techniques");
}
function backpack() {
  let html = "<h3>Recursos</h3>" + field("Berrys", "character.berries", draft.berries, "number");
  for (const gem of GEMS) html += '<div class="gem-row"><strong>' + gem + "</strong>" + field(gem + " possu\xEDdos", "character.gems." + gem + ".owned", draft.gems[gem].owned, "number") + field(gem + " gastos", "character.gems." + gem + ".spent", draft.gems[gem].spent, "number") + "</div>";
  return html + field("Tempo de Inatividade dispon\xEDvel (dias)", "character.downtime", draft.downtime, "number") + '<div id="load-summary" class="meter-summary"></div><p class="hint">A carga ocupada \xE9 o total da linha, considerando a quantidade. Apenas a Mochila entra no limite; o Invent\xE1rio registra os itens guardados no navio ou em outro local.</p>' + collection("backpack") + collection("inventory");
}
function updateEditor() {
  let html = '<h3>Recompensas da aventura</h3><p class="hint">Registre os resultados aprovados pela narra\xE7\xE3o. Dados de Gemas n\xE3o s\xE3o valores fixos; este di\xE1rio n\xE3o rola recompensas por voc\xEA.</p>' + field("Aventura / t\xEDtulo do registro", "update.title", update.title) + field("Link ou refer\xEAncia da aprova\xE7\xE3o", "update.reference", update.reference) + '<div class="fields">' + field("Berrys recebidos", "update.berryGain", update.berryGain, "number") + field("Berrys gastos", "update.berryCost", update.berryCost, "number") + "</div>";
  for (const gem of GEMS) html += '<div class="gem-row"><strong>' + gem + "</strong>" + field(gem + " recebidos", "update.gains." + gem, update.gains[gem], "number") + field(gem + " gastos manuais", "update.spending." + gem, update.spending[gem], "number") + "</div>";
  html += '<p class="hint">Gastos manuais cobrem melhorias espec\xEDficas e exce\xE7\xF5es aprovadas. N\xE3o repita aqui os custos dos treinamentos autom\xE1ticos abaixo.</p><div class="fields">' + field("Dias de Inatividade recebidos", "update.daysGained", update.daysGained, "number") + field("Dias usados em outras atividades", "update.daysSpent", update.daysSpent, "number") + '</div><h3>Treinamentos</h3><p class="hint">Atributos: custo em Rubis por ponto e 5 dias por ponto. Recupera\xE7\xE3o: Safiras por patamar e 25 dias por patamar. Registre descontos e exce\xE7\xF5es como edi\xE7\xE3o manual aprovada.</p>';
  update.training.forEach((t, i) => html += '<div class="entry"><div class="fields">' + field("Tipo de treino", "update.training." + i + ".kind", t.kind, "text", ["attribute", "recovery"]) + field("Atributo do treino", "update.training." + i + ".attribute", t.attribute, "text", ATTRIBUTES) + field("Valor / faces desejados", "update.training." + i + ".target", t.target, "number") + '</div><button data-action="remove-training" data-index="' + i + '">Remover treino</button></div>');
  return html + '<div class="section-actions"><button data-action="add-training">+ Treinamento</button></div>' + field("Observa\xE7\xF5es / exce\xE7\xF5es aprovadas", "update.notes", update.notes, "textarea");
}
function review() {
  if (mode === "update") return updateEditor() + '<div class="section-actions"><button class="primary" data-action="review-update">Conferir e registrar atualiza\xE7\xE3o</button><button data-action="discard">Descartar proposta</button></div>' + publicationControls() + "<h3>Di\xE1rio de aventuras</h3>" + historyHTML();
  const issues = [...creationIssues(draft), ...catalogIssues(draft, pasts)];
  return '<h3>Confer\xEAncia antes de zarpar</h3><p class="hint">Confira a pr\xE9via e as escolhas antes de enviar sua Vivre Card \xE0 equipe. O envio n\xE3o substitui a avalia\xE7\xE3o das regras e dos benef\xEDcios espec\xEDficos do personagem.</p>' + issuesHTML(issues) + publicationControls() + historyHTML();
}
function publicationControls() {
  let valid = true;
  try {
    if (!rules) throw new Error("Regras indispon\xEDveis.");
    if (mode === "update" && hasPending()) throw new Error("Registre a atualiza\xE7\xE3o primeiro.");
    preparePublication({ kind: mode === "create" ? "creation" : "update", project: currentProject() }, template, rules);
  } catch {
    valid = false;
  }
  return '<section class="publication"><h3>Enviar para avalia\xE7\xE3o</h3><p class="hint">' + (mode === "create" ? "Sua ficha ser\xE1 enviada em Cria\xE7\xE3o de Personagens." : "A ficha e o resumo ser\xE3o enviados em Atualiza\xE7\xF5es. A publica\xE7\xE3o aprovada permanece sob controle da equipe.") + ' Voc\xEA ver\xE1 uma confer\xEAncia final no f\xF3rum antes de confirmar.</p><button class="primary" data-action="publish" data-valid="' + valid + '"' + (!valid || !forumConnected || publicationPending ? " disabled" : "") + ">" + (mode === "create" ? "Enviar ficha para avalia\xE7\xE3o" : "Enviar atualiza\xE7\xE3o para avalia\xE7\xE3o") + '</button><p id="publication-status" role="status"></p><p><a id="publication-link" target="_blank" rel="noopener" hidden>Abrir t\xF3pico publicado</a></p><p class="hint" id="forum-connect-hint"' + (forumConnected ? " hidden" : "") + '>Abra o Di\xE1rio de Bordo pelo bot\xE3o do <a href="' + FORUM_ORIGIN + '" target="_blank" rel="noopener">Romance Dawn</a> para enviar usando sua conta conectada.</p></section>';
}
function refreshPublicationStatus() {
  const status = document.querySelector("#publication-status");
  if (status) status.textContent = publicationStatus;
  const link = document.querySelector("#publication-link");
  if (link) {
    link.hidden = !publicationURL;
    if (publicationURL) link.href = publicationURL;
  }
  const button = document.querySelector('[data-action="publish"]');
  if (button) button.disabled = button.dataset.valid !== "true" || !forumConnected || !!publicationPending;
  const hint = document.querySelector("#forum-connect-hint");
  if (hint) hint.hidden = forumConnected;
}
function publish() {
  if (!forumConnected) throw new Error("Abra o Di\xE1rio de Bordo pelo bot\xE3o do f\xF3rum para enviar sua ficha.");
  if (publicationPending) throw new Error("Conclua a confer\xEAncia que j\xE1 est\xE1 aberta.");
  if (mode === "update" && hasPending()) throw new Error("Confira e registre a atualiza\xE7\xE3o antes de envi\xE1-la.");
  if (!rules) throw new Error("As regras n\xE3o puderam ser carregadas.");
  const payload = { kind: mode === "create" ? "creation" : "update", project: currentProject() };
  preparePublication(payload, template, rules);
  publicationPending = "rd-" + crypto.randomUUID();
  publicationURL = "";
  publicationStatus = "Abrindo a confer\xEAncia final no f\xF3rum\u2026";
  refreshPublicationStatus();
  window.parent.postMessage({ type: "romance-dawn-publication-request", requestId: publicationPending, payload }, FORUM_ORIGIN);
}
function issuesHTML(issues) {
  return issues.length ? '<ul class="issues">' + issues.map((s) => "<li>" + escape(s) + "</li>").join("") + "</ul>" : '<p class="meter-summary">Distribui\xE7\xE3o b\xE1sica conferida. Revise benef\xEDcios e escolhas com a narra\xE7\xE3o.</p>';
}
function historyHTML() {
  return project.history.length ? [...project.history].reverse().map((h) => '<details class="history-record"><summary>' + escape(h.title) + " \xB7 " + escape(new Date(h.date).toLocaleDateString("pt-BR")) + "</summary><pre>" + escape(h.summary) + '</pre><button data-action="download-summary" data-id="' + escape(h.id) + '">Baixar resumo</button></details>').join("") + '<button data-action="undo-update">Desfazer \xFAltimo registro local</button>' : '<p class="hint">O di\xE1rio ainda n\xE3o tem aventuras registradas.</p>';
}
function renderEditor() {
  $("#module-title").textContent = mode === "create" ? "Criar Vivre Card" : "Atualizar Vivre Card";
  $("#steps").innerHTML = steps.map(([key2, label2], i) => '<button data-action="step" data-index="' + i + '"' + (i === step ? ' aria-current="step"' : "") + ">" + String(i + 1).padStart(2, "0") + " " + (mode === "update" && key2 === "review" ? "Registro" : label2) + "</button>").join("");
  if (mode === "create") syncCreationRecovery(draft);
  const [key, label] = steps[step];
  const renderers = [identity, attributes, origins, talents, combat, backpack, review];
  $("#editor").innerHTML = "<h2>" + escape(mode === "update" && key === "review" ? "Fechamento da aventura" : label) + "</h2>" + ruleLink(mode === "update" && key === "review" ? "update" : key) + (mode === "update" && step !== 6 ? '<p class="hint">Voc\xEA edita uma proposta. Saldos e treinamentos ser\xE3o aplicados no fechamento da aventura.</p>' : "") + renderers[step]() + '<div class="section-actions">' + (step > 0 ? '<button data-action="previous">\u2190 Rumo anterior</button>' : "") + (step < 6 ? '<button class="primary" data-action="next">Pr\xF3ximo rumo \u2192</button>' : "") + "</div>";
  if (mode === "update" && step === 5) $("#editor").querySelectorAll("input[data-path]").forEach((n) => {
    if (/character\.(berries|gems|downtime)/.test(n.dataset.path)) n.disabled = true;
  });
  setPreview();
  refreshPublicationStatus();
}
function enter(nextMode) {
  if (nextMode !== mode) {
    if (mode === "update" && hasPending()) {
      toast("Conclua ou descarte a proposta antes de mudar de m\xF3dulo.");
      return;
    }
    project.character = clone(draft);
    draft = clone(project.character);
    update = proposal();
    mode = nextMode;
  }
  $("#launcher").hidden = true;
  $("#workspace").hidden = false;
  step = nextMode === "update" ? 6 : step;
  renderEditor();
  persist();
}
function hasPending() {
  return JSON.stringify(draft) !== JSON.stringify(project.character) || update.training.length > 0 || !!update.title || !!update.reference || !!update.notes || [...Object.values(update.gains), ...Object.values(update.spending), update.berryGain, update.berryCost, update.daysGained, update.daysSpent].some((n) => n !== 0);
}
function confirmDialog(title, summary, callback, approval = false) {
  $("#confirm-title").textContent = title;
  $("#confirm-summary").textContent = summary;
  $("#approved").checked = false;
  document.querySelector(".approval").hidden = !approval;
  confirmNeedsApproval = approval;
  confirmAction = callback;
  $("#confirm-dialog").showModal();
}
function backup() {
  try {
    const data = { ...currentProject(), pending: mode === "update" ? { base: project, draft, update } : null };
    const raw = JSON.stringify(data, null, 2);
    if (new TextEncoder().encode(raw).length > 5e6) throw new Error("O backup excede 5 MB. Reduza os textos ou guarde um arquivo de continuidade.");
    parseProject(JSON.stringify(data));
    download("romance-dawn-" + draft.id + ".json", raw, "application/json");
    toast("Backup guardado. Leve-o ao pr\xF3ximo porto.");
  } catch (e) {
    toast(e.message);
  }
}
function recover(raw) {
  try {
    let next, nextDraft, nextUpdate;
    const json = raw.trim().startsWith("{");
    next = json ? parseProject(raw) : importHTML(raw, template);
    if (json) {
      const extra = JSON.parse(raw);
      if (extra.pending) {
        const base = parseProject(JSON.stringify(extra.pending.base));
        nextDraft = validateCharacter(extra.pending.draft);
        nextUpdate = extra.pending.update;
        if (base.character.id !== next.character.id || nextDraft.id !== base.character.id) throw new Error("Proposta pertence a outra ficha.");
        next = base;
      }
    }
    const accept = () => {
      project = next;
      draft = nextDraft ?? clone(next.character);
      update = nextUpdate ?? proposal();
      mode = nextUpdate ? "update" : "create";
      step = 0;
      persist();
      $("#import-dialog").close();
      $("#launcher").hidden = true;
      $("#workspace").hidden = false;
      renderEditor();
      toast(json ? "Vivre Card recuperado." : "Vivre Card recuperado do HTML. O hist\xF3rico completo est\xE1 no backup JSON.");
    };
    if (nextUpdate) {
      const saved = update;
      update = nextUpdate;
      try {
        planUpdateForRestore();
      } finally {
        update = saved;
      }
    }
    confirmDialog("Substituir o rascunho?", "A ficha atual ser\xE1 substitu\xEDda por " + (next.character.identity.name || "um personagem sem nome") + ". Guarde um backup se quiser manter o rascunho atual.", accept);
  } catch (e) {
    $("#import-error").textContent = e.message;
  }
}
function action(target) {
  const act = target.dataset.action, index = Number(target.dataset.index), kind = target.dataset.kind;
  try {
    if (act === "step") {
      step = index;
      renderEditor();
    }
    if (act === "next" || act === "previous") {
      step += act === "next" ? 1 : -1;
      renderEditor();
    }
    if (act === "add") {
      if (draft.collections[kind].length >= 100) throw new Error("Limite de 100 registros por se\xE7\xE3o.");
      draft.collections[kind].push(newEntry(kind));
      renderEditor();
    }
    if (act === "remove") confirmDialog("Remover este registro?", draft.collections[kind][index].fields.name || COLLECTIONS[kind].label, () => {
      if (mode === "create" && kind === "complications") {
        const candidate = clone(draft);
        candidate.collections[kind].splice(index, 1);
        assertCreationAttributes(candidate);
      }
      draft.collections[kind].splice(index, 1);
      renderEditor();
      persist();
    });
    if (act === "duplicate") {
      if (draft.collections[kind].length >= 100) throw new Error("Limite de 100 registros por se\xE7\xE3o.");
      const e = newEntry(kind);
      e.fields = clone(draft.collections[kind][index].fields);
      if (kind === "complications") e.attributeBonus = false;
      draft.collections[kind].splice(index + 1, 0, e);
      renderEditor();
    }
    if (act === "move") {
      const other = index + Number(target.dataset.direction);
      if (other >= 0 && other < draft.collections[kind].length) {
        [draft.collections[kind][index], draft.collections[kind][other]] = [draft.collections[kind][other], draft.collections[kind][index]];
        renderEditor();
      }
    }
    if (act === "past-dice") {
      for (const k of ATTRIBUTES) draft.attributes[k].recovery = k === "Destino" ? null : 4;
      syncPastRecovery(draft);
      renderEditor();
      toast("Recupera\xE7\xE3o aplicada. Escolhas repetidas n\xE3o acumulam melhorias.");
    }
    if (act === "add-training") {
      update.training.push({ kind: "attribute", attribute: "For\xE7a", target: Math.min(12, project.character.attributes.For\u00E7a.value + 1) });
      renderEditor();
    }
    if (act === "remove-training") {
      update.training.splice(index, 1);
      renderEditor();
    }
    if (act === "publish") publish();
    if (act === "export-json") backup();
    if (act === "review-update") {
      const result = planUpdate(project, draft, update);
      confirmDialog("Registrar os frutos da aventura?", result.summary, () => {
        project = confirmUpdate(project, draft, update);
        draft = clone(project.character);
        update = proposal();
        renderEditor();
        persist();
        toast("Atualiza\xE7\xE3o registrada no di\xE1rio local. Exporte a ficha e o resumo para o f\xF3rum.");
      }, true);
    }
    if (act === "discard") confirmDialog("Descartar a proposta?", "A ficha-base e o hist\xF3rico ser\xE3o mantidos.", () => {
      draft = clone(project.character);
      update = proposal();
      renderEditor();
      persist();
    });
    if (act === "undo-update") {
      const last = project.history.at(-1);
      if (!last) throw new Error("N\xE3o h\xE1 atualiza\xE7\xE3o para desfazer.");
      if (hasPending()) throw new Error("Descarte ou confirme a proposta antes de desfazer um registro.");
      confirmDialog("Desfazer o \xFAltimo registro local?", last.title, () => {
        project.character = clone(last.before);
        project.history.pop();
        draft = clone(project.character);
        update = proposal();
        renderEditor();
        persist();
        toast("\xDAltimo registro desfeito neste navegador.");
      });
    }
    if (act === "download-summary") {
      const h = project.history.find((h2) => h2.id === target.dataset.id);
      if (h) download("romance-dawn-resumo.txt", h.summary, "text/plain;charset=utf-8");
    }
    persist();
  } catch (e) {
    toast(e.message);
  }
}
async function main() {
  const [html, css, book] = await Promise.all([fetch("assets/template.html").then((r) => {
    if (!r.ok) throw new Error("Modelo n\xE3o encontrado.");
    return r.text();
  }), fetch("assets/sheet.css").then((r) => {
    if (!r.ok) throw new Error("CSS n\xE3o encontrado.");
    return r.text();
  }), fetch("assets/rules.json").then((r) => r.ok ? r.json() : null).catch(() => null)]);
  template = html;
  sheetCSS = css + "\n" + APP_SHEET_CSS;
  rules = book;
  if (rules) pasts = pastCatalog(rules);
  const frame = $("#preview");
  const loaded = new Promise((resolve) => frame.addEventListener("load", () => resolve(), { once: true }));
  frame.srcdoc = '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><link rel="stylesheet" href="assets/fonts/fonts.css"><style>' + sheetCSS + "</style></head><body></body></html>";
  await loaded;
  restore();
  $("#preview-faction").innerHTML = Object.entries(FACTIONS).filter(([key]) => key !== "auto").map(([key, label]) => '<option value="' + key + '"' + (key === "neutral" ? " selected" : "") + ">" + label + "</option>").join("");
  $("#create-module").onclick = () => enter("create");
  $("#update-module").onclick = () => enter("update");
  $("#home").onclick = $("#brand").onclick = () => {
    $("#workspace").hidden = true;
    $("#launcher").hidden = false;
  };
  $("#new").onclick = () => confirmDialog("Tra\xE7ar um novo rumo?", "O rascunho e o di\xE1rio atuais ser\xE3o substitu\xEDdos. Guarde um backup antes de come\xE7ar outro personagem.", () => {
    project = freshProject();
    draft = clone(project.character);
    update = proposal();
    mode = "create";
    step = 0;
    renderEditor();
    persist();
  });
  $("#theme").onclick = () => {
    document.body.classList.toggle("darkmode");
    $("#theme").textContent = document.body.classList.contains("darkmode") ? "Modo claro" : "Modo escuro";
    setPreview();
  };
  $("#backup").onclick = backup;
  $("#import").onclick = () => {
    $("#import-error").textContent = "";
    $("#import-dialog").showModal();
  };
  $("#import-file-button").onclick = () => $("#file").click();
  $("#import-code").onclick = () => recover($("#import-text").value);
  $("#file").onchange = async () => {
    const file = $("#file").files?.[0];
    if (file) {
      if (file.size > 5e6) {
        $("#import-error").textContent = "Arquivo maior que 5 MB.";
        return;
      }
      recover(await file.text());
    }
    $("#file").value = "";
  };
  $("#preview-faction").onchange = () => {
    previewFaction = $("#preview-faction").value;
    setPreview();
  };
  const closeConfirm = () => {
    $("#confirm-dialog").close();
    confirmAction = null;
  };
  $("#confirm-close").onclick = $("#confirm-cancel").onclick = closeConfirm;
  $("#confirm-dialog").addEventListener("cancel", () => confirmAction = null);
  $("#confirm-accept").onclick = () => {
    if (confirmNeedsApproval && !$("#approved").checked) {
      toast("Confirme a confer\xEAncia com a aprova\xE7\xE3o da narra\xE7\xE3o.");
      return;
    }
    const run = confirmAction;
    closeConfirm();
    try {
      run?.();
    } catch (e) {
      toast(e.message);
    }
  };
  document.addEventListener("click", (e) => {
    const button = e.target.closest("[data-action]");
    if (button) action(button);
  });
  const onInput = (event) => {
    const input = event.target, path = input.dataset.path;
    if (!path) return;
    const old = readPath(path);
    try {
      let value = input.value;
      if (typeof old === "boolean") value = input.checked;
      else if (typeof old === "number" || old === null) {
        const required = path.startsWith("update.") || /\.attributes\.[^.]+\.(value|recovery)$/.test(path);
        value = input.value === "" ? required ? 0 : null : Number(input.value);
        if (value !== null && !Number.isFinite(value)) throw new Error("Informe um n\xFAmero v\xE1lido.");
      }
      writePath(path, value);
      if (mode === "create") {
        if (/\.attributes\.[^.]+\.value$/.test(path) || path === "character.identity.generation" || path.includes(".complications.")) assertCreationAttributes(draft);
        syncCreationRecovery(draft);
      }
      setPreview();
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (mode === "create") project.character = clone(draft);
        persist();
      }, 180);
    } catch (e) {
      writePath(path, old);
      if (typeof old === "boolean") input.checked = old;
      else input.value = String(old ?? "");
      toast(e.message);
    }
  };
  document.addEventListener("input", onInput);
  document.addEventListener("change", (event) => {
    if (event.target.tagName === "SELECT") onInput(event);
  });
  window.addEventListener("message", (event) => {
    if (event.source !== window.parent || event.origin !== document.referrer.split("/").slice(0, 3).join("/")) return;
    if (event.data?.type === "romance-dawn-theme") {
      document.body.classList.toggle("darkmode", event.data.dark === true);
      setPreview();
    }
    if (event.origin !== FORUM_ORIGIN) return;
    if (event.data?.type === "romance-dawn-forum-context") {
      forumConnected = event.data.connected === true;
      refreshPublicationStatus();
    }
    if (event.data?.type === "romance-dawn-publication-result" && event.data.requestId === publicationPending) {
      publicationPending = null;
      publicationURL = "";
      if (event.data.status === "posted") {
        try {
          const url = new URL(event.data.url);
          if (url.origin !== FORUM_ORIGIN || !/^\/(?:t\d+|viewtopic)/.test(url.pathname)) throw new Error();
          publicationURL = url.href;
          publicationStatus = "Sua Vivre Card foi enviada para avalia\xE7\xE3o.";
        } catch {
          publicationStatus = "Confira a publica\xE7\xE3o no f\xF3rum. O link recebido n\xE3o p\xF4de ser validado.";
        }
      } else publicationStatus = event.data.status === "cancelled" ? "Envio cancelado. Voc\xEA pode continuar editando sua ficha." : String(event.data.message || "N\xE3o foi poss\xEDvel confirmar o envio. Seu rascunho continua salvo.");
      refreshPublicationStatus();
    }
  });
  if (window.parent !== window && document.referrer) {
    const parentOrigin = new URL(document.referrer).origin;
    window.parent.postMessage({ type: "romance-dawn-ready" }, parentOrigin);
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !document.querySelector("dialog[open]")) window.parent.postMessage({ type: "romance-dawn-close" }, parentOrigin);
    });
  }
  window.addEventListener("beforeunload", (event) => {
    if (timer) {
      clearTimeout(timer);
      if (mode === "create") project.character = clone(draft);
      persist();
    }
    if (!storageAvailable) {
      event.preventDefault();
      event.returnValue = "";
    }
  });
  renderEditor();
  if (location.hash === "#create") enter("create");
  else if (location.hash === "#update") enter("update");
}
void main().catch((e) => {
  $("#save-status").textContent = "N\xE3o foi poss\xEDvel abrir o di\xE1rio.";
  toast(e.message);
});
