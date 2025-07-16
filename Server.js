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
import cors from 'cors';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// CORS setup
app.use(cors({
  origin: 'https://tech-rraj-client-repo.vercel.app ',
  credentials: true,
}));

// Test route (should be here, not in routes)
app.get('/test', (req, res) => {
  res.json({ success: true });
});

// Route handlers
app.use('/api/user', userRoutes);
app.use('/api/image', imageRoutes);

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

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Database connected successfully");
    app.listen(PORT, () => {
      console.log(`Server started on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });