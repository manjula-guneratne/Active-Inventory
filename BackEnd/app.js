const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("./models/User");

const app = express();
app.use(express.json());
dotenv.config();

mongoose
  .connect(process.env.MONGO_URI, {
    dbName: "activeInventoryDatabase"
})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

const signAccessToken = (userId) => {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET, {
    expiresIn: Number(process.env.JWT_EXPIRES_IN),
  });
};

const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.token;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "INVALID_TOKEN" });
    }

    const token = authHeader.split(" ")[1];

    let payload;

    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
      console.log("PAYLOAD:", payload);
    } catch (err) {
      console.log("JWT VERIFY ERROR:", err.message);
    }

    // Attach userId to request
    req.userId = payload.sub;

    next(); // allow next route to run
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

app.post("/users/signup", async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ email, password: hashedPassword, name });

    if (user) {
      res.status(201).json({
        message: "User created successfully",
        user: {
          email: user.email,
          name: user.name,
        },
      });
    } else {
      res.status(400).json({ message: "Email is already registered" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/users/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "EMAIL_NOT_FOUND" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "BAD_PASSWORD" });
    } else {
      // User authentication
      const token = await signAccessToken(user._id);
      return res.status(200).json({
        status: "ok",
        data: {
          accessToken: token,
          tokenType: "Bearer",
          expiresIn: process.env.JWT_EXPIRES_IN,
        },
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/me", requireAuth, async (req, res) => {
  const user = await User.findById(req.userId).select("email name createdAt");

  res.json({
    status: "ok",
    data: {
      user,
    },
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
