const express = require("express");
const Stock = require("../models/Stock");

const router = express.Router();

// Add a new stock symbol (Admin)
router.post("/stocks", async (req, res) => {
  try {
    const { symbol, name } = req.body;

    const existing = await Stock.findOne({ symbol });
    if (existing) {
      return res.status(400).json({ error: "Symbol already exists" });
    }

    const stock = new Stock({ symbol, name });
    await stock.save();
    res.json({ message: "Stock added", stock });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all stock symbols
router.get("/stocks", async (req, res) => {
  try {
    const stocks = await Stock.find();
    res.json(stocks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a stock symbol (Admin)
router.delete("/stocks/:symbol", async (req, res) => {
  try {
    const { symbol } = req.params;
    const deleted = await Stock.findOneAndDelete({ symbol });
    if (!deleted) {
      return res.status(404).json({ error: "Symbol not found" });
    }
    res.json({ message: "Stock deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
