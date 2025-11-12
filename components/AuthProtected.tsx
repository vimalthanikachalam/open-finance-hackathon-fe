"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import appStore from "@/store";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface AuthProtectedProps {
  children: React.ReactNode;
  redirectTo?: string;
  serviceKey?: string; // Optional: specific service to request consent for
}

/**
 * Component to protect routes that require authorization
 * Shows authorization prompt if user is not logged in
 */
export default function AuthProtected({
  children,
  redirectTo = "/",
  serviceKey = "bankDataSharing", // Default to bankDataSharing to show all consents
}: AuthProtectedProps) {
  const router = useRouter();
  const isLoggedIn = appStore((state) => state.isLoggedIn);
  const accessToken = appStore((state) => state.accessToken);
  const setConsentModalOpen = appStore((state) => state.setConsentModalOpen);
  const setSelectedService = appStore((state) => state.setSelectedService);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Give time for session to initialize
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleAuthorize = () => {
    // Open consent modal with the specified service
    setSelectedService(serviceKey, "Bank Data Sharing");
    setConsentModalOpen(true);
  };

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-slate-600">Loading...</div>
      </div>
    );
  }

  if (!isLoggedIn || !accessToken) {
    return (
      <div className="flex items-center justify-center min-h-[500px] px-4">
        <Card className="max-w-md w-full p-8 text-center space-y-6 border-2 border-orange-200 bg-orange-50/50">
          <div className="flex justify-center">
            <div className="p-4 bg-orange-100 rounded-full">
              <AlertCircle className="w-12 h-12 text-orange-600" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">
              Authorization Required
            </h2>
            <p className="text-slate-600 leading-relaxed">
              You need to authorize the app to access this feature. Click below
              to grant the necessary permissions.
            </p>
          </div>

          <div className="pt-4 space-y-3">
            <Button
              onClick={handleAuthorize}
              className="w-full bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Grant Consent & Login
            </Button>
            <Button
              onClick={() => router.push(redirectTo)}
              variant="outline"
              className="w-full"
            >
              Go Back to Home
            </Button>
          </div>

          <p className="text-sm text-slate-500">
            Sessions last for 10 minutes. You'll need to reauthorize after that
            time.
          </p>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
