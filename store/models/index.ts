export interface IAccount {
  AccountId: string;
  AccountHolderName: string;
  AccountHolderShortName: string;
  Status: string;
  Currency: string;
  Nickname: string;
  AccountType: string;
  AccountSubType: string;
  StatusUpdateDateTime: string;
  AccountIdentifiers: IAccountIdentifier[];
  Servicer: IAccountServicer;
  Description: string;
  OpeningDate: string;
  MaturityDate: string;
}

export interface IAccountIdentifier {
  SchemeName: string;
  Identification: string;
  Name: string;
}

export interface IAccountServicer {
  SchemeName: string;
  Identification: string;
}

export interface IBalance {
  Amount: IBalanceAmount;
  CreditDebitIndicator: string;
  Type: string;
  DateTime: string;
}

export interface IBalanceAmount {
  Amount: string;
  Currency: string;
}

export interface IResponseData<T> {
  Balance: IBalance[];
  AccountId: string;
}

export interface IBeneficiaryData {
  Beneficiary: IBeneficiary[];
  AccountId: string;
}

export interface IResponseSummaryData<T> {
  Data: IResponseData<T>;
  Meta: Meta;
  Links: Links;
}

export interface IBeneficiary {
  BeneficiaryId: string;
  BeneficiaryType: string;
  Reference?: string;
  SupplementaryData?: ISupplementaryData;
  CreditorAccount?: ICreditorAccount[];
  CreditorAgent?: ICreditorAgent;
}

export interface ISupplementaryData {}

export interface ICreditorAccount {
  SchemeName: string;
  Identification: string;
}

export interface ICreditorAgent {
  SchemeName: string;
  Identification: string;
  Name?: string;
}

export interface Meta {
  TotalPages: number;
}

export interface ITransactionResponseData {
  Data: ITransactionData;
  Meta: Meta;
  Links: Links;
}

export interface ITransactionData {
  Transaction: ITransaction[];
  AccountId: string;
}

export interface ITransaction {
  TransactionId: string;
  TransactionDateTime: string;
  TransactionReference?: string;
  TransactionType: string;
  SubTransactionType: string;
  PaymentModes: string;
  StatementReference?: string;
  CreditDebitIndicator: string;
  Status: string;
  BookingDateTime: string;
  ValueDateTime?: string;
  Amount: ITransactionAmount;
  Balance: ITransactionBalance;
  LocalTimeZone: string;
  Flags?: string[];
  TransactionInformation?: string;
  TerminalId?: number;
  TransactionMutability?: string;
}

export interface ITransactionAmount {
  Amount: string;
  Currency: string;
}

export interface ITransactionBalance {
  CreditDebitIndicator: string;
  Type: string;
  Amount: ITransactionAmount;
}

export interface Links {
  Self: string;
  First: string;
  Next: string;
  Last: string;
}
