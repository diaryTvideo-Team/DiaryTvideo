"use client";

import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { translations } from "@/lib/translations";
import { useLanguage } from "./language-toggle";

type ErrorType = "no-token" | "expired" | "invalid" | "already-used";

interface ResetPasswordErrorProps {
  type: ErrorType;
}

const ERROR_CONFIG: Record<
  ErrorType,
  { titleKey: string; descKey: string; actionKey: string; actionHref: string }
> = {
  "no-token": {
    titleKey: "invalidAccess",
    descKey: "invalidAccessDesc",
    actionKey: "goToLogin",
    actionHref: "/login",
  },
  expired: {
    titleKey: "linkExpired",
    descKey: "linkExpiredDesc",
    actionKey: "requestNewLink",
    actionHref: "/forgot-password",
  },
  invalid: {
    titleKey: "invalidLink",
    descKey: "invalidLinkDesc",
    actionKey: "goToLogin",
    actionHref: "/login",
  },
  "already-used": {
    titleKey: "linkAlreadyUsed",
    descKey: "linkAlreadyUsedDesc",
    actionKey: "goToLogin",
    actionHref: "/login",
  },
};

export function ResetPasswordError({ type }: ResetPasswordErrorProps) {
  const { language } = useLanguage();
  const t = translations[language];
  const config = ERROR_CONFIG[type];

  return (
    <Card className="w-full max-w-md border-destructive/50">
      <CardHeader className="text-center space-y-2">
        <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-2">
          <AlertCircle className="w-6 h-6 text-destructive" />
        </div>
        <CardTitle className="text-2xl text-destructive">
          {t[config.titleKey as keyof typeof t]}
        </CardTitle>
        <CardDescription className="text-base">
          {t[config.descKey as keyof typeof t]}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild className="w-full">
          <Link href={config.actionHref}>
            {t[config.actionKey as keyof typeof t]}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
