/*
  Warnings:

  - You are about to drop the column `role` on the `Loan` table. All the data in the column will be lost.
  - You are about to drop the column `termCount` on the `Loan` table. All the data in the column will be lost.
  - You are about to drop the column `termPayment` on the `Loan` table. All the data in the column will be lost.
  - You are about to drop the column `paymentDate` on the `Payment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Loan" DROP COLUMN "role",
DROP COLUMN "termCount",
DROP COLUMN "termPayment",
ADD COLUMN     "accruedInterest" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
ADD COLUMN     "lastPaymentDate" TIMESTAMP(3),
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "paymentDate";

-- DropEnum
DROP TYPE "Role";
