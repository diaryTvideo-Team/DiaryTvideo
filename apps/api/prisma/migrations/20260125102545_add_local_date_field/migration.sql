/*
  Warnings:

  - Added the required column `local_date` to the `diary_entries` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "diary_entries" ADD COLUMN     "local_date" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "diary_entries_user_id_local_date_idx" ON "diary_entries"("user_id", "local_date");
