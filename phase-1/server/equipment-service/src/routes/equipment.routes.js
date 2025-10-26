import express from 'express';
import { Router } from 'express';
import equipmentController from '../controllers/equipment.controller.js'

const equipmentRouter = Router();
equipmentRouter.get('/',equipmentController.getEquipment)
equipmentRouter.post('/',equipmentController.createEquipment);
equipmentRouter.put('/:id',equipmentController.updateEquipment);
equipmentRouter.delete('/:id',equipmentController.deleteEquipment);

export default equipmentRouter;

