import EquipmentItem from "../models/equipment.model.js";
import logger from "../utils/logger.js";

// GET /api/equipment
const getEquipment = async (req, res) => {
  logger.debug("getEquipment initiated");

  try {
    const { category, name, condition, available } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (name) filter.name = name;
    if (condition) filter.condition = condition;
    if (available !== undefined) filter.available = available;

    const equipment = await EquipmentItem.find(filter);

    res.status(200).json({ items: equipment }); // normalized for client
  } catch (error) {
    logger.error("Error fetching equipment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// POST /api/equipment
const createEquipment = async (req, res) => {
  logger.debug("createEquipment initiated for: " + req.body.name);

  try {
    const { name, category, condition, quantity, available } = req.body;

    const newEquipment = new EquipmentItem({
      name,
      category,
      condition,
      quantity,
      available,
    });

    await newEquipment.save();

    res.status(201).json(newEquipment);
    logger.debug("Equipment created for: " + req.body.name);
  } catch (error) {
    if (error.code === 11000) {
      logger.error("Duplicate equipment found:", error.keyValue);
      return res.status(409).json({
        error: "Duplicate entry",
        message: `Equipment with ${Object.keys(error.keyValue).join(
          ", "
        )} already exists.`,
      });
    }
    logger.error("Error creating equipment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// PUT /api/equipment/:id
const updateEquipment = async (req, res) => {
  logger.debug("updateEquipment initiated for: " + req.params.id);

  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedEquipment = await EquipmentItem.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    );

    if (!updatedEquipment) {
      return res.status(404).json({ error: `Equipment ${id} not found` });
    }

    res.status(200).json(updatedEquipment);
    logger.debug("Equipment updated for: " + req.body.name);
  } catch (error) {
    logger.error("Error updating equipment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// DELETE /api/equipment/:id
const deleteEquipment = async (req, res) => {
  logger.debug("deleteEquipment initiated for: " + req.params.id);

  try {
    const { id } = req.params;
    const deletedEquipment = await EquipmentItem.findByIdAndDelete(id);

    if (!deletedEquipment) {
      return res.status(404).json({ error: `Equipment ${id} not found` });
    }

    res.status(204).send();
    logger.debug("Equipment deleted for: " + req.params.id);
  } catch (error) {
    logger.error("Error deleting equipment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default {
  getEquipment,
  createEquipment,
  updateEquipment,
  deleteEquipment,
};
