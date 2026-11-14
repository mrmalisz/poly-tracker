const state = {
  wallets: JSON.parse(localStorage.getItem("wallets") || "[]"),
  alerts: JSON.parse(localStorage.getItem("alerts") || "[]"),
  markets: [],
  sound: true,
  triggeredToday: 0
};

const $ = (id) => document.getElementById(id);
const formatPercent = (value) => `${(value * 100).toFixed(1)}%`;
const formatMoney = (value) => `$${Number(value || 0).toLocaleString()}`;
const shortenAddress = (address) => `${address.slice(0, 6)}...${address.slice(-4)}`;

function save() {
  localStorage.setItem("wallets", JSON.stringify(state.wallets));
  localStorage.setItem("alerts", JSON.stringify(state.alerts));
}

function toast(message, isAlert = false) {
  const element = document.createElement("div");
  element.className = `toast${isAlert ? " alert" : ""}`;
  element.innerHTML = `<strong>${isAlert ? "Alert" : "Update"}</strong><br>${message}`;
  $("toast-stack").appendChild(element);
  setTimeout(() => element.remove(), 6000);

  if (isAlert && state.sound) {
    const context = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.frequency.value = 740;
    gain.gain.value = 0.05;
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.18);
  }

  if (isAlert && Notification.permission === "granted") {
    new Notification("Market alert", { body: message });
  }
}

function renderWallets() {
  const list = $("wallet-list");
  list.innerHTML = "";

  state.wallets.forEach((wallet, index) => {
    const item = document.createElement("li");
    item.innerHTML = `
      <div>
        <strong>${wallet.label || "Wallet"}</strong>
        <div class="addr">${shortenAddress(wallet.address)}</div>
      </div>
    `;

    const removeButton = document.createElement("button");
    removeButton.className = "remove";
    removeButton.textContent = "Remove";
    removeButton.onclick = () => {
      state.wallets.splice(index, 1);
      save();
      renderWallets();
    };

    item.appendChild(removeButton);
    list.appendChild(item);
  });

  $("stat-wallets").textContent = state.wallets.length;
}

function renderMarkets() {
  const query = $("search").value.toLowerCase();
  const rows = state.markets.filter((market) =>
    `${market.market} ${market.event}`.toLowerCase().includes(query)
  );

  $("market-rows").innerHTML = rows.map((market) => `
    <tr>
      <td>
        <strong>${market.market}</strong>
        <br>
        <span style="color:var(--muted)">${market.event}</span>
      </td>
      <td>${formatPercent(market.yes)}</td>
      <td>${formatPercent(market.no)}</td>
      <td class="${market.change24h >= 0 ? "up" : "down"}">
        ${market.change24h >= 0 ? "+" : ""}${(market.change24h * 100).toFixed(1)}%
      </td>
      <td>${formatMoney(market.volume)}</td>
      <td><span class="badge ${market.status}">${market.status}</span></td>
    </tr>
  `).join("");

  $("stat-markets").textContent = state.markets.length;
}

function renderAlerts() {
  const list = $("alert-list");
  list.innerHTML = state.alerts.length ? "" : "<li>No alert rules yet.</li>";

  state.alerts.forEach((alert, index) => {
    const market = state.markets.find((item) => item.id === alert.marketId);
    const item = document.createElement("li");
    item.innerHTML = `
      <strong>${market?.market || "Market no longer available"}</strong>
      <br>
      <span style="color:var(--muted)">${describeAlert(alert)}</span>
    `;

    const removeButton = document.createElement("button");
    removeButton.className = "remove";
    removeButton.textContent = "Delete";
    removeButton.onclick = () => {
      state.alerts.splice(index, 1);
      save();
      renderAlerts();
    };

    item.appendChild(removeButton);
    list.appendChild(item);
  });

  $("stat-alerts").textContent = state.alerts.length;
}

function describeAlert(alert) {
  if (alert.type === "move") {
    return `Yes price moves by at least ${alert.threshold}%`;
  }

  if (alert.type === "price_above") {
    return `Yes price rises above ${alert.threshold}%`;
  }

  return `Yes price falls below ${alert.threshold}%`;
}

function populateMarketSelector() {
  $("alert-market").innerHTML = state.markets
    .map((market) => `<option value="${market.id}">${market.market}</option>`)
    .join("");
}

function evaluateAlerts() {
  state.markets.forEach((market) => {
    state.alerts.forEach((alert) => {
      if (alert.triggered || alert.marketId !== market.id) return;

      let triggered = false;
      let message = "";

      if (
        alert.type === "price_above" &&
        market.yes * 100 >= alert.threshold
      ) {
        triggered = true;
        message = `${market.market}: Yes is now ${formatPercent(market.yes)}`;
      }

      if (
        alert.type === "price_below" &&
        market.yes * 100 <= alert.threshold
      ) {
        triggered = true;
        message = `${market.market}: Yes is now ${formatPercent(market.yes)}`;
      }

      if (
        alert.type === "move" &&
        Math.abs(market.change24h) * 100 >= alert.threshold
      ) {
        triggered = true;
        message = `${market.market}: moved ${(market.change24h * 100).toFixed(1)}% in 24h`;
      }

      if (triggered) {
        alert.triggered = true;
        state.triggeredToday += 1;
        $("stat-triggered").textContent = state.triggeredToday;
        toast(message, true);
        save();
        renderAlerts();
      }
    });
  });
}

$("wallet-form").addEventListener("submit", (event) => {
  event.preventDefault();

  const address = $("wallet-address").value.trim();

  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    toast("Enter a valid 42-character EVM wallet address.");
    return;
  }

  state.wallets.push({
    address,
    label: $("wallet-label").value.trim()
  });

  save();
  renderWallets();
  toast("Wallet added to watchlist.");
  event.target.reset();
});

$("alert-form").addEventListener("submit", (event) => {
  event.preventDefault();

  state.alerts.push({
    id: crypto.randomUUID(),
    marketId: $("alert-market").value,
    type: $("alert-type").value,
    threshold: Number($("alert-threshold").value || 0),
    triggered: false,
    createdAt: Date.now()
  });

  save();
  renderAlerts();
  toast("Alert rule created.");
});

$("alert-type").addEventListener("change", (event) => {
  $("threshold-wrap").style.display =
    event.target.value === "wallet_bet" ? "none" : "flex";
});

$("search").addEventListener("input", renderMarkets);

$("sound-toggle").addEventListener("click", (event) => {
  state.sound = !state.sound;
  event.target.textContent = `Sound: ${state.sound ? "On" : "Off"}`;
});

$("browser-notifications").addEventListener("click", async () => {
  const permission = await Notification.requestPermission();
  toast(
    permission === "granted"
      ? "Browser alerts enabled."
      : "Browser alerts were not enabled."
  );
});

renderWallets();
renderMarkets();
renderAlerts();