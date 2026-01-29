import { Suspense } from "react";
import { AuthForm } from "@/components/auth-form";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { COOMON_TRANSLATIONS } from "@/lib/translations";

export default function ForgotPasswordPage() {
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
        <Suspense>
          <AuthForm mode="forgot-password" />
        </Suspense>
      </div>
    </main>
  );
}
