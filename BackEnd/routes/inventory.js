import express from "express";
import InventoryCount from "../models/InventoryCount.js";

const router = express.Router();

router.post("/post/", async (req, res) => {
  try {
    const { shelf_id, order_id, qty, date_ordered } = req.body;

    if (!shelf_id || !order_id || !qty || !date_ordered) {
      return res.status(400).json({ message: "shelf_id, order_id, qty, and date_ordered are required" });
    }

    const newInventory = await InventoryCount.create({ shelf_id, order_id, qty, date_ordered });
    res.status(201).json({
      message: "InventoryCount created successfully",
      data: newInventory,
    });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(400).json({ message: "shelf_id must be unique" });
    }
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