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

// PUT /parts/:shelfId - Update part by shelfId
router.put("/:shelfId", async (req, res) => {
  try {
    const shelfId = Number(req.params.shelfId);
    const { part_no, description } = req.body;

    const updated = await Part.findOneAndUpdate(
      { shelf_id: shelfId },
      { part_no, description },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Part not found" });
    }

    res.json({
      message: "Part updated successfully",
      data: updated
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /parts/:shelfId - Delete part by shelfId
router.delete("/:shelfId", async (req, res) => {
  try {
    const shelfId = Number(req.params.shelfId);

    if (Number.isNaN(shelfId)) {
      return res.status(400).json({
        message: "Invalid shelf ID",
      });
    }

    // Delete the Part (master record)
    const deletedPart = await Part.findOneAndDelete({
      shelf_id: shelfId,
    });

    if (!deletedPart) {
      return res.status(404).json({
        message: "Part not found",
      });
    }

    // CASCADE: delete all inventory records for this shelf
    const inventoryResult = await InventoryCount.deleteMany({
      shelf_id: shelfId,
    });

    res.status(200).json({
      message: "Part and related inventory deleted successfully",
      deletedShelf: shelfId,
      inventoryDeletedCount: inventoryResult.deletedCount,
    });

  } catch (err) {
    console.error(err);
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
