const { producer } = require("../utils/kafka");
const Stock = require("../models/Stock");
const mongoose = require("mongoose");

async function produce() {
  await mongoose
    .connect("mongodb+srv://bhaskarabbisetti9:Abm13abm13@cluster0.sgdkk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error(err));

  await producer.connect();

  // ✅ Stock cache
  let stocks = await Stock.find();
  if (!stocks.length) {
    console.error("⚠️ No stocks found in DB. Seed Stock collection first.");
    return;
  }
  console.log(`Loaded ${stocks.length} stocks into cache.`);

  // ♻️ Refresh stock cache every 1 hour
  setInterval(async () => {
    try {
      stocks = await Stock.find();
      console.log("♻️ Stock list refreshed. Count:", stocks.length);
    } catch (err) {
      console.error("Failed to refresh stock list:", err.message);
    }
  }, 3600 * 1000);

  // Produce random prices every 10 sec
  setInterval(async () => {
    if (!stocks.length) return; // skip if no stocks in cache

    const randomStock = stocks[Math.floor(Math.random() * stocks.length)];
    const symbol = randomStock.symbol;
    const price = +(Math.random() * 200 + 100).toFixed(2);
    const msg = { symbol, price, ts: new Date().toISOString() };

    try {
      await producer.send({
        topic: "stock-prices",
        messages: [{ value: JSON.stringify(msg) }],
      });
      console.log("Produced:", msg);
    } catch (err) {
      console.error("❌ Kafka send failed:", err.message);
    }
  }, 10000);
}

produce().catch(console.error);
