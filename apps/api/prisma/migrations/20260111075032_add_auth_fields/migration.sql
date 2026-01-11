-- AlterTable
ALTER TABLE "users" ADD COLUMN     "email_verification_token" TEXT,
ADD COLUMN     "email_verification_token_expires_at" TIMESTAMP(3),
ADD COLUMN     "refresh_token" TEXT,
ADD COLUMN     "refresh_token_expires_at" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_refresh_token_idx" ON "users"("refresh_token");

-- CreateIndex
CREATE INDEX "users_email_verification_token_idx" ON "users"("email_verification_token");
