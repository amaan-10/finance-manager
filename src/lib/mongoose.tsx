// lib/mongoose.ts
import mongoose from "mongoose";

let _mongoClientPromise: Promise<typeof mongoose> | undefined;

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable.");
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = mongoose.connect(MONGODB_URI);
  }
  _mongoClientPromise = global._mongoClientPromise;
} else {
  _mongoClientPromise = mongoose.connect(MONGODB_URI);
}

export const connectToDatabase = async () => {
  try {
    const connection = await _mongoClientPromise;
    console.log("Connected to MongoDB");
    return connection;
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw error;
  }
};
