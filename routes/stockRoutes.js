const express = require("express");
const StockPrice = require("../models/StockPrice");
const router = express.Router();

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


module.exports = router;
