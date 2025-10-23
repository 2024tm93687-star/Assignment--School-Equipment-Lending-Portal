import express from 'express';
import cors from 'cors';
import connectionMongoDb from './db/mongo.js'
import equipmentRouter from './routes/equipment.routes.js'
import logger from './utils/logger.js'

const equipmentServiceApp = async function createEquipmentServiceApp(){
    logger.info("Creating Equipment Service");
    const expressApp = express();
    try{
        
        await connectionMongoDb(process.env.MONGODB_URL|| 'mongodb://localhost:27017/equipmentdb')
        expressApp.use(cors());
        expressApp.use(express.json());
        expressApp.use('/equipment',equipmentRouter);
        expressApp.get('/health',(req,res)=>res.json({status:"ok"}));
        logger.info("Equipment Service initialized");
    }catch(error){
        logger.error("Failed to initialize app Equipment Service");
        throw error;
    }
    return expressApp;
};

export default equipmentServiceApp