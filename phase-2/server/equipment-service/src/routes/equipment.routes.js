import { Router } from 'express';
import equipmentController from '../controllers/equipment.controller.js';
import authenticate from '../middleware/authentication.js';

const equipmentRouter = Router();
equipmentRouter.get('/', authenticate, equipmentController.getEquipment);
equipmentRouter.post('/', authenticate, equipmentController.createEquipment);
equipmentRouter.put('/:id', authenticate, equipmentController.updateEquipment);
equipmentRouter.delete('/:id', authenticate, equipmentController.deleteEquipment);

export default equipmentRouter;

