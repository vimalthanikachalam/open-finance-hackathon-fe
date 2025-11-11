import { Card } from "@/components/ui/card";
import {
  ArrowDownRight,
  ArrowUpRight,
  DollarSign,
  Receipt,
  Send,
  ShoppingBag,
  Target,
  TrendingUp,
  Wallet,
} from "lucide-react";

type Props = {};

const PFM = (props: Props) => {
  return (
    <div className="space-y-12">
      <div className="text-center space-y-6 py-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold mb-2">
          <TrendingUp className="w-4 h-4" />
          Take Control of Your Finances
        </div>
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-balance">
          <span className="text-slate-900">Personal Finance</span>
          <br />
          <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 bg-clip-text text-transparent">
            Management
          </span>
        </h1>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto text-pretty leading-relaxed">
          Track spending, set budgets, and achieve your financial goals with
          powerful tools and insights designed for your success.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
        <Card className="gap-2 p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 hover:shadow-xl transition-all hover:-translate-y-1">
          <div className="p-3 bg-emerald-600 rounded-xl w-fit mb-4">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1">$12,450</div>
          <div className="text-sm text-slate-600">Total Balance</div>
        </Card>

        <Card className="gap-2 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 hover:shadow-xl transition-all hover:-translate-y-1">
          <div className="p-3 bg-blue-600 rounded-xl w-fit mb-4">
            <ArrowUpRight className="w-6 h-6 text-white" />
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1">$3,280</div>
          <div className="text-sm text-slate-600">Income This Month</div>
        </Card>

        <Card className="gap-2 p-6 bg-gradient-to-br from-rose-50 to-orange-50 border-2 border-rose-200 hover:shadow-xl transition-all hover:-translate-y-1">
          <div className="p-3 bg-rose-600 rounded-xl w-fit mb-4">
            <ArrowDownRight className="w-6 h-6 text-white" />
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1">$1,840</div>
          <div className="text-sm text-slate-600">Expenses This Month</div>
        </Card>

        <Card className="gap-2 p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 hover:shadow-xl transition-all hover:-translate-y-1">
          <div className="p-3 bg-purple-600 rounded-xl w-fit mb-4">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1">$8,500</div>
          <div className="text-sm text-slate-600">Savings Goal</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-8 border-2 border-slate-200 hover:shadow-xl transition-all">
          <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <div className="w-2 h-8 bg-gradient-to-b from-emerald-600 to-teal-600 rounded-full" />
            Spending by Category
          </h3>
          <div className="space-y-4">
            {[
              {
                category: "Groceries",
                amount: "$580",
                percentage: 32,
                color: "bg-emerald-500",
              },
              {
                category: "Transportation",
                amount: "$340",
                percentage: 18,
                color: "bg-blue-500",
              },
              {
                category: "Entertainment",
                amount: "$290",
                percentage: 16,
                color: "bg-purple-500",
              },
              {
                category: "Utilities",
                amount: "$270",
                percentage: 15,
                color: "bg-orange-500",
              },
              {
                category: "Shopping",
                amount: "$360",
                percentage: 19,
                color: "bg-pink-500",
              },
            ].map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-slate-700">
                    {item.category}
                  </span>
                  <span className="text-sm font-bold text-slate-900">
                    {item.amount}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div
                    className={`${item.color} h-2.5 rounded-full`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-8 border-2 border-slate-200 hover:shadow-xl transition-all">
          <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <div className="w-2 h-8 bg-gradient-to-b from-emerald-600 to-teal-600 rounded-full" />
            Recent Transactions
          </h3>
          <div className="space-y-4">
            {[
              {
                name: "Whole Foods Market",
                amount: "-$84.50",
                category: "Groceries",
                icon: ShoppingBag,
              },
              {
                name: "Salary Deposit",
                amount: "+$3,280.00",
                category: "Income",
                icon: DollarSign,
              },
              {
                name: "Netflix Subscription",
                amount: "-$15.99",
                category: "Entertainment",
                icon: Receipt,
              },
              {
                name: "Gas Station",
                amount: "-$45.00",
                category: "Transportation",
                icon: Send,
              },
              {
                name: "Amazon Purchase",
                amount: "-$127.40",
                category: "Shopping",
                icon: ShoppingBag,
              },
            ].map((transaction, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-emerald-50 transition-colors"
              >
                <div className="p-2 bg-white rounded-lg border border-slate-200">
                  <transaction.icon className="w-5 h-5 text-slate-600" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-slate-900">
                    {transaction.name}
                  </div>
                  <div className="text-xs text-slate-500">
                    {transaction.category}
                  </div>
                </div>
                <div
                  className={`font-bold ${
                    transaction.amount.startsWith("+")
                      ? "text-emerald-600"
                      : "text-slate-900"
                  }`}
                >
                  {transaction.amount}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      {/* 
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="group relative overflow-hidden p-8 hover:shadow-2xl transition-all duration-500 border-2 border-slate-200 hover:border-emerald-300 bg-white hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-bl-full opacity-50 group-hover:opacity-100 transition-opacity" />
          <div className="relative">
            <div className="p-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg mb-6 w-fit">
              <PieChart className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">
              Budget Planning
            </h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              Create custom budgets and track your spending against your goals.
            </p>
            <button className="text-emerald-600 font-semibold hover:gap-3 flex items-center gap-2 transition-all">
              Set Budget <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </Card>

        <Card className="group relative overflow-hidden p-8 hover:shadow-2xl transition-all duration-500 border-2 border-slate-200 hover:border-emerald-300 bg-white hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-bl-full opacity-50 group-hover:opacity-100 transition-opacity" />
          <div className="relative">
            <div className="p-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg mb-6 w-fit">
              <Target className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">
              Financial Goals
            </h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              Set and track progress towards your short and long-term financial
              goals.
            </p>
            <button className="text-emerald-600 font-semibold hover:gap-3 flex items-center gap-2 transition-all">
              Create Goal <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </Card>

        <Card className="group relative overflow-hidden p-8 hover:shadow-2xl transition-all duration-500 border-2 border-slate-200 hover:border-emerald-300 bg-white hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-bl-full opacity-50 group-hover:opacity-100 transition-opacity" />
          <div className="relative">
            <div className="p-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg mb-6 w-fit">
              <BarChart3 className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">
              Smart Reports
            </h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              Get detailed insights and reports on your spending habits and
              trends.
            </p>
            <button className="text-emerald-600 font-semibold hover:gap-3 flex items-center gap-2 transition-all">
              View Reports <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </Card>
      </div> */}

      {/* <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-3xl p-12 shadow-2xl text-white">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <PiggyBank className="w-20 h-20 mx-auto" />
          <h2 className="text-4xl font-bold">
            Start Managing Your Finances Today
          </h2>
          <p className="text-xl text-emerald-100">
            Join thousands who have taken control of their financial future
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button className="px-8 py-4 bg-white text-emerald-600 font-bold rounded-xl hover:bg-emerald-50 transition-colors shadow-lg">
              Get Started Free
            </button>
            <button className="px-8 py-4 bg-transparent text-white font-bold rounded-xl hover:bg-white/10 transition-colors border-2 border-white/30">
              Watch Demo
            </button>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default PFM;
