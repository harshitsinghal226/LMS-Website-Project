import mongoose from "mongoose";
import { Purchase } from "../models/Purchase.js";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", async () => {
      console.log("✅ Database Connected");
      
      // Drop the old non-sparse index and create a new sparse one
      try {
        // First, try to drop the existing index
        await Purchase.collection.dropIndex("paymentIntentId_1");
      } catch (e) {
        // Index might not exist, that's okay
      }
      
      // Create the new sparse unique index
      try {
        await Purchase.collection.createIndex(
          { paymentIntentId: 1 },
          { unique: true, sparse: true, name: "paymentIntentId_1" }
        );
      } catch (e) {
      }
    });

    await mongoose.connect(`${process.env.MONGODB_URI}/lms`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
