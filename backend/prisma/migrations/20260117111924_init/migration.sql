/*
  Warnings:

  - You are about to drop the column `sentAt` on the `Email` table. All the data in the column will be lost.
  - The `status` column on the `Email` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "EmailStatus" AS ENUM ('scheduled', 'sent', 'failed');

-- AlterTable
ALTER TABLE "Email" DROP COLUMN "sentAt",
DROP COLUMN "status",
ADD COLUMN     "status" "EmailStatus" NOT NULL DEFAULT 'scheduled';
