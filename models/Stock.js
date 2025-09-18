const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
    unique: true,
    uppercase: true, // normalize symbols (e.g., "aapl" → "AAPL")
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
});



module.exports = mongoose.model("Stock", stockSchema);
