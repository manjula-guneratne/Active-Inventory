import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import inventoryRoutes from "./routes/inventory.js";
import dateOrderRoutes from "./routes/dateOrder.js";

const app = express();
app.use(express.json());
dotenv.config();

mongoose
  .connect(process.env.MONGO_URI, {
    dbName: "activeInventoryDatabase",
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

app.use("/users", authRoutes);
app.use("/inventory-count", inventoryRoutes);
app.use("/date-orders", dateOrderRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
