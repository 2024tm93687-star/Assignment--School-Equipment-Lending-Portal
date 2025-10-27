import mongoose from 'mongoose';
import EquipmentItem from '../models/equipment.model.js';
import logger from '../utils/logger.js';

const getEquipment = async(req,res) =>{
    logger.debug("getEquipment initiated");
    const session = await mongoose.startSession();
    try{
        session.startTransaction();
        const { equipmentId, category, name, condition, available } = req.query;
        const filter = {}

        if(category){
            filter.category = category;
        }
        if(name){
            filter.name = name;
        }
        if(name){
            filter.condition = condition;
        }
        if(name){
            filter.equipmentId = equipmentId;
        }
        if(name){
            filter.available = available;
        }
        const equipment = await EquipmentItem.find(filter);
        if(equipment.length === 0)
        {
            res.status(200).json({
                message: "No equipment found matching your query.",
                data :equipment});
        }else{
            res.status(200).json(equipment);
        }
    }catch(error){
        session.abortTransaction();
        logger.error("Error updating equipment :",error);
        res.status(500).json({error : 'Internal Server Error'})
    }finally{
        session.endSession();
    }
};

const createEquipment = async(req, res)=>{
    logger.debug("createEquipment initiated for :" + req.body.name);
    const session = await mongoose.startSession();
    try{
        session.startTransaction();
        const{name,category, condition, quantity, available} = req.body;
        const newEquipment = new EquipmentItem({
            name,category,condition,quantity,available
        });
        await newEquipment.save();
          
        res.status(201).json(newEquipment);
        session.commitTransaction();
        logger.debug("Equipment  created for :" + req.body.name);
    }catch(error){
        session.abortTransaction();
        if (error.code === 11000) {
            logger.error("Duplicate equipment found:", error.keyValue);
            return res.status(409).json({
                error: "Duplicate entry",
                message: `Equipment with ${Object.keys(error.keyValue).join(', ')} already exists.`,
            });
        }
        logger.error("Error creating equipment :",error);
        res.status(500).json({error : 'Internal Server Error'})
    }finally{
        session.endSession();
    }
};

const updateEquipment = async(req, res)=>{
    logger.debug("updateEquipment initiated for :" + req.params.id);
     const session = await mongoose.startSession();
    try{
        session.startTransaction();
        const{id} = req.params;
        const updates = req.body;
       
        const updateEquipment = await EquipmentItem.findByIdAndUpdate(id,updates,{new:true});
        if(!updateEquipment)
        {
            return res.status(404).json({error: `Equipment ${id} not found`});
        }
        res.status(200).json(updateEquipment);
        session.commitTransaction();
        logger.debug("Equipment  updated for :" + req.body.name);
    }catch(error){
        session.abortTransaction();
        logger.error("Error updating equipment :",error);
        res.status(500).json({error : 'Internal Server Error'})
    }finally{
        session.endSession();
    }
};

const deleteEquipment = async(req, res)=>{
    logger.debug("deleteEquipment initiated for :" + req.params.id);
     const session = await mongoose.startSession();
    try{
       session.startTransaction();
        const{id} = req.params;       
        const deleteEquipment = await EquipmentItem.findByIdAndDelete(id);
        if(!deleteEquipment)
        {
            return res.status(404).json({error: `Equipment ${id} not found`});
        }
        res.status(204).send();
        session.commitTransaction();
        logger.debug("Equipment  deleted for :" + req.params.id);
    }catch(error){
        session.abortTransaction();
        logger.error("Error deleting equipment :",error);
        res.status(500).json({error : 'Internal Server Error'})
    }finally{
        session.endSession();
    }
};

export default {
    getEquipment,
    createEquipment,
    updateEquipment,
    deleteEquipment
}

