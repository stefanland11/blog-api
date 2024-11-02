-- AlterTable
ALTER TABLE "Comment" ALTER COLUMN "editedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "editedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" DROP NOT NULL;
