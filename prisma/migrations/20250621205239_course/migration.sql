/*
  Warnings:

  - You are about to drop the column `ownerId` on the `Assessment` table. All the data in the column will be lost.
  - You are about to drop the column `answer` on the `AssessmentQuestion` table. All the data in the column will be lost.
  - You are about to drop the column `correctAnswer` on the `AssessmentQuestion` table. All the data in the column will be lost.
  - You are about to drop the column `question` on the `AssessmentQuestion` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `AssessmentQuestion` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Assessment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `questionId` to the `AssessmentQuestion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Assessment" DROP CONSTRAINT "Assessment_ownerId_fkey";

-- AlterTable
ALTER TABLE "Assessment" DROP COLUMN "ownerId",
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "isPublished" BOOLEAN DEFAULT false,
ADD COLUMN     "startDate" TIMESTAMP(3),
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "AssessmentQuestion" DROP COLUMN "answer",
DROP COLUMN "correctAnswer",
DROP COLUMN "question",
DROP COLUMN "score",
ADD COLUMN     "questionId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Experience" ALTER COLUMN "startDate" SET DATA TYPE DATE,
ALTER COLUMN "endDate" SET DATA TYPE DATE;

-- CreateTable
CREATE TABLE "questions" (
    "id" TEXT NOT NULL,
    "question_text" TEXT NOT NULL,
    "question_type" TEXT NOT NULL,
    "options" JSONB,
    "correct_answer" TEXT,
    "explanation" TEXT,
    "category" TEXT,
    "difficulty" TEXT NOT NULL,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_responses" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "user_assessment_id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "response" TEXT,
    "is_correct" BOOLEAN,
    "points_earned" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_modules" (
    "id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "content_type" TEXT NOT NULL,
    "content_url" TEXT,
    "content_text" TEXT,
    "duration_minutes" INTEGER,
    "module_order" INTEGER NOT NULL,
    "is_required" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "course_modules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_course_enrollments" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "enrolled_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "progress_percentage" INTEGER NOT NULL DEFAULT 0,
    "last_accessed_at" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'enrolled',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_course_enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_module_progress" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "module_id" TEXT NOT NULL,
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "time_spent_minutes" INTEGER NOT NULL DEFAULT 0,
    "score" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'not_started',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_module_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_reviews" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "review_text" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "course_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningPlan" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LearningPlan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_course_enrollments_user_id_course_id_key" ON "user_course_enrollments"("user_id", "course_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_module_progress_user_id_module_id_key" ON "user_module_progress"("user_id", "module_id");

-- CreateIndex
CREATE UNIQUE INDEX "course_reviews_user_id_course_id_key" ON "course_reviews"("user_id", "course_id");

-- AddForeignKey
ALTER TABLE "Assessment" ADD CONSTRAINT "Assessment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentQuestion" ADD CONSTRAINT "AssessmentQuestion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_responses" ADD CONSTRAINT "user_responses_user_assessment_id_fkey" FOREIGN KEY ("user_assessment_id") REFERENCES "UserAssessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_responses" ADD CONSTRAINT "user_responses_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_responses" ADD CONSTRAINT "user_responses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_modules" ADD CONSTRAINT "course_modules_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_course_enrollments" ADD CONSTRAINT "user_course_enrollments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_course_enrollments" ADD CONSTRAINT "user_course_enrollments_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_module_progress" ADD CONSTRAINT "user_module_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_module_progress" ADD CONSTRAINT "user_module_progress_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "course_modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_reviews" ADD CONSTRAINT "course_reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_reviews" ADD CONSTRAINT "course_reviews_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningPlan" ADD CONSTRAINT "LearningPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
