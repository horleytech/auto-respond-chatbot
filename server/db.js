import mongoose from "mongoose";

// Replace with your MongoDB connection string or use an environment variable
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/autoRespondDB";

export async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}
