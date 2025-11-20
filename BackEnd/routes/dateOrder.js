const express = require("express");
const router = express.Router();
const DateOrder = require("../models/DateOrder");

// POST /date-orders
router.post("/", async (req, res) => {
  try {
    const { order_id, date_ordered } = req.body;

    // Validation
    if (!order_id || !date_ordered) {
      return res.status(400).json({ message: "order_id and date_ordered are required" });
    }

    // Create the document
    const newOrder = await DateOrder.create({
      order_id,
      date_ordered: new Date(date_ordered), // ensure it's a Date
    });

    res.status(201).json({
      message: "DateOrder created successfully",
      data: newOrder,
    });
  } catch (err) {
    console.error(err);

    // Handle unique constraint error
    if (err.code === 11000) {
      return res.status(400).json({ message: "order_id must be unique" });
    }

    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
