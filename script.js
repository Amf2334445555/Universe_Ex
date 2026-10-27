
"use strict";

// NASA API KEY
// Substitua DEMO_KEY pela sua chave da NASA.
// Não publique uma chave pessoal em um repositório público.
const NASA_API_KEY = "WhF8GtwPtKcGrCrLPBk6FcqHF7RzBnCRzDjmjFPH";

const NASA_API = "https://api.nasa.gov";
const NASA_IMAGES = "https://images-api.nasa.gov";

// --------------------------------------------------
// NAVEGAÇÃO ENTRE TELAS
// --------------------------------------------------

const pages = document.querySelectorAll(".page");
const navLinks = document.querySelectorAll(".nav-link");
const navigation = document.getElementById("navigation");
const menuToggle = document.getElementById("menu-toggle");

function showPage(pageId) {
  const target = document.getElementById(pageId);
  if (!target) return;

  pages.forEach(page => {
    page.classList.toggle("active", page.id === pageId);
  });

  navLinks.forEach(link => {
    const active = link.dataset.page === pageId;
    link.classList.toggle("active", active);

    if (active) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });

  navigation.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  window.scrollTo({ top: 0, behavior: "smooth" });

  if (pageId === "asteroids") loadAsteroids();
}

navLinks.forEach(link => {
  link.addEventListener("click", () => showPage(link.dataset.page));
});

document.querySelectorAll("[data-go]").forEach(button => {
  button.addEventListener("click", () => showPage(button.dataset.go));
});

document.querySelectorAll("[data-page]").forEach(link => {
  if (!link.classList.contains("nav-link")) {
    link.addEventListener("click", event => {
      event.preventDefault();
      showPage(link.dataset.page);
    });
  }
});

