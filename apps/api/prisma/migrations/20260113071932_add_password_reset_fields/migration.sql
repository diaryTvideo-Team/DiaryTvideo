-- AlterTable
ALTER TABLE "users" ADD COLUMN     "password_reset_token" TEXT,
ADD COLUMN     "password_reset_token_expires_at" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "users_password_reset_token_idx" ON "users"("password_reset_token");
