import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { apiFactory } from "@/lib/api";
import appStore from "@/store";
import { Building2, CreditCard, Hash, Users } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {};

const Beneficiaries = (props: Props) => {
  const {
    accessToken,
    selectedAccountId,
    setBeneficiariesData,
    beneficiariesData,
  } = appStore();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (accessToken && selectedAccountId) {
      setIsLoading(true);
      setError(null);
      apiFactory
        .getAccountBeneficiaries(accessToken, selectedAccountId)
        .then((res) => {
          setBeneficiariesData(res);
        })
        .catch((error) => {
          console.error("Failed to fetch beneficiaries:", error);
          setError("Failed to load beneficiaries. Please try again.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [accessToken, selectedAccountId]);

  // Loading state
  if (isLoading || !selectedAccountId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-12">
        <Spinner className="h-12 w-12 text-primary mb-4" />
        <h3 className="text-lg font-semibold mb-2">Loading Beneficiaries</h3>
        <p className="text-sm text-muted-foreground">
          Please wait while we fetch your saved beneficiaries...
        </p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="rounded-full bg-destructive/10 p-4 mb-4">
          <Users className="h-8 w-8 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold mb-2">
          Unable to Load Beneficiaries
        </h3>
        <p className="text-sm text-muted-foreground max-w-md">{error}</p>
      </div>
    );
  }

  // Get beneficiaries from the correct property
  // The data structure uses Beneficiary property, not Balance
  let beneficiaries: any[] = [];

  if (beneficiariesData) {
    if (Array.isArray(beneficiariesData)) {
      beneficiaries = beneficiariesData;
    } else if (
      (beneficiariesData as any).Beneficiary &&
      Array.isArray((beneficiariesData as any).Beneficiary)
    ) {
      beneficiaries = (beneficiariesData as any).Beneficiary;
    } else if ((beneficiariesData as any).Data) {
      const innerData = (beneficiariesData as any).Data;
      if (Array.isArray(innerData)) {
        beneficiaries = innerData;
      } else if (innerData.Beneficiary) {
        beneficiaries = innerData.Beneficiary;
      }
    }
  }

  console.log("🚀 ~ Mapped beneficiaries:", beneficiaries);
  console.log(
    "🚀 ~ beneficiariesData structure:",
    JSON.stringify(beneficiariesData, null, 2)
  );

  // Empty state
  if (!beneficiaries || beneficiaries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <Users className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No Beneficiaries Found</h3>
        <p className="text-sm text-muted-foreground max-w-md">
          You haven't added any beneficiaries to this account yet.
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Data structure: {JSON.stringify(Object.keys(beneficiariesData || {}))}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8 text-primary" />
          <div>
            <h2 className="text-2xl font-bold">Beneficiaries</h2>
            <p className="text-sm text-muted-foreground">
              {beneficiaries.length} beneficiar
              {beneficiaries.length === 1 ? "y" : "ies"} found
            </p>
          </div>
        </div>
      </div>

      {/* Beneficiaries Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {beneficiaries.map((beneficiary: any, index: number) => {
          // Extract all possible fields flexibly
          const id =
            beneficiary.BeneficiaryId ||
            beneficiary.Id ||
            beneficiary.id ||
            `beneficiary-${index}`;
          const type =
            beneficiary.BeneficiaryType ||
            beneficiary.Type ||
            beneficiary.type ||
            "N/A";
          const reference = beneficiary.Reference || beneficiary.reference;
          const creditorAccount =
            beneficiary.CreditorAccount || beneficiary.creditorAccount;
          const creditorAgent =
            beneficiary.CreditorAgent || beneficiary.creditorAgent;

          // Check if it's an active/enabled beneficiary
          const isActive =
            type?.toLowerCase().includes("activate") ||
            type?.toLowerCase().includes("enabled");

          return (
            <Card
              key={id + index}
              className="group relative overflow-hidden hover:shadow-md transition-all duration-200 bg-linear-to-br from-card to-card/80"
            >
              {/* Decorative corner accent */}
              <div
                className={`absolute top-0 right-0 w-20 h-20 opacity-20 ${
                  isActive ? "bg-green-500" : "bg-primary"
                }`}
                style={{ clipPath: "polygon(100% 0, 100% 100%, 0 0)" }}
              />

              <CardHeader className="pb-3 relative">
                <div className="flex items-start gap-3">
                  <div
                    className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${
                      isActive
                        ? "bg-green-500/15 ring-1 ring-green-500/20"
                        : "bg-primary/15 ring-1 ring-primary/20"
                    }`}
                  >
                    <Users
                      className={`h-5 w-5 ${
                        isActive ? "text-green-600" : "text-primary"
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Badge
                      variant={isActive ? "default" : "secondary"}
                      className="text-[10px] font-medium mb-1.5"
                    >
                      {type}
                    </Badge>
                    <CardTitle className="text-sm font-bold leading-tight">
                      <span className="truncate block text-foreground/90">
                        {id}
                      </span>
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-2.5 pt-0">
                {/* Reference */}
                {reference && (
                  <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-muted/40 border border-border/50">
                    <div className="shrink-0 w-7 h-7 rounded-lg bg-background flex items-center justify-center shadow-sm">
                      <Hash className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">
                        Reference
                      </p>
                      <p className="text-xs font-medium text-foreground truncate">
                        {reference}
                      </p>
                    </div>
                  </div>
                )}

                {/* Creditor Account */}
                {creditorAccount &&
                  Array.isArray(creditorAccount) &&
                  creditorAccount.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 px-1">
                        <CreditCard className="h-3 w-3 text-blue-600" />
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                          Account Details
                        </p>
                      </div>
                      {creditorAccount.map((account: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2.5 p-2.5 rounded-lg bg-blue-500/5 border border-blue-500/20"
                        >
                          <div className="shrink-0 w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center">
                            <CreditCard className="h-3.5 w-3.5 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0 pt-0.5">
                            <p className="text-[9px] font-medium text-blue-600/70 uppercase tracking-wide mb-0.5">
                              {account.SchemeName ||
                                account.schemeName ||
                                "Account"}
                            </p>
                            <p className="text-xs font-semibold font-mono text-foreground/90 break-all leading-tight">
                              {account.Identification ||
                                account.identification ||
                                account.Name ||
                                account.name ||
                                "N/A"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                {/* Creditor Agent */}
                {creditorAgent && (
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 px-1">
                      <Building2 className="h-3 w-3 text-purple-600" />
                      <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                        Bank Information
                      </p>
                    </div>
                    <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-purple-500/5 border border-purple-500/20">
                      <div className="shrink-0 w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center">
                        <Building2 className="h-3.5 w-3.5 text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0 pt-0.5">
                        <p className="text-[9px] font-medium text-purple-600/70 uppercase tracking-wide mb-0.5">
                          {creditorAgent.SchemeName ||
                            creditorAgent.schemeName ||
                            "Bank"}
                        </p>
                        <p className="text-xs font-semibold text-foreground/90 leading-tight">
                          {creditorAgent.Name ||
                            creditorAgent.name ||
                            creditorAgent.Identification ||
                            creditorAgent.identification ||
                            "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* If no additional data, show a nice message instead of raw JSON */}
                {!reference &&
                  (!creditorAccount || creditorAccount.length === 0) &&
                  !creditorAgent && (
                    <div className="flex flex-col items-center justify-center py-4 px-2">
                      <div className="w-12 h-12 rounded-full bg-muted/30 flex items-center justify-center mb-2">
                        <Users className="h-6 w-6 text-muted-foreground/60" />
                      </div>
                      <p className="text-[10px] text-muted-foreground/70 font-medium text-center">
                        No additional details
                      </p>
                    </div>
                  )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Beneficiaries;
