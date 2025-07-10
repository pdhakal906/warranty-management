/*
  Warnings:

  - You are about to drop the column `serialNumber` on the `Product` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Product_serialNumber_key";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "serialNumber";
