import mongoose from "mongoose";
import EquipmentItem from "../models/equipment.model.js";
import logger from "../utils/logger.js";

const mockEquipment = [
  {
    name: "HP Laptop",
    category: "Computers",
    condition: "new",
    quantity: 10,
    available: 10,
  },
  {
    name: "Scientific Calculator",
    category: "Electronics",
    condition: "good",
    quantity: 20,
    available: 15,
  },
  {
    name: "Digital Camera",
    category: "Photography",
    condition: "fair",
    quantity: 5,
    available: 3,
  },
  {
    name: "Laboratory Microscope",
    category: "Lab Equipment",
    condition: "good",
    quantity: 8,
    available: 8,
  },
  {
    name: "Sports Equipment Set",
    category: "Sports",
    condition: "new",
    quantity: 3,
    available: 3,
  },
];

export async function seedEquipment() {
  try {
    // Check if we already have equipment
    const count = await EquipmentItem.countDocuments();

    if (count === 0) {
      logger.info("Seeding equipment data...");
      await EquipmentItem.insertMany(mockEquipment);
      logger.info("Equipment data seeded successfully");
    } else {
      logger.info("Equipment data already exists, skipping seed");
    }
  } catch (error) {
    logger.error("Error seeding equipment data:", error);
    throw error;
  }
}