menuToggle.addEventListener("click", () => {
  const isOpen = navigation.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

// --------------------------------------------------
// IMAGEM ASTRONÔMICA DO DIA - NASA APOD
// --------------------------------------------------

const apodImage = document.getElementById("apod-image");
const apodPlaceholder = document.getElementById("apod-placeholder");

async function loadAPOD() {
  const title = document.getElementById("apod-title");
  const description = document.getElementById("apod-description");
  const date = document.getElementById("apod-date");
  const link = document.getElementById("apod-link");

  try {
    const response = await fetch(
      `${NASA_API}/planetary/apod?api_key=${NASA_API_KEY}`
    );

    if (!response.ok) {
      throw new Error("Não foi possível consultar a API APOD.");
    }

    const data = await response.json();

    title.textContent = data.title || "Imagem astronômica";
    description.textContent =
      data.explanation || "Descrição não disponível.";
    date.textContent = data.date
      ? `REGISTRO ASTRONÔMICO / ${data.date}`
      : "REGISTRO ASTRONÔMICO";

    link.href = data.hdurl || data.url ||
      "https://apod.nasa.gov/apod/astropix.html";

    if (data.media_type === "image" && data.url) {
      apodImage.src = data.url;
      apodImage.alt = data.title || "Imagem astronômica da NASA";
      apodImage.hidden = false;
      apodPlaceholder.hidden = true;

      apodImage.onerror = () => {
        apodPlaceholder.hidden = false;
        apodPlaceholder.textContent =
          "A imagem não pôde ser carregada. Consulte a fonte da NASA.";
        apodImage.hidden = true;
      };
    } else {
      apodImage.hidden = true;
      apodPlaceholder.hidden = false;
      apodPlaceholder.textContent =
        "O registro de hoje é um vídeo ou outro tipo de mídia. " +
        "Use o link da NASA para visualizá-lo.";
    }
  } catch (error) {
    console.error(error);
    title.textContent = "Observatório temporariamente indisponível";
    description.textContent =
      "Verifique sua conexão, a chave da API ou tente novamente mais tarde.";
    apodPlaceholder.textContent =
      "Não foi possível carregar a imagem.";
    link.href = "https://apod.nasa.gov/apod/astropix.html";
  }
}

// --------------------------------------------------
// PLANETAS DO SISTEMA SOLAR
// --------------------------------------------------

const planets = [
  {
    name: "Mercúrio",
    type: "PLANETA ROCHOSO • 1º A PARTIR DO SOL",
    query: "Mercury planet NASA Mariner",
    color: "#a7a9ad",
    description:
      "Mercúrio é o menor planeta do Sistema Solar e o mais próximo do Sol. " +
      "Sua superfície é marcada por crateras e suas temperaturas variam bastante.",
    facts: [
      ["Diâmetro", "4.879 km"],
      ["Duração do ano", "88 dias terrestres"],
      ["Tipo", "Rochoso"],
      ["Luas conhecidas", "0"]
    ],
    source: "https://science.nasa.gov/mercury/"
  },
  {
    name: "Vênus",
    type: "PLANETA ROCHOSO • 2º A PARTIR DO SOL",
    query: "Venus planet NASA Magellan",
    color: "#e8bd82",
    description:
      "Vênus possui uma atmosfera muito densa, rica em dióxido de carbono. " +
      "O intenso efeito estufa torna sua superfície a mais quente entre os planetas.",
    facts: [
      ["Diâmetro", "12.104 km"],
      ["Duração do ano", "225 dias terrestres"],
      ["Tipo", "Rochoso"],
      ["Luas conhecidas", "0"]
    ],
    source: "https://science.nasa.gov/venus/"
  },
  {
    name: "Terra",
    type: "PLANETA ROCHOSO • 3º A PARTIR DO SOL",
    query: "Earth planet NASA Blue Marble",
    color: "#3e91ff",
    description:
      "A Terra possui água líquida abundante na superfície e, até onde sabemos, " +
      "é o único mundo com vida confirmada. Sua atmosfera ajuda a regular o clima.",
    facts: [
      ["Diâmetro", "12.742 km"],
      ["Duração do ano", "365,25 dias"],
      ["Tipo", "Rochoso"],
      ["Luas conhecidas", "1"]
    ],
    source: "https://science.nasa.gov/earth/"
  },
  {
    name: "Marte",
    type: "PLANETA ROCHOSO • 4º A PARTIR DO SOL",
    query: "Mars planet NASA rover global",
    color: "#e76e4c",
    description:
      "Marte é conhecido por sua aparência avermelhada, causada por minerais ricos " +
      "em ferro. Missões robóticas investigam sua geologia e a possibilidade de ter " +
      "abrigado ambientes favoráveis à vida microbiana no passado.",
    facts: [
      ["Diâmetro", "6.779 km"],
      ["Duração do ano", "687 dias terrestres"],
      ["Tipo", "Rochoso"],
      ["Luas conhecidas", "2"]
    ],
    source: "https://science.nasa.gov/mars/"
  },
  {
    name: "Júpiter",
    type: "GIGANTE GASOSO • 5º A PARTIR DO SOL",
    query: "Jupiter planet NASA Juno",
    color: "#d5a77e",
    description:
      "Júpiter é o maior planeta do Sistema Solar. Sua atmosfera apresenta faixas " +
      "de nuvens e grandes tempestades, incluindo a Grande Mancha Vermelha.",
    facts: [
      ["Diâmetro", "139.820 km"],
      ["Duração do ano", "11,86 anos terrestres"],
      ["Tipo", "Gigante gasoso"],
      ["Luas conhecidas", "95*"]
    ],
    source: "https://science.nasa.gov/jupiter/"
  },
  {
    name: "Saturno",
    type: "GIGANTE GASOSO • 6º A PARTIR DO SOL",
    query: "Saturn planet NASA Cassini rings",
    color: "#e9d39c",
    description:
      "Saturno é famoso por seu extenso sistema de anéis, formado principalmente " +
      "por partículas de gelo e fragmentos rochosos. É um gigante gasoso de baixa densidade.",
    facts: [
      ["Diâmetro", "116.460 km"],
      ["Duração do ano", "29,4 anos terrestres"],
      ["Tipo", "Gigante gasoso"],
      ["Luas conhecidas", "146*"]
    ],
    source: "https://science.nasa.gov/saturn/"
  },
  {
    name: "Urano",
    type: "GIGANTE DE GELO • 7º A PARTIR DO SOL",
    query: "Uranus planet NASA Voyager 2",
    color: "#80dce9",
    description:
      "Urano é um gigante de gelo com coloração azul-esverdeada associada ao metano " +
      "atmosférico. Seu eixo de rotação é extremamente inclinado em relação à sua órbita.",
    facts: [
      ["Diâmetro", "50.724 km"],
      ["Duração do ano", "84 anos terrestres"],
      ["Tipo", "Gigante de gelo"],
      ["Luas conhecidas", "28*"]
    ],
    source: "https://science.nasa.gov/uranus/"
  },
  {
    name: "Netuno",
    type: "GIGANTE DE GELO • 8º A PARTIR DO SOL",
    query: "Neptune planet NASA Voyager 2",
    color: "#477aff",
    description:
      "Netuno é o planeta mais distante do Sol entre os oito planetas. Sua atmosfera " +
      "apresenta ventos muito intensos e tempestades. A luz solar chega até ele muito fraca.",
    facts: [
      ["Diâmetro", "49.244 km"],
      ["Duração do ano", "165 anos terrestres"],
      ["Tipo", "Gigante de gelo"],
      ["Luas conhecidas", "16*"]
    ],
    source: "https://science.nasa.gov/neptune/"
  }
];

const planetSelector = document.getElementById("planet-selector");
const planetImage = document.getElementById("planet-image");
let planetImageRequest = 0;

function renderPlanetButtons() {
  planetSelector.replaceChildren();

  planets.forEach((planet, index) => {
    const button = document.createElement("button");
    button.className = "planet-option";
    button.type = "button";
    button.dataset.index = String(index);

    const symbol = document.createElement("span");
    symbol.className = "planet-symbol";
    symbol.style.background = planet.color;
    symbol.setAttribute("aria-hidden", "true");

    const name = document.createElement("span");
    name.textContent = planet.name;

    button.append(symbol, name);
    button.addEventListener("click", () => selectPlanet(index));
    planetSelector.appendChild(button);
  });

  selectPlanet(2);
}

async function selectPlanet(index) {
  const planet = planets[index];
  if (!planet) return;

  planetSelector.querySelectorAll(".planet-option").forEach((button, i) => {
    const active = i === index;
    button.classList.toggle("active", active);
    if (active) {
      button.setAttribute("aria-current", "true");
    } else {
      button.removeAttribute("aria-current");
    }
  });

  document.getElementById("planet-name").textContent = planet.name;
  document.getElementById("planet-type").textContent = planet.type;
  document.getElementById("planet-description").textContent =
    planet.description;
  document.getElementById("planet-source").href = planet.source;

  const factsContainer = document.getElementById("planet-facts");
  factsContainer.replaceChildren();

  planet.facts.forEach(([label, value]) => {
    const item = document.createElement("div");
    item.className = "fact";

    const labelElement = document.createElement("span");
    labelElement.textContent = label;

    const valueElement = document.createElement("strong");
    valueElement.textContent = value;

    item.append(labelElement, valueElement);
    factsContainer.appendChild(item);
  });

  // Cada clique invalida a busca anterior para evitar imagens trocadas.
  const requestId = ++planetImageRequest;
  planetImage.alt = `Imagem de referência de ${planet.name}`;
  planetImage.removeAttribute("src");

  try {
    const url = new URL(`${NASA_IMAGES}/search`);
    url.searchParams.set("q", planet.query);
    url.searchParams.set("media_type", "image");
    url.searchParams.set("page_size", "10");

    const response = await fetch(url);

    if (!response.ok) throw new Error("Busca de imagem indisponível.");

    const data = await response.json();
    const items = data.collection?.items || [];

    // Prefere imagens cujo título menciona o planeta pesquisado.
    const planetName = planet.name.toLowerCase();
    const match = items.find(item =>
      (item.data?.[0]?.title || "").toLowerCase().includes(planetName)
    ) || items.find(item => item.links?.some(link => link.rel === "preview"));

    const imageUrl = match?.links?.find(link =>
      link.rel === "preview" && /^https?:\/\//i.test(link.href)
    )?.href;

    if (requestId !== planetImageRequest) return;

    if (imageUrl) {
      planetImage.src = imageUrl;
    } else {
      planetImage.alt = `Imagem indisponível para ${planet.name}`;
    }
  } catch (error) {
    console.error(error);
    if (requestId === planetImageRequest) {
      planetImage.alt =
        `Não foi possível carregar a imagem de ${planet.name}.`;
    }
  }
}

// --------------------------------------------------
// GALERIA DE IMAGENS E VÍDEOS DA NASA
// --------------------------------------------------

const galleryForm = document.getElementById("gallery-form");
const galleryInput = document.getElementById("gallery-search");
const galleryResults = document.getElementById("gallery-results");
const galleryStatus = document.getElementById("gallery-status");

galleryForm.addEventListener("submit", async event => {
  event.preventDefault();

  const query = galleryInput.value.trim();
  if (!query) return;

  galleryResults.replaceChildren();
  galleryStatus.textContent = "Pesquisando no arquivo da NASA...";

  try {
    const url = new URL(`${NASA_IMAGES}/search`);
    url.searchParams.set("q", query);
    url.searchParams.set("media_type", "image");
    url.searchParams.set("page_size", "12");

    const response = await fetch(url);

    if (!response.ok) throw new Error("Falha na pesquisa.");

    const data = await response.json();
    const items = data.collection?.items || [];

    if (items.length === 0) {
      galleryStatus.textContent =
        "Nenhuma imagem encontrada. Tente outro termo.";
      return;
    }

    let count = 0;

    items.forEach(item => {
      const metadata = item.data?.[0];
      const imageUrl = item.links?.find(link =>
        link.rel === "preview" &&
        /^https?:\/\//i.test(link.href)
      )?.href;

      if (!metadata || !imageUrl) return;

      const card = document.createElement("article");
      card.className = "gallery-card";

      const image = document.createElement("img");
      image.src = imageUrl;
      image.alt = metadata.title || "Imagem espacial da NASA";
      image.loading = "lazy";

      const copy = document.createElement("div");
      copy.className = "gallery-card-copy";

      const title = document.createElement("h3");
      title.textContent = metadata.title || "Imagem sem título";

      const description = document.createElement("p");
      description.textContent =
        (metadata.description || "Descrição não disponível.")
          .replace(/\s+/g, " ")
          .slice(0, 190);

      const source = document.createElement("a");
      source.href = metadata.nasa_id
        ? `https://images.nasa.gov/details/${encodeURIComponent(metadata.nasa_id)}`
        : "https://images.nasa.gov/";
      source.target = "_blank";
      source.rel = "noopener noreferrer";
      source.textContent = "Abrir registro ↗";

      copy.append(title, description, source);
      card.append(image, copy);
      galleryResults.appendChild(card);
      count++;
    });

    galleryStatus.textContent = count
      ? `${count} resultado(s) exibido(s) para "${query}".`
      : "Foram encontrados registros, mas não havia imagens de prévia disponíveis.";
  } catch (error) {
    console.error(error);
    galleryStatus.textContent =
      "Não foi possível consultar a galeria. Verifique sua conexão e tente novamente.";
  }
});

// --------------------------------------------------
// ASTEROIDES PRÓXIMOS DA TERRA - NASA NEOWS
// --------------------------------------------------

const asteroidResults = document.getElementById("asteroid-results");
const asteroidStatus = document.getElementById("asteroid-status");
const asteroidRefresh = document.getElementById("asteroid-refresh");

function formatNumber(value, decimals = 0) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "Não disponível";

  return new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits: decimals
  }).format(number);
}

