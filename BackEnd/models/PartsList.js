const mongoose = require("mongoose");

const partsListSchema = new mongoose.Schema(
  {
    shelf_id: { type: Number, required: true, unique: true, ref: "Order" },
    part_no: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

const PartsList = mongoose.model("PartsList", partsListSchema);

module.exports = PartsList;