import { Request, Response } from 'express';
import { createLoanService ,getLoanByIdService,getLoansService} from '../services/loan';

export const createLoan = async (req: Request, res: Response) => {
  const {
    role,
    title,
    description,
    initialAmount,
    remainingAmount,
    interestRate,
    termCount,
    termPayment,
    counterparty,
  } = req.body;
    const userId = req.user.uid;
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized: No user ID provided' });
    return;
  }
  try {
    const loan = await createLoanService({
      userId,
      role,
      title,
      description,
      initialAmount,
      remainingAmount,
      interestRate,
      termCount,
      termPayment,
      counterparty,
    });
    res.status(201).json(loan);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getLoans = async (req: Request, res: Response) => {
    try {
        const userId = req.user.uid;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized: No user ID provided' });
            return;
        }
        const loans = await getLoansService(userId);
        res.json(loans);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
        
    }
}

export const getLoanById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user.uid;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized: No user ID provided' });
            return;
        }
        const loan = await getLoanByIdService(userId,id);
        res.json(loan);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
        
    }
}