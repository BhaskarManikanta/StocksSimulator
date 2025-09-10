const { producer } = require("../utils/kafka");
const Stock = require("../models/Stock");
const mongoose = require('mongoose');

async function produce() {
  mongoose
    .connect("mongodb+srv://bhaskarabbisetti9:Abm13abm13@cluster0.sgdkk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error(err));
    
  await producer.connect();
    setInterval(async () => {
    const stocks = await Stock.find();
    const symbol = stocks[Math.floor(Math.random() * stocks.length)].symbol;
    const price = +(Math.random() * 200 + 100).toFixed(2);
    const msg = { symbol, price, ts: new Date().toISOString() };

    await producer.send({
      topic: "stock-prices",
      messages: [{ value: JSON.stringify(msg) }],
    });

    console.log("Produced:", msg);
  }, 5000);
}

produce().catch(console.error);
