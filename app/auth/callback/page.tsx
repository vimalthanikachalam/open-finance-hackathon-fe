"use client";

import appStore from "@/store";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthCallbackPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("Processing authorization...");

  useEffect(() => {
    const handleCallback = () => {
      try {
        // Get the authorization code from URL params
        const code = searchParams.get("code");
        const error = searchParams.get("error");
        const errorDescription = searchParams.get("error_description");

        if (error) {
          setStatus("error");
          setMessage(errorDescription || `Authorization failed: ${error}`);

          // Send error message to parent window
          if (window.opener) {
            window.opener.postMessage(
              {
                type: "oauth_callback",
                success: false,
                error: error,
                errorDescription: errorDescription,
              },
              window.location.origin
            );
          }
          return;
        }

        if (!code) {
          setStatus("error");
          setMessage("No authorization code received");

          if (window.opener) {
            window.opener.postMessage(
              {
                type: "oauth_callback",
                success: false,
                error: "no_code",
              },
              window.location.origin
            );
          }
          return;
        }

        // Get stored OAuth data from store
        const { oauthCodeVerifier, oauthConsentId } = appStore.getState();

        setStatus("success");
        setMessage("Authorization successful! You can close this window.");

        // Send authorization code back to parent window
        if (window.opener) {
          window.opener.postMessage(
            {
              type: "oauth_callback",
              success: true,
              code: code,
              codeVerifier: oauthCodeVerifier,
              consentId: oauthConsentId,
            },
            window.location.origin
          );

          // Auto-close after a short delay
          setTimeout(() => {
            window.close();
          }, 2000);
        } else {
          // If not in popup, redirect to home
          setTimeout(() => {
            window.location.href = "/";
          }, 3000);
        }
      } catch (err) {
        console.error("Error processing callback:", err);
        setStatus("error");
        setMessage("An unexpected error occurred");

        if (window.opener) {
          window.opener.postMessage(
            {
              type: "oauth_callback",
              success: false,
              error: "processing_error",
            },
            window.location.origin
          );
        }
      }
    };

    handleCallback();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {status === "loading" && (
            <>
              <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Processing Authorization
              </h2>
              <p className="text-slate-600">{message}</p>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Success!
              </h2>
              <p className="text-slate-600">{message}</p>
            </>
          )}

          {status === "error" && (
            <>
              <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Authorization Failed
              </h2>
              <p className="text-slate-600">{message}</p>
              <button
                onClick={() => window.close()}
                className="mt-6 px-6 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg transition-colors"
              >
                Close Window
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
