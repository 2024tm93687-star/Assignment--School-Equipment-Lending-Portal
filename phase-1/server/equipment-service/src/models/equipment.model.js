import mongoose from 'mongoose';
import {getNextSeqVal} from './counter.model.js';
const CONDITION_TYPES = ['new', 'good', 'fair', 'poor', 'damaged', 'retired'];
const equipmentSchema = new mongoose.Schema({
  equipmentId: { type: Number, unique: true, required: true, index: true },
  name: { type: String, required: true ,index: true },
  category: { type: String,required: true ,index: true },
  condition: { type: String, enum: CONDITION_TYPES, required: true, default: 'new' },
  quantity: { type: Number,required: true , default: 0, min: 0 },
  available: { type: Number,required: true , default: 0, min: 0 },
}, { timestamps: true, collation: { locale: 'en', strength: 2 } });

equipmentSchema.index({name:1 , category:1},
    {
        unique: true,
        collation:{locale: 'en' , strength : 2}
    }
);

equipmentSchema.pre('validate',async function(){
  if(this.equipmentId == null || this.equipmentId === 0)
  {
    this.equipmentId = await getNextSeqVal("equipmentId");
  }
});

const EquipmentItem = mongoose.model('Equipment', equipmentSchema);

export default EquipmentItem;

