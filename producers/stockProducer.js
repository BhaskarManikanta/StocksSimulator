const { producer } = require("../utils/kafka");
const Stock = require("../models/Stock");
require("dotenv").config();
const app = require("../app")
let stocks = [];
const priceMap = new Map();

const TOPIC = "stock-prices";
const REFRESH_INTERVAL = 60 * 60 * 1000; // 1 hour
const PRODUCE_INTERVAL = 30 * 1000; // 30 sec

// -------------------------------------
// Load Stocks
// -------------------------------------
async function loadStocks() {
  try {
    const latestStocks = await Stock.find().lean();

    if (!latestStocks.length) {
      console.warn("⚠️ No stocks found");
      return;
    }

    stocks = latestStocks;

    const currentSymbols = new Set();

    for (const stock of stocks) {
      const symbol = stock.symbol;

      currentSymbols.add(symbol);

      // Add initial price if not exists
      if (!priceMap.has(symbol)) {
        priceMap.set(
          symbol,
          +(Math.random() * 200 + 100).toFixed(2)
        );

        console.log(`🆕 Added ${symbol}`);
      }
    }

    // Remove deleted stocks
    for (const symbol of priceMap.keys()) {
      if (!currentSymbols.has(symbol)) {
        priceMap.delete(symbol);
        console.log(`🗑️ Removed ${symbol}`);
      }
    }

    console.log(`✅ Loaded ${stocks.length} stocks`);
  } catch (err) {
    console.error("❌ Failed to load stocks:", err.message);
  }
}

// -------------------------------------
// Generate Random Price
// -------------------------------------
function generatePrice(currentPrice) {
  const changePercent = (Math.random() - 0.5) * 0.04;

  let updatedPrice = currentPrice * (1 + changePercent);

  // Clamp values
  updatedPrice = Math.max(50, Math.min(1000, updatedPrice));

  return +updatedPrice.toFixed(2);
}

// -------------------------------------
// Produce Stock Message
// -------------------------------------
async function produceStockPrice() {
  try {
    if (!stocks.length) return;

    const stock =
      stocks[Math.floor(Math.random() * stocks.length)];

    const symbol = stock.symbol;

    const updatedPrice = generatePrice(
      priceMap.get(symbol)
    );

    priceMap.set(symbol, updatedPrice);

    const message = {
      symbol,
      price: updatedPrice,
      ts: Date.now(),
    };

    await producer.send({
      topic: TOPIC,
      messages: [
        {
          key: symbol,
          value: JSON.stringify(message),
        },
      ],
    });

    console.log("📈 Produced:", message);
  } catch (err) {
    console.error("❌ Produce failed:", err.message);
  }
}

// -------------------------------------
// Start Producer
// -------------------------------------
async function startProducer() {
  try {
    await producer.connect();
    console.log("✅ Kafka Producer Connected");

    await loadStocks();

    // Refresh stocks periodically
    setInterval(loadStocks, REFRESH_INTERVAL);

    // Produce messages periodically
    setInterval(produceStockPrice, PRODUCE_INTERVAL);
  } catch (err) {
    console.error("❌ Producer startup failed:", err.message);
    process.exit(1);
  }
}

module.exports = startProducer;