// Dados das equipas de F1 (grelha de 2026).
// cor = cor da equipa | apiId = id da equipa na API Jolpica/Ergast (confirma se algum não carregar)
// vitorias e poles estão a null: preenche à mão com números confirmados (aparece "—" enquanto estiver null).
window.EQUIPAS = [
  {
    nome: "Alpine", slug: "alpine", cor: "#2293D1", apiId: "alpine",
    motor: "Mercedes", sede: "Enstone, Reino Unido", chefe: "Steve Nielsen (diretor-geral)",
    titulos: 2, vitorias: null, poles: null,
    historia: "A base de Enstone tem uma longa tradição na F1, passando por Benetton, Renault e Lotus. Os dois títulos de construtores (2005 e 2006) foram conquistados como Renault, com Fernando Alonso. Desde 2021 corre com o nome Alpine.",
    pilotos: ["Pierre Gasly", "Franco Colapinto"]
  },
  {
    nome: "Aston Martin", slug: "aston-martin", cor: "#229971", apiId: "aston_martin",
    motor: "Honda", sede: "Silverstone, Reino Unido", chefe: "Adrian Newey",
    titulos: 0, vitorias: null, poles: null,
    historia: "A estrutura nasceu como Jordan em 1991 e passou por Midland, Spyker, Force India e Racing Point, até se tornar Aston Martin em 2021. Em 2026 inicia uma nova era com motores Honda.",
    pilotos: ["Fernando Alonso", "Lance Stroll"]
  },
  {
    nome: "Audi", slug: "audi", cor: "#F50537", apiId: "audi",
    motor: "Audi", sede: "Hinwil, Suíça (chassis) · Neuburg, Alemanha (motor)", chefe: "Jonathan Wheatley",
    titulos: 0, vitorias: null, poles: null,
    historia: "A Audi assumiu a estrutura da Sauber e estreia-se como construtor oficial em 2026, com motor próprio.",
    pilotos: ["Nico Hülkenberg", "Gabriel Bortoleto"]
  },
  {
    nome: "Cadillac", slug: "cadillac", cor: "#9CA3AF", apiId: "cadillac",
    motor: "Ferrari", sede: "Fishers, Indiana, EUA", chefe: "Graeme Lowdon",
    titulos: 0, vitorias: null, poles: null,
    historia: "A Cadillac, ligada à General Motors, é a equipa mais recente da grelha e estreia-se na F1 em 2026.",
    pilotos: ["Sergio Pérez", "Valtteri Bottas"]
  },
  {
    nome: "Ferrari", slug: "ferrari", cor: "#E8002D", apiId: "ferrari",
    motor: "Ferrari", sede: "Maranello, Itália", chefe: "Frédéric Vasseur",
    titulos: 16, vitorias: null, poles: null,
    historia: "A Scuderia Ferrari é a única equipa presente em todas as épocas do Mundial desde 1950 e a mais titulada de sempre entre os construtores.",
    pilotos: ["Charles Leclerc", "Lewis Hamilton"]
  },
  {
    nome: "Haas", slug: "haas", cor: "#D6D8DA", apiId: "haas",
    motor: "Ferrari", sede: "Kannapolis, Carolina do Norte, EUA", chefe: "Ayao Komatsu",
    titulos: 0, vitorias: null, poles: null,
    historia: "Fundada por Gene Haas, estreou-se na F1 em 2016 e foi a primeira equipa americana na categoria em décadas.",
    pilotos: ["Esteban Ocon", "Oliver Bearman"]
  },
  {
    nome: "McLaren", slug: "mclaren", cor: "#FF8000", apiId: "mclaren",
    motor: "Mercedes", sede: "Woking, Reino Unido", chefe: "Andrea Stella",
    titulos: 10, vitorias: null, poles: null,
    historia: "Fundada por Bruce McLaren em 1963, é uma das equipas mais históricas da F1, com eras marcantes de Senna, Prost, Hakkinen e Hamilton.",
    pilotos: ["Lando Norris", "Oscar Piastri"]
  },
  {
    nome: "Mercedes", slug: "mercedes", cor: "#27F4D2", apiId: "mercedes",
    motor: "Mercedes", sede: "Brackley (chassis) · Brixworth (motor), Reino Unido", chefe: "Toto Wolff",
    titulos: 8, vitorias: null, poles: null,
    historia: "Entre 2014 e 2021 conquistou oito títulos de construtores consecutivos, o maior domínio da história da categoria.",
    pilotos: ["George Russell", "Kimi Antonelli"]
  },
  {
    nome: "Racing Bulls", slug: "racing-bulls", cor: "#6692FF", apiId: "rb",
    motor: "Red Bull Ford", sede: "Faenza, Itália", chefe: "Alan Permane",
    titulos: 0, vitorias: null, poles: null,
    historia: "Herdeira da Minardi, correu como Toro Rosso e AlphaTauri antes de adotar o nome Racing Bulls. É a equipa júnior da Red Bull.",
    pilotos: ["Liam Lawson", "Arvid Lindblad"]
  },
  {
    nome: "Red Bull Racing", slug: "red-bull", cor: "#3671C6", apiId: "red_bull",
    motor: "Red Bull Ford", sede: "Milton Keynes, Reino Unido", chefe: "Laurent Mekies",
    titulos: 6, vitorias: null, poles: null,
    historia: "Comprou a estrutura da Jaguar em 2005 e tornou-se uma potência com Sebastian Vettel e Max Verstappen. Em 2026 estreia o seu motor próprio, com a Ford.",
    pilotos: ["Max Verstappen", "Isack Hadjar"]
  },
  {
    nome: "Williams", slug: "williams", cor: "#64C4FF", apiId: "williams",
    motor: "Mercedes", sede: "Grove, Reino Unido", chefe: "James Vowles",
    titulos: 9, vitorias: null, poles: null,
    historia: "Fundada em 1977 por Frank Williams e Patrick Head, dominou os anos 80 e 90 e está em fase de reconstrução.",
    pilotos: ["Alexander Albon", "Carlos Sainz"]
  }
];

// Mostra o logótipo da equipa dentro de "box".
// Procura img/logos/<slug>.svg, depois .png, .webp e .jpg. Se não houver nenhum, mostra as iniciais.
window.montarLogo = function (box, slug, nome) {
  var exts = ["svg", "png", "webp", "jpg"], i = 0;
  var ini = nome.split(" ").map(function (p) { return p[0]; }).join("").slice(0, 2).toUpperCase();
  var img = new Image();
  img.alt = "Logótipo " + nome;
  img.onload = function () { box.textContent = ""; box.classList.add("com-img"); box.appendChild(img); };
  img.onerror = function () {
    console.warn("Logótipo não encontrado: " + img.src);
    i++;
    if (i < exts.length) img.src = "img/logos/" + slug + "." + exts[i] + "?v=2";
  };
  box.textContent = ini;
  img.src = "img/logos/" + slug + "." + exts[0] + "?v=2";
};
