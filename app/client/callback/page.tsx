"use client";

import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ClientCallbackPage() {
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
        const stateParam = searchParams.get("state");
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

        // Decode the state parameter to get code_verifier and consent_id
        let codeVerifier = null;
        let consentId = null;

        if (stateParam) {
          try {
            // The state is base64 encoded JSON
            const decodedState = JSON.parse(atob(stateParam));
            codeVerifier = decodedState.code_verifier;
            consentId = decodedState.consent_id;
          } catch (e) {
            console.error("Failed to decode state parameter:", e);
          }
        }

        setStatus("success");
        setMessage("Authorization successful! Closing window...");

        // Send authorization code back to parent window
        if (window.opener) {
          window.opener.postMessage(
            {
              type: "oauth_callback",
              success: true,
              code: code,
              codeVerifier: codeVerifier,
              consentId: consentId,
            },
            window.location.origin
          );

          // Auto-close after a short delay
          setTimeout(() => {
            window.close();
          }, 1500);
        } else {
          // If not in popup, redirect to home
          setMessage("Authorization successful! Redirecting...");
          setTimeout(() => {
            window.location.href = "/";
          }, 2000);
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
                onClick={() => {
                  if (window.opener) {
                    window.close();
                  } else {
                    window.location.href = "/";
                  }
                }}
                className="mt-6 px-6 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg transition-colors"
              >
                {window.opener ? "Close Window" : "Go Home"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
