import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  getBalanceSuggestions,
  getCreditCardRecommendations,
  type CreditCardRecommendation,
} from "@/lib/aiApi";
import { apiFactory } from "@/lib/api";
import appStore from "@/store";
import { ITransaction, ITransactionResponseData } from "@/store/models";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Building,
  Car,
  Coffee,
  CreditCard,
  ExternalLink,
  Gift,
  Home,
  Loader2,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Target,
  TrendingUp,
  Utensils,
  Wallet,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

type Props = {};

const Transactions = (props: Props) => {
  const {
    selectedAccountId,
    accessToken,
    transactionsData,
    setTransactionsData,
  } = appStore();
  console.log("🚀 ~ Transactions ~ transactionsData:", transactionsData);
  const [isLoading, setIsLoading] = useState(true);
  const [creditCardRecommendations, setCreditCardRecommendations] = useState<
    CreditCardRecommendation[]
  >([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] =
    useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  useEffect(() => {
    if (accessToken && selectedAccountId) {
      setIsLoading(true);
      // Clear previous recommendations and suggestions when switching accounts
      setCreditCardRecommendations([]);
      setAiSuggestions([]);

      apiFactory
        .getAccountTransactions(
          accessToken as string,
          selectedAccountId as string
        )
        .then((data: ITransactionResponseData) => {
          console.log("Transaction API response:", data);
          console.log("Response keys:", Object.keys(data || {}));
          console.log("Transaction array:", data?.Data?.Transaction);
          console.log(
            "Transaction count:",
            data?.Data?.Transaction?.length || 0
          );

          setTransactionsData(data as any);

          // Fetch credit card recommendations based on transactions
          const transactions = data?.Data?.Transaction;
          if (
            transactions &&
            Array.isArray(transactions) &&
            transactions.length > 0
          ) {
            // Get current balance for AI suggestions
            const currentBalance =
              transactions.length > 0
                ? parseFloat(transactions[0].Balance.Amount.Amount)
                : 0;

            // Fetch AI suggestions based on balance
            setIsLoadingSuggestions(true);
            getBalanceSuggestions(currentBalance)
              .then((response) => {
                console.log("✅ AI suggestions received:", response);
                setAiSuggestions(response.suggestions);
              })
              .catch((error) => {
                console.error("❌ Error fetching AI suggestions:", error);
              })
              .finally(() => {
                setIsLoadingSuggestions(false);
              });

            // Fetch credit card recommendations
            setIsLoadingRecommendations(true);
            console.log(
              `✅ Fetching credit card recommendations for account: ${selectedAccountId}`
            );
            console.log(`✅ Number of transactions: ${transactions.length}`);
            console.log(`✅ Sample transaction:`, transactions[0]);

            getCreditCardRecommendations(transactions)
              .then((recommendations) => {
                console.log(
                  "✅ Credit card recommendations received:",
                  recommendations
                );
                setCreditCardRecommendations(recommendations.recommendations);
              })
              .catch((error) => {
                console.error(
                  "❌ Error fetching credit card recommendations:",
                  error
                );
              })
              .finally(() => {
                setIsLoadingRecommendations(false);
              });
          } else {
            console.log(
              "❌ No transactions available for credit card recommendations"
            );
            console.log("Data structure:", {
              hasData: !!data,
              hasDataProperty: !!data?.Data,
              hasTransaction: !!data?.Data?.Transaction,
              isArray: Array.isArray(data?.Data?.Transaction),
              length: data?.Data?.Transaction?.length || 0,
            });
          }
        })
        .catch((error) => {
          console.error("Error fetching transactions:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [accessToken, selectedAccountId]);

  const getTransactionIcon = (transaction: ITransaction) => {
    const info = transaction.TransactionInformation?.toLowerCase() || "";
    const type = transaction.SubTransactionType?.toLowerCase() || "";

    if (
      info.includes("grocery") ||
      info.includes("supermarket") ||
      info.includes("market")
    ) {
      return <ShoppingCart className="h-5 w-5" />;
    }
    if (
      info.includes("coffee") ||
      info.includes("cafe") ||
      info.includes("starbucks")
    ) {
      return <Coffee className="h-5 w-5" />;
    }
    if (
      info.includes("rent") ||
      info.includes("mortgage") ||
      info.includes("property")
    ) {
      return <Home className="h-5 w-5" />;
    }
    if (
      info.includes("fuel") ||
      info.includes("gas") ||
      info.includes("parking")
    ) {
      return <Car className="h-5 w-5" />;
    }
    if (
      info.includes("restaurant") ||
      info.includes("food") ||
      info.includes("dining")
    ) {
      return <Utensils className="h-5 w-5" />;
    }
    if (
      info.includes("salary") ||
      info.includes("payment") ||
      type.includes("salary")
    ) {
      return <TrendingUp className="h-5 w-5" />;
    }
    if (
      info.includes("utility") ||
      info.includes("electric") ||
      info.includes("water")
    ) {
      return <Zap className="h-5 w-5" />;
    }
    if (info.includes("gift") || info.includes("present")) {
      return <Gift className="h-5 w-5" />;
    }
    if (
      info.includes("phone") ||
      info.includes("mobile") ||
      info.includes("internet")
    ) {
      return <Smartphone className="h-5 w-5" />;
    }
    if (info.includes("bank") || info.includes("atm")) {
      return <Building className="h-5 w-5" />;
    }
    if (transaction.CreditDebitIndicator === "Debit") {
      return <ArrowUpRight className="h-5 w-5" />;
    }
    return <ArrowDownLeft className="h-5 w-5" />;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year:
          date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
      });
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const groupTransactionsByDate = (transactions: ITransaction[]) => {
    const grouped: { [key: string]: ITransaction[] } = {};

    transactions.forEach((transaction) => {
      const dateKey = new Date(transaction.TransactionDateTime).toDateString();
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(transaction);
    });

    return Object.entries(grouped).sort(
      ([dateA], [dateB]) =>
        new Date(dateB).getTime() - new Date(dateA).getTime()
    );
  };

  const calculateDayTotal = (transactions: ITransaction[]) => {
    const credits = transactions
      .filter((t) => t.CreditDebitIndicator === "Credit")
      .reduce((sum, t) => sum + parseFloat(t.Amount.Amount), 0);
    const debits = transactions
      .filter((t) => t.CreditDebitIndicator === "Debit")
      .reduce((sum, t) => sum + parseFloat(t.Amount.Amount), 0);
    return { credits, debits, net: credits - debits };
  };

  const calculatePFMMetrics = (transactions: ITransaction[]) => {
    // Calculate totals from ALL transactions - Debit means money going out (expenses)
    const totalIncome = transactions
      .filter((t) => t.CreditDebitIndicator === "Credit")
      .reduce((sum, t) => sum + parseFloat(t.Amount.Amount), 0);

    const totalExpenses = transactions
      .filter((t) => t.CreditDebitIndicator === "Debit")
      .reduce((sum, t) => sum + parseFloat(t.Amount.Amount), 0);

    // Get current balance from the most recent transaction
    const currentBalance =
      transactions.length > 0
        ? parseFloat(transactions[0].Balance.Amount.Amount)
        : 0;

    const savings = totalIncome - totalExpenses;

    const currency =
      transactions.length > 0 ? transactions[0].Amount.Currency : "GBP";

    return {
      currentBalance,
      totalIncome,
      totalExpenses,
      savings,
      currency,
    };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const transactions = transactionsData?.Transaction || [];

  if (transactions.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center h-96">
          <CreditCard className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Transactions Yet</h3>
          <p className="text-muted-foreground text-center">
            Your transaction history will appear here once you start making
            transactions.
          </p>
        </CardContent>
      </Card>
    );
  }

  const groupedTransactions = groupTransactionsByDate(transactions);
  const pfmMetrics = calculatePFMMetrics(transactions);

  return (
    <div className="space-y-6">
      {/* PFM Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 hover:shadow-xl transition-all hover:-translate-y-1">
          <div className="p-3 bg-emerald-600 rounded-xl w-fit mb-4">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1">
            {pfmMetrics.currency} {pfmMetrics.currentBalance.toFixed(2)}
          </div>
          <div className="text-sm text-slate-600">Current Balance</div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 hover:shadow-xl transition-all hover:-translate-y-1">
          <div className="p-3 bg-blue-600 rounded-xl w-fit mb-4">
            <ArrowDownLeft className="w-6 h-6 text-white" />
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1">
            {pfmMetrics.currency} {pfmMetrics.totalIncome.toFixed(2)}
          </div>
          <div className="text-sm text-slate-600">Total Income</div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-rose-50 to-orange-50 border-2 border-rose-200 hover:shadow-xl transition-all hover:-translate-y-1">
          <div className="p-3 bg-rose-600 rounded-xl w-fit mb-4">
            <ArrowUpRight className="w-6 h-6 text-white" />
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1">
            {pfmMetrics.currency} {pfmMetrics.totalExpenses.toFixed(2)}
          </div>
          <div className="text-sm text-slate-600">Total Expenses</div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 hover:shadow-xl transition-all hover:-translate-y-1">
          <div className="p-3 bg-purple-600 rounded-xl w-fit mb-4">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1">
            {pfmMetrics.currency} {pfmMetrics.savings.toFixed(2)}
          </div>
          <div className="text-sm text-slate-600">Net Savings</div>
        </Card>
      </div>

      {/* Compact Income vs Expenses Summary */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-700">
            Financial Overview
          </h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 bg-blue-600 rounded-full"></div>
              <span className="text-xs text-slate-600">Income</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 bg-rose-600 rounded-full"></div>
              <span className="text-xs text-slate-600">Expenses</span>
            </div>
          </div>
        </div>
        <div className="mt-3 relative h-6 bg-slate-100 rounded-full overflow-hidden">
          {/* Income Bar (Left) */}
          <div
            className="absolute left-0 top-0 h-full bg-linear-to-r from-blue-500 to-blue-600 flex items-center justify-start pl-4 transition-all duration-1000"
            style={{
              width: `${
                pfmMetrics.totalIncome > 0
                  ? (pfmMetrics.totalIncome /
                      (pfmMetrics.totalIncome + pfmMetrics.totalExpenses)) *
                    100
                  : 0
              }%`,
            }}
          >
            <span className="text-white text-xs font-semibold">
              {pfmMetrics.currency} {pfmMetrics.totalIncome.toFixed(0)}
            </span>
          </div>
          {/* Expenses Bar (Right) */}
          <div
            className="absolute right-0 top-0 h-full bg-linear-to-r from-rose-500 to-rose-600 flex items-center justify-end pr-4 transition-all duration-1000"
            style={{
              width: `${
                pfmMetrics.totalExpenses > 0
                  ? (pfmMetrics.totalExpenses /
                      (pfmMetrics.totalIncome + pfmMetrics.totalExpenses)) *
                    100
                  : 0
              }%`,
            }}
          >
            <span className="text-white text-xs font-semibold">
              {pfmMetrics.currency} {pfmMetrics.totalExpenses.toFixed(0)}
            </span>
          </div>
        </div>
        {/* Net Savings */}
        <div className="mt-3 flex items-center justify-between text-xs">
          <span className="text-slate-600">Net Savings:</span>
          <span
            className={`font-bold ${
              pfmMetrics.savings >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {pfmMetrics.savings >= 0 ? "+" : ""}
            {pfmMetrics.currency} {pfmMetrics.savings.toFixed(2)}
          </span>
        </div>
      </Card>

      {/* AI Insights & Recommendations Section */}
      <div className="space-y-6">
        {/* AI Suggestions */}

        {/* AI Insights & Recommendations Section */}
        <div className="space-y-6">
          {/* AI Suggestions */}
          {isLoadingSuggestions && (
            <Card className="p-6 bg-linear-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
              <div className="flex items-center justify-center gap-3 py-8">
                <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                <p className="text-slate-600">Loading AI suggestions...</p>
              </div>
            </Card>
          )}

          {!isLoadingSuggestions && aiSuggestions.length > 0 && (
            <Card className="p-6 bg-linear-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-linear-to-br from-blue-600 to-cyan-600 rounded-xl">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    AI Financial Insights
                  </h3>
                  <p className="text-sm text-slate-600">
                    Personalized recommendations based on your account balance
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {aiSuggestions.map((suggestion, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-4 bg-white rounded-lg border border-blue-200"
                  >
                    <div className="shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
                      {idx + 1}
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {suggestion}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Credit Card Recommendations */}
          {isLoadingRecommendations && (
            <Card className="p-6 bg-linear-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200">
              <div className="flex items-center justify-center gap-3 py-8">
                <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
                <p className="text-slate-600">
                  Loading credit card recommendations...
                </p>
              </div>
            </Card>
          )}

          {!isLoadingRecommendations &&
            creditCardRecommendations.length > 0 && (
              <Card className="p-6 bg-linear-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-linear-to-br from-indigo-600 to-purple-600 rounded-xl">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      Recommended ADCB Credit Cards
                    </h3>
                    <p className="text-sm text-slate-600">
                      Primary and alternative cards based on your spending
                      patterns
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {creditCardRecommendations.slice(0, 2).map((card, idx) => {
                    // Define gradient colors for primary and secondary cards
                    const cardGradients = [
                      {
                        bg: "from-indigo-600 via-purple-600 to-pink-600",
                        pattern1: "bg-purple-400",
                        pattern2: "bg-pink-500",
                        badge: "Primary Recommendation",
                      },
                      {
                        bg: "from-emerald-600 via-teal-600 to-cyan-600",
                        pattern1: "bg-teal-400",
                        pattern2: "bg-cyan-500",
                        badge: "Alternative Option",
                      },
                    ];
                    const gradient = cardGradients[idx] || cardGradients[0];

                    return (
                      <div
                        key={idx}
                        className={`group relative bg-linear-to-br ${gradient.bg} rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 overflow-hidden`}
                      >
                        {/* Card Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                          <div
                            className={`absolute top-0 right-0 w-64 h-64 ${gradient.pattern1} rounded-full blur-3xl`}
                          ></div>
                          <div
                            className={`absolute bottom-0 left-0 w-48 h-48 ${gradient.pattern2} rounded-full blur-3xl`}
                          ></div>
                        </div>

                        {/* Card Content */}
                        <div className="relative z-10">
                          {/* Card Header */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                                <CreditCard className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <h4 className="font-bold text-white text-lg mb-1">
                                  {card.name}
                                </h4>
                                <p className="text-xs text-white/80">
                                  ADCB Credit Card
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <Sparkles className="w-5 h-5 text-yellow-300" />
                              <span className="text-[10px] font-medium text-white/70 uppercase tracking-wide">
                                {gradient.badge}
                              </span>
                            </div>
                          </div>

                          {/* Card Reason */}
                          <p className="text-sm text-white/90 mb-4 leading-relaxed">
                            {card.reason}
                          </p>

                          {/* Benefits */}
                          <div className="mb-4">
                            <p className="text-xs font-semibold text-white/70 uppercase tracking-wide mb-2">
                              Key Benefits
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {card.benefits
                                .slice(0, 4)
                                .map((benefit, bidx) => (
                                  <span
                                    key={bidx}
                                    className="text-xs bg-white/15 backdrop-blur-sm text-white px-3 py-1 rounded-full border border-white/30"
                                  >
                                    {benefit}
                                  </span>
                                ))}
                            </div>
                          </div>

                          {/* Savings */}
                          <div className="flex items-center justify-between mb-4 p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                            <span className="text-xs font-semibold text-white/80 uppercase tracking-wide">
                              Potential Savings
                            </span>
                            <span className="text-sm font-bold text-white">
                              {card.potential_savings}
                            </span>
                          </div>

                          {/* Apply Button */}
                          <Button
                            onClick={() =>
                              window.open(card.apply_url, "_blank")
                            }
                            className="w-full bg-white hover:bg-slate-100 text-slate-900 font-semibold shadow-lg"
                          >
                            Apply Now
                            <ExternalLink className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}
        </div>

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-6 w-6" />
              Transaction History
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {transactions.length} transaction
              {transactions.length !== 1 ? "s" : ""} found
            </p>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[600px]">
              {groupedTransactions.map(([dateKey, dayTransactions], index) => {
                const dayTotal = calculateDayTotal(dayTransactions);
                return (
                  <div key={dateKey + index} className="px-6 py-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-muted-foreground">
                        {formatDate(dateKey)}
                      </h3>
                      <div className="flex gap-4 text-xs">
                        {dayTotal.credits > 0 && (
                          <span className="text-green-600 dark:text-green-400">
                            +{dayTotal.credits.toFixed(2)}{" "}
                            {dayTransactions[0].Amount.Currency}
                          </span>
                        )}
                        {dayTotal.debits > 0 && (
                          <span className="text-red-600 dark:text-red-400">
                            -{dayTotal.debits.toFixed(2)}{" "}
                            {dayTransactions[0].Amount.Currency}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      {dayTransactions.map((transaction, index) => {
                        const isCredit =
                          transaction.CreditDebitIndicator === "Credit";
                        const amount = parseFloat(transaction.Amount.Amount);

                        return (
                          <div
                            key={transaction.TransactionId + index}
                            className="group flex items-center gap-4 p-4 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer border border-transparent hover:border-border"
                          >
                            <div
                              className={`flex items-center justify-center h-12 w-12 rounded-full ${
                                isCredit
                                  ? "bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400"
                                  : "bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400"
                              }`}
                            >
                              {getTransactionIcon(transaction)}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-sm truncate">
                                  {transaction.TransactionInformation ||
                                    transaction.SubTransactionType ||
                                    "Transaction"}
                                </h4>
                                <Badge
                                  variant={
                                    transaction.Status === "Booked"
                                      ? "default"
                                      : transaction.Status === "Pending"
                                      ? "outline"
                                      : "secondary"
                                  }
                                  className="text-xs"
                                >
                                  {transaction.Status}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>
                                  {formatTime(transaction.TransactionDateTime)}
                                </span>
                                {transaction.TransactionReference && (
                                  <>
                                    <span>•</span>
                                    <span className="truncate">
                                      {transaction.TransactionReference}
                                    </span>
                                  </>
                                )}
                                <span>•</span>
                                <span className="truncate">
                                  {transaction.PaymentModes}
                                </span>
                              </div>
                            </div>

                            <div className="text-right">
                              <div
                                className={`text-lg font-bold ${
                                  isCredit
                                    ? "text-green-600 dark:text-green-400"
                                    : "text-red-600 dark:text-red-400"
                                }`}
                              >
                                {isCredit ? "+" : "-"}
                                {amount.toFixed(2)}{" "}
                                {transaction.Amount.Currency}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                Balance:{" "}
                                {parseFloat(
                                  transaction.Balance.Amount.Amount
                                ).toFixed(2)}{" "}
                                {transaction.Balance.Amount.Currency}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {dateKey !==
                      groupedTransactions[
                        groupedTransactions.length - 1
                      ][0] && <Separator className="mt-4" />}
                  </div>
                );
              })}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Transactions;
