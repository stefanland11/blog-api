/*
  Warnings:

  - Added the required column `editedAt` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `editedAt` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "editedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "editedAt" TIMESTAMP(3) NOT NULL;
