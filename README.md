# Esports Market Alerts

A dark, website-only dashboard for tracking esports prediction markets and watched betting wallets on Polymarket and Kalshi.

## Run it

Open `index.html` in a browser, or serve the folder:

```bash
npx serve .
```

## Game tabs

CS2 is loaded by default. Use the tabs at the top to switch between CS2, Dota 2, League of Legends, and Valorant. Each game changes the top-bar accent colour:

- CS2: yellow
- Dota 2: red
- League of Legends: blue
- Valorant: cyan

The app identifies game markets from Polymarket market and event text. It excludes markets it cannot confidently classify as one of the four selected games.

## Archive

Toggle **Archive** to load resolved/closed Polymarket markets instead of active markets. Archived markets are displayed but are never marked as suspicious.

## Suspicious movement

A live market is highlighted when its 24-hour price movement is at least 10 percentage points, or when it starts within 60 minutes and has moved by at least 5 percentage points. This is a heuristic signal, not proof of manipulation or match fixing.

## Live Polymarket data

The app requests markets from Polymarket’s public Gamma API:

```text
https://gamma-api.polymarket.com/markets?closed=false&limit=200
```

Public market discovery does not require credentials. If the browser request fails, the dashboard falls back to sample data and shows a status badge. https://docs.polymarket.com/getting-started/api

## Included

- Wallet watchlist with validation and local persistence
- Polymarket and Kalshi market table with filters and search
- Price-above, price-below, price-move, and wallet-bet alert rules
- In-app toasts, optional browser notifications, and alert sound
- Live Polymarket Gamma API integration with mock-data fallback
- Game-specific tabs, archive mode, and suspicious-movement highlighting

## API integration

`js/polymarketApi.js` loads live Polymarket markets through Gamma and maps them into this shape:

```js
{ id, platform, game, event, market, yes, no, change24h, volume, status, startsInMinutes }
```

For wallet activity, replace `WALLET_ACTIVITY` with records containing:

```js
{ wallet, label, market, side, amount, platform, time }
```

Polymarket’s Data API is the intended surface for positions, activity, and market participation; CLOB provides prices and order books, while Gamma provides market/event discovery. https://docs.polymarket.com/getting-started/api
