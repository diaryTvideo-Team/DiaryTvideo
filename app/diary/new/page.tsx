'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { DiaryForm } from '@/components/diary-form';
import { useAuth } from '@/components/auth-provider';
import { ThemeToggle } from '@/components/theme-toggle';
import { BookOpen } from 'lucide-react';
import { COOMON_TRANSLATIONS } from '@/lib/translations';

export default function NewEntryPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border mb-8">
        <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link href="/diary" className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="font-serif text-xl font-semibold text-foreground">
              {COOMON_TRANSLATIONS.project_name}
            </span>
          </Link>
          <ThemeToggle />
        </div>
      </header>
      <div className="mx-auto max-w-2xl px-4 pb-8 sm:px-6 lg:px-8">
        <DiaryForm />
      </div>
    </main>
  );
}
