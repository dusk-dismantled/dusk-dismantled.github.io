import { EFFECTS, POWERS, GRADES, DAMAGE_TYPES, freshTechnique, parseTechnique, calculateTechnique, techniqueHTML } from "./techniques.js";
import { FORUM_ORIGIN } from "./posting.js";
import { TECHNIQUE_HELP, TECHNIQUE_CONDITIONS } from "./technique-reference.js";
function installTechniqueEditor() {
  const key = "romance-dawn:technique:v1";
  let t = freshTechnique(), connected = false, pending = "", step = 0, storageError = "";
  try {
    const saved = localStorage.getItem(key);
    if (saved) t = parseTechnique(JSON.parse(saved));
  } catch {
    storageError = "N\xE3o foi poss\xEDvel recuperar o rascunho anterior. Importe seu backup para recuper\xE1-lo.";
  }
  const esc = (v) => String(v).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
  const section = document.createElement("main");
  section.id = "technique-workspace";
  section.hidden = true;
  section.className = "technique-workspace";
  document.querySelector("#workspace").after(section);
  const button = document.createElement("button");
  button.id = "technique-module";
  button.type = "button";
  button.hidden = true;
  button.innerHTML = "<small>04 / T\xC9CNICAS</small><strong>Criar t\xE9cnica</strong><span>Combine fontes de poder, escolha efeitos e confira seus custos.</span><b>Desenvolver uma habilidade \u2197</b>";
  document.querySelector(".module-cards").append(button);
  const save = () => {
    try {
      localStorage.setItem(key, JSON.stringify(t));
      storageError = "";
    } catch {
      storageError = "Armazenamento indispon\xEDvel. Guarde um backup antes de sair.";
    }
  };
  const field = (label, key2, value, type = "text") => '<label class="field">' + label + (type === "textarea" ? '<textarea data-tech="' + key2 + '" rows="4" maxlength="10000">' + esc(value) + "</textarea>" : '<input data-tech="' + key2 + '" type="' + type + '" value="' + esc(value) + '"' + (type === "number" ? ' min="0" max="100000" step="1"' : ' maxlength="10000"') + ">") + "</label>";
  const select = (label, key2, value, options) => '<label class="field">' + label + '<select data-tech="' + key2 + '">' + options.map(([v, l]) => '<option value="' + esc(v) + '"' + (String(value) === v ? " selected" : "") + ">" + esc(l) + "</option>").join("") + "</select></label>";
  const message = (s) => {
    section.querySelector('[role="status"]').textContent = s;
  };
  const preview = () => {
    try {
      const c = calculateTechnique(t);
      section.querySelector("#technique-summary").textContent = "Rank " + c.rank + " \xB7 " + c.cost + " pontos de atributo \xB7 " + c.pa + " PA \xB7 " + c.emeralds + " Esmeraldas + 1 dia";
      section.querySelector("#technique-preview").innerHTML = techniqueHTML(t);
      section.querySelector("#technique-issues").innerHTML = c.issues.length ? '<ul class="issues">' + c.issues.map((i) => "<li>" + esc(i) + "</li>").join("") + "</ul>" : "<p>Limites conferidos. Revise a compatibilidade narrativa e as mec\xE2nicas com a equipe.</p>";
      const publish = section.querySelector("#technique-publish");
      if (publish) publish.disabled = !!c.issues.length || !connected || !!pending;
    } catch (e) {
      section.querySelector("#technique-issues").textContent = e.message;
      const publish = section.querySelector("#technique-publish");
      if (publish) publish.disabled = true;
    }
  };
  const render = () => {
    let body = "";
    if (step === 0) body = field("Nome da t\xE9cnica", "name", t.name) + field("Nome do personagem", "character", t.character) + field("Link da ficha (opcional)", "sheetURL", t.sheetURL, "url") + field("Como a t\xE9cnica funciona?", "description", t.description, "textarea") + field("Mec\xE2nica de base: Estilo de Combate, fruto, tecnologia, dano e requisitos", "base", t.base, "textarea") + '<div class="fields">' + field("Alcance base em metros (0 = corpo a corpo)", "reach", t.reach, "number") + select("Dado de dano base", "die", t.die, [4, 6, 8, 10, 12].map((n) => [String(n), "d" + n])) + '</div><p class="hint">Informe o dano e alcance da mec\xE2nica de origem. Paramecia Extracorporal usa d8; Espa\xE7o-Temporal e Transforma\xE7\xE3o, d6; Cria\xE7\xE3o usa d10 e corpo a corpo. Manipula\xE7\xE3o usa d6 ou a arma proficiente. Zoan usa o EdC compat\xEDvel ou d6. Demais fontes seguem suas mec\xE2nicas pr\xF3prias.</p>';
    if (step === 1) {
      body = "<p>Escolha de uma a tr\xEAs Trilhas j\xE1 possu\xEDdas pelo personagem. O grau de cada uma deve permitir o Rank final. O custo de cada fonte e sua divis\xE3o ser\xE3o conferidos pela Staff.</p>";
      t.sources.forEach((s, i) => {
        body += '<article class="entry"><div class="fields">' + select("Fonte de poder", "sources." + i + ".power", s.power, Object.keys(POWERS).map((p) => [p, p])) + select("Grau da Trilha", "sources." + i + ".grade", s.grade, GRADES.map((g, n) => [String(n), g])) + select("Atributo de custo", "sources." + i + ".attribute", s.attribute, POWERS[s.power].map((a) => [a, a])) + '</div><button data-tech-action="remove-source" data-index="' + i + '">Remover fonte</button></article>';
      });
      body += '<button data-tech-action="add-source"' + (t.sources.length >= 3 ? " disabled" : "") + '>+ Fonte de poder</button><p class="hint">Poder Marcial recebe redutor autom\xE1tico de metade do Rank, arredondado para cima. Haki precisa de outra fonte; Busoshoku/Kenbunshoku come\xE7am em Not\xE1vel e Haoshoku em Ex\xEDmio.</p>';
    }
    if (step === 2) {
      body = "<p>Adicione efeitos e redutores. A quantidade usa a unidade indicada. Os custos e o Rank se ajustam a cada escolha.</p>";
      for (const group of ["Ofensivos", "Controle", "Suporte", "Redutores"]) {
        body += '<details class="entry" open><summary>' + group + "</summary>";
        for (const [id, d] of Object.entries(EFFECTS).filter(([, d2]) => d2.group === group)) {
          const e = t.effects.find((e2) => e2.id === id);
          body += '<div class="technique-effect"><label><input type="checkbox" data-effect="' + id + '"' + (e ? " checked" : "") + "> " + esc(d.name) + '</label><p class="hint">' + esc(d.unit) + '</p><details><summary>Como funciona e quanto custa</summary><p class="hint">' + esc(TECHNIQUE_HELP[d.name] || d.unit).replaceAll("\n", "<br>") + "</p></details>";
          if (e) {
            const i = t.effects.indexOf(e);
            body += (["damageType", "breakImmunity", "immunity", "resistance"].includes(id) ? select("Tipo de dano", "effects." + i + ".damageType", e.damageType || "Contundente", DAMAGE_TYPES.map((name) => [name, name])) : "") + (["condition", "dispel"].includes(id) ? select("Condi\xE7\xE3o", "effects." + i + ".condition", e.condition || "Restrito", Object.entries(TECHNIQUE_CONDITIONS).filter(([, c]) => c.cost !== null).map(([name, c]) => [name, name + " \u2014 " + c.cost + " pontos"])) + '<p class="hint">' + esc(TECHNIQUE_CONDITIONS[e.condition || "Restrito"]?.text || "") + "</p>" : "") + field("Quantidade \u2014 " + d.name, "effects." + i + ".quantity", e.quantity, "number") + (d.minute !== void 0 ? '<label><input type="checkbox" data-tech="effects.' + i + '.minute"' + (e.minute ? " checked" : "") + "> Dura\xE7\xE3o: 1 minuto (+" + d.minute + ")</label>" : "") + field("Detalhes \u2014 " + d.name, "effects." + i + ".detail", e.detail, "textarea");
          }
          body += "</div>";
        }
        body += "</details>";
      }
    }
    if (step === 3) body = "<p>Sem destino, ser\xE1 criado um t\xF3pico novo em Cria\xE7\xE3o de Personagens. Informe um t\xF3pico dessa \xE1rea para publicar como resposta.</p>" + field("T\xF3pico existente (opcional)", "topicURL", t.topicURL, "url") + '<p class="hint">O aprendizado custa 10 + custo final em Esmeraldas e 1 dia. O envio \xE9 uma solicita\xE7\xE3o; a equipe confere a ficha, as condi\xE7\xF5es, a distribui\xE7\xE3o de custos entre fontes e as exce\xE7\xF5es. Nenhum recurso \xE9 descontado automaticamente.</p><button id="technique-publish" class="primary" data-tech-action="publish">Enviar t\xE9cnica para avalia\xE7\xE3o</button><p>' + (!connected ? "Abra o Di\xE1rio de Bordo pelo bot\xE3o do f\xF3rum para enviar com sua conta." : "Voc\xEA ver\xE1 a pr\xE9via final no f\xF3rum antes de confirmar.") + "</p>";
    section.innerHTML = '<section class="editor-column"><div class="workspace-title"><button data-tech-action="home">\u2190 Porto</button><h1>Criar t\xE9cnica</h1><button data-tech-action="new">Nova t\xE9cnica</button></div><nav aria-label="Etapas da t\xE9cnica">' + ["Conceito", "Fontes de Poder", "Efeitos e redutores", "Revis\xE3o e envio"].map((s, i) => '<button data-tech-action="step" data-index="' + i + '"' + (step === i ? ' aria-current="step"' : "") + ">" + String(i + 1).padStart(2, "0") + " " + s + "</button>").join("") + '</nav><div class="section-actions"><button data-tech-action="backup">Guardar backup da t\xE9cnica</button><label class="field">Carregar backup da t\xE9cnica<input type="file" id="technique-file" accept="application/json,.json"></label></div><div>' + body + '</div><p><a href="' + FORUM_ORIGIN + '/t107-15-tecnicas" target="_blank" rel="noopener">Regra de T\xE9cnicas \u2197</a> \xB7 <a href="' + FORUM_ORIGIN + '/t77-14-trilhas-de-poder" target="_blank" rel="noopener">Trilhas de Poder \u2197</a> \xB7 <a href="' + FORUM_ORIGIN + '/t71-08-estilos-de-combate" target="_blank" rel="noopener">Estilos de Combate \u2197</a></p><div class="section-actions">' + (step ? '<button data-tech-action="previous">\u2190 Anterior</button>' : "") + (step < 3 ? '<button class="primary" data-tech-action="next">Pr\xF3xima etapa \u2192</button>' : "") + '</div><p role="status" aria-live="polite">' + esc(storageError) + '</p><a id="technique-posted" target="_blank" rel="noopener" hidden>Abrir t\xF3pico publicado</a></section><aside class="preview-column"><h2>Pr\xE9via da t\xE9cnica</h2><p id="technique-summary" class="meter-summary" aria-live="polite"></p><div id="technique-issues" aria-live="polite"></div><article id="technique-preview"></article></aside>';
    preview();
    section.querySelector("#technique-file").onchange = async (event) => {
      const input = event.target, file = input.files?.[0];
      try {
        if (!file) return;
        if (file.size > 2e5) throw new Error("Backup excede 200 KB.");
        const next = parseTechnique(JSON.parse(await file.text()));
        if (!window.confirm("Substituir o rascunho da t\xE9cnica? Guarde um backup se precisar preserv\xE1-lo.")) return;
        t = next;
        save();
        render();
      } catch (e) {
        message(e.message);
      } finally {
        input.value = "";
      }
    };
  };
  button.onclick = () => {
    if (!connected) return;
    document.querySelector("#launcher").hidden = true;
    document.querySelector("#workspace").hidden = true;
    section.hidden = false;
    render();
  };
  document.querySelector("#brand").addEventListener("click", () => section.hidden = true);
  section.addEventListener("input", (event) => {
    const input = event.target;
    const path = input.dataset.tech;
    if (!path) return;
    const bits = path.split(".");
    let obj = t;
    for (const part of bits.slice(0, -1)) obj = obj[part];
    const k = bits.at(-1);
    obj[k] = input.type === "checkbox" ? input.checked : input.type === "number" || k === "die" || k === "grade" ? Number(input.value) : input.value;
    if (k === "power") {
      obj.attribute = POWERS[obj.power][0];
      const baseDie = { "Paramecia \u2014 Extracorporal": 8, "Paramecia \u2014 Espa\xE7o-Temporal": 6, "Paramecia \u2014 Transforma\xE7\xE3o": 6, "Paramecia \u2014 Cria\xE7\xE3o": 10 }[obj.power];
      if (baseDie) t.die = baseDie;
      if (["Paramecia \u2014 Cria\xE7\xE3o", "Zoan Comum ou Ancestral"].includes(obj.power)) t.reach = 0;
    }
    if (k === "damageType" && obj.id === "damageType") obj.quantity = obj.damageType === "Laser" ? 2 : 1;
    save();
    if (k === "power" || k === "condition" || k === "damageType") render();
    else preview();
    if (storageError) message(storageError);
  });
  section.addEventListener("change", (event) => {
    const input = event.target;
    if (!input.dataset.effect) return;
    const id = input.dataset.effect;
    if (input.checked) t.effects.push({ id, quantity: 1, minute: false, detail: "", ...["condition", "dispel"].includes(id) ? { condition: "Restrito" } : {}, ...["damageType", "breakImmunity", "immunity", "resistance"].includes(id) ? { damageType: "Contundente" } : {} });
    else t.effects = t.effects.filter((e) => e.id !== id);
    save();
    render();
  });
  section.addEventListener("click", (event) => {
    const b = event.target.closest("[data-tech-action]");
    if (!b) return;
    try {
      const a = b.dataset.techAction, i = Number(b.dataset.index);
      if (a === "home") {
        section.hidden = true;
        document.querySelector("#launcher").hidden = false;
      }
      if (a === "step") step = i;
      if (a === "next") step++;
      if (a === "previous") step--;
      if (a === "new") {
        if (!window.confirm("Iniciar outra t\xE9cnica? Guarde um backup para preservar a atual.")) return;
        t = freshTechnique();
        step = 0;
        save();
      }
      if (a === "add-source") t.sources.push({ power: "Poder Marcial", grade: 1, attribute: "Estamina" });
      if (a === "remove-source") t.sources.splice(i, 1);
      if (a === "backup") {
        const blob = new Blob([JSON.stringify(t, null, 2)], { type: "application/json" }), url = URL.createObjectURL(blob), link = document.createElement("a");
        link.href = url;
        link.download = "tecnica-" + t.id + ".json";
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 1e3);
        return;
      }
      if (a === "publish") {
        const c = calculateTechnique(t);
        if (c.issues.length) throw new Error(c.issues.join("\n"));
        if (!connected || pending) throw new Error("Abra pelo f\xF3rum e conclua o envio pendente.");
        pending = "rd-" + crypto.randomUUID();
        window.parent.postMessage({ type: "romance-dawn-publication-request", requestId: pending, payload: { kind: "technique", technique: t } }, FORUM_ORIGIN);
        preview();
        message("Abrindo a confer\xEAncia final no f\xF3rum\u2026");
        return;
      }
      save();
      render();
    } catch (e) {
      message(e.message);
    }
  });
  window.addEventListener("message", (event) => {
    if (event.source !== window.parent || event.origin !== FORUM_ORIGIN) return;
    if (event.data?.type === "romance-dawn-forum-context") {
      connected = event.data.connected === true && event.data.isStaff === true;
      button.hidden = !connected;
      if (!connected && !section.hidden) {
        section.hidden = true;
        document.querySelector("#launcher").hidden = false;
      }
      if (!section.hidden) preview();
    }
    if (event.data?.type === "romance-dawn-publication-result" && event.data.requestId === pending) {
      pending = "";
      if (!section.hidden) {
        message(event.data.status === "posted" ? "T\xE9cnica enviada para avalia\xE7\xE3o." : event.data.status === "cancelled" ? "Envio cancelado. Continue editando." : String(event.data.message || "Confira o f\xF3rum antes de repetir o envio."));
        if (event.data.status === "posted") {
          try {
            const url = new URL(event.data.url);
            if (url.origin !== FORUM_ORIGIN || !/^\/(t\d+|viewtopic)/.test(url.pathname)) throw Error();
            const link = section.querySelector("#technique-posted");
            link.href = url.href;
            link.hidden = false;
          } catch {
            message("Confira o resultado na \xE1rea de Cria\xE7\xE3o de Personagens.");
          }
        }
        preview();
      }
    }
  });
}
export {
  installTechniqueEditor
};
