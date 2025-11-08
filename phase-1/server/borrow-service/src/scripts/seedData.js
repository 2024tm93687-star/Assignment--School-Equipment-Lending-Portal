import Borrow from '../../Models/requestModel.js';
import logger from '../utils/logger.js';

const mockBorrows = [
  { userId: 3, borrowerName: 'John Student', equipmentId: 'hp-laptop-1', equipmentName: 'HP Laptop', status: 'approved', issueDate: new Date(), dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), returnDate: null, remarks: 'For project', approvedBy: 2, createdAt: new Date() },
  { userId: 2, borrowerName: 'Staff Member', equipmentId: 'microscope-1', equipmentName: 'Laboratory Microscope', status: 'pending', issueDate: new Date(), dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), returnDate: null, remarks: 'Lab session', approvedBy: null, createdAt: new Date() },
  { userId: 4, borrowerName: 'Alice Student', equipmentId: 'calculator-1', equipmentName: 'Scientific Calculator', status: 'pending', issueDate: new Date(), dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), returnDate: null, remarks: 'Homework', approvedBy: null, createdAt: new Date() },
  { userId: 5, borrowerName: 'Bob Student', equipmentId: 'camera-1', equipmentName: 'Digital Camera', status: 'approved', issueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), dueDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000), returnDate: null, remarks: 'Media club', approvedBy: 2, createdAt: new Date() },
  { userId: 6, borrowerName: 'Charlie Student', equipmentId: 'projector-1', equipmentName: 'LED Projector', status: 'rejected', issueDate: new Date(), dueDate: null, returnDate: null, remarks: 'Class demo', approvedBy: 2, createdAt: new Date() },
  { userId: 7, borrowerName: 'Dana Student', equipmentId: 'tablet-1', equipmentName: 'iPad', status: 'pending', issueDate: new Date(), dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), returnDate: null, remarks: 'Research', approvedBy: null, createdAt: new Date() },
  { userId: 8, borrowerName: 'Eli Student', equipmentId: 'vr-1', equipmentName: 'VR Headset', status: 'approved', issueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), returnDate: null, remarks: 'Design lab', approvedBy: 2, createdAt: new Date() },
  { userId: 9, borrowerName: 'Fay Student', equipmentId: 'microscope-2', equipmentName: 'Portable Microscope', status: 'pending', issueDate: new Date(), dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), returnDate: null, remarks: 'Field work', approvedBy: null, createdAt: new Date() },
  { userId: 10, borrowerName: 'Gabe Student', equipmentId: 'sound-1', equipmentName: 'Portable Speaker', status: 'approved', issueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), returnDate: null, remarks: 'Event', approvedBy: 2, createdAt: new Date() },
  { userId: 11, borrowerName: 'Hannah Student', equipmentId: 'dslr-1', equipmentName: 'DSLR Camera', status: 'pending', issueDate: new Date(), dueDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000), returnDate: null, remarks: 'Photography', approvedBy: null, createdAt: new Date() },
  { userId: 12, borrowerName: 'Ian Student', equipmentId: 'calculator-2', equipmentName: 'Graphing Calculator', status: 'approved', issueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), returnDate: null, remarks: 'Exam prep', approvedBy: 2, createdAt: new Date() },
  { userId: 2, borrowerName: 'Staff Member', equipmentId: 'projector-2', equipmentName: 'Conference Projector', status: 'pending', issueDate: new Date(), dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), returnDate: null, remarks: 'Department meeting', approvedBy: null, createdAt: new Date() }
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
