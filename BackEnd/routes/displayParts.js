// routes/displayParts.js (or inside inventoryCount routes)

import express from "express";
import InventoryCount from "../models/InventoryCount.js";
import Part from "../models/PartsList.js";

const router = express.Router();

// GET /displayParts
router.get("/", async (req, res) => {
  try {
    const results = await InventoryCount.aggregate([
      // 1️⃣ Sum quantities per shelf
      {
        $group: {
          _id: "$shelf_id",
          totalQty: { $sum: "$qty" }
        }
      },

      // 2️⃣ Join with PartsList
      {
        $lookup: {
          from: "partslists",
          localField: "_id",
          foreignField: "shelf_id",
          as: "part"
        }
      },

      // 3️⃣ Convert part array to object
      { $unwind: "$part" },

      // 4️⃣ Final shape
      {
        $project: {
          shelf_id: "$_id",
          description: "$part.description",
          totalQty: 1,
          _id: 0
        }
      },

      // 5️⃣ Sort
      { $sort: { shelf_id: 1 } }
    ]);

    res.status(200).json({
      //message: "Display parts retrieved successfully",
      data: results
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /displayParts/:id - Get total quantity for a specific shelf
router.get("/:id", async (req, res) => {
  try {
    const shelfId = Number(req.params.id);

    if (Number.isNaN(shelfId)) {
      return res.status(400).json({
        message: "Shelf ID must be a number",
      });
    }

    const result = await InventoryCount.aggregate([
      // 1️⃣ Filter to ONE shelf
      {
        $match: { shelf_id: shelfId }
      },

      // 2️⃣ Sum quantity
      {
        $group: {
          _id: "$shelf_id",
          totalQty: { $sum: "$qty" }
        }
      },

      // 3️⃣ Join PartsList
      {
        $lookup: {
          from: "partslists",
          localField: "_id",
          foreignField: "shelf_id",
          as: "part"
        }
      },

      // 4️⃣ Flatten result
      { $unwind: "$part" },

      // 5️⃣ Final shape
      {
        $project: {
          shelf_id: "$_id",
          description: "$part.description",
          totalQty: 1,
          _id: 0
        }
      }
    ]);

    if (result.length === 0) {
      return res.status(404).json({
        message: `Shelf ${shelfId} not found`,
      });
    }

    res.status(200).json({
      message: "Shelf retrieved successfully",
      data: result[0], // 👈 single object
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});



export default router;
