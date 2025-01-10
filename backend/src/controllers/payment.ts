import { Request, Response } from 'express';
import { makePaymentService ,getPaymentsService,deleteAllPaymentsService} from '../services/payment';

export const makePayment = async (req: Request, res: Response): Promise<void> => {
  try {
    // Destructure and validate the input data
    const { paymentAmount, interest, principal, loanId, note } = req.body;

    if (
      paymentAmount === undefined ||
      interest === undefined ||
      principal === undefined ||
      !loanId
    ) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    // Ensure the `uid` is present
    const { uid } = req.user;
    if (!uid) {
      res.status(401).json({ error: 'Unauthorized: No user ID provided' });
      return
    }
    
    // Call the service layer to handle the payment logic
    const response = await makePaymentService(
      paymentAmount,
      // interest,
      // principal,
      loanId,
      uid,
      note,
    );

    // Return the successful response
     res.status(201).json(
        {
            updatedLoan: response.updatedLoan,
            payment: response.payment
        }
     );
  } catch (error: any) {
    console.error('Error in makePayment:', error);
     res.status(500).json({ error: 'An unexpected error occurred' });
  }
};

export const getPayments = async (req: Request, res: Response): Promise<void> => {
    try {
        // Ensure the `uid` is present
        const { uid } = req.user;
        const {id} = req.params;
        if (!uid) {
        res.status(401).json({ error: 'Unauthorized: No user ID provided' });
        return
        }
    
        // Call the service layer to fetch the user's payments
        const payments = await getPaymentsService(id);
        res.json(payments);
    } catch (error: any) {
        console.error('Error in getPayments:', error);
        res.status(500).json({ error: 'An unexpected error occurred' });
    }
}

export const deleteAllPayments = async (req: Request, res: Response): Promise<void> => {
    try {
        // Ensure the `uid` is present
        const { uid } = req.user;
        const {id} = req.params;
        if (!uid) {
        res.status(401).json({ error: 'Unauthorized: No user ID provided' });
        return
        }
    
        // Call the service layer to fetch the user's payments
        const payments = await deleteAllPaymentsService(id);
        res.json(payments);
    } catch (error: any) {
        console.error('Error in getPayments:', error);
        res.status(500).json({ error: 'An unexpected error occurred' });
    }
}