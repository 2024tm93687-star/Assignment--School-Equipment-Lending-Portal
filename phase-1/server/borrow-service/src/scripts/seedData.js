import Borrow from '../../Models/requestModel.js';
import logger from '../utils/logger.js';

const mockBorrows = [
  {
    userId: 3,
    borrowerName: 'John Student',
    equipmentId: 'hp-laptop-1',
    equipmentName: 'HP Laptop',
    status: 'approved',
    issueDate: new Date(),
    dueDate: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000),
    returnDate: null,
    remarks: 'For project',
    approvedBy: 2,
    createdAt: new Date(),
  },
  {
    userId: 2,
    borrowerName: 'Staff Member',
    equipmentId: 'microscope-1',
    equipmentName: 'Laboratory Microscope',
    status: 'pending',
    issueDate: new Date(),
    dueDate: new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000),
    returnDate: null,
    remarks: 'Lab session',
    approvedBy: null,
    createdAt: new Date(),
  }
];

export async function seedBorrows() {
  try {
    const count = await Borrow.countDocuments();
    if (count === 0) {
      logger.info('Seeding borrow data...');
      await Borrow.insertMany(mockBorrows);
      logger.info('Borrow data seeded successfully');
    } else {
      logger.info('Borrow data already exists, skipping seed');
    }
  } catch (error) {
    logger.error('Error seeding borrow data:', error);
    throw error;
  }
}
