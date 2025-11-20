const mongoose = require("mongoose");

const dateOrderSchema = new mongoose.Schema(
  {
    order_id: { type: Number, required: true, unique: true },
    date_ordered: { type: Date, required: true },
  },
  { timestamps: true }
);

const DateOrder = mongoose.model("DateOrder", dateOrderSchema);

module.exports = DateOrder;
