import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema(
    {
        _id : {type : String,required:true},
        seq : {type : Number}
    }
)

export async function getNextSeqVal(seqName){
  const Counter = await CounterModel.findByIdAndUpdate(
    {_id : `{seqName}`},
    {$inc : {seq : 1}},
    {new : true, upsert: true}
  )
  return Counter.seq;
}
const CounterModel = mongoose.model('Counter',counterSchema);
export default CounterModel;
