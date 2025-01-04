/*
  Warnings:

  - You are about to drop the `Document` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_loanId_fkey";

-- AlterTable
ALTER TABLE "Loan" ADD COLUMN     "files" TEXT[];

-- DropTable
DROP TABLE "Document";
