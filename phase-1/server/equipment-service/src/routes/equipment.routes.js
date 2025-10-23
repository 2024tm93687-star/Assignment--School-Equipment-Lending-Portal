import express from 'express';
import { Router } from 'express';
import equipmentController from '../controllers/equipment.controller.js'

const equipmentRouter = Router();

equipmentRouter.post('/',equipmentController.createEquipment);
equipmentRouter.patch('/:id',equipmentController.patchEquipment);
equipmentRouter.delete('/:id',equipmentController.deleteEquipment);

export default equipmentRouter;

