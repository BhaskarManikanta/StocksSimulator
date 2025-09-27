const express = require("express");
const StockPrice = require("../models/StockPrice");
const router = express.Router();
const Stock = require('../models/Stock')

router.get("/history/:symbol", async (req, res) => {
  const { symbol } = req.params;
  const { limit = 50 } = req.query; // default last 50
  try {
    const prices = await StockPrice.find({ symbol })
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));
    res.json(prices.reverse()); // reverse for oldest → newest
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Get all available stocks
 */
router.get("/stocks", async (req, res) => {
  try {
    const stocks = await Stock.find({}).sort({ symbol: 1 });
    res.json(stocks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
