import express from 'express';
import userRoutes from './routes/userRoutes.js';
import imageRoutes from './routes/imageRoutes.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// CORS setup
app.use(cors({
  origin: 'https://tech-rraj-client-repo-xwx8.vercel.app ', // ✅ Updated origin
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token'],
  exposedHeaders: ['Content-Type', 'Authorization', 'token']
}));

// Routes
app.use('/api/user', userRoutes);
app.use('/api/image', imageRoutes);

// Test route
app.get('/test', (req, res) => {
  res.json({ success: true });
});

// MongoDB connection
try {
  await mongoose.connect(process.env.MONGODB_URI, {
    dbName: "ImageGen",
    serverSelectionTimeoutMS: 15000,
    socketTimeoutMS: 45000,
  });
  console.log("Database connected successfully");
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server started on port: ${PORT}`);
  });
} catch (err) {
  console.error("MongoDB connection failed:", err.message);
  process.exit(1);
}