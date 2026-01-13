"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { ResetPasswordForm } from "@/components/reset-password-form";
import { ResetPasswordError } from "@/components/reset-password-error";
import { COOMON_TRANSLATIONS } from "@/lib/translations";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  // No token provided - show error
  if (!token) {
    return <ResetPasswordError type="no-token" />;
  }

  // TODO: Add token validation logic here
  // - Call API to validate token
  // - Check if expired, invalid, or already used
  // - For now, just show the form

  return <ResetPasswordForm token={token} />;
}

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 w-fit">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="font-serif text-xl font-semibold text-foreground">
              {COOMON_TRANSLATIONS.project_name}
            </span>
          </Link>
          <ThemeToggle />
        </div>
      </header>
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <Suspense
          fallback={
            <div className="w-full max-w-md text-center text-muted-foreground">
              Loading...
            </div>
          }
        >
          <ResetPasswordContent />
        </Suspense>
      </div>
    </main>
  );
}
