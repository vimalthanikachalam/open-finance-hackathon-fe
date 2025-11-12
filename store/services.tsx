import { Briefcase, Home, PiggyBank } from "lucide-react";
import type React from "react";

interface SubService {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  benefits: string[];
  // optional consent ids for this subservice (one or more strings)
  consentIds?: string[];
}

interface Service {
  icon: React.ReactNode;
  title: string;
  description: string;
  subServices: SubService[];
  // optional base consent identifier for the whole service
  baseConsentId?: string;
}

import {
  AlertCircle,
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  DollarSign,
  Eye,
  Globe,
  Lock,
  RefreshCw,
  Repeat,
  Send,
  Shield,
  ShoppingBag,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";

const services: Record<string, Service> = {
  bankDataSharing: {
    icon: <Shield className="w-7 h-7" />,
    title: "Bank Data Sharing",
    description:
      "Securely access and share comprehensive banking information with enhanced security protocols",
    subServices: [
      {
        id: "account-access",
        name: "Account Access",
        description:
          "Comprehensive account access management with granular permissions",
        icon: <Eye className="w-6 h-6" />,
        features: [
          "Real-time account verification",
          "Permission management",
          "Access level controls",
          "Audit trails",
        ],
        benefits: ["Enhanced Security", "User Control", "Compliance Ready"],
        consentIds: ["BaseConsentId"],
      },
      {
        id: "accounts",
        name: "Accounts",
        description: "Complete account information and management capabilities",
        icon: <Briefcase className="w-6 h-6" />,
        features: [
          "Account details",
          "Account types",
          "Status tracking",
          "Multi-account support",
        ],
        benefits: ["Unified View", "Easy Management", "Quick Access"],
        consentIds: ["ReadAccountsBasic", "ReadAccountsDetail"],
      },
      {
        id: "balances",
        name: "Balances",
        description: "Real-time balance information across all your accounts",
        icon: <DollarSign className="w-6 h-6" />,
        features: [
          "Current balance",
          "Available balance",
          "Reserved funds",
          "Historical data",
        ],
        benefits: [
          "Real-time Updates",
          "Accurate Tracking",
          "Financial Planning",
        ],
        consentIds: ["ReadBalances"],
      },
      {
        id: "beneficiaries",
        name: "Beneficiaries",
        description: "Manage and verify trusted payment recipients",
        icon: <Users className="w-6 h-6" />,
        features: [
          "Beneficiary lists",
          "Verification system",
          "Quick payments",
          "Trusted contacts",
        ],
        benefits: ["Faster Payments", "Reduced Errors", "Enhanced Trust"],
        consentIds: ["ReadBeneficiariesBasic", "ReadBeneficiariesDetail"],
      },
      {
        id: "direct-debits",
        name: "Direct Debits",
        description: "Monitor and manage all direct debit arrangements",
        icon: <Repeat className="w-6 h-6" />,
        features: [
          "Active mandates",
          "Payment schedules",
          "Cancellation options",
          "History tracking",
        ],
        benefits: ["Better Control", "Avoid Surprises", "Easy Management"],
        consentIds: ["ReadDirectDebits"],
      },
      {
        id: "products",
        name: "Products",
        description: "View all your banking products and services",
        icon: <ShoppingBag className="w-6 h-6" />,
        features: [
          "Product details",
          "Terms & conditions",
          "Linked accounts",
          "Product benefits",
        ],
        benefits: ["Clear Overview", "Informed Decisions", "Maximize Benefits"],
        consentIds: ["ReadProduct"],
      },
      {
        id: "scheduled-payments",
        name: "Scheduled Payments",
        description: "Plan and manage future payment instructions",
        icon: <Calendar className="w-6 h-6" />,
        features: [
          "Payment scheduling",
          "Recurring options",
          "Modification tools",
          "Reminders",
        ],
        benefits: ["Never Miss Payments", "Flexible Planning", "Peace of Mind"],
        consentIds: [
          "ReadScheduledPaymentsBasic",
          "ReadScheduledPaymentsDetail",
        ],
      },
      {
        id: "standing-orders",
        name: "Standing Orders",
        description: "Set up and manage automated regular payments",
        icon: <Clock className="w-6 h-6" />,
        features: [
          "Automated payments",
          "Flexible schedules",
          "Easy setup",
          "Modification options",
        ],
        benefits: ["Save Time", "Consistent Payments", "Financial Automation"],
        consentIds: ["ReadStandingOrdersBasic", "ReadStandingOrdersDetail"],
      },
      {
        id: "transactions",
        name: "Transactions",
        description: "Detailed transaction history and analytics",
        icon: <BarChart3 className="w-6 h-6" />,
        features: [
          "Transaction details",
          "Search & filter",
          "Category analysis",
          "Export options",
        ],
        benefits: ["Complete Transparency", "Better Insights", "Easy Tracking"],
        consentIds: [
          "ReadTransactionsBasic",
          "ReadTransactionsDetail",
          "ReadTransactionsCredits",
          "ReadTransactionsDebits",
        ],
      },
      {
        id: "parties",
        name: "Parties",
        description: "Manage all parties associated with your accounts",
        icon: <Users className="w-6 h-6" />,
        features: [
          "Party information",
          "Relationship mapping",
          "Authorization levels",
          "Contact details",
        ],
        benefits: [
          "Clear Relationships",
          "Enhanced Collaboration",
          "Simplified Management",
        ],
        consentIds: ["ReadParty", "ReadPartyUser", "ReadPartyUserIdentity"],
      },
    ],
    // base consent for the whole service
    baseConsentId: "BaseConsentId",
  },
  paymentInitiation: {
    icon: <CreditCard className="w-7 h-7" />,
    title: "Payment Initiation",
    description:
      "Initiate secure payments with instant processing and comprehensive tracking",
    subServices: [
      {
        id: "single-payments",
        name: "Single Payments",
        description: "Quick and secure one-time payment processing",
        icon: <Send className="w-6 h-6" />,
        features: [
          "Instant transfers",
          "Multiple currencies",
          "Payment confirmation",
          "Receipt generation",
        ],
        benefits: ["Fast Processing", "Secure Transfers", "Easy to Use"],
      },
      {
        id: "bulk-payments",
        name: "Bulk Payments",
        description: "Process multiple payments efficiently in one go",
        icon: <TrendingUp className="w-6 h-6" />,
        features: [
          "Batch processing",
          "CSV upload",
          "Validation checks",
          "Progress tracking",
        ],
        benefits: ["Save Time", "Reduce Errors", "Efficient Management"],
      },
      {
        id: "standing-order-setup",
        name: "Standing Order Setup",
        description: "Automate regular payments with flexible scheduling",
        icon: <RefreshCw className="w-6 h-6" />,
        features: [
          "Flexible schedules",
          "Auto-renewal",
          "Modification options",
          "Notification alerts",
        ],
        benefits: ["Automation", "Reliability", "Convenience"],
      },
      {
        id: "international-payments",
        name: "International Payments",
        description: "Send money globally with competitive rates",
        icon: <Globe className="w-6 h-6" />,
        features: [
          "Multi-currency support",
          "Rate tracking",
          "SWIFT transfers",
          "Compliance checks",
        ],
        benefits: ["Global Reach", "Competitive Rates", "Secure Transfers"],
      },
    ],
    baseConsentId: "PaymentInitiationBaseConsent",
  },
  productsLeads: {
    icon: <ShoppingBag className="w-7 h-7" />,
    title: "Products and Leads",
    description:
      "Discover personalized financial products designed for your goals",
    subServices: [
      {
        id: "personal-loans",
        name: "Personal Loans",
        description: "Flexible personal loans with competitive interest rates",
        icon: <DollarSign className="w-6 h-6" />,
        features: [
          "Quick approval",
          "Flexible terms",
          "Competitive rates",
          "Easy application",
        ],
        benefits: ["Fast Access", "Flexible Repayment", "No Hidden Fees"],
      },
      {
        id: "mortgages",
        name: "Mortgages",
        description: "Home financing solutions tailored to your needs",
        icon: <Home className="w-6 h-6" />,
        features: [
          "Fixed & variable rates",
          "First-time buyer support",
          "Remortgage options",
          "Expert advice",
        ],
        benefits: ["Dream Home", "Best Rates", "Expert Support"],
      },
      {
        id: "savings",
        name: "Savings Accounts",
        description: "Grow your wealth with high-interest savings accounts",
        icon: <PiggyBank className="w-6 h-6" />,
        features: [
          "High interest rates",
          "Easy access",
          "No monthly fees",
          "Goal tracking",
        ],
        benefits: ["Earn More", "Financial Security", "Easy Management"],
      },
      {
        id: "investments",
        name: "Investment Products",
        description: "Build your portfolio with diverse investment options",
        icon: <TrendingUp className="w-6 h-6" />,
        features: [
          "Diverse options",
          "Risk assessment",
          "Portfolio management",
          "Expert insights",
        ],
        benefits: ["Wealth Growth", "Diversification", "Professional Guidance"],
      },
    ],
    baseConsentId: "ProductsBaseConsent",
  },
  confirmationPayee: {
    icon: <UserCheck className="w-7 h-7" />,
    title: "Confirmation Of Payee",
    description:
      "Verify recipient details and prevent fraud before making payments",
    subServices: [
      {
        id: "name-verification",
        name: "Name Verification",
        description: "Confirm payee name matches account details",
        icon: <CheckCircle2 className="w-6 h-6" />,
        features: [
          "Real-time checks",
          "Name matching",
          "Instant verification",
          "High accuracy",
        ],
        benefits: ["Prevent Errors", "Fraud Protection", "Peace of Mind"],
      },
      {
        id: "account-matching",
        name: "Account Matching",
        description: "Ensure account details are correct before transfer",
        icon: <Shield className="w-6 h-6" />,
        features: [
          "Account validation",
          "Sort code checks",
          "Reference matching",
          "Error detection",
        ],
        benefits: ["Accurate Transfers", "Reduced Risk", "Confidence"],
      },
      {
        id: "fraud-prevention",
        name: "Fraud Prevention",
        description: "Advanced fraud detection and prevention mechanisms",
        icon: <Lock className="w-6 h-6" />,
        features: [
          "Suspicious activity alerts",
          "Risk scoring",
          "Blacklist checking",
          "Real-time monitoring",
        ],
        benefits: ["Enhanced Security", "Protected Funds", "Safe Banking"],
      },
      {
        id: "risk-alerts",
        name: "Risk Alerts",
        description:
          "Get notified of potential risks before completing transactions",
        icon: <AlertCircle className="w-6 h-6" />,
        features: [
          "Instant notifications",
          "Risk assessment",
          "Action recommendations",
          "Alert history",
        ],
        benefits: ["Stay Informed", "Quick Response", "Better Decisions"],
      },
    ],
    baseConsentId: "ConfirmationPayeeBaseConsent",
  },
};

export { services };
