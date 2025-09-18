const { producer } = require("../utils/kafka");
const Stock = require("../models/Stock");
const mongoose = require("mongoose");

async function produce() {
  await mongoose
    .connect("mongodb+srv://bhaskarabbisetti9:Abm13abm13@cluster0.sgdkk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("❌ MongoDB error:", err));

  await producer.connect();

  // ✅ Stock cache
  let stocks = await Stock.find();
  if (!stocks.length) {
    console.error("⚠️ No stocks found in DB. Seed Stock collection first.");
    return;
  }
  console.log(`Loaded ${stocks.length} stocks into cache.`);

  // ✅ Track current prices in memory
  const priceMap = {};
  for (const s of stocks) {
    priceMap[s.symbol] = +(Math.random() * 200 + 100).toFixed(2); // initial price
  }

  // ♻️ Refresh stock cache every 1 hour
  setInterval(async () => {
    try {
      const latestStocks = await Stock.find();
      console.log("♻️ Stock list refreshed. Count:", latestStocks.length);

      // Replace stocks cache
      stocks = latestStocks;

      // Add base price for new stocks
      for (const s of stocks) {
        if (!priceMap[s.symbol]) {
          priceMap[s.symbol] = +(Math.random() * 200 + 100).toFixed(2);
          console.log(`🆕 Added ${s.symbol} with base price ${priceMap[s.symbol]}`);
        }
      }

      // Remove prices for deleted stocks
      Object.keys(priceMap).forEach((symbol) => {
        if (!stocks.find((s) => s.symbol === symbol)) {
          delete priceMap[symbol];
          console.log(`🗑️ Removed ${symbol} from price map`);
        }
      });
    } catch (err) {
      console.error("❌ Failed to refresh stock list:", err.message);
    }
  }, 3600 * 1000);

  // Produce updated prices every 10 sec
  setInterval(async () => {
    if (!stocks.length) return;

    const randomStock = stocks[Math.floor(Math.random() * stocks.length)];
    const symbol = randomStock.symbol;

    // random walk: move ±2%
    let currentPrice = priceMap[symbol];
    const changePercent = (Math.random() - 0.5) * 0.04; // -2% to +2%
    currentPrice = +(currentPrice * (1 + changePercent)).toFixed(2);

    // clamp to range
    if (currentPrice < 50) currentPrice = 50;
    if (currentPrice > 1000) currentPrice = 1000;

    priceMap[symbol] = currentPrice;

    const msg = { symbol, price: currentPrice, ts: new Date().toISOString() };

    try {
      await producer.send({
        topic: "stock-prices",
        messages: [{ value: JSON.stringify(msg) }],
      });
      console.log("📈 Produced:", msg);
    } catch (err) {
      console.error("❌ Kafka send failed:", err.message);
    }
  }, 10000);
}

produce().catch(console.error);
