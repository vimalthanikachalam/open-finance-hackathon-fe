import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { apiFactory } from "@/lib/api";
import appStore from "@/store";
import { ITransaction } from "@/store/models";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Building,
  Car,
  Coffee,
  CreditCard,
  Gift,
  Home,
  Loader2,
  ShoppingCart,
  Smartphone,
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (accessToken && selectedAccountId) {
      setIsLoading(true);
      apiFactory
        .getAccountTransactions(
          accessToken as string,
          selectedAccountId as string
        )
        .then((data) => {
          setTransactionsData(data);
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

      {/* Income vs Expenses Graph */}
      <Card className="p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-6">
          Income vs Expenses
        </h3>
        <div className="space-y-6">
          {/* Income Bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                <span className="text-sm font-semibold text-slate-700">
                  Total Income
                </span>
              </div>
              <span className="text-sm font-bold text-slate-900">
                {pfmMetrics.currency} {pfmMetrics.totalIncome.toFixed(2)}
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-8 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-8 rounded-full flex items-center justify-end pr-3 transition-all duration-1000"
                style={{
                  width: `${
                    pfmMetrics.totalIncome > 0 && pfmMetrics.totalExpenses > 0
                      ? Math.min(
                          (pfmMetrics.totalIncome /
                            Math.max(
                              pfmMetrics.totalIncome,
                              pfmMetrics.totalExpenses
                            )) *
                            100,
                          100
                        )
                      : pfmMetrics.totalIncome > 0
                      ? 100
                      : 0
                  }%`,
                }}
              >
                {pfmMetrics.totalIncome > 0 && (
                  <span className="text-white text-xs font-semibold">
                    {(
                      (pfmMetrics.totalIncome /
                        Math.max(
                          pfmMetrics.totalIncome,
                          pfmMetrics.totalExpenses
                        )) *
                      100
                    ).toFixed(0)}
                    %
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Expenses Bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-rose-600 rounded-full"></div>
                <span className="text-sm font-semibold text-slate-700">
                  Total Expenses
                </span>
              </div>
              <span className="text-sm font-bold text-slate-900">
                {pfmMetrics.currency} {pfmMetrics.totalExpenses.toFixed(2)}
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-8 overflow-hidden">
              <div
                className="bg-gradient-to-r from-rose-500 to-rose-600 h-8 rounded-full flex items-center justify-end pr-3 transition-all duration-1000"
                style={{
                  width: `${
                    pfmMetrics.totalIncome > 0 && pfmMetrics.totalExpenses > 0
                      ? Math.min(
                          (pfmMetrics.totalExpenses /
                            Math.max(
                              pfmMetrics.totalIncome,
                              pfmMetrics.totalExpenses
                            )) *
                            100,
                          100
                        )
                      : pfmMetrics.totalExpenses > 0
                      ? 100
                      : 0
                  }%`,
                }}
              >
                {pfmMetrics.totalExpenses > 0 && (
                  <span className="text-white text-xs font-semibold">
                    {(
                      (pfmMetrics.totalExpenses /
                        Math.max(
                          pfmMetrics.totalIncome,
                          pfmMetrics.totalExpenses
                        )) *
                      100
                    ).toFixed(0)}
                    %
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Net Savings Indicator */}
          <div className="pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-700">
                Net Savings
              </span>
              <span
                className={`text-lg font-bold ${
                  pfmMetrics.savings >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {pfmMetrics.savings >= 0 ? "+" : ""}
                {pfmMetrics.currency} {pfmMetrics.savings.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </Card>

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
                              {amount.toFixed(2)} {transaction.Amount.Currency}
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
                    groupedTransactions[groupedTransactions.length - 1][0] && (
                    <Separator className="mt-4" />
                  )}
                </div>
              );
            })}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default Transactions;
