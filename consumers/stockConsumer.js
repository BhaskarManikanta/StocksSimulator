const { consumer } = require("../utils/kafka");
const Threshold = require("../models/Threshold");
const { sendEmail } = require("../utils/email");
const mongoose = require("mongoose");
const io = require('..server.js')

mongoose
  .connect("mongodb+srv://bhaskarabbisetti9:Abm13abm13@cluster0.sgdkk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

async function consume() {
  await consumer.connect();
  await consumer.subscribe({ topic: "stock-prices", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const stockData = JSON.parse(message.value.toString());
      console.log("Consumed:", stockData);

      const thresholds = await Threshold.find({ symbol: stockData.symbol });

      for (const t of thresholds) {
        if (stockData.price >= t.limit) {
          const now = new Date();
          const cooldownMs = 60 * 60 * 1000; // 60 min cooldown

          if (!t.lastNotifiedAt || now - t.lastNotifiedAt > cooldownMs) {
            console.log(`📩 Sending alert to ${t.email} for ${t.symbol}`);

            // 1.Send Email
            await sendEmail(
              t.email,
              `Stock Alert: ${t.symbol}`,
              `${t.symbol} has reached price ${stockData.price}, exceeding your threshold ${t.limit}`
            );

            // 2. Send WebSocket notification
            io.to(t.email).emit("stock-alert", {
              symbol: t.symbol,
              price: stockData.price,
              limit: t.limit,
              time: now,
            });

            // update lastNotifiedAt so we don’t spam
            t.lastNotifiedAt = now;
            await t.save();
          } else {
            console.log(
              `⏳ Skipping duplicate alert for ${t.email} (${t.symbol})`
            );
          }
        }
      }
    },
  });
}

consume().catch(console.error);
