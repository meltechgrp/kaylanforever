/*
  Warnings:

  - You are about to drop the column `qrCode` on the `CheckIn` table. All the data in the column will be lost.
  - Made the column `userId` on table `CheckIn` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "CheckIn" DROP CONSTRAINT "CheckIn_userId_fkey";

-- DropIndex
DROP INDEX "CheckIn_qrCode_key";

-- AlterTable
ALTER TABLE "CheckIn" DROP COLUMN "qrCode",
ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "CheckIn" ADD CONSTRAINT "CheckIn_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
