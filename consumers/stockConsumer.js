const { consumer } = require("../utils/kafka");
const Threshold = require("../models/Threshold");
const StockPrice = require("../models/StockPrice"); 
const { sendEmail } = require("../utils/email");
const mongoose = require("mongoose");
const io = require("../server");

mongoose
  .connect("mongodb+srv://<username>:<password>@cluster0.sgdkk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

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
        if (stockData.price >= t.limit) {
          const now = new Date();
          const cooldownMs = 5 * 60 * 1000;

          if (!t.lastNotifiedAt || now - t.lastNotifiedAt > cooldownMs) {
            await sendEmail(
              t.email,
              `Stock Alert: ${t.symbol}`,
              `${t.symbol} has reached price ${stockData.price}, exceeding your threshold ${t.limit}`
            );

            io.to(t.email).emit("stock-alert", {
              symbol: t.symbol,
              price: stockData.price,
              limit: t.limit,
              time: now,
            });

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
