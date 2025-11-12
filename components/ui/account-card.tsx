"use client";

import { cn } from "@/lib/utils";
import { IAccount } from "@/store/models";
import { Images } from "@/utils";
import { Building2, CheckCircle2 } from "lucide-react";

interface AccountCardProps {
  account: IAccount;
  isSelected: boolean;
  onSelect: (accountId: string) => void;
}

export function AccountCard({
  account,
  isSelected,
  onSelect,
}: AccountCardProps) {
  return (
    <div
      onClick={() => onSelect(account.AccountId)}
      className={cn(
        "relative cursor-pointer rounded-2xl p-6 transition-all duration-200 border-2",
        "hover:shadow-lg hover:scale-[1.02]",
        isSelected
          ? "bg-linear-to-br from-blue-50 to-indigo-50 border-blue-500 shadow-md"
          : "bg-white border-slate-200 hover:border-slate-300"
      )}
    >
      {/* Selection Indicator */}
      <div className="absolute top-4 right-4">
        <div
          className={cn(
            "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
            isSelected
              ? "bg-blue-600 border-blue-600"
              : "bg-white border-slate-300"
          )}
        >
          {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
        </div>
      </div>

      {/* Account Icon */}
      {(Images as any)[account.Servicer.Identification] ? (
        <img
          src={(Images as any)[account.Servicer.Identification]?.src}
          alt="bank-logo"
          className="w-18 mb-4"
        />
      ) : (
        <div
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center mb-4",
            isSelected
              ? "bg-linear-to-br from-blue-500 to-indigo-600"
              : "bg-slate-100"
          )}
        >
          <Building2
            className={cn(
              "w-6 h-6",
              isSelected ? "text-white" : "text-slate-600"
            )}
          />
        </div>
      )}

      {/* Account Details */}
      <div className="space-y-2 pr-8">
        <div className="flex items-center gap-2">
          <h3
            className={cn(
              "font-bold text-lg",
              isSelected ? "text-blue-900" : "text-slate-900"
            )}
          >
            {account.Nickname || account.AccountHolderName}
          </h3>
        </div>

        <p className="text-sm text-slate-600 font-medium">
          {account.AccountType} • {account.AccountSubType}
        </p>

        <div className="flex items-center gap-2 pt-1">
          <span
            className={cn(
              "px-3 py-1 rounded-full text-xs font-semibold",
              account.Status === "Enabled"
                ? "bg-green-100 text-green-700"
                : "bg-green-200 text-slate-700"
            )}
          >
            {account.Status}
          </span>
          <span className="text-xs font-mono text-slate-500">
            {account.Currency}
          </span>
        </div>

        {/* Account Number */}
        {account.AccountIdentifiers &&
          account.AccountIdentifiers.length > 0 && (
            <div className="pt-2">
              <p className="text-xs text-slate-500">
                {account.AccountIdentifiers[0].SchemeName}
              </p>
              <p className="text-sm font-mono text-slate-700">
                {account.AccountIdentifiers[0].Identification}
              </p>
            </div>
          )}
      </div>
    </div>
  );
}
