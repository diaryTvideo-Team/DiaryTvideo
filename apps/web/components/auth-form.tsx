"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  login,
  register,
  sendVerificationCode,
  verifyCode,
  resendVerificationCode,
  resendPasswordResetEmail,
} from "@/lib/auth-store";
import { useAuth } from "@/components/auth-provider";
import { useLanguage } from "./language-toggle";
import { translations } from "@/lib/translations";

interface AuthFormProps {
  mode: "login" | "register" | "verify" | "forgot-password";
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [verificationCode, setVerificationCode] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { language } = useLanguage();

  const t = translations[language];

  // Get email from URL params for verify mode
  useEffect(() => {
    if (mode === "verify") {
      const emailParam = searchParams.get("email");
      if (emailParam) {
        setEmail(emailParam);
      }
    }
  }, [mode, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (mode === "verify") {
      const code = verificationCode.join("");
      const result = verifyCode(email, code);
      if (result.success) {
        // Log user in after successful verification
        const users = localStorage.getItem("diary_users");
        if (users) {
          const parsedUsers = JSON.parse(users);
          const user = parsedUsers.find(
            (u: { email: string }) =>
              u.email.toLowerCase() === email.toLowerCase(),
          );
          if (user) {
            const publicUser = {
              id: user.id,
              email: user.email,
              name: user.name,
              createdAt: user.createdAt,
            };
            localStorage.setItem(
              "diary_current_user",
              JSON.stringify(publicUser),
            );
            refreshUser();
            router.push("/diary");
          }
        }
      } else {
        setError(result.error || "Verification failed");
      }
    } else if (mode === "register") {
      const result = register(email, password, name);
      if (result.success) {
        // Send verification code
        sendVerificationCode(email);
        // Redirect to verification page
        router.push(`/verify?email=${encodeURIComponent(email)}`);
      } else {
        setError(result.error || "Registration failed");
      }
    } else {
      const result = login(email, password);
      if (result.success) {
        refreshUser();
        router.push("/diary");
      } else {
        setError(result.error || "Login failed");
      }
    }

    setIsLoading(false);
  };

  const handleVerificationCodeChange = (index: number, value: string) => {
    // Only allow single alphanumeric character
    if (value && !/^[a-zA-Z0-9]$/.test(value)) return;

    const newCode = [...verificationCode];
    // Convert to uppercase
    newCode[index] = value.toUpperCase();
    setVerificationCode(newCode);

    // Auto-focus next input if value entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleVerificationCodeKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      // Move to previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    resendVerificationCode(email);
    setError("");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsResending(false);
    alert(t.verificationCodeResent);
  };

  const handleResendPasswordResetEmail = async () => {
    setIsResending(true);
    resendPasswordResetEmail(email);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsResending(false);
    alert(t.passwordResetEmailResent);
  };

  const isVerificationComplete = verificationCode.every(
    (digit) => digit !== "",
  );

  if (mode === "forgot-password") {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
          <h1 className="font-serif text-3xl font-semibold text-foreground text-center mb-2">
            {t.resetPassword}
          </h1>
          <p className="text-muted-foreground text-center mb-2">
            {t.passwordResetEmailSent}
          </p>
          <p className="text-muted-foreground text-center mb-6">
            {t.checkEmailForReset}
          </p>

          <p className="text-center text-muted-foreground mt-6">
            {t.didntReceiveEmail}{" "}
            <button
              type="button"
              onClick={handleResendPasswordResetEmail}
              disabled={isResending}
              className="text-primary hover:underline font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResending ? "Please wait..." : t.resendEmail}
            </button>
          </p>
        </div>
      </div>
    );
  }

  if (mode === "verify") {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
          <h1 className="font-serif text-3xl font-semibold text-foreground text-center mb-2">
            {t.verifyEmail}
          </h1>
          <p className="text-muted-foreground text-center mb-2">
            {t.verificationCodeSent}
          </p>
          {email && (
            <p className="text-primary text-center mb-6 font-medium">{email}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label className="text-center block">
                {t.enterVerificationCode}
              </Label>
              <div className="flex justify-center gap-3">
                {verificationCode.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) =>
                      handleVerificationCodeChange(index, e.target.value)
                    }
                    onKeyDown={(e) => handleVerificationCodeKeyDown(index, e)}
                    className="w-12 h-12 text-center text-2xl font-semibold"
                  />
                ))}
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full h-12 bg-primary hover:bg-primary/90"
              disabled={isLoading || !isVerificationComplete}
            >
              {isLoading ? "Please wait..." : t.verifyAndContinue}
            </Button>
          </form>

          <p className="text-center text-muted-foreground mt-6">
            {t.didntReceiveCode}{" "}
            <button
              type="button"
              onClick={handleResendCode}
              disabled={isResending}
              className="text-primary hover:underline font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResending ? "Please wait..." : t.resendCode}
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
        <h1 className="font-serif text-3xl font-semibold text-foreground text-center mb-2">
          {mode === "login" ? t.welcomeBack : t.createAccount}
        </h1>
        <p className="text-muted-foreground text-center mb-8">
          {mode === "login" ? t.signInToContinue : t.startYourDiaryToday}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {mode === "register" && (
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-12"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="h-12"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
              {error}
            </p>
          )}

          <Button
            type="submit"
            className="w-full h-12 bg-primary hover:bg-primary/90"
            disabled={isLoading}
          >
            {isLoading
              ? "Please wait..."
              : mode === "login"
                ? t.signIn
                : t.createAccount}
          </Button>
        </form>

        <p className="text-center text-muted-foreground mt-6">
          {mode === "login" ? (
            <>
              {t.notyetAccount}{" "}
              <Link
                href="/register"
                className="text-primary hover:underline font-medium"
              >
                Sign up
              </Link>
            </>
          ) : (
            <>
              {t.alreayAccount}{" "}
              <Link
                href="/login"
                className="text-primary hover:underline font-medium"
              >
                Sign in
              </Link>
            </>
          )}
        </p>

        {mode === "login" && (
          <p className="text-center text-muted-foreground mt-4">
            <Link
              href="/forgot-password"
              className="text-primary hover:underline font-medium"
            >
              {t.forgotPassword}
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
