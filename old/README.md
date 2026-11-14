# Esports Market Alerts

A dark, website-only dashboard prototype for tracking esports prediction markets and watched betting wallets on Polymarket and Kalshi.

## Run it

Open `index.html` in a browser, or serve the folder:

```bash
npx serve .
```

## Included

- Wallet watchlist with validation and local persistence
- Polymarket and Kalshi market table with filters and search
- Price-above, price-below, price-move, and wallet-bet alert rules
- In-app toasts, optional browser notifications, and alert sound
- Mock market and wallet-activity data

## API integration

Replace the arrays in `js/mockData.js` with data returned by your Polymarket/Kalshi data provider. Keep the market object shape:

```js
{
  id, platform, event, market, yes, no, change24h, volume, status
}
```

For wallet activity, replace `WALLET_ACTIVITY` with records containing:

```js
{
  wallet, label, market, side, amount, platform, time
}
```

The UI and alert engine will work unchanged once live data is connected.
