import mongoose from "mongoose";
import logger from "../utils/logger/winston";
import { config } from "./config";

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoURI, {});
    logger.info("MongoDB connected successfully");
  } catch (error) {
    logger.error("MongoDB connection error:", error);
  }
};

export default connectDB;
