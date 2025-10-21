import mongoose from 'mongoose';
const CONDITION_TYPES = ['new', 'good', 'fair', 'poor', 'damaged', 'retired'];
const equipmentSchema = new mongoose.Schema({
  equipmentId: { type: Number, unique: true, required: true, index: true },
  name: { type: String, required: true ,index: true },
  category: { type: String,required: true ,index: true },
  condition: { type: String, enum: CONDITION_TYPES, required: true, default: 'new' },
  quantity: { type: Number,required: true , default: 1, min: 0 },
  available: { type: Boolean,default: true },
}, { timestamps: true, collation: { locale: 'en', strength: 2 } });

equipmentSchema.index({name:1 , category:1},
    {
        unique: true,
        collation:{locale: 'en' , strenght : 2}
    }
);

const EquipmentModel = mongoose.model('Equipment', equipmentSchema);

export default EquipmentModel;

