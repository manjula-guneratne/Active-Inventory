const express = require("express");
const router = express.Router();
const Part = require("../models/PartsList");

// POST /parts
router.post("/post", async (req, res) => {
  try {
    const { shelf_id, part_no, description } = req.body;

    // Validation
    if (!shelf_id || !part_no || !description) {
      return res
        .status(400)
        .json({ message: "shelf_id, part_no, and description are required" });
    }

    const newPart = await Part.create({ shelf_id, part_no, description });
    res.status(201).json({
      message: "Part created successfully",
      data: newPart,
    });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(400).json({ message: "shelf_id must be unique" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

// GET /parts
router.get("/", async (req, res) => {
  try {
    const parts = await Part.find();
    res.status(200).json({
      message: "Parts retrieved successfully",
      data: parts,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
