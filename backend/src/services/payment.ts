import { prisma } from "../configs/prisma";
import { Prisma } from "@prisma/client";
export const makePaymentService = async (
  paymentAmount: number,
  interest: number,
  principal: number,
  loanId: string,
  userId: string,
  note: string
) => {
  try {
    // Perform transaction
    const [updatedLoan, payment] = await prisma.$transaction(async (tx) => {
      // Update the loan's remaining amount
      const updatedLoan = await tx.loan.update({
        where: { id: loanId },
        data: {
          remainingAmount: {
            decrement: principal,
          },
          updatedAt: new Date(),
        },
      });
      const paymentAmountDecimal = new Prisma.Decimal(paymentAmount);

      if (updatedLoan.remainingAmount.lessThan(paymentAmountDecimal)) {
        throw new Error("Payment amount exceeds remaining loan amount");
      }

      // Log the payment
      const payment = await tx.payment.create({
        data: {
          loanId,
          amount: paymentAmount,
          interest,
          principal,
          note,
          paymentDate: new Date(),
        },
      });

      // Return both updated loan and payment as an array
      return [updatedLoan, payment];
    });

    // Return the results
    return { updatedLoan, payment };
  } catch (error) {
    console.error("Transaction failed:", error);
    throw error; // Re-throw the error to be handled by the controller
  }
};

export const getPaymentsService = async (loanId: string) => {
    const payments = await prisma.payment.findMany({
        where: {
        loanId,
        },
    });
    return payments;
}