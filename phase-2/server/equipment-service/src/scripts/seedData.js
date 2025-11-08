import mongoose from "mongoose";
import EquipmentItem from "../models/equipment.model.js";
import logger from "../utils/logger.js";

const mockEquipment = [
  { name: "HP Laptop", category: "Computers", condition: "new", quantity: 10, available: 10 },
  { name: "MacBook Air", category: "Computers", condition: "good", quantity: 5, available: 5 },
  { name: "Dell Inspiron", category: "Computers", condition: "good", quantity: 6, available: 6 },
  { name: "Scientific Calculator", category: "Electronics", condition: "good", quantity: 20, available: 15 },
  { name: "Graphing Calculator", category: "Electronics", condition: "good", quantity: 8, available: 6 },
  { name: "Digital Camera", category: "Photography", condition: "fair", quantity: 5, available: 3 },
  { name: "DSLR Camera", category: "Photography", condition: "good", quantity: 3, available: 2 },
  { name: "Laboratory Microscope", category: "Lab Equipment", condition: "good", quantity: 8, available: 8 },
  { name: "Portable Microscope", category: "Lab Equipment", condition: "fair", quantity: 4, available: 3 },
  { name: "LED Projector", category: "AV", condition: "good", quantity: 4, available: 4 },
  { name: "Conference Projector", category: "AV", condition: "good", quantity: 2, available: 2 },
  { name: "iPad", category: "Tablets", condition: "good", quantity: 6, available: 5 },
  { name: "VR Headset", category: "AV", condition: "fair", quantity: 2, available: 1 },
  { name: "Portable Speaker", category: "Audio", condition: "good", quantity: 3, available: 3 },
  { name: "Sports Equipment Set", category: "Sports", condition: "new", quantity: 3, available: 3 }
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
