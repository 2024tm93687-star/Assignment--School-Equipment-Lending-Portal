import mongoose from "mongoose";
const CONDITION_TYPES = ["new", "good", "fair", "poor", "damaged", "retired"];
const equipmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    category: { type: String, required: true, index: true },
    condition: {
      type: String,
      enum: CONDITION_TYPES,
      required: true,
      default: "new",
    },
    quantity: { type: Number, required: true, default: 0, min: 0 },
    available: { type: Number, required: true, default: 0, min: 0 },
  },
  { timestamps: true, collation: { locale: "en", strength: 2 } }
);

equipmentSchema.index(
  { name: 1, category: 1 },
  {
    collation: { locale: "en", strength: 2 },
  }
);

const EquipmentItem = mongoose.model("Equipment", equipmentSchema);

export default EquipmentItem;
