// import express from 'express';
// import userRoutes from './routes/userRoutes.js';
// import imageRoutes from './routes/imageRoutes.js';
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';

// dotenv.config();

// const app = express();

// // Middleware to parse JSON requests
// app.use(express.json());

// // Routes
// app.use('/api/user', userRoutes);
// app.use('/api/image', imageRoutes);
// app.get('/', (req, res) => {
//   res.send('API Working')
// });

// // Connect to MongoDB
// mongoose.connect(process.env.MONGODB_URI)
//   .then(() => console.log("Database connected successfully"))
//   .catch((err) => console.error("Database connection failed:", err));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server started on port: ${PORT}`);
// });


import express from 'express';
import userRoutes from './routes/userRoutes.js';
import imageRoutes from './routes/imageRoutes.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors'; // ✅ Import cors

dotenv.config();

const app = express();

// ✅ Use CORS middleware
app.use(cors({
  origin: 'https://tech-rraj-client-repo.vercel.app/', // Allow frontend origin
  credentials: true, // Allow cookies if needed
}));

// Middleware to parse JSON requests
app.use(express.json());

// Routes
app.use('/api/user', userRoutes);
app.use('/api/image', imageRoutes);

app.get('/', (req, res) => {
  res.send('API Working');
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.error("Database connection failed:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`);
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    message: "Something went wrong on the server.",
    error: err.message,
  });
});