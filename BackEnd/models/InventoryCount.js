const mongoose = require("mongoose");

const inventoryCountSchema = new mongoose.Schema(
  {
    shelf_id: { type: Number, required: true, unique: true, ref: "Order" },
    date_ordered: { type: Date, required: true },
    order_id: { type: Number, required: true },
    qty: { type: Number, required: true },
  },
  { timestamps: true }
);

const InventoryCount = mongoose.model("InventoryCount", inventoryCountSchema);

module.exports = InventoryCount;
