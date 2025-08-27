const { consumer } = require("../utils/kafka");
const Threshold = require("../models/Threshold")
const { sendEmail } = require("../utils/email");
const mongoose = require('mongoose')

mongoose
  .connect("mongodb+srv://bhaskarabbisetti9:Abm13abm13@cluster0.sgdkk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));


async function consume() {
  await consumer.connect();
  await consumer.subscribe({ topic: "stock-prices", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const stockData = JSON.parse(message.value.toString());
      console.log("Consumed:", stockData);

      const thresholds = await Threshold.find({ symbol: stockData.symbol });
      console.log(thresholds)
      for (const t of thresholds) {
        if (stockData.price >= t.limit) {
          console.log(`📩 Sending alert to ${t.email} for ${t.symbol}`);
          await sendEmail(
            t.email,
            `Stock Alert: ${t.symbol}`,
            `${t.symbol} has reached price ${stockData.price}, exceeding your threshold ${t.limit}`
          );
        }
      }
    },
  });
}

consume().catch(console.error);
