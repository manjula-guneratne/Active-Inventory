import express from "express";
import InventoryCount from "../models/InventoryCount.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { my_id, order_id, qty } = req.body;

    if (!my_id || !order_id || !qty) {
      return res.status(400).json({ message: "my_id, order_id, and qty are required" });
    }

    const newInventory = await InventoryCount.create({ my_id, order_id, qty });

    res.status(201).json({
      message: "InventoryCount created successfully",
      data: newInventory,
    });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(400).json({ message: "my_id must be unique" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

export default router;