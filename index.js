import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import loadAllJson from "./data/index.js";
import ChatbotRoute from "./route/index.js";

dotenv.config();

const app = express();

/* =====================
   Middlewares
===================== */
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

app.use("/api", ChatbotRoute);

/* =====================
   Routes
===================== */
app.get("/", (req, res) => {
  res.json({
    message: "🚀 Server is running",
    data: loadAllJson(),
  });
});

/* =====================
   MongoDB Connection
===================== */
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

/* =====================
   Start Server
===================== */
const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
});
