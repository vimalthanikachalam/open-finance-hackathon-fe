import {
  IAccount,
  IBalance,
  IBeneficiary,
  IBeneficiaryData,
  IResponseData,
  IResponseSummaryData,
  ITransaction,
  ITransactionData,
} from ".";

export interface AppState {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;

  // Session management
  initializeSession: () => void;

  bottomActiveMenu: string;
  setBottomActiveMenu: (menu: string) => void;

  // Consent Modal State
  isConsentModalOpen: boolean;
  selectedService: string | null;
  selectedServiceTitle: string | null;
  setConsentModalOpen: (open: boolean) => void;
  setSelectedService: (
    serviceKey: string | null,
    serviceTitle?: string | null
  ) => void;
  // Selected consent ids (temporary selection in modal)
  selectedConsents: string[];
  setSelectedConsents: (ids: string[]) => void;
  toggleSelectedConsent: (id: string) => void;

  // Granted consents persisted in app state (consentId -> granted)
  grantedConsents: Record<string, boolean>;
  grantConsents: (ids: string[]) => void;
  revokeConsents: (ids: string[]) => void;

  // OAuth flow state
  oauthCodeVerifier: string | null;
  oauthConsentId: string | null;
  setOAuthFlowData: (codeVerifier: string, consentId: string) => void;
  clearOAuthFlowData: () => void;

  // Session/Token state
  accessToken: string | null;
  refreshToken: string | null;
  tokenType: string | null;
  tokenExpiresIn: number | null;
  tokenScope: string | null;
  setTokenData: (
    accessToken: string,
    refreshToken: string,
    tokenType: string,
    expiresIn: number,
    scope: string
  ) => void;
  clearTokenData: () => void;

  Accounts: IAccount[];
  setAccounts: (accounts: IAccount[]) => void;

  selectedAccountId: string | null;
  setSelectedAccountId: (accountId: string | null) => void;

  accountBalanceData: IResponseData<IBalance>;
  setAccountBalanceData: (data: IResponseSummaryData<IBalance>) => void;

  beneficiariesData: IBeneficiaryData;
  setBeneficiariesData: (data: IResponseSummaryData<IBeneficiary>) => void;

  transactionsData: ITransactionData;
  setTransactionsData: (data: IResponseSummaryData<ITransaction>) => void;
}
