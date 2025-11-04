import express from "express";
import cors from "cors";
import connectionMongoDb from "./db/mongo.js";
import equipmentRouter from "./routes/equipment.routes.js";
import logger from "./utils/logger.js";
import { seedEquipment } from "./scripts/seedData.js";

const equipmentServiceApp = async function createEquipmentServiceApp() {
  logger.info("Creating Equipment Service");
  const expressApp = express();
  try {
    // Connect to MongoDB
    await connectionMongoDb(
      process.env.MONGODB_URL || "mongodb://localhost:27017/equipmentdb"
    );

    // Seed initial data
    await seedEquipment();

    // Configure middleware
    expressApp.use(cors());
    expressApp.use(express.json());
    expressApp.use("/api/equipment", equipmentRouter);
    expressApp.get("/health", (req, res) => res.json({ status: "ok" }));

    logger.info("Equipment Service initialized with seed data");
  } catch (error) {
    logger.error("Failed to initialize app Equipment Service");
    throw error;
  }
  return expressApp;
};

export default equipmentServiceApp;
