"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createEntry } from "@/lib/diary-store";
import { ApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "./language-toggle";
import { translations } from "@/lib/translations";

export function DiaryForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { language } = useLanguage();

  const t = translations[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setError("");
    setIsSubmitting(true);

    try {
      await createEntry({ title: title.trim(), content: content.trim() });
      router.push("/diary");
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/diary"
          className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="font-serif text-2xl font-semibold text-foreground">
          {t.newEntry}
        </h1>
      </div>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="mb-2 block text-sm font-medium text-foreground"
          >
            {t.newEntryTitle}
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t.newEntryTitlePlaceholder}
            className="w-full rounded-lg border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            required
          />
        </div>

        <div>
          <label
            htmlFor="content"
            className="mb-2 block text-sm font-medium text-foreground"
          >
            {t.newEntryDescription}
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={t.newEntryDescriptionPlaceholder}
            rows={12}
            className="w-full resize-none rounded-lg border border-border bg-card px-4 py-3 text-foreground leading-relaxed placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            required
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>
      )}

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/diary")}
          className="border-border text-foreground hover:bg-secondary"
        >
          {t.cancel}
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || !title.trim() || !content.trim()}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isSubmitting ? "Saving..." : t.saveEntry}
        </Button>
      </div>
    </form>
  );
}
