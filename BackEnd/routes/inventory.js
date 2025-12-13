import express from "express";
import InventoryCount from "../models/InventoryCount.js";
import Part from "../models/PartsList.js";

const router = express.Router();

/**
 * POST /inventoryCount/post
 * Create inventory count records
 */
router.post("/post", async (req, res) => {
  try {
    const { order_id, date_ordered, items } = req.body;

    if (!order_id || !date_ordered || !Array.isArray(items)) {
      return res.status(400).json({
        message: "order_id, date_ordered, and items[] are required",
      });
    }

    // Remove empty rows
    const validItems = items.filter(
      (item) =>
        item.shelfId &&
        item.qty !== "" &&
        !isNaN(item.qty) &&
        Number(item.qty) >= 0
    );

    if (validItems.length === 0) {
      return res.status(400).json({
        message: "At least one valid inventory row is required",
      });
    }

    const inventoryToInsert = [];
    const errors = [];

    // Validate each shelf independently
    for (const item of validItems) {
      const shelfValue = item.shelfId; // STRING (your DB uses strings)

      const shelfExists = await Part.findOne({ shelf_id: shelfValue });

      if (!shelfExists) {
        errors.push({
          shelf_id: shelfValue,
          error: "Shelf does not exist",
        });
        continue; // skip this row
      }

      inventoryToInsert.push({
        shelf_id: shelfValue,
        order_id: Number(order_id),
        qty: Number(item.qty),
        date_ordered: new Date(date_ordered),
      });
    }

    // Insert only valid rows
    let inserted = [];
    if (inventoryToInsert.length > 0) {
      inserted = await InventoryCount.insertMany(inventoryToInsert);
    }

    // Final response
    return res.status(201).json({
      message: "Inventory processing completed",
      insertedCount: inserted.length,
      insertedShelves: inserted.map((i) => i.shelf_id),
      errors, // ❗ per-shelf errors
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET /inventoryCount/shelf-ids
 * Used by frontend dropdown
 * SOURCE OF TRUTH: PartsList
 */
router.get("/shelf-ids", async (req, res) => {
  try {
    const shelfIds = await Part.distinct("shelf_id");

    res.status(200).json({
      message: "Shelf IDs retrieved successfully",
      data: shelfIds,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET /inventoryCount
 * Display inventory counts
 */
router.get("/", async (req, res) => {
  try {
    const inventoryCounts = await InventoryCount.find();
    res.status(200).json({
      message: "InventoryCounts retrieved successfully",
      data: inventoryCounts,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
