import express from 'express';

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import imageRoutes from  './routes/imageRoutes.js';
// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// ✅ Fix: Remove trailing space in origin URL
app.use(cors({
origin: 'https://tech-rraj-client-repo.vercel.app ', // ✅ No trailing space
  credentials: true,
}));

// ✅ Fix: Use correct route prefix (should be /api/user, not /routes/user)
app.use('/api/user', userRoutes);
app.use('/api/image', imageRoutes);

// Test route to verify server is running
app.get('/test', (req, res) => {
  res.json({ success: true });
});

// Root route
app.get('/', (req, res) => {
  res.send('API Working');
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({
    success: false,
    message: "Something went wrong on the server.",
    error: err.message,
  });
});

// MongoDB connection retry logic
let retry = 0;
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "ImageGen",
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
    });

    console.log("Database connected successfully");
    app.listen(PORT, () => {
      console.log(`Server started on port: ${PORT}`);
    });
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    if (retry < 5) {
      console.log(`Retrying connection... Attempt ${retry + 1}`);
      retry++;
      setTimeout(connectDB, 5000);
    } else {
      console.error("Failed to connect after several attempts.");
      process.exit(1);
    }
  }
};

connectDB();