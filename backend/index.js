import express from "express";
import dotenv from "dotenv";
import connectDB from "./lib/connectDB.js";
import userRouter from "./routes/user.route.js";
import postRouter from "./routes/post.route.js";
import commentRouter from "./routes/comment.route.js";
import webHookRouter from "./routes/webhook.route.js";
import { clerkMiddleware } from '@clerk/express';
import cors from "cors";

// Load environment variables
dotenv.config();

// Environment variable check
console.log("Environment check:");
console.log("- MongoDB: ", process.env.MONGO ? "✓" : "✗");
console.log("- Clerk Keys: ", process.env.CLERK_SECRET_KEY ? "✓" : "✗");
console.log("- ImageKit Keys: ", process.env.IK_YOUR_IMAGEKIT_PUBLIC_KEY ? "✓" : "✗");

// Connect to database
connectDB();

const app = express();

// Allowed frontend origins
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://magazines-fe-gveqbbh.vercel.app",
  "https://magazines-website.vercel.app"
];

// Debug log to check incoming origin (optional)
app.use((req, res, next) => {
  console.log("Incoming request origin:", req.headers.origin);
  next();
});

// CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`❌ CORS blocked request from: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Middleware for JSON parsing
app.use(express.json({ limit: '50mb' })); // Allow large payloads (e.g., images)

// Clerk webhooks (secured)
app.use("/webhooks", clerkMiddleware(), webHookRouter);

// Public API routes
app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/comments", commentRouter);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error("Global error:", error);
  res.status(error.status || 500).json({
    message: error.message || "Something went wrong!",
    status: error.status || 500,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : error.stack,
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
