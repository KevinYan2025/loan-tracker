/*
  Warnings:

  - You are about to drop the column `urls` on the `Document` table. All the data in the column will be lost.
  - Added the required column `s3_folder_path` to the `Document` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Document" DROP COLUMN "urls",
ADD COLUMN     "s3_folder_path" TEXT NOT NULL;
