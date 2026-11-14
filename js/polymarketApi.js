// Live Polymarket market data via the public Gamma API.
// Docs: https://docs.polymarket.com/getting-started/api
const GAMMA_API = "https://gamma-api.polymarket.com";
const GAME_LABELS={cs2:"CS2",dota2:"Dota 2",lol:"League of Legends",valorant:"Valorant"};

function safeJson(value){try{return JSON.parse(value);}catch{return [];}}
function clampProbability(value){const n=Number(value);if(!Number.isFinite(n))return .5;return Math.min(.99,Math.max(.01,n));}

function detectGame(text){
  const value=(text||"").toLowerCase();
  if(/\b(cs2|counter[- ]?strike|csgo|cs:go|iem|blast premier|esl pro league|pgl major)\b/.test(value))return"cs2";
  if(/\b(dota\s?2|dota|the international|dreamleague|esl one)\b/.test(value))return"dota2";
  if(/\b(league of legends|lol|lck|lpl|lec|lcs|worlds|msi)\b/.test(value))return"lol";
  if(/\b(valorant|vct|champions tour)\b/.test(value))return"valorant";
  return null;
}

function startsInMinutes(raw){
  const value=raw.startDate||raw.start_date||raw.gameStartTime||raw.eventStartTime;
  if(!value)return null;
  const diff=(new Date(value).getTime()-Date.now())/60000;
  return Number.isFinite(diff)?Math.max(0,Math.round(diff)):null;
}

function normaliseMarket(raw,index){
  let prices=Array.isArray(raw.outcomePrices)?raw.outcomePrices:typeof raw.outcomePrices==="string"?safeJson(raw.outcomePrices):[];
  const yes=Number(prices[0]??raw.bestAsk??.5);
  const no=Number(prices[1]??1-yes);
  const volume=Number(raw.volume??raw.volumeNum??0);
  const closed=raw.closed===true||raw.active===false;
  const searchable=[raw.question,raw.title,raw.slug,raw.eventTitle,raw.seriesTitle,raw.groupItemTitle,raw.description].filter(Boolean).join(" ");
  return{id:raw.id||raw.slug||`polymarket-${index}`,platform:"polymarket",game:detectGame(searchable)||"other",event:raw.eventTitle||raw.seriesTitle||raw.groupItemTitle||"Polymarket event",market:raw.question||raw.title||raw.slug||"Untitled market",yes:clampProbability(yes),no:clampProbability(Number.isFinite(no)?no:1-yes),change24h:Number(raw.change24h??raw.oneDayPriceChange??0),volume,status:closed?"closed":"live",startsInMinutes:startsInMinutes(raw),raw};
}

async function fetchPolymarketMarkets(closed,limit=200){
  const url=`${GAMMA_API}/markets?closed=${closed}&limit=${limit}`;
  const response=await fetch(url,{headers:{Accept:"application/json"}});
  if(!response.ok)throw new Error(`Gamma API returned ${response.status}`);
  const payload=await response.json();
  const markets=Array.isArray(payload)?payload:payload.data||[];
  return markets.map(normaliseMarket).filter(m=>m.market&&m.market!=="Untitled market"&&m.game!=="other");
}

async function loadLiveMarkets(){
  const status=document.getElementById("data-source");
  try{
    const markets=await fetchPolymarketMarkets(state.archive);
    if(!markets.length)throw new Error("No matching markets returned");
    state.markets=markets;
    const gameName=GAME_LABELS[state.game];
    if(status){status.textContent=`Live Polymarket data • ${markets.filter(m=>m.game===state.game).length} ${gameName} markets`;status.className="source live";}
  }catch(error){
    state.markets=Object.entries(MARKETS).flatMap(([game,markets])=>markets.map(m=>({...m,game})));
    if(status){status.textContent="Using sample data • Polymarket request unavailable";status.className="source fallback";}
    console.warn("Polymarket Gamma API unavailable:",error);
  }
  renderMarkets();populateMarkets();
}

window.addEventListener("load",loadLiveMarkets);