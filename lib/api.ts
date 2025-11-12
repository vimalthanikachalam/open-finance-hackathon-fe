import { IBalance, IResponseSummaryData } from "@/store/models";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const POST_LOGIN_BASE_URL = "/open-finance/account-information/v1.2/";
const ACCOUNT_BASE_URL = POST_LOGIN_BASE_URL + "accounts/";

const getApiUrl = (accountId: string = "", baseConsentId: string = "") => ({
  Accounts: `${POST_LOGIN_BASE_URL}accounts`,
  Balances: `${ACCOUNT_BASE_URL}${accountId}/balances`,
  Beneficiaries: `${ACCOUNT_BASE_URL}${accountId}/beneficiaries`,
  Transactions: `${ACCOUNT_BASE_URL}${accountId}/transactions`,
});

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// API response types
export interface ConsentResponse {
  consent_id?: string;
  status?: string;
  data?: any;
  message?: string;
}

export interface ConsentCreateResponse {
  redirect: string;
  consent_id: string;
  code_verifier: string;
}

export interface ConsentRequest {
  data_permissions: string[];
}

export interface TokenRequest {
  code: string;
  code_verifier: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

// Consent API
export const apiFactory = {
  /**
   * Create a consent request for bank data access
   * @param permissions - Array of data permissions
   * @returns Promise with consent response
   */
  createConsent: async (
    permissions: string[] = ["ReadAccountsBasic", "ReadBalances"]
  ): Promise<ConsentResponse> => {
    try {
      const response = await apiClient.post<ConsentResponse>(
        "/consent-create/bank-data",
        {
          data_permissions: permissions,
        } as ConsentRequest
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message ||
            "Failed to create consent. Please try again."
        );
      }
      throw error;
    }
  },
  /**
   * Create a consent request for specific consent IDs
   * @param ids - Array of consent IDs (permission identifiers)
   * @returns Promise with consent creation response including redirect URL
   */
  createConsentForIds: async (
    ids: string[]
  ): Promise<ConsentCreateResponse> => {
    try {
      const response = await apiClient.post<ConsentCreateResponse>(
        "/consent-create/bank-data",
        {
          data_permissions: ids.filter(
            (id) => id !== "BaseConsentId" && id !== "ReadProduct"
          ),
        } as ConsentRequest
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message ||
            "Failed to create consent. Please try again."
        );
      }
      throw error;
    }
  },

  /**
   * Exchange authorization code for access token
   * @param code - Authorization code from OAuth callback
   * @param codeVerifier - Code verifier from initial consent creation
   * @returns Promise with token response including access_token and refresh_token
   */
  exchangeToken: async (
    code: string,
    codeVerifier: string
  ): Promise<TokenResponse> => {
    try {
      const response = await apiClient.post<TokenResponse>(
        "/token/authorization-code",
        {
          code: code,
          code_verifier: codeVerifier,
        } as TokenRequest
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message ||
            "Failed to exchange authorization code for token. Please try again."
        );
      }
      throw error;
    }
  },
  getUserAccounts: async (accessToken: string): Promise<any> => {
    try {
      const response = await apiClient.get<any>(getApiUrl().Accounts, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message ||
            "Failed to fetch user accounts. Please try again."
        );
      }
      throw error;
    }
  },
  getAccountBalances: async (
    accessToken: string,
    accountId: string
  ): Promise<IResponseSummaryData<IBalance>> => {
    try {
      const response = await apiClient.get<IResponseSummaryData<IBalance>>(
        getApiUrl(accountId).Balances,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message ||
            "Failed to fetch account balances. Please try again."
        );
      }
      throw error;
    }
  },
  getAccountBeneficiaries: async (
    accessToken: string,
    accountId: string
  ): Promise<any> => {
    try {
      const response = await apiClient.get<any>(
        getApiUrl(accountId).Beneficiaries,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message ||
            "Failed to fetch account beneficiaries. Please try again."
        );
      }
      throw error;
    }
  },
  getAccountTransactions: async (
    accessToken: string,
    accountId: string
  ): Promise<any> => {
    try {
      const response = await apiClient.get<any>(
        getApiUrl(accountId).Transactions,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message ||
            "Failed to fetch account transactions. Please try again."
        );
      }
      throw error;
    }
  },
};
