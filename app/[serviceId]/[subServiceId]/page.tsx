"use client";

import AuthProtected from "@/components/AuthProtected";
import { AccountCard } from "@/components/ui/account-card";
import { apiFactory } from "@/lib/api";
import appStore from "@/store";
import { IAccount } from "@/store/models";
import { services } from "@/store/servicesStore";
import { Building2, Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import AccountAccessConsent from "./Components/AccountAccess";
import AccountsDetailsView from "./Components/Accounts";
import Balances from "./Components/Balances";
import Beneficiaries from "./Components/Beneficiaries";
import Transactions from "./Components/Transactions";

export default function ServiceDetail() {
  const params = useParams();
  const serviceId = params.serviceId as string;
  const subServiceId = params.subServiceId as string;

  const {
    Accounts,
    setAccounts,
    selectedAccountId,
    setSelectedAccountId,
    accessToken,
  } = appStore();

  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);
  const [accountsError, setAccountsError] = useState<string | null>(null);

  const selectedService = services[serviceId];
  const selectedSubService = selectedService?.subServices.find(
    (sub) => sub.id === subServiceId
  );

  // Fetch accounts when component mounts and access token is available
  useEffect(() => {
    const fetchAccounts = async () => {
      if (!accessToken) return;

      // Only fetch if we don't have accounts already
      if (Accounts.length > 0) {
        // Set first account as selected if no account is selected
        if (!selectedAccountId && Accounts.length > 0) {
          setSelectedAccountId(Accounts[0].AccountId);
        }
        return;
      }

      setIsLoadingAccounts(true);
      setAccountsError(null);

      try {
        const response = await apiFactory.getUserAccounts(accessToken);
        const accountsData = response?.Data?.Account || [];
        setAccounts(accountsData);

        // Set the first account as selected by default
        if (accountsData.length > 0) {
          setSelectedAccountId(accountsData[0].AccountId);
        }
      } catch (error) {
        console.error("Error fetching accounts:", error);
        setAccountsError("Failed to load accounts. Please try again.");
      } finally {
        setIsLoadingAccounts(false);
      }
    };

    fetchAccounts();
  }, [
    accessToken,
    Accounts.length,
    setAccounts,
    selectedAccountId,
    setSelectedAccountId,
  ]);

  const handleAccountSelect = (accountId: string) => {
    setSelectedAccountId(accountId);
  };

  if (!selectedService || !selectedSubService) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-slate-900">Service not found</h2>
      </div>
    );
  }

  return (
    <AuthProtected>
      <div className="space-y-8">
        {/* Sub-Service Header */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border-2 border-slate-200 mb-12">
          <div className="flex items-start gap-6">
            <div className="p-4 bg-linear-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
              <div className="text-white">{selectedSubService.icon}</div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-slate-900">
                {selectedSubService.name}
              </h2>
              <p className="text text-slate-600 leading-relaxed">
                {selectedSubService.description}
              </p>
            </div>
          </div>
        </div>

        {/* Account Selection Cards */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-2xl font-bold text-slate-900">
              Select Account
            </h3>
            {Accounts.length > 0 && (
              <span className="text-sm text-slate-500">
                {Accounts.length}{" "}
                {Accounts.length === 1 ? "account" : "accounts"} available
              </span>
            )}
          </div>

          {/* Loading State */}
          {isLoadingAccounts && (
            <div className="flex items-center justify-center py-12 bg-white rounded-2xl border-2 border-slate-200">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-3" />
                <p className="text-slate-600">Loading accounts...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {accountsError && !isLoadingAccounts && (
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
              <p className="text-red-700 font-medium">{accountsError}</p>
            </div>
          )}

          {/* Accounts Grid */}
          {!isLoadingAccounts && !accountsError && Accounts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Accounts.map((account: IAccount) => (
                <AccountCard
                  key={account.AccountId}
                  account={account}
                  isSelected={selectedAccountId === account.AccountId}
                  onSelect={handleAccountSelect}
                />
              ))}
            </div>
          )}

          {/* No Accounts State */}
          {!isLoadingAccounts &&
            !accountsError &&
            Accounts.length === 0 &&
            accessToken && (
              <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-12 text-center">
                <Building2 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h4 className="text-lg font-bold text-slate-900 mb-2">
                  No Accounts Found
                </h4>
                <p className="text-slate-600">
                  No accounts are available for this service.
                </p>
              </div>
            )}
        </div>

        {/* Detailed Account Information */}
        {selectedSubService.id === "accounts" && (
          <AccountsDetailsView
            selectedAccountId={selectedAccountId}
            Accounts={Accounts}
          />
        )}

        {selectedSubService.id === "account-access" && <AccountAccessConsent />}
        {selectedSubService.id === "balances" && <Balances />}
        {selectedSubService.id === "beneficiaries" && <Beneficiaries />}
        {selectedSubService.id === "transactions" && <Transactions />}
      </div>
    </AuthProtected>
  );
}
