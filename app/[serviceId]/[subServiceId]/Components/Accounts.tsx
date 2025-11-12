import { IAccount } from "@/store/models";

type Props = {
  selectedAccountId: string | null;
  Accounts: IAccount[];
};

const AccountsDetailsView = (props: Props) => {
  const { selectedAccountId, Accounts } = props;
  return (
    <>
      {selectedAccountId &&
        Accounts.length > 0 &&
        (() => {
          const selectedAccount = Accounts.find(
            (acc) => acc.AccountId === selectedAccountId
          );

          if (!selectedAccount) return null;

          return (
            <div className="space-y-6">
              {/* Account Overview */}
              <div className="bg-linear-to-br from-blue-600 to-indigo-600 rounded-3xl p-8 shadow-xl text-white">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-3xl font-bold mb-2">
                      {selectedAccount.Nickname ||
                        selectedAccount.AccountHolderName}
                    </h3>
                    <p className="text-blue-100 text-lg">
                      {selectedAccount.AccountType} •{" "}
                      {selectedAccount.AccountSubType}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl">
                      <p className="text-sm text-blue-100">Account Status</p>
                      <p className="text-lg font-bold">
                        {selectedAccount.Status}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
                  <div>
                    <p className="text-blue-100 text-sm mb-1">Account ID</p>
                    <p className="font-mono text-sm font-semibold">
                      {selectedAccount.AccountId}
                    </p>
                  </div>
                  <div>
                    <p className="text-blue-100 text-sm mb-1">Currency</p>
                    <p className="text-xl font-bold">
                      {selectedAccount.Currency}
                    </p>
                  </div>
                </div>
              </div>

              {/* Account Details Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Account Holder Information */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-slate-200">
                  <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                    Account Holder
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-start py-3 border-b border-slate-100">
                      <span className="text-slate-600 font-medium">
                        Full Name
                      </span>
                      <span className="text-slate-900 font-semibold text-right">
                        {selectedAccount.AccountHolderName}
                      </span>
                    </div>
                    <div className="flex justify-between items-start py-3 border-b border-slate-100">
                      <span className="text-slate-600 font-medium">
                        Short Name
                      </span>
                      <span className="text-slate-900 font-semibold text-right">
                        {selectedAccount.AccountHolderShortName}
                      </span>
                    </div>
                    {selectedAccount.Nickname && (
                      <div className="flex justify-between items-start py-3 border-b border-slate-100">
                        <span className="text-slate-600 font-medium">
                          Nickname
                        </span>
                        <span className="text-slate-900 font-semibold text-right">
                          {selectedAccount.Nickname}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Account Classification */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-slate-200">
                  <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-indigo-600 rounded-full" />
                    Classification
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-start py-3 border-b border-slate-100">
                      <span className="text-slate-600 font-medium">
                        Account Type
                      </span>
                      <span className="text-slate-900 font-semibold text-right">
                        {selectedAccount.AccountType}
                      </span>
                    </div>
                    <div className="flex justify-between items-start py-3 border-b border-slate-100">
                      <span className="text-slate-600 font-medium">
                        Sub Type
                      </span>
                      <span className="text-slate-900 font-semibold text-right">
                        {selectedAccount.AccountSubType}
                      </span>
                    </div>
                    {selectedAccount.Description && (
                      <div className="py-3">
                        <span className="text-slate-600 font-medium block mb-2">
                          Description
                        </span>
                        <span className="text-slate-900 text-sm">
                          {selectedAccount.Description}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Account Identifiers */}
                {selectedAccount.AccountIdentifiers &&
                  selectedAccount.AccountIdentifiers.length > 0 && (
                    <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-slate-200">
                      <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                        Account Identifiers
                      </h4>
                      <div className="space-y-4">
                        {selectedAccount.AccountIdentifiers.map(
                          (identifier, index) => (
                            <div
                              key={index}
                              className="p-4 bg-slate-50 rounded-xl border border-slate-200"
                            >
                              <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-semibold text-blue-600 uppercase">
                                  {identifier.SchemeName}
                                </span>
                              </div>
                              <p className="font-mono text-sm font-bold text-slate-900 mb-1">
                                {identifier.Identification}
                              </p>
                              {identifier.Name && (
                                <p className="text-xs text-slate-600">
                                  {identifier.Name}
                                </p>
                              )}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                {/* Servicer Information */}
                {selectedAccount.Servicer && (
                  <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-slate-200">
                    <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <div className="w-1.5 h-6 bg-indigo-600 rounded-full" />
                      Servicer Details
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-start py-3 border-b border-slate-100">
                        <span className="text-slate-600 font-medium">
                          Scheme
                        </span>
                        <span className="text-slate-900 font-semibold text-right">
                          {selectedAccount.Servicer.SchemeName}
                        </span>
                      </div>
                      <div className="py-3">
                        <span className="text-slate-600 font-medium block mb-2">
                          Identification
                        </span>
                        <span className="font-mono text-sm text-slate-900 bg-slate-50 px-3 py-2 rounded-lg inline-block">
                          {selectedAccount.Servicer.Identification}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Timeline Information */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-slate-200">
                <h4 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                  Timeline
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {selectedAccount.OpeningDate && (
                    <div className="text-center p-4 bg-blue-50 rounded-xl">
                      <p className="text-sm text-slate-600 mb-2">
                        Opening Date
                      </p>
                      <p className="text-lg font-bold text-slate-900">
                        {new Date(
                          selectedAccount.OpeningDate
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  )}
                  {selectedAccount.StatusUpdateDateTime && (
                    <div className="text-center p-4 bg-indigo-50 rounded-xl">
                      <p className="text-sm text-slate-600 mb-2">
                        Last Updated
                      </p>
                      <p className="text-lg font-bold text-slate-900">
                        {new Date(
                          selectedAccount.StatusUpdateDateTime
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  )}
                  {selectedAccount.MaturityDate && (
                    <div className="text-center p-4 bg-slate-50 rounded-xl">
                      <p className="text-sm text-slate-600 mb-2">
                        Maturity Date
                      </p>
                      <p className="text-lg font-bold text-slate-900">
                        {new Date(
                          selectedAccount.MaturityDate
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })()}
    </>
  );
};

export default AccountsDetailsView;
