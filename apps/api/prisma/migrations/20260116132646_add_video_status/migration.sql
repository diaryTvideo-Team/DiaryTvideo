-- CreateEnum
CREATE TYPE "VideoStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- AlterTable
ALTER TABLE "diary_entries" ADD COLUMN     "video_error" TEXT,
ADD COLUMN     "video_status" "VideoStatus" NOT NULL DEFAULT 'PENDING';

-- CreateIndex
CREATE INDEX "diary_entries_video_status_idx" ON "diary_entries"("video_status");
