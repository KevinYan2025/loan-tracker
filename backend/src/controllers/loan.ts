import { Request, Response } from 'express';
import { createLoanService, getLoanByIdService, getLoansService } from '../services/loan';
import { uploadFileToS3, deleteFileFromS3, getPresignedUrls } from '../configs/aws';
import { prisma } from '../configs/prisma';

export const createLoan = async (req: Request, res: Response): Promise<void> => {
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
  const files = req.files as Express.Multer.File[];
  const userId = req.user?.uid;

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized: No user ID provided' });
    return;
  }

  const uploadedFiles: string[] = []; // Track successfully uploaded files

  try {
    // Start a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Step 1: Create the loan
      const loan = await tx.loan.create({
        data: {
          userId,
          role,
          title,
          description,
          initialAmount: parseFloat(initialAmount),
          remainingAmount: parseFloat(remainingAmount),
          interestRate: parseFloat(interestRate),
          termCount: parseInt(termCount, 10),
          termPayment: parseFloat(termPayment),
          counterparty,
        },
      });

      let documentUrls: string[] = [];
      for (const file of files) {
        const filePath = `${userId}/loan-files/${loan.id}/${Date.now()}-${file.originalname}`;
        const fileUrl = await uploadFileToS3(file, filePath);
        uploadedFiles.push(filePath); // Track the uploaded file for potential cleanup
        documentUrls.push(fileUrl); // Add the uploaded file URL to the array
      }

      // Step 3: Save document URLs in the database
      await tx.document.create({
        data: {
          loanId: loan.id,
          s3_folder_path: `${userId}/loan-files/${loan.id}/`, // Save the array of URLs
        },
      });

      return loan;
    });

    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating loan with documents:', error);

    // Roll back: Delete uploaded files from S3 if operation fails
    for (const filePath of uploadedFiles) {
      try {
        await deleteFileFromS3(filePath);
      } catch (deleteError) {
        console.error('Error deleting file from S3:', deleteError);
      }
    }

    res.status(500).json({ error: 'An error occurred while creating the loan.' });
  }
};

export const getLoans = async (req: Request, res: Response): Promise<void> => {
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
};

export const getLoanById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user.uid;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized: No user ID provided' });
      return;
    }
    const loan = await getLoanByIdService(userId, id);
    res.json(loan);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getLoanDocumentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user.uid;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized: No user ID provided' });
      return;
    }
    const document = await prisma.document.findFirst({
      where: {
        loanId: id,
      },
    });
    if (!document?.s3_folder_path) {
      res.status(404).json({ error: 'Document not found' });
      return;
    }
    const urls = await getPresignedUrls(document.s3_folder_path);
    res.status(200).json(urls);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
