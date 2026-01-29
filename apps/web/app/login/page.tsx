"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { AuthForm } from "@/components/auth-form";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { COOMON_TRANSLATIONS } from "@/lib/translations";

export default function LoginPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/diary");
    }
  }, [user, isLoading, router]);

  // 로딩 중이거나 이미 로그인된 경우 폼 숨김
  if (isLoading || user) {
    return null;
  }

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
        <AuthForm mode="login" />
      </div>
    </main>
  );
}
