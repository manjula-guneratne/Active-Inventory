const mongoose = require("mongoose");

const inventoryCountSchema = new mongoose.Schema(
  {
    my_id: { type: Number, required: true, unique: true },
    order_id: { type: Number, required: true, ref: "Order" },
    qty: { type: Number, required: true },
  },
  { timestamps: true }
);

const InventoryCount = mongoose.model("InventoryCount", inventoryCountSchema);

module.exports = InventoryCount;
