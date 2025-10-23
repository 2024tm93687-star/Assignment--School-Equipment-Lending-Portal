import dotenv from 'dotenv';
import equipmentServiceApp from './server.js';

const PORT = process.env.PORT || 3000;
dotenv.config();

const equipmentService = await equipmentServiceApp();
const equipmentServer = equipmentService.listen(PORT,()=>{
    console.log(`Equipment Service started on port ${PORT}`);
});

