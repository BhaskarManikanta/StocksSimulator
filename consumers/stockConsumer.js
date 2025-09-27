const { consumer } = require("../utils/kafka");
const Threshold = require("../models/Threshold");
const StockPrice = require("../models/StockPrice"); 
const { sendEmail } = require("../utils/email");
const io = require("../server");


async function consume() {
  await consumer.connect();
  await consumer.subscribe({ topic: "stock-prices", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const stockData = JSON.parse(message.value.toString());
      console.log("Consumed:", stockData);

      // ✅ Save price history
      const newPrice = new StockPrice({
        symbol: stockData.symbol,
        price: stockData.price,
        timestamp: stockData.ts || new Date(),
      });
      await newPrice.save();

      // ✅ Broadcast real-time stock price
      io.emit("stock-price", stockData);

      // 🔔 Threshold check
      const thresholds = await Threshold.find({ symbol: stockData.symbol });
      for (const t of thresholds) {
        const now = new Date();
        const cooldownMs = 5 * 60 * 1000;

        let shouldAlert = false;

        if (t.direction === "above" && stockData.price >= t.limit) {
          shouldAlert = true;
        } else if (t.direction === "below" && stockData.price <= t.limit) {
          shouldAlert = true;
        }

        if (shouldAlert) {
          if (!t.lastNotifiedAt || now - t.lastNotifiedAt > cooldownMs) {
            console.log(`📩 Sending alert to ${t.email} for ${t.symbol}`);

      // Send Email
        await sendEmail(
          t.email,
          `Stock Alert: ${t.symbol}`,
          `${t.symbol} has ${t.direction === "above" ? "risen above" : "fallen below"} ${
          t.limit
          }. Current price: ${stockData.price}`);
        
          io.to(t.email).emit("stock-alert", {
            symbol: t.symbol,
            price: stockData.price,
            limit: t.limit,
            direction: t.direction,
            time: now,
          });

      // Update lastNotifiedAt
      await Threshold.updateOne(
        { _id: t._id },
        { $set: { lastNotifiedAt: now } }
      );
    }
  }
}
    },
  });
}

consume().catch(console.error);
