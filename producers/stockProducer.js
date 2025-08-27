const { producer } = require("../utils/kafka");
const Stock = require("./models/Stock");

async function produce() {
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
