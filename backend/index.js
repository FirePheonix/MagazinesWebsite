import express from "express";
import dotenv from "dotenv";
import connectDB from "./lib/connectDB.js";
import userRouter from "./routes/user.route.js";
import postRouter from "./routes/post.route.js";
import commentRouter from "./routes/comment.route.js";
import webHookRouter from "./routes/webhook.route.js";
import { clerkMiddleware } from '@clerk/express';
import cors from "cors";

// Load environment variables at the very beginning
dotenv.config();

// Verify environment variables are loaded correctly
console.log("Environment check:");
console.log("- MongoDB: ", process.env.MONGO ? "✓" : "✗");
console.log("- Clerk Keys: ", process.env.CLERK_SECRET_KEY ? "✓" : "✗");
console.log("- ImageKit Keys: ", process.env.IK_YOUR_IMAGEKIT_PUBLIC_KEY ? "✓" : "✗");

// Connect to database
connectDB();

const app = express();

// Configure CORS to allow requests from frontend
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://magazines-fe-gveqbbh.vercel.app",
  "https://magazines-website.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Then apply json parsing globally
app.use(express.json({ limit: '50mb' }));  // Increased limit for image uploads

// Apply Clerk middleware only for webhooks
app.use("/webhooks", clerkMiddleware(), webHookRouter);

// API routes (without Clerk middleware for now)
app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/comments", commentRouter); 

// Basic health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", message: "Server is running" });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error("Global error:", error);
    res.status(error.status || 500).json({
        message: error.message || "Something went wrong!",
        status: error.status || 500,
        stack: process.env.NODE_ENV === 'production' ? '🥞' : error.stack,
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});