const mongoose = require("mongoose");

const thresholdSchema = new mongoose.Schema({
  email: { type: String, required: true },
  symbol: { type: String, required: true },
  limit: { type: Number, required: true },
  lastNotifiedAt: { type: Date, default: null },
});

module.exports = mongoose.model("Threshold", thresholdSchema);
