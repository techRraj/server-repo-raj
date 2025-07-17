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
  origin: 'https://tech-rraj-client-repo.vercel.app ', // ✅ No trailing space
  credentials: true,
}));

// Routes
app.use('/api/user', userRoutes);
app.use('/api/image', imageRoutes);

// Test route
app.get('/test', (req, res) => {
  res.json({ success: true });
});

// Root route
app.get('/', (req, res) => {
  res.send('API Working');
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({
    success: false,
    message: "Something went wrong on the server.",
    error: err.message,
  });
});

// MongoDB connection with retry
let retry = 0;
const connectDB = async () => {
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