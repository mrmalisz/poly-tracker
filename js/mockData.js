const GAME_KEYWORDS = {
  cs2:["cs2","counter-strike","counter strike","csgo","cs:go","iem","blast premier","esl pro league","pgl major","major"],
  dota2:["dota 2","dota2","dota","the international","dreamleague","esl one"],
  lol:["league of legends","lol","lck","lpl","lec","lcs","worlds","msi"],
  valorant:["valorant","vct","champions","masters"]
};

const MARKETS = {
  cs2:[
    {id:"pm-cs-01",platform:"polymarket",event:"IEM Katowice",market:"NAVI to beat FaZe",yes:.62,no:.38,change24h:.041,volume:184320,status:"live",startsInMinutes:35},
    {id:"pm-cs-02",platform:"polymarket",event:"BLAST Premier",market:"Vitality to win Group A",yes:.48,no:.52,change24h:-.028,volume:96140,status:"live",startsInMinutes:180},
    {id:"pm-cs-03",platform:"polymarket",event:"IEM Katowice",market:"MOUZ to beat Falcons",yes:.71,no:.29,change24h:.018,volume:42310,status:"live",startsInMinutes:520},
    {id:"ks-cs-01",platform:"kalshi",event:"PGL Major",market:"Spirit to win championship",yes:.27,no:.73,change24h:-.015,volume:143760,status:"live",startsInMinutes:1440}
  ],
  dota2:[
    {id:"pm-dota-01",platform:"polymarket",event:"DreamLeague",market:"Team Spirit to beat Gaimin Gladiators",yes:.58,no:.42,change24h:.092,volume:74210,status:"live",startsInMinutes:45},
    {id:"pm-dota-02",platform:"polymarket",event:"ESL One",market:"Tundra to qualify",yes:.31,no:.69,change24h:-.041,volume:31870,status:"live",startsInMinutes:260}
  ],
  lol:[
    {id:"pm-lol-01",platform:"polymarket",event:"LCK",market:"T1 to beat Gen.G",yes:.54,no:.46,change24h:.067,volume:88450,status:"live",startsInMinutes:55},
    {id:"pm-lol-02",platform:"polymarket",event:"LEC",market:"G2 to reach final",yes:.38,no:.62,change24h:-.022,volume:41230,status:"live",startsInMinutes:610}
  ],
  valorant:[
    {id:"pm-val-01",platform:"polymarket",event:"VCT",market:"Sentinels to beat Fnatic",yes:.47,no:.53,change24h:.081,volume:56980,status:"live",startsInMinutes:25},
    {id:"pm-val-02",platform:"polymarket",event:"VCT",market:"Paper Rex to win group",yes:.63,no:.37,change24h:-.034,volume:33410,status:"live",startsInMinutes:300}
  ]
};

const WALLET_ACTIVITY = [
  {wallet:"0x8f21...a4c9",label:"Sharp bettor",market:"NAVI to beat FaZe",side:"YES",amount:4200,platform:"Polymarket",time:"2m ago"},
  {wallet:"0x71bd...9e12",label:"Whale",market:"Spirit to win championship",side:"NO",amount:18500,platform:"Kalshi",time:"11m ago"},
  {wallet:"0x2c88...77d1",label:"Market maker",market:"G2 to reach final",side:"YES",amount:960,platform:"Kalshi",time:"26m ago"}
];