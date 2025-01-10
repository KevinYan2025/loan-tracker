/*
  Warnings:

  - You are about to drop the column `counterparty` on the `Loan` table. All the data in the column will be lost.
  - Added the required column `lender` to the `Loan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Loan" DROP COLUMN "counterparty",
ADD COLUMN     "lender" TEXT NOT NULL;
