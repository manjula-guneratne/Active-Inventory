// routes/displayParts.js (or inside inventoryCount routes)

import express from "express";
import InventoryCount from "../models/InventoryCount.js";
import Part from "../models/PartsList.js";

const router = express.Router();

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


export default router;
