// Live Polymarket market data via the public Gamma API.
// Docs: https://docs.polymarket.com/getting-started/api

const GAMMA_API = "https://gamma-api.polymarket.com";

function safeJson(value) {
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

function getMarketTitle(raw) {
  return (
    raw.question ||
    raw.title ||
    raw.market?.question ||
    raw.market?.title ||
    raw.slug ||
    ""
  );
}

function getEventTitle(raw) {
  return (
    raw.eventTitle ||
    raw.seriesTitle ||
    raw.groupItemTitle ||
    raw.event?.title ||
    raw.market?.eventTitle ||
    "Polymarket event"
  );
}

function getOutcomePrices(raw) {
  const prices =
    raw.outcomePrices ??
    raw.market?.outcomePrices ??
    raw.bestAsk ??
    raw.lastTradePrice ??
    0.5;

  if (Array.isArray(prices)) return prices;
  if (typeof prices === "string") return safeJson(prices);

  return [prices, 1 - Number(prices)];
}

function normaliseMarket(raw, index) {
  const prices = getOutcomePrices(raw);
  const yes = clampProbability(prices[0]);
  const no = clampProbability(
    Number.isFinite(Number(prices[1])) ? prices[1] : 1 - yes
  );

  const volume = Number(
    raw.volume ??
    raw.volumeNum ??
    raw.market?.volume ??
    0
  );

  const closed =
    raw.closed === true ||
    raw.active === false ||
    raw.market?.closed === true;

  return {
    id: String(raw.id || raw.slug || raw.market?.id || `polymarket-${index}`),
    platform: "polymarket",
    event: getEventTitle(raw),
    market: getMarketTitle(raw) || `Polymarket market ${index + 1}`,
    yes,
    no,
    change24h: Number(
      raw.change24h ??
      raw.oneDayPriceChange ??
      raw.market?.change24h ??
      0
    ),
    volume,
    status: closed ? "closed" : "live",
    raw
  };
}

function extractMarkets(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.markets)) return payload.markets;
  if (Array.isArray(payload?.results)) return payload.results;

  return [];
}

async function fetchPolymarketMarkets(limit = 50) {
  const url = `${GAMMA_API}/markets?closed=false&limit=${limit}`;

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
  const status = document.getElementById("data-source");

  try {
    const markets = await fetchPolymarketMarkets(50);

    state.markets = markets;

    if (status) {
      status.textContent = `Live Polymarket data • ${markets.length} markets`;
      status.className = "source live";
    }
  } catch (error) {
    state.markets = MARKETS.map((market) => ({ ...market }));

    if (status) {
      status.textContent = "Using sample data • Polymarket request unavailable";
      status.className = "source fallback";
    }

    console.warn("Polymarket Gamma API unavailable:", error);
  }

  renderMarkets();
  populateMarkets();
}

window.addEventListener("load", loadLiveMarkets);