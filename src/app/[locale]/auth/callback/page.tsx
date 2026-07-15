"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations();
  const locale = useLocale();
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const supabase = createClient();

        // Exchange the auth code for a session (handles OAuth and email confirmation)
        const { error } = await supabase.auth.exchangeCodeForSession(
          window.location.href
        );

        if (error) {
          setStatus("error");
          setErrorMessage(error.message);
          return;
        }

        setStatus("success");

        // Read redirect_to from URL params, or default to dashboard
        const redirectTo = searchParams.get("redirect_to") || "/dashboard";

        // Short delay so the user sees the success state
        setTimeout(() => {
          router.push(`/${locale}${redirectTo}`);
          router.refresh();
        }, 1500);
      } catch (err: any) {
        setStatus("error");
        setErrorMessage(err.message || "An unexpected error occurred");
      }
    };

    handleCallback();
  }, [router, searchParams, locale]);

  return (
    <Card className="bg-[#12122a] border-indigo-500/10">
      <CardContent className="py-12 text-center">
        {status === "processing" && (
          <>
            <div className="animate-spin w-10 h-10 border-2 border-indigo-400 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-300 font-medium">{t("auth.callback.processing")}</p>
            <p className="text-gray-500 text-sm mt-2">
              {t("auth.callback.processingHint")}
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-emerald-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
            </div>
            <p className="text-gray-300 font-medium">{t("auth.callback.success")}</p>
            <p className="text-gray-500 text-sm mt-2">
              {t("auth.callback.successHint")}
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <p className="text-red-400 font-medium mb-2">
              {t("auth.callback.error")}
            </p>
            <p className="text-gray-400 text-sm mb-4">{errorMessage}</p>
            <button
              onClick={() => router.push(`/${locale}/login`)}
              className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 text-sm"
            >
              {t("auth.callback.backToSignIn")}
            </button>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default function AuthCallbackPage() {
  const t = useTranslations();

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12 bg-[#0a0a1a]">
      <div className="w-full max-w-md">
        <Suspense
          fallback={
            <Card className="bg-[#12122a] border-indigo-500/10">
              <CardContent className="py-12 text-center">
                <div className="animate-spin w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full mx-auto" />
              </CardContent>
            </Card>
          }
        >
          <CallbackHandler />
        </Suspense>
      </div>
    </div>
  );
}