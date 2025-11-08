import mongoose from 'mongoose';
import logger from '../utils/logger.js';
const connectionMongoDb = async(url) => {
    console.log("connecting to mongoDb" +url);
    mongoose.set('strictQuery',true);
    mongoose.set('debug',true);
    await mongoose.connect(url,
        {
            minPoolSize : 5,
            timeoutMS : 20000
        }
    )
    .then(()=>{
        logger.info("MongoDb connected successfully")
    })
    .catch((error)=>{
        logger.error("Error connecting MongoDb:",error);
    })
};
export default connectionMongoDb;