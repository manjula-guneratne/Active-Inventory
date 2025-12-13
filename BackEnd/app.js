import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import inventoryRoutes from "./routes/inventory.js";
import partsRoutes from "./routes/parts.js";
import displayPartsRoutes from "./routes/displayParts.js";

const app = express();
app.use(express.json());
dotenv.config();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

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
app.use("/inventoryCount", inventoryRoutes);
app.use("/parts", partsRoutes);
app.use("/displayParts", displayPartsRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
