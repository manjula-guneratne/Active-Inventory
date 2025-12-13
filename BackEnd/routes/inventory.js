import express from "express";
import InventoryCount from "../models/InventoryCount.js";

const router = express.Router();

router.post("/post", async (req, res) => {
  try {
    const { order_id, date_ordered, items } = req.body;

    console.log("BODY RECEIVED:", req.body);

    if (!order_id || !date_ordered || !Array.isArray(items)) {
      return res.status(400).json({
        message: "order_id, date_ordered, and items[] are required",
      });
    }

    // Filter out empty rows
    const validItems = items.filter((item) => item.shelfId && item.qty);

    if (validItems.length === 0) {
      return res.status(400).json({
        message: "At least one valid inventory row is required",
      });
    }

    // Create multiple documents
    const inventoryRecords = validItems.map((item) => ({
      shelf_id: Number(item.shelfId),
      order_id: Number(order_id),
      qty: Number(item.qty),
      date_ordered: new Date(date_ordered),
    }));

    const result = await InventoryCount.insertMany(inventoryRecords);

    res.status(201).json({
      message: "InventoryCounts created successfully",
      data: result,
    });
  } catch (err) {
    console.error(err);

    if (err.code === 11000) {
      return res.status(400).json({
        message: "Duplicate shelf_id detected",
      });
    }

    res.status(500).json({ message: "Server error" });
  }
});

router.get("/shelf-ids", async (req, res) => {
  try {
    const shelfIds = await InventoryCount.distinct("shelf_id");

    res.status(200).json({
      message: "Shelf IDs retrieved successfully",
      data: shelfIds,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

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
