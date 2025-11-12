import { clearSession, loadSession, saveSession } from "@/lib/sessionStorage";
import { create } from "zustand";
import { IAccount, IBalance, IResponseSummaryData } from "./models";
import { AppState } from "./models/appState";

const appStore = create<AppState>((set) => ({
  isLoggedIn: false,
  setIsLoggedIn: (value: boolean) => set(() => ({ isLoggedIn: value })),

  bottomActiveMenu: "/",
  setBottomActiveMenu: (menu: string) =>
    set(() => ({ bottomActiveMenu: menu })),

  // Consent Modal State
  isConsentModalOpen: false,
  selectedService: null,
  selectedServiceTitle: null,
  setConsentModalOpen: (open: boolean) =>
    set(() => ({ isConsentModalOpen: open })),
  setSelectedService: (
    serviceKey: string | null,
    serviceTitle: string | null = null
  ) =>
    set(() => ({
      selectedService: serviceKey,
      selectedServiceTitle: serviceTitle,
    })),
  // Consent selections
  selectedConsents: [],
  setSelectedConsents: (ids: string[]) =>
    set(() => ({ selectedConsents: ids })),
  toggleSelectedConsent: (id: string) =>
    set((state: any) => {
      const exists = state.selectedConsents.includes(id);
      return {
        selectedConsents: exists
          ? state.selectedConsents.filter((s: string) => s !== id)
          : [...state.selectedConsents, id],
      };
    }),

  // granted consents map
  grantedConsents: {},
  grantConsents: (ids: string[]) =>
    set((state: any) => {
      const next = { ...(state.grantedConsents || {}) };
      ids.forEach((id) => (next[id] = true));

      // Update cookies if session exists
      if (state.accessToken) {
        saveSession({
          accessToken: state.accessToken,
          refreshToken: state.refreshToken,
          tokenType: state.tokenType,
          tokenExpiresIn: state.tokenExpiresIn,
          tokenScope: state.tokenScope,
          grantedConsents: next,
          consentId: state.oauthConsentId,
        });
      }

      return { grantedConsents: next };
    }),
  revokeConsents: (ids: string[]) =>
    set((state: any) => {
      const next = { ...(state.grantedConsents || {}) };
      ids.forEach((id) => delete next[id]);

      // Update cookies if session exists
      if (state.accessToken) {
        saveSession({
          accessToken: state.accessToken,
          refreshToken: state.refreshToken,
          tokenType: state.tokenType,
          tokenExpiresIn: state.tokenExpiresIn,
          tokenScope: state.tokenScope,
          grantedConsents: next,
          consentId: state.oauthConsentId,
        });
      }

      return { grantedConsents: next };
    }),

  // OAuth flow state
  oauthCodeVerifier: null,
  oauthConsentId: null,
  setOAuthFlowData: (codeVerifier: string, consentId: string) =>
    set(() => ({
      oauthCodeVerifier: codeVerifier,
      oauthConsentId: consentId,
    })),
  clearOAuthFlowData: () =>
    set(() => ({
      oauthCodeVerifier: null,
      oauthConsentId: null,
    })),

  // Session/Token state
  accessToken: null,
  refreshToken: null,
  tokenType: null,
  tokenExpiresIn: null,
  tokenScope: null,
  setTokenData: (
    accessToken: string,
    refreshToken: string,
    tokenType: string,
    expiresIn: number,
    scope: string
  ) =>
    set((state) => {
      const newState = {
        accessToken,
        refreshToken,
        tokenType,
        tokenExpiresIn: expiresIn,
        tokenScope: scope,
        isLoggedIn: true,
      };

      // Save to cookies
      saveSession({
        accessToken,
        refreshToken,
        tokenType,
        tokenExpiresIn: expiresIn,
        tokenScope: scope,
        grantedConsents: state.grantedConsents,
        consentId: state.oauthConsentId,
      });

      return newState;
    }),
  clearTokenData: () =>
    set(() => {
      clearSession();
      return {
        accessToken: null,
        refreshToken: null,
        tokenType: null,
        tokenExpiresIn: null,
        tokenScope: null,
        isLoggedIn: false,
      };
    }),

  Accounts: [],
  setAccounts: (accounts: IAccount[]) => set(() => ({ Accounts: accounts })),

  selectedAccountId: null,
  setSelectedAccountId: (accountId: string | null) =>
    set(() => ({ selectedAccountId: accountId })),

  // Initialize session from cookies
  initializeSession: () => {
    const session = loadSession();
    if (session) {
      set(() => ({
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
        tokenType: session.tokenType,
        tokenExpiresIn: session.tokenExpiresIn,
        tokenScope: session.tokenScope,
        grantedConsents: session.grantedConsents,
        oauthConsentId: session.consentId,
        isLoggedIn: true,
      }));
    }
  },

  accountBalanceData: {
    AccountId: String(),
    Balance: [],
  },
  setAccountBalanceData: (data: IResponseSummaryData<IBalance>) =>
    set(() => ({ accountBalanceData: data.Data })),
  beneficiariesData: {
    AccountId: String(),
    Beneficiary: [],
  },
  setBeneficiariesData: (data: any) =>
    set(() => ({ beneficiariesData: data.Data })),

  transactionsData: {
    AccountId: String(),
    Transaction: [],
  },
  setTransactionsData: (data: any) =>
    set(() => ({ transactionsData: data.Data })),
}));

export default appStore;
