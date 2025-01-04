import { Router } from 'express';
import { createLoan,getLoanById,getLoans,getLoanDocumentById } from '../controllers/loan';
import { authenticate } from '../middlewares/auth';
import upload from '../configs/multer';
const route = Router();


route.post('/', authenticate,upload, createLoan)
route.get('/', authenticate, getLoans)
route.get('/s3/:id', authenticate, getLoanDocumentById)
route.get('/:id', authenticate, getLoanById)

export default route;