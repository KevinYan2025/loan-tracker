import { prisma } from "../configs/prisma";
import { Prisma } from '@prisma/client';
import { Role } from "@prisma/client";
import { parse } from "node:path";
interface CreateLoanInput {
  userId: string;
  role: Role;
  title: string;
  description?: string;
  initialAmount: Prisma.Decimal;
  remainingAmount: Prisma.Decimal;
  interestRate: Prisma.Decimal;
  termCount: number;
  termPayment: Prisma.Decimal;
  counterparty: string;
}

export const createLoanService = async (input: CreateLoanInput) => {
  const {
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
  } = input;

  try {
    const loan = await prisma.loan.create({
      data: {
        userId,
        role,
        title,
        description,
        initialAmount,
        remainingAmount,
        interestRate,
        termCount : parseInt(termCount.toString()),
        termPayment,
        counterparty,
      },
    });
    return loan;
  } catch (error) {
    console.error('Error creating loan:', error);
    throw new Error('Could not create loan');
  }
};

export const getLoansService = async (userId: string) => {
    const loans = await prisma.loan.findMany({
      where: {
        userId,
      },
    });
    return loans;
  };
  
  export const getLoanByIdService = async (id: string, userId: string) => {
    const loan = await prisma.loan.findUnique({
      where: {
        userId,
        id,
      },
    });
    return loan;
  };

  export const updateLoanByIdService = async (id: string, userId: string, data: Prisma.LoanUpdateInput) => {
    const loan = await prisma.loan.update({
      where: {
        userId,
        id,
      },
      data,
    });
    return loan;
  }