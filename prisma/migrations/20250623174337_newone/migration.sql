-- AlterTable
ALTER TABLE "Assessment" ALTER COLUMN "type" DROP NOT NULL,
ALTER COLUMN "type" SET DEFAULT 'default';
