import mongoose from 'mongoose';
const connectionMongoDb = async(url) => {
    mongoose.set('strictQuery',true);
    mongoose.set('debug',true);
    await mongoose.connect(url,
        {
            minPoolSize : 5,
            timeoutMS : 20000
        }
    )
};