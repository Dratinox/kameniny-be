/*
  Warnings:

  - You are about to drop the column `stocks` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "stocks",
ADD COLUMN     "variation" TEXT;
