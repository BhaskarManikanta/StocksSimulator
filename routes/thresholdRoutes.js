const express = require("express");
const Threshold = require("../models/Threshold");

const router = express.Router();

/**
 * Add new threshold
 * - Prevents duplicate threshold for same email + stock
 */
router.post("/thresholds", async (req, res) => {
  try {
    const { email, symbol, limit } = req.body;

    if (!email || !symbol || !limit) {
      return res.status(400).json({ error: "Email, symbol, and limit are required" });
    }

    // Check if threshold already exists for same user + stock
    const existing = await Threshold.findOne({ email, symbol });
    if (existing) {
      return res.status(400).json({ error: "Threshold already exists for this stock" });
    }

    const threshold = new Threshold({ email, symbol, limit });
    await threshold.save();
    res.json({ message: "Threshold added", threshold });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



/**
 * Delete threshold for a specific stock (by email + symbol)
 */
router.delete("/thresholds", async (req, res) => {
  try {
    const { email, symbol } = req.body;

    if (!email || !symbol) {
      return res.status(400).json({ error: "Email and symbol are required" });
    }

    const deleted = await Threshold.findOneAndDelete({ email, symbol });

    if (!deleted) {
      return res.status(404).json({ error: "Threshold not found" });
    }

    res.json({ message: "Threshold deleted", deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/thresholds/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const thresholds = await Threshold.find({ email });
    res.json(thresholds);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/thresholds", async (req, res) => {
  try {
    const { email, symbol, limit } = req.body;

    const threshold = await Threshold.findOneAndUpdate(
      { email, symbol },      // find by user & stock
      { limit },              // update limit
      { new: true }           // return updated document
    );

    if (!threshold) {
      return res.status(404).json({ error: "Threshold not found for this stock" });
    }

    res.json({ message: "Threshold updated", threshold });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
