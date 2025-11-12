// Consent metadata mapping - provides user-friendly titles and descriptions for consent IDs
export interface ConsentMetadata {
  id: string;
  title: string;
  description: string;
}

export const consentMetadataMap: Record<string, ConsentMetadata> = {
  // Base Consents
  BaseConsentId: {
    id: "BaseConsentId",
    title: "Basic Account Access",
    description: "Grants fundamental access to your account information",
  },
  PaymentInitiationBaseConsent: {
    id: "PaymentInitiationBaseConsent",
    title: "Payment Initiation Access",
    description: "Enables the service to initiate payments on your behalf",
  },
  ProductsBaseConsent: {
    id: "ProductsBaseConsent",
    title: "Product Information Access",
    description: "Allows viewing and managing financial product information",
  },
  ConfirmationPayeeBaseConsent: {
    id: "ConfirmationPayeeBaseConsent",
    title: "Payee Verification Access",
    description: "Enables verification of payment recipient details",
  },

  // Account Data Consents
  ReadAccountsBasic: {
    id: "ReadAccountsBasic",
    title: "Basic Account Information",
    description: "Access to account numbers, names, and basic details",
  },
  ReadAccountsDetail: {
    id: "ReadAccountsDetail",
    title: "Detailed Account Information",
    description:
      "Access to comprehensive account information including account type and status",
  },

  // Balance Consents
  ReadBalances: {
    id: "ReadBalances",
    title: "Account Balance Information",
    description: "View current and available balance information",
  },

  // Beneficiaries Consents
  ReadBeneficiariesBasic: {
    id: "ReadBeneficiariesBasic",
    title: "Basic Beneficiary Information",
    description: "Access to saved beneficiary names and account numbers",
  },
  ReadBeneficiariesDetail: {
    id: "ReadBeneficiariesDetail",
    title: "Detailed Beneficiary Information",
    description:
      "Access to complete beneficiary details including payment references",
  },

  // Direct Debits Consents
  ReadDirectDebits: {
    id: "ReadDirectDebits",
    title: "Direct Debit Information",
    description: "View active direct debit mandates and payment schedules",
  },

  // Product Consents
  ReadProduct: {
    id: "ReadProduct",
    title: "Product Details",
    description: "Access to banking product information and terms",
  },

  // Scheduled Payments Consents
  ReadScheduledPaymentsBasic: {
    id: "ReadScheduledPaymentsBasic",
    title: "Basic Scheduled Payments",
    description: "View scheduled payment dates and amounts",
  },
  ReadScheduledPaymentsDetail: {
    id: "ReadScheduledPaymentsDetail",
    title: "Detailed Scheduled Payments",
    description:
      "Access to complete scheduled payment information including references",
  },

  // Standing Orders Consents
  ReadStandingOrdersBasic: {
    id: "ReadStandingOrdersBasic",
    title: "Basic Standing Order Information",
    description: "View standing order payment schedules and amounts",
  },
  ReadStandingOrdersDetail: {
    id: "ReadStandingOrdersDetail",
    title: "Detailed Standing Order Information",
    description: "Access to complete standing order details and history",
  },

  // Transaction Consents
  ReadTransactionsBasic: {
    id: "ReadTransactionsBasic",
    title: "Basic Transaction History",
    description: "View transaction dates, amounts, and basic details",
  },
  ReadTransactionsDetail: {
    id: "ReadTransactionsDetail",
    title: "Detailed Transaction History",
    description:
      "Access to comprehensive transaction information including merchant details",
  },
  ReadTransactionsCredits: {
    id: "ReadTransactionsCredits",
    title: "Credit Transaction Information",
    description: "View incoming payments and credit transactions",
  },
  ReadTransactionsDebits: {
    id: "ReadTransactionsDebits",
    title: "Debit Transaction Information",
    description: "View outgoing payments and debit transactions",
  },

  // Party Consents
  ReadParty: {
    id: "ReadParty",
    title: "Party Information",
    description: "Access to information about account holders and parties",
  },
  ReadPartyUser: {
    id: "ReadPartyUser",
    title: "Party User Details",
    description: "View user details for parties associated with the account",
  },
  ReadPartyUserIdentity: {
    id: "ReadPartyUserIdentity",
    title: "Party User Identity Information",
    description: "Access to identity verification details for account parties",
  },
};

// Helper function to get consent metadata
export const getConsentMetadata = (
  consentId: string
): ConsentMetadata | null => {
  return (
    consentMetadataMap[consentId] || {
      id: consentId,
      title: consentId,
      description: `Permission for ${consentId}`,
    }
  );
};
