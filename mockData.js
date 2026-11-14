const PLATFORMS = ["Polymarket", "Kalshi"];
const MARKETS = [
  {id:"pm-cs-01", platform:"polymarket", event:"IEM Katowice", market:"NAVI to beat FaZe", yes:0.62, no:0.38, change24h:0.041, volume:184320, status:"live"},
  {id:"pm-cs-02", platform:"polymarket", event:"BLAST Premier", market:"Vitality to win Group A", yes:0.48, no:0.52, change24h:-0.028, volume:96140, status:"live"},
  {id:"ks-cs-01", platform:"kalshi", event:"ESL Pro League", market:"G2 to reach final", yes:0.35, no:0.65, change24h:0.072, volume:51280, status:"live"},
  {id:"ks-cs-02", platform:"kalshi", event:"PGL Major", market:"Spirit to win championship", yes:0.27, no:0.73, change24h:-0.015, volume:143760, status:"live"},
  {id:"pm-cs-03", platform:"polymarket", event:"IEM Katowice", market:"MOUZ to beat Falcons", yes:0.71, no:0.29, change24h:0.018, volume:42310, status:"live"},
  {id:"ks-cs-03", platform:"kalshi", event:"BLAST Premier", market:"Astralis to qualify", yes:0.19, no:0.81, change24h:0.093, volume:28940, status:"closed"}
];
const WALLET_ACTIVITY = [
  {wallet:"0x8f21...a4c9", label:"Sharp bettor", market:"NAVI to beat FaZe", side:"YES", amount:4200, platform:"Polymarket", time:"2m ago"},
  {wallet:"0x71bd...9e12", label:"Whale", market:"Spirit to win championship", side:"NO", amount:18500, platform:"Kalshi", time:"11m ago"},
  {wallet:"0x2c88...77d1", label:"Market maker", market:"G2 to reach final", side:"YES", amount:960, platform:"Kalshi", time:"26m ago"}
];