-- AlterTable
ALTER TABLE "Email" ADD COLUMN     "sentAt" TIMESTAMP(3),
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'scheduled';
