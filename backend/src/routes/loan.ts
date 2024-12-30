import { Router } from 'express';
import { createLoan,getLoanById,getLoans } from '../controllers/loan';
const route = Router();

import { authenticate } from '../middlewares/auth';

route.post('/', authenticate, createLoan)
route.get('/', authenticate, getLoans)
route.get('/:id', authenticate, getLoanById)

export default route;