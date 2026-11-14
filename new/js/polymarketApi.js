const GAMMA_API = "https://gamma-api.polymarket.com";

function parseJsonString(value) {
  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
}

function clampProbability(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) return 0.5;

  return Math.min(0.99, Math.max(0.01, number));
}

function extractMarkets(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.markets)) return payload.markets;
  if (Array.isArray(payload?.results)) return payload.results;

  return [];
}

function normaliseMarket(raw, index) {
  const outcomes =
    Array.isArray(raw.outcomes)
      ? raw.outcomes
      : parseJsonString(raw.outcomes);

  const prices =
    Array.isArray(raw.outcomePrices)
      ? raw.outcomePrices
      : parseJsonString(raw.outcomePrices);

  const yes = clampProbability(prices[0] ?? raw.lastTradePrice ?? 0.5);
  const no = clampProbability(
    Number.isFinite(Number(prices[1])) ? prices[1] : 1 - yes
  );

  return {
    id: String(raw.id || raw.slug || `polymarket-${index}`),
    platform: "polymarket",
    event: raw.eventTitle || raw.seriesTitle || raw.groupItemTitle || "Polymarket",
    market: raw.question || raw.title || raw.slug || `Polymarket market ${index + 1}`,
    yes,
    no,
    change24h: Number(raw.oneDayPriceChange ?? raw.change24h ?? 0),
    volume: Number(raw.volume ?? raw.volumeNum ?? 0),
    status: raw.closed === true || raw.active === false ? "closed" : "live",
    raw
  };
}

async function fetchPolymarketMarkets(limit = 500) {
  const url = `${GAMMA_API}/markets?closed=false&limit=${limit}&order=volumeNum&ascending=false`;

  const response = await fetch(url, {
    headers: {
      Accept: "application/json"
    }
  });

  if (!response.ok) {
    throw new Error(`Gamma API returned ${response.status}`);
  }

  const payload = await response.json();
  const markets = extractMarkets(payload);

  if (!markets.length) {
    console.log("Gamma API response:", payload);
    throw new Error("Gamma returned no market records");
  }

  return markets.map(normaliseMarket);
}

async function loadLiveMarkets() {
  const status = $("data-source");

  try {
    const markets = await fetchPolymarketMarkets(50);

    state.markets = markets;
    renderMarkets();
    populateMarketSelector();
    renderAlerts();

    status.textContent = `Live Polymarket data • ${markets.length} markets`;
    status.className = "source live";
  } catch (error) {
    console.error("Polymarket Gamma API unavailable:", error);

    status.textContent = "Live Polymarket data unavailable";
    status.className = "source fallback";
  }
}

window.addEventListener("load", loadLiveMarkets);