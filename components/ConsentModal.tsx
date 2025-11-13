"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiFactory } from "@/lib/api";
import { getConsentMetadata } from "@/lib/consentMetadata";
import appStore from "@/store";
import { services } from "@/store/services";
import { Loader2, Lock, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function ConsentModal() {
  const router = useRouter();
  const { toast } = useToast();
  const {
    isConsentModalOpen,
    setConsentModalOpen,
    selectedService,
    selectedServiceTitle,
    setOAuthFlowData,
    setTokenData,
  } = appStore();
  const {
    selectedConsents,
    setSelectedConsents,
    toggleSelectedConsent,
    grantedConsents,
    grantConsents,
  } = appStore();

  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [authPopup, setAuthPopup] = useState<Window | null>(null);
  const [isAuthorizing, setIsAuthorizing] = useState(false); // Guard against double calls

  // derive current service metadata
  const svc = selectedService ? (services as any)[selectedService] : null;

  // flatten all consent ids for this service (include service base if present)
  const allConsentIds: string[] = useMemo(() => {
    if (!svc) return [];
    const ids: string[] = [];
    if (svc.baseConsentId) ids.push(svc.baseConsentId);
    svc.subServices?.forEach((s: any) => {
      if (s.consentIds && Array.isArray(s.consentIds)) {
        ids.push(...s.consentIds);
      }
    });
    // unique
    return Array.from(new Set(ids));
  }, [svc]);

  const handleClose = () => {
    setConsentModalOpen(false);
    setAgreedToTerms(false);
    setIsAuthorizing(false); // Reset authorization guard
    // Close popup if open
    if (authPopup && !authPopup.closed) {
      authPopup.close();
    }
  };

  // initialize selection when modal opens: preselect ALL consents
  useEffect(() => {
    if (!isConsentModalOpen) return;
    // Always show and select all consents, not just pending ones
    setSelectedConsents(allConsentIds);
  }, [isConsentModalOpen, allConsentIds.join("|")]);

  // Listen for OAuth callback messages
  useEffect(() => {
    let isProcessing = false; // Guard against duplicate message processing

    const handleMessage = async (event: MessageEvent) => {
      // Verify origin matches your app
      if (event.origin !== window.location.origin) return;

      if (event.data?.type === "oauth_callback") {
        // Prevent duplicate processing
        if (isProcessing) {
          console.log("Already processing OAuth callback, ignoring duplicate");
          return;
        }

        isProcessing = true;

        if (event.data.success) {
          // Authorization successful - now exchange code for token
          const { code, codeVerifier, consentId } = event.data;

          try {
            toast({
              title: "Exchanging Token",
              description: "Completing authorization...",
            });

            // Exchange authorization code for access token
            const tokenResponse = await apiFactory.exchangeToken(
              code,
              codeVerifier
            );

            // Store token data in the store (manages session)
            setTokenData(
              tokenResponse.access_token,
              tokenResponse.refresh_token,
              tokenResponse.token_type,
              tokenResponse.expires_in,
              tokenResponse.scope
            );

            toast({
              title: "Authorization Successful",
              description: `Session established. Consent ID: ${consentId}`,
            });

            console.log("Token received:", {
              accessToken: tokenResponse.access_token,
              refreshToken: tokenResponse.refresh_token,
              expiresIn: tokenResponse.expires_in,
            });

            // Mark consents as granted
            grantConsents(selectedConsents);

            // Close modal and navigate
            handleClose();
            if (selectedService) router.push(`/${selectedService}`);
          } catch (error) {
            toast({
              title: "Token Exchange Failed",
              description:
                error instanceof Error
                  ? error.message
                  : "Failed to complete authorization",
              variant: "destructive",
            });
          } finally {
            isProcessing = false;
          }
        } else {
          // Authorization failed
          toast({
            title: "Authorization Failed",
            description:
              event.data.errorDescription || "Failed to authorize access",
            variant: "destructive",
          });
          isProcessing = false;
        }

        setIsLoading(false);
        setIsAuthorizing(false); // Reset the guard

        // Close the popup
        if (authPopup && !authPopup.closed) {
          authPopup.close();
        }
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [
    authPopup,
    selectedConsents,
    grantConsents,
    setTokenData,
    toast,
    router,
    selectedService,
  ]);

  const handleAuthorize = async () => {
    // Guard against double execution
    if (isAuthorizing) {
      console.log("Authorization already in progress, ignoring duplicate call");
      return;
    }

    if (!agreedToTerms) {
      toast({
        title: "Agreement Required",
        description: "Please agree to the terms and conditions to continue.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedConsents || selectedConsents.length === 0) {
      toast({
        title: "No permissions selected",
        description: "Please select at least one permission to authorize.",
        variant: "destructive",
      });
      return;
    }

    setIsAuthorizing(true); // Set guard immediately
    setIsLoading(true);
    try {
      // Call the consent creation API with selected permissions
      const response = await apiFactory.createConsentForIds(selectedConsents);

      // Store code_verifier and consent_id in the store
      setOAuthFlowData(response.code_verifier, response.consent_id);

      toast({
        title: "Opening Authorization",
        description: "Please complete the authentication in the new window.",
      });

      // Open the redirect URL in a popup window
      const popup = window.open(
        response.redirect,
        "BankAuthorization",
        "width=600,height=700,scrollbars=yes,resizable=yes"
      );

      if (!popup) {
        setIsAuthorizing(false); // Reset guard on error
        throw new Error(
          "Popup was blocked. Please allow popups for this site."
        );
      }

      setAuthPopup(popup);

      // Monitor popup closure
      const checkPopup = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkPopup);
          setIsLoading(false);
          setIsAuthorizing(false); // Reset guard when popup closes

          console.log({
            title: "Authorization window closed",
            description: "The authorization window was closed.",
            variant: "default",
          });
        }
      }, 500);
    } catch (error) {
      toast({
        title: "Authorization Failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to create consent authorization.",
        variant: "destructive",
      });
      setIsLoading(false);
      setIsAuthorizing(false); // Reset guard on error
    }
  };

  const isAllSelected =
    allConsentIds.length > 0 &&
    allConsentIds.every((id) => selectedConsents.includes(id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      // clear pending selection
      setSelectedConsents([]);
    } else {
      setSelectedConsents(allConsentIds);
    }
  };

  const toggleSelectForSub = (sub: any) => {
    if (!sub.consentIds || sub.consentIds.length === 0) return;
    const subIds: string[] = sub.consentIds;
    const allSelected = subIds.every((id) => selectedConsents.includes(id));
    if (allSelected) {
      // remove
      setSelectedConsents(
        selectedConsents.filter((id) => !subIds.includes(id))
      );
    } else {
      // add
      const next = Array.from(new Set([...selectedConsents, ...subIds]));
      setSelectedConsents(next);
    }
  };

  return (
    <Dialog open={isConsentModalOpen} onOpenChange={setConsentModalOpen}>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0 overflow-hidden">
        {/* Header with gradient background */}
        <div className="bg-linear-to-br from-blue-600 via-indigo-600 to-blue-700 p-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Shield className="w-7 h-7" />
            </div>
            <Badge
              variant="secondary"
              className="bg-white/20 text-white border-white/30 backdrop-blur-sm"
            >
              Secure Access
            </Badge>
          </div>
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-white mb-2">
              Authorize Access
            </DialogTitle>
            <DialogDescription className="text-blue-100 text-base">
              {selectedServiceTitle || "This service"} is requesting permission
              to access your financial data securely.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[32vh] overflow-y-auto">
          {/* Security Notice */}
          <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <Lock className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-blue-900 mb-1">
                Your data is protected
              </p>
              <p className="text-sm text-blue-700">
                We use bank-level encryption and never store your credentials.
                You can revoke access at any time.
              </p>
            </div>
          </div>

          {/* Consent selection list */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
                Permissions requested
              </h3>
              <div className="flex items-center gap-3">
                <label className="text-sm text-slate-600">Select all</label>
                <Checkbox
                  id="select-all"
                  checked={isAllSelected}
                  onCheckedChange={toggleSelectAll}
                />
              </div>
            </div>

            <div className="space-y-3">
              {svc ? (
                // render subservices, each with its consent ids
                svc.subServices.map((sub: any) => (
                  <div
                    key={sub.id}
                    className="p-4 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-white rounded-lg border border-slate-200 text-blue-600">
                          {sub.icon}
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900">
                            {sub.name}
                          </h4>
                          <p className="text-sm text-slate-600">
                            {sub.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-sm text-slate-600">All</label>
                        <Checkbox
                          checked={
                            sub.consentIds &&
                            sub.consentIds.every((id: string) =>
                              selectedConsents.includes(id)
                            )
                          }
                          onCheckedChange={() => toggleSelectForSub(sub)}
                        />
                      </div>
                    </div>

                    {/* list consent ids */}
                    {sub.consentIds && sub.consentIds.length > 0 ? (
                      <div className="mt-3 space-y-2">
                        {sub.consentIds.map((cid: string) => {
                          const metadata = getConsentMetadata(cid);
                          if (!metadata) return null;
                          return (
                            <div
                              key={cid}
                              className="flex items-center justify-between p-3 bg-white rounded-lg border hover:border-blue-300 transition-colors"
                            >
                              <div className="flex items-center gap-3 flex-1">
                                <Checkbox
                                  id={`cid-${cid}`}
                                  checked={selectedConsents.includes(cid)}
                                  onCheckedChange={() =>
                                    toggleSelectedConsent(cid)
                                  }
                                />
                                <div className="flex-1">
                                  <div className="font-medium text-sm text-slate-900">
                                    {metadata.title}
                                  </div>
                                  <div className="text-xs text-slate-500 mt-0.5">
                                    {metadata.description}
                                  </div>
                                </div>
                              </div>
                              {grantedConsents[cid] && (
                                <div className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                                  Granted
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="mt-3 text-sm text-slate-500">
                        No explicit consents listed for this subservice.
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-sm text-slate-600">
                  No service selected
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="p-6 bg-slate-50 border-t border-slate-200 sm:space-x-3 sm:flex-col gap-4">
          {/* Terms Agreement */}
          <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <Checkbox
              id="terms"
              checked={agreedToTerms}
              onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
              className="mt-1"
            />
            <label
              htmlFor="terms"
              className="text-sm text-slate-700 cursor-pointer leading-relaxed"
            >
              I agree to share my data and acknowledge that I have read and
              understood the{" "}
              <span className="text-blue-600 font-semibold hover:underline">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="text-blue-600 font-semibold hover:underline">
                Privacy Policy.
              </span>
            </label>
          </div>
          <div className="flex gap-6 justify-end">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 sm:flex-initial"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAuthorize}
              disabled={!agreedToTerms || isLoading || isAuthorizing}
              className="flex-1 sm:flex-initial bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Authorizing...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Authorize Access
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
