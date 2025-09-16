const mongoose = require("mongoose");

const stockPriceSchema = new mongoose.Schema({
  symbol: { type: String, required: true },
  price: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

// ✅ Add TTL index: delete docs 30 days after timestamp
stockPriceSchema.index({ timestamp: 1 }, { expireAfterSeconds: 2592000 });

module.exports = mongoose.model("StockPrice", stockPriceSchema);
