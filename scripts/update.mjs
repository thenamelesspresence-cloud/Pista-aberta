// Atualiza site/data/weekends.json (calendário) e site/data/news.json (notícias).
// Precisa de Node 18+. Corre com: node scripts/update.mjs
import { readFile, writeFile } from "node:fs/promises";

const D = new URL("../site/data/", import.meta.url);
const ler = async (f) => JSON.parse(await readFile(new URL(f, D), "utf8"));
const gravar = (f, v) => writeFile(new URL(f, D), JSON.stringify(v, null, 2) + "\n");
const pedir = async (u) => {
  const r = await fetch(u, { headers: { "user-agent": "pista-aberta/1.0" } });
  if (!r.ok) throw new Error(u + " -> " + r.status);
  return r;
};
const decod = (s) => s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#039;|&apos;/g, "'")
  .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n)).replace(/&lt;/g, "<").replace(/&gt;/g, ">");

async function calendario() {
  const j = await (await pedir("https://api.jolpi.ca/ergast/f1/current.json")).json();
  const limite = Date.now() - 3 * 864e5;
  const SESSOES = [
    ["FirstPractice", "Treino Livre 1", 60], ["SecondPractice", "Treino Livre 2", 60],
    ["ThirdPractice", "Treino Livre 3", 60], ["SprintQualifying", "Qualificação Sprint", 45],
    ["Sprint", "Sprint", 30], ["Qualifying", "Qualificação", 60],
  ];
  const dia = new Intl.DateTimeFormat("pt-PT", { timeZone: "Europe/Lisbon", day: "numeric", month: "long" });
  const fins = [];
  for (const r of j.MRData.RaceTable.Races) {
    const sessoes = SESSOES.filter(([k]) => r[k]).map(([k, n, d]) => ({ n, t: `${r[k].date}T${r[k].time}`, d }));
    sessoes.push({ n: "Corrida", t: r.time ? `${r.date}T${r.time}` : null, d: 120, race: 1 });
    sessoes.sort((a, b) => (a.t || "9").localeCompare(b.t || "9"));
    if (Date.parse(r.date) < limite) continue;
    fins.push({
      gp: "GP " + r.raceName.replace(/ Grand Prix$/, ""),
      circuit: r.Circuit.circuitName,
      dates: `${dia.format(new Date(sessoes[0].t || r.date))} a ${dia.format(new Date(r.date))}`,
      sessions: sessoes,
    });
  }
  if (fins.length) await gravar("weekends.json", fins.slice(0, 3));
  console.log("Calendário:", fins.length, "fins de semana por vir");
}

async function noticias() {
  const feeds = await ler("feeds.json");
  const itens = [];
  const data = new Intl.DateTimeFormat("pt-PT", { timeZone: "Europe/Lisbon", day: "numeric", month: "short" });
  for (const f of feeds) {
    try {
      const xml = await (await pedir(f.url)).text();
      for (const m of xml.matchAll(/<item[\s>][\s\S]*?<\/item>/g)) {
        const campo = (tag) => {
          const x = m[0].match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
          return x ? x[1].replace(/<!\[CDATA\[|\]\]>/g, "").trim() : "";
        };
        const u = campo("link"), t = decod(campo("title")), d = Date.parse(campo("pubDate")) || 0;
        if (!/^https:\/\//.test(u) || !t) continue;
        if (f.filtro && !u.includes(f.filtro)) continue;
        itens.push({ t, u, d, nome: f.nome });
      }
    } catch (e) { console.warn("Feed falhou:", f.nome, e.message); }
  }
  if (!itens.length) return console.log("Notícias: nada novo, mantive o ficheiro anterior.");
  itens.sort((a, b) => b.d - a.d);
  await gravar("news.json", itens.slice(0, 12).map((i) => ({
    t: i.t, u: i.u, s: i.nome + (i.d ? " · " + data.format(new Date(i.d)) : ""),
  })));
  console.log("Notícias:", Math.min(itens.length, 12));
}

await calendario().catch((e) => console.warn("Calendário falhou:", e.message));
await noticias();
