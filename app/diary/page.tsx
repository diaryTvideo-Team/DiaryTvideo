'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DiaryList } from '@/components/diary-list';
import { Button } from '@/components/ui/button';
import { PenLine, LogOut, BookOpen } from 'lucide-react';
import { useAuth } from '@/components/auth-provider';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageToggle, useLanguage } from '@/components/language-toggle';
import { translations } from '@/lib/translations';

export default function DiaryPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const { language } = useLanguage();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const t = translations[language];

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
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/diary" className="flex items-center gap-2">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <BookOpen className="h-6 w-6 text-primary" />
                  <h1 className="font-serif text-3xl font-bold text-foreground">
                    {t.project_name}
                  </h1>
                </div>
                <p className="mt-1 text-muted-foreground">
                  {t.welcomeBack}, {user.name}
                </p>
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
            <Link href="/diary/new">
              <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                <PenLine className="h-4 w-4" />
                {t.newEntry}
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              title={t.logout}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>

        <DiaryList language={language} />
      </div>
    </main>
  );
}
