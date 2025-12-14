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

// app.use(cors());

const allowedOrigins = [
  "http://localhost:5173",
  "https://active-inventory.onrender.com",
];
// Able to test locally and from deployed front-end
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

