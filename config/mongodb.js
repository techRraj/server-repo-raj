import mongoose from "mongoose";


const connectDB = async () => {
    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        dbName: "ImageGen", // Specify the database name here
      });
      console.log("Database connected successfully");
    } catch (error) {
      console.error("Database connection failed:", error.message);
      process.exit(1); // Exit the process if the database connection fails
    }
  };

  export default connectDB;