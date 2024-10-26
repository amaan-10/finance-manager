// lib/mongoose.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable.");
}

let isConnected = false; // Track the connection state

export const connectToDatabase = async () => {
  if (isConnected) {
    console.log("Already connected to MongoDB");
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI); // No need for extra options
    isConnected = true;
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};
