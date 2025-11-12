import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiFactory } from "@/lib/api";
import appStore from "@/store";
import { ArrowDownCircle, RefreshCw, Wallet } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {};

const Balances = (props: Props) => {
  const {
    accessToken,
    selectedAccountId,
    setAccountBalanceData,
    accountBalanceData,
  } = appStore();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (accessToken && selectedAccountId) {
      setIsLoading(true);
      apiFactory
        .getAccountBalances(accessToken, selectedAccountId)
        .then((res) => {
          setAccountBalanceData(res);
        })
        .catch((error) => {
          console.error("Failed to fetch balances:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [accessToken, selectedAccountId]);

  const formatAmount = (amount: string, currency: string) => {
    const numAmount = parseFloat(amount);
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
    }).format(numAmount);
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getBalanceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "interimavailable":
      case "available":
        return <Wallet className="h-5 w-5 text-green-600" />;
      case "interimbooked":
      case "closingbooked":
        return <ArrowDownCircle className="h-5 w-5 text-blue-600" />;
      default:
        return <Wallet className="h-5 w-5 text-gray-600" />;
    }
  };

  const getBalanceTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      InterimAvailable: "Available Balance",
      InterimBooked: "Current Balance",
      ClosingBooked: "Closing Balance",
      Expected: "Expected Balance",
      OpeningBooked: "Opening Balance",
      Available: "Available Balance",
    };
    return labels[type] || type;
  };

  // Loading state
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold">
                Account Balances
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Loading account information...
              </p>
            </div>
            <RefreshCw className="h-5 w-5 animate-spin text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="relative">
              <div className="h-16 w-16 rounded-full border-4 border-muted"></div>
              <div className="absolute top-0 h-16 w-16 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Fetching your balance information
              </p>
              <p className="text-xs text-muted-foreground">
                This may take a few seconds...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // No data state
  if (!accountBalanceData?.Balance || accountBalanceData.Balance.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Account Balances
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Wallet className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm font-medium text-muted-foreground">
              No balance information available
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Please select an account to view balances
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold">
              Account Balances
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Account ID:{" "}
              <span className="font-mono">{accountBalanceData.AccountId}</span>
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Balance Type</TableHead>
                <TableHead className="font-semibold">Amount</TableHead>
                <TableHead className="font-semibold">Type</TableHead>
                <TableHead className="font-semibold">Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accountBalanceData.Balance.map((balance, index) => {
                const isCredit = balance.CreditDebitIndicator === "Credit";
                return (
                  <TableRow
                    key={index}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getBalanceIcon(balance.Type)}
                        <span className="font-medium">
                          {getBalanceTypeLabel(balance.Type)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-lg font-semibold ${
                            isCredit ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {formatAmount(
                            balance.Amount.Amount,
                            balance.Amount.Currency
                          )}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={isCredit ? "default" : "secondary"}
                        className={
                          isCredit
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : "bg-red-100 text-red-800 hover:bg-red-100"
                        }
                      >
                        {balance.CreditDebitIndicator}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDateTime(balance.DateTime)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default Balances;
