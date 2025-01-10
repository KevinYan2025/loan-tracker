import { prisma } from "../configs/prisma";
import { Prisma } from "@prisma/client";

export const makePaymentService = async (
  paymentAmount: number,
  loanId: string,
  userId: string,
  note: string
) => {
  try {
    if (!paymentAmount || !loanId || !userId) {
      throw new Error("Missing required fields");
    }

    // Perform transaction
    const [updatedLoan, payment] = await prisma.$transaction(async (tx) => {
      // Fetch the current loan details
      const loan = await tx.loan.findUnique({
        where: { id: loanId },
        select: {
          accruedInterest: true,
          remainingAmount: true,
        },
      });

      if (!loan) {
        throw new Error("Loan not found");
      }

      const paymentAmountDecimal = new Prisma.Decimal(paymentAmount);
      let remainingPayment = paymentAmountDecimal;

      // Apply payment to accrued interest first
      let newAccruedInterest = loan.accruedInterest;
      let interestPaid = new Prisma.Decimal(0);
      if (remainingPayment.greaterThan(0)) {
        const interestPayment = Prisma.Decimal.min(
          loan.accruedInterest,
          remainingPayment
        );
        newAccruedInterest = loan.accruedInterest.minus(interestPayment);
        remainingPayment = remainingPayment.minus(interestPayment);
        interestPaid = interestPayment;
      }

      // Apply remaining payment to principal
      let newRemainingAmount = loan.remainingAmount;
      let principalPaid = new Prisma.Decimal(0);
      if (remainingPayment.greaterThan(0)) {
        const principalPayment = Prisma.Decimal.min(
          loan.remainingAmount,
          remainingPayment
        );
        newRemainingAmount = loan.remainingAmount.minus(principalPayment);
        remainingPayment = remainingPayment.minus(principalPayment);
        principalPaid = principalPayment;
      }

      if (remainingPayment.greaterThan(0)) {
        throw new Error(
          "Payment amount exceeds total loan balance (principal + interest)"
        );
      }

      // Update the loan's accrued interest and remaining amount
      const updatedLoan = await tx.loan.update({
        where: { id: loanId },
        data: {
          accruedInterest: newAccruedInterest,
          remainingAmount: newRemainingAmount,
          updatedAt: new Date(),
        },
      });

      // Log the payment
      const payment = await tx.payment.create({
        data: {
          loanId,
          amount: paymentAmountDecimal,
          interest: interestPaid, // Exact interest portion
          principal: principalPaid, // Exact principal portion
          note,
          outstanding: updatedLoan.remainingAmount,
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

export const deleteAllPaymentsService = async (loanId: string) => {
    try {
      const payments = await prisma.payment.deleteMany({
        where: {
          loanId,
        },
      });
      return payments;
    } catch (error) {
      throw new Error("Could not delete payments");
    }
}