async function loadAsteroids() {
  asteroidStatus.textContent = "Consultando dados da NASA...";
  asteroidResults.replaceChildren();
  asteroidRefresh.disabled = true;

  try {
    const now = new Date();
    const start = now.toISOString().slice(0, 10);
    const endDate = new Date(now);
    endDate.setUTCDate(endDate.getUTCDate() + 2);
    const end = endDate.toISOString().slice(0, 10);

    const url = new URL(`${NASA_API}/neo/rest/v1/feed`);
    url.searchParams.set("start_date", start);
    url.searchParams.set("end_date", end);
    url.searchParams.set("api_key", NASA_API_KEY);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Falha ao consultar os dados de asteroides.");
    }

    const data = await response.json();
    const dates = data.near_earth_objects || {};
    const objects = Object.values(dates).flat();

    if (!objects.length) {
      asteroidStatus.textContent =
        "Não há registros disponíveis para o período consultado.";
      return;
    }

    // Ordena pela distância de aproximação nominal, em quilômetros.
    objects.sort((a, b) => {
      const distanceA = Number(
        a.close_approach_data?.[0]?.miss_distance?.kilometers
      );
      const distanceB = Number(
        b.close_approach_data?.[0]?.miss_distance?.kilometers
      );

      return distanceA - distanceB;
    });

    objects.slice(0, 20).forEach(object => {
      const row = document.createElement("tr");
      const diameter = object.estimated_diameter?.kilometers;
      const approach = object.close_approach_data?.[0];
      const distance = approach?.miss_distance?.kilometers;
      const velocity =
        approach?.relative_velocity?.kilometers_per_hour;

      const minDiameter = diameter?.estimated_diameter_min;
      const maxDiameter = diameter?.estimated_diameter_max;
      const diameterText =
        Number.isFinite(minDiameter) && Number.isFinite(maxDiameter)
          ? `${formatNumber(minDiameter * 1000, 1)}–${formatNumber(maxDiameter * 1000, 1)} m`
          : "Não disponível";

      const values = [
        object.name || "Objeto sem nome",
        diameterText,
        velocity
          ? `${formatNumber(velocity, 0)} km/h`
          : "Não disponível",
        distance
          ? `${formatNumber(Number(distance), 0)} km`
          : "Não disponível"
      ];

      values.forEach(value => {
        const cell = document.createElement("td");
        cell.textContent = value;
        row.appendChild(cell);
      });

      const riskCell = document.createElement("td");
      const risk = Boolean(object.is_potentially_hazardous_asteroid);
      riskCell.textContent = risk ? "Classificado como potencialmente perigoso" : "Não classificado assim";
      riskCell.className = risk ? "status-danger" : "status-safe";
      row.appendChild(riskCell);

      asteroidResults.appendChild(row);
    });

    asteroidStatus.textContent =
      `${objects.length} objeto(s) encontrados entre ${start} e ${end}. ` +
      "A tabela mostra até 20 registros ordenados pela distância nominal.";
  } catch (error) {
    console.error(error);
    asteroidStatus.textContent =
      "Não foi possível carregar os asteroides. Confira a chave da API e tente novamente.";
  } finally {
    asteroidRefresh.disabled = false;
  }
}

asteroidRefresh.addEventListener("click", loadAsteroids);

// --------------------------------------------------
// INICIALIZAÇÃO
// --------------------------------------------------

renderPlanetButtons();
loadAPOD();
