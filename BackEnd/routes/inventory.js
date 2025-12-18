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
    const { date_ordered, items } = req.body;

    if (!date_ordered || !Array.isArray(items)) {
      return res.status(400).json({
        message: "date_ordered and items are required",
      });
    }

    const docs = items.map(item => ({
      shelf_id: item.shelfId,
      qty: Number(item.qty) || 0,
      date_ordered: new Date(date_ordered),
    }));

    // Remove existing inventory for that date (shopping-list behavior)
    await InventoryCount.deleteMany({
      date_ordered: new Date(date_ordered),
    });

    // Insert full list
    await InventoryCount.insertMany(docs);

    res.status(201).json({
      message: "Inventory count saved",
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

// Get inventory by date_ordered
router.get("/by-date/:date", async (req, res) => {
  try {
    const dateParam = req.params.date;

    const inventoryCounts = await InventoryCount.find({
      date_ordered: new Date(dateParam),
    }).sort({ shelf_id: 1 });

    res.status(200).json({
      message: "Inventory retrieved successfully",
      data: inventoryCounts,
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
