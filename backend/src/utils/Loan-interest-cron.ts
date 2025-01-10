import { CronJob } from 'cron';
import { prisma } from '../configs/prisma';
import { Prisma } from '@prisma/client';

// Function to calculate daily interest
function calculateDailyInterest(principal: Prisma.Decimal, rate: Prisma.Decimal): Prisma.Decimal {
  const dailyRate = rate.div(365); // Convert annual rate to daily rate
  return principal.mul(dailyRate);
}

// Define the cron job
const updateLoanAccruedInterest = new CronJob(
      '0 0 * * *', // Runs daily at midnight
//   '*/1 * * * * *', // Every second (for testing; adjust for production)
  async () => {
    console.log('Running daily loan update job...');

    try {
      // Fetch all active loans
      const loans = await prisma.loan.findMany({
        where: { remainingAmount: { gt: 0 } },
      });

      for (const loan of loans) {
        const { remainingAmount, interestRate, accruedInterest, id } = loan;

        try {
          // Calculate daily interest
          const dailyInterest = calculateDailyInterest(
            new Prisma.Decimal(remainingAmount).add(accruedInterest),
            new Prisma.Decimal(interestRate)
          );

          // Update accrued interest
          const newAccruedInterest = new Prisma.Decimal(accruedInterest).add(dailyInterest);

          // Update the loan in the database
          await prisma.loan.update({
            where: { id },
            data: {
              accruedInterest: newAccruedInterest,
              updatedAt: new Date(), // Update the timestamp
            },
          });

        } catch (loanError: any) {
          // Handle error for this specific loan
          console.error(`Error updating loan ${id}:`, loanError.message || loanError);
        }
      }
    } catch (error) {
      // Log unexpected errors that may occur while fetching loans or initializing the loop
      console.error('Error in loan update job:', error);
    }
  },
  null, // onComplete callback (not used here)
  true, // Start the job immediately
  'UTC' // Timezone
);

export default updateLoanAccruedInterest;
