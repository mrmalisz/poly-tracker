# Esports Market Alerts

A dark, website-only dashboard for tracking esports prediction markets and watched betting wallets on Polymarket and Kalshi.

## Run it

Open `index.html` in a browser, or serve the folder:

```bash
npx serve .
```

## Live Polymarket data

The app requests active markets from Polymarket’s public Gamma API:

```text
https://gamma-api.polymarket.com/markets?closed=false&limit=50
```

Public market discovery does not require credentials. If the browser request fails—because of CORS, network restrictions, or an API change—the dashboard falls back to sample data and shows a status badge. https://docs.polymarket.com/getting-started/api

## Included

- Wallet watchlist with validation and local persistence
- Polymarket and Kalshi market table with filters and search
- Price-above, price-below, price-move, and wallet-bet alert rules
- In-app toasts, optional browser notifications, and alert sound
- Live Polymarket Gamma API integration with mock-data fallback

## API integration

`js/polymarketApi.js` loads live Polymarket markets through Gamma and maps them into this shape:

```js
{ id, platform, event, market, yes, no, change24h, volume, status }
```

For wallet activity, replace `WALLET_ACTIVITY` with records containing:

```js
{ wallet, label, market, side, amount, platform, time }
```

Polymarket’s Data API is the intended surface for positions, activity, and market participation; CLOB provides prices and order books, while Gamma provides market/event discovery. https://docs.polymarket.com/getting-started/api
