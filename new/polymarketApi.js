// Live Polymarket market data via the public Gamma API.
// Docs: https://docs.polymarket.com/getting-started/api
const GAMMA_API = "https://gamma-api.polymarket.com";

function safeJson(value){try{return JSON.parse(value);}catch{return [];}}
function clampProbability(value){const n=Number(value);if(!Number.isFinite(n))return .5;return Math.min(.99,Math.max(.01,n));}

function normaliseMarket(raw,index){
  const outcomes=Array.isArray(raw.outcomes)?raw.outcomes:typeof raw.outcomes==="string"?safeJson(raw.outcomes):[];
  let prices=Array.isArray(raw.outcomePrices)?raw.outcomePrices:typeof raw.outcomePrices==="string"?safeJson(raw.outcomePrices):[];
  const yes=Number(prices[0]??raw.bestAsk??.5);
  const no=Number(prices[1]??1-yes);
  const volume=Number(raw.volume??raw.volumeNum??0);
  const closed=raw.closed===true||raw.active===false;
  return{id:raw.id||raw.slug||`polymarket-${index}`,platform:"polymarket",event:raw.eventTitle||raw.seriesTitle||raw.groupItemTitle||"Polymarket event",market:raw.question||raw.title||raw.slug||"Untitled market",yes:clampProbability(yes),no:clampProbability(Number.isFinite(no)?no:1-yes),change24h:Number(raw.change24h??raw.oneDayPriceChange??0),volume,status:closed?"closed":"live",raw};
}

async function fetchPolymarketMarkets(limit=50){
  const url=`${GAMMA_API}/markets?closed=false&limit=${limit}`;
  const response=await fetch(url,{headers:{Accept:"application/json"}});
  if(!response.ok)throw new Error(`Gamma API returned ${response.status}`);
  const payload=await response.json();
  const markets=Array.isArray(payload)?payload:payload.data||[];
  return markets.map(normaliseMarket).filter(m=>m.market&&m.market!=="Untitled market");
}

async function loadLiveMarkets(){
  const status=document.getElementById("data-source");
  try{
    const markets=await fetchPolymarketMarkets(50);
    if(!markets.length)throw new Error("No markets returned");
    state.markets=markets;
    if(status){status.textContent=`Live Polymarket data • ${markets.length} markets`;status.className="source live";}
  }catch(error){
    state.markets=MARKETS.map(m=>({...m}));
    if(status){status.textContent="Using sample data • Polymarket request unavailable";status.className="source fallback";}
    console.warn("Polymarket Gamma API unavailable:",error);
  }
  renderMarkets();populateMarkets();
}

window.addEventListener("load",loadLiveMarkets);