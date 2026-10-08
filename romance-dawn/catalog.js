import { ATTRIBUTES } from "./model.js";
function pastCatalog(book) {
  const text = book.rules.find((r) => new URL(r.url).pathname.startsWith("/t68-"))?.text || "";
  const lines = text.split("\n");
  const headings = lines.map((s, i) => ({ name: s.trim(), i })).filter((x) => x.name.length > 4 && x.name.length < 65 && /^[A-ZÀ-Ý][A-ZÀ-Ý ’' -]+$/.test(x.name));
  return headings.map((h, index) => {
    const body = lines.slice(h.i + 1, headings[index + 1]?.i ?? lines.length).join("\n");
    const skillsLine = body.match(/Perícias:\s*Escolha duas entre ([^.]+)\./)?.[1] || "";
    const recoveryLine = body.match(/Melhoria no Dado de Recuperação:\s*Escolha entre ([^.]+)\./)?.[1] || "";
    return { name: h.name, skills: skillsLine.split(/,\s*|\s+ou\s+/).map((s) => s.trim()).filter(Boolean), recovery: ATTRIBUTES.filter((k) => recoveryLine.includes(k)), text: body.trim() };
  });
}
function catalogIssues(c, pasts) {
  const issues = [];
  for (const e of c.collections.pasts) {
    const rule = pasts.find((p) => p.name.toLocaleLowerCase("pt-BR") === e.fields.name.trim().toLocaleLowerCase("pt-BR"));
    if (!rule) {
      if (e.fields.name) issues.push("Passado " + e.fields.name + ": confira as op\xE7\xF5es na regra ou registre a aprova\xE7\xE3o de uma op\xE7\xE3o personalizada.");
      continue;
    }
    if (rule.recovery.length && !rule.recovery.includes(e.fields.recovery)) issues.push(rule.name + ": recupera\xE7\xE3o deve ser " + rule.recovery.join(" ou ") + ".");
    const chosen = e.fields.skills.split("\n").map((s) => s.trim()).filter(Boolean);
    if (new Set(chosen).size !== chosen.length) issues.push(rule.name + ": n\xE3o repita a mesma Per\xEDcia.");
    for (const skill of chosen) if (!rule.skills.some((s) => s.toLocaleLowerCase("pt-BR") === skill.toLocaleLowerCase("pt-BR"))) issues.push(rule.name + ": " + skill + " n\xE3o consta entre as op\xE7\xF5es de Per\xEDcias.");
  }
  return issues;
}
export {
  catalogIssues,
  pastCatalog
};
