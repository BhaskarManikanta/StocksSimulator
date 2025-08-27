const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema({
  symbol: { type: String, required: true, unique: true }, // e.g., "MSFT"
  name: { type: String }, // e.g., "MICROSOFT"
});

module.exports = mongoose.model("Stock", stockSchema);
