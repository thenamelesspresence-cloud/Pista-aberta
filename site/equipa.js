// Página de equipa: lê ?equipa=slug, mostra dados fixos (equipas-data.js)
// e vai buscar pilotos, últimas corridas e head-to-head à API Jolpica (Ergast).
const EPOCA = new Date().getFullYear();            // 2026
const API = `https://api.jolpi.ca/ergast/f1/${EPOCA}`;

const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const $ = id => document.getElementById(id);
const iniciais = n => n.split(" ").map(p => p[0]).join("").slice(0, 2).toUpperCase();
const curto = n => n.replace("Grand Prix", "GP");
const val = v => (v === null || v === undefined ? "—" : v);

const slug = new URLSearchParams(location.search).get("equipa");
const t = EQUIPAS.find(e => e.slug === slug);

if (!t) {
  document.querySelector("main").innerHTML = '<p class="erro" style="padding:48px 0">Equipa não encontrada. <a href="equipas.html">Voltar às equipas</a></p>';
} else {
  document.documentElement.style.setProperty("--team", t.cor);
  document.title = `${t.nome} · Pista Aberta`;
  $("nome").textContent = t.nome;
  $("logo").innerHTML = `<img src="img/logos/${esc(t.slug)}.svg" alt="Logótipo ${esc(t.nome)}"
      onerror="this.replaceWith(document.createTextNode('${iniciais(t.nome)}'))">`;
  $("historia").textContent = t.historia;

  $("identidade").innerHTML = `
    <div><span>Títulos de construtores</span><strong class="num">${val(t.titulos)}</strong></div>
    <div><span>Vitórias</span><strong class="num">${val(t.vitorias)}</strong></div>
    <div><span>Pole positions</span><strong class="num">${val(t.poles)}</strong></div>
    <div><span>Sede</span><strong>${esc(t.sede)}</strong></div>
    <div><span>Chefe de equipa</span><strong>${esc(t.chefe)}</strong></div>
    <div><span>Motor</span><strong>${esc(t.motor)}</strong></div>`;

  carregarDados();
}

async function pedir(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(r.status);
  return (await r.json()).MRData;
}

async function carregarDados() {
  // mostra já os pilotos do ficheiro de dados enquanto a API responde
  $("pilotos").innerHTML = t.pilotos.map(n => `<div class="piloto"><h3>${esc(n)}</h3><div class="sub">A carregar resultados…</div></div>`).join("");

  try {
    const [st, res, qua] = await Promise.all([
      pedir(`${API}/constructors/${t.apiId}/driverStandings.json`),
      pedir(`${API}/constructors/${t.apiId}/results.json?limit=100`),
      pedir(`${API}/constructors/${t.apiId}/qualifying.json?limit=100`)
    ]);

    const tabela = st.StandingsTable.StandingsLists[0]?.DriverStandings || [];
    const corridas = res.RaceTable.Races || [];
    const qualis = qua.RaceTable.Races || [];

    if (!tabela.length) throw new Error("Sem resultados ainda");

    // os dois pilotos com mais pontos (ignora suplentes)
    const pilotos = tabela.slice(0, 2).map(d => ({
      id: d.Driver.driverId,
      nome: `${d.Driver.givenName} ${d.Driver.familyName}`,
      pontos: Number(d.points),
      pos: d.position,
      vitorias: d.wins
    }));

    // --- cartões dos pilotos com últimas 5 corridas ---
    $("pilotos").innerHTML = pilotos.map(p => {
      const ultimas = corridas.slice(-5).reverse().map(c => {
        const r = c.Results.find(x => x.Driver.driverId === p.id);
        return r ? { gp: curto(c.raceName), pos: r.position, txt: r.positionText, pts: r.points } : null;
      }).filter(Boolean);
      return `<div class="piloto">
        <h3>${esc(p.nome)}</h3>
        <div class="sub">${esc(p.pos)}.º no campeonato · ${p.pontos} pts · ${esc(p.vitorias)} vitória(s)</div>
        <div class="chips">${ultimas.map(u => `
          <div class="chip ${Number(u.pts) > 0 ? "pts-sim" : ""}"><b>${/^\d+$/.test(u.txt) ? "P" + esc(u.pos) : esc(u.txt)}</b>${esc(u.gp)}</div>`).join("") || "Sem corridas ainda"}
        </div>
      </div>`;
    }).join("");

    // --- head-to-head ---
    if (pilotos.length < 2) throw new Error("Só um piloto");
    const [A, B] = pilotos;

    const duelo = (lista, campo) => {
      let a = 0, b = 0;
      lista.forEach(c => {
        const ra = c[campo].find(x => x.Driver.driverId === A.id);
        const rb = c[campo].find(x => x.Driver.driverId === B.id);
        if (ra && rb) { Number(ra.position) < Number(rb.position) ? a++ : b++; }
      });
      return [a, b];
    };
    const [qa, qb] = duelo(qualis, "QualifyingResults");
    const [ra, rb] = duelo(corridas, "Results");

    const linha = (titulo, x, y) => {
      const total = x + y || 1;
      return `<div class="h2h-linha">
        <div class="titulo"><b>${x}</b><span>${titulo}</span><b>${y}</b></div>
        <div class="barra"><div class="a" style="width:${(x / total) * 100}%"></div><div class="b" style="width:${(y / total) * 100}%"></div></div>
      </div>`;
    };

    $("h2h").innerHTML = `
      <div class="h2h-nomes"><span style="color:var(--team)">${esc(A.nome)}</span><span>${esc(B.nome)}</span></div>
      ${linha("Qualificações", qa, qb)}
      ${linha("Corridas", ra, rb)}
      ${linha("Pontos totais", A.pontos, B.pontos)}
      <div class="nota">Época ${EPOCA}. Em cada sessão ganha quem terminou à frente do companheiro de equipa (só conta quando ambos participaram).</div>`;
  } catch (e) {
    $("h2h").innerHTML = '<p class="erro">Ainda não há dados desta equipa na API (ou não foi possível carregar). Confirma o <code>apiId</code> em equipas-data.js.</p>';
    $("pilotos").innerHTML = t.pilotos.map(n => `<div class="piloto"><h3>${esc(n)}</h3><div class="sub">Resultados indisponíveis</div></div>`).join("");
  }
}

}
