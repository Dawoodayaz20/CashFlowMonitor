import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AreaChartComp from "./AreaChart";
import AddTransactionModal from "../transactionModal/addTransaction";
import useTransactionStore from "../../store/useTransactionStore";
import type { Transaction } from "../../../types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TransactionForm {
  type: "income" | "expense";
  amount: string;
  category: string;
  date: string;
  note: string;
  isRecurring: boolean;
  frequency: "weekly" | "monthly" | "yearly";
  endDate: string;
}

interface transactionDataInt {
  month: string,
  income: number,
  expense: number
}

interface AreaChartData {
  data ?: transactionDataInt[]
}

// ─── Summary Card ─────────────────────────────────────────────────────────────

interface SummaryCardProps {
  label: string;
  value: string;
  accent?: "teal" | "rose" | "neutral" | "positive";
  icon: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ label, value, accent = "neutral", icon }) => {
  const accentStyles = {
    teal:     "from-teal-50 to-teal-100/60 border-teal-200",
    rose:     "from-rose-50 to-rose-100/60 border-rose-200",
    positive: "from-emerald-50 to-emerald-100/60 border-emerald-200",
    neutral:  "from-white to-gray-50 border-gray-200",
  };
  const valueStyles = {
    teal:     "text-teal-700",
    rose:     "text-rose-600",
    positive: "text-emerald-600",
    neutral:  "text-gray-800",
  };

  return (
    <div className={`bg-gradient-to-br ${accentStyles[accent]} border rounded-2xl p-5 shadow-sm`}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{label}</p>
        <span className="text-lg">{icon}</span>
      </div>
      <p className={`text-2xl font-bold ${valueStyles[accent]}`}>{value}</p>
    </div>
  );
};

// ─── Dashboard Component ──────────────────────────────────────────────────────

const Dashboard: React.FC = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  // const navigate = useNavigate();
  const { transactions, fetchTransactions} = useTransactionStore();

  useEffect(()=>{
    fetchTransactions();
  }, [])

  const handleTransactionSubmit = (data: TransactionForm) => {
    // console.log("New transaction:", data);
    // → wire to useTransactionStore later
  };
// month: new Date(a.date).toLocaleString('default', { month: 'short' })

  // const chartData = (data: Transaction[]): transactionDataInt[] => {
  //   return data.map((a) => ({
  //       month: new Date(a.date).toLocaleString('default', { month: 'short' }),
  //       income: a.type === 'income' ? a.amount : 0,
  //       expense: a.type === 'expense' ? a.amount : 0
  //     }))
  //   };

  const chartData = (data: Transaction[]): transactionDataInt[] => {
  // Step 1: Group and aggregate by month
  const monthMap: Record<string, transactionDataInt> = {};

  data.forEach((tx) => {
    const date  = new Date(tx.date);
    // Key by "YYYY-MM" so sorting works correctly
    const key   = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const label = date.toLocaleString("default", { month: "short" });

    if (!monthMap[key]) {
      monthMap[key] = { month: label, income: 0, expense: 0 };
    }

    if (tx.type === "income")  monthMap[key].income  += tx.amount;
    if (tx.type === "expense") monthMap[key].expense += tx.amount;
  });

  // Step 2: Sort by "YYYY-MM" key ascending, then return just the values
  return Object.entries(monthMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, value]) => value);
};

  console.log(chartData(transactions))

  const recentTransactions = transactions
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .slice(0,5);

  // console.log(transactions.map((a) => {
  //   return new Date(a.date).toLocaleString('default', { month: 'short' })
  // }));

  const monthChart = transactions.map((a) => {
    return new Date(a.date).toLocaleString('default', { month: 'short' })
  });
  
  // const Data : DataPoint[] = (transactions) => {
  //   const month = transactions.map((a) => {
  //   return new Date(a.date).toLocaleString('default', { month: 'short' })
  // })

  const MOCK_TRANSACTIONS = [
  { id: 1, type: "income"  as const, label: "Salary",        date: "Feb 1, 2026",  amount: 2000 },
  { id: 2, type: "expense" as const, label: "Rent",           date: "Feb 2, 2026",  amount: 800  },
  { id: 3, type: "expense" as const, label: "Groceries",      date: "Feb 5, 2026",  amount: 120  },
  { id: 4, type: "income"  as const, label: "Freelance",      date: "Feb 8, 2026",  amount: 500  },
  { id: 5, type: "expense" as const, label: "Subscriptions",  date: "Feb 10, 2026", amount: 45   },
  { id: 6, type: "expense" as const, label: "Transport",      date: "Feb 12, 2026", amount: 60   },
];

  const totalIncome : number = recentTransactions
  .filter((tx) => tx.type === 'income')
  .reduce((sum, tx) => sum + tx.amount, 0);

  const totalExpense : number = recentTransactions
  .filter((tx) => tx.type ==='expense')
  .reduce((sum, tx) => sum + tx.amount, 0) 

  const totalBalance : number = totalIncome - totalExpense

  const AvgIncome = (amount: number) : number => Math.round(amount/12);
  const AvgExpense = (amount: number) : number => Math.round(amount/12);
  
  console.log(totalIncome)
  console.log(AvgIncome(totalIncome))

  return (
    <div className="flex w-full h-screen bg-gray-50 font-sans">

      {/* ── Main Content ─────────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto">

        {/* Page Body */}
        <div className="px-8 py-6 space-y-6">

          {/* ── Summary Cards ──────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <SummaryCard label="Total Balance"     value={`$${totalBalance}`}   accent="neutral"  icon="🏦" />
            <SummaryCard label="Income"            value={`$${totalIncome}`}   accent="teal"     icon="💰" />
            <SummaryCard label="Expenses"          value={`$${totalExpense}`}     accent="rose"     icon="💸" />
            <SummaryCard label="Net Monthly"       value={`$${totalIncome}`} accent="positive" icon="📈" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">

            {/* LEFT: Risk Status + Transactions Overview */}
            <div className="flex flex-col gap-4">

              {/* Risk Status */}
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-1">Risk Status</h2>
                  <p className="text-gray-600 text-sm">Based on income, expenses & savings rate</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-emerald-700 font-semibold text-sm">Safe</span>
                </div>
              </div>

              {/* Transactions Overview */}
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-1">Transactions Overview</h2>
                    <p className="text-gray-500 text-xs">Your most recent entries</p>
                  </div>
                  <button className="text-xs font-semibold text-teal-600 hover:text-teal-700 transition">
                    View all →
                  </button>
                </div>

                {/* Transaction List — static placeholder, wired to store later */}
                <div className="space-y-2">
                  {recentTransactions.map((tx) => (
                    <div
                      key={tx._id}
                      className="flex items-center justify-between px-4 py-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition"
                    >
                      {/* Left: icon + label + date */}
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 ${
                            tx.type === "income"
                              ? "bg-teal-50 text-teal-600"
                              : "bg-rose-50 text-rose-500"
                          }`}
                        >
                          {tx.type === "income" ? "💰" : "💸"}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-700 leading-tight">{tx.note}</p>
                          <p className="text-xs text-gray-400">{new Date(tx.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                        </div>
                      </div>

                      {/* Right: amount */}
                      <span
                        className={`text-sm font-bold ${
                          tx.type === "income" ? "text-teal-600" : "text-rose-500"
                        }`}
                      >
                        {tx.type === "income" ? "+" : "-"}${tx.amount.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT: Cash Flow Forecast Chart */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-1">Cash-Flow Forecast</h2>
                  <p className="text-gray-600 text-sm">Monthly income vs expenses</p>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-teal-50 text-teal-700 font-semibold border border-teal-100">
                  Last 6 months
                </span>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <AreaChartComp data={chartData(transactions)}/>
              </div>
            </div>

          </div>

          {/* ── Monthly Summary Cards ──────────────────────────────────────── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Avg Income",       value: `${AvgIncome(totalIncome)}`,   icon: "📊", accent: "teal"     as const },
              { label: "Avg Expenses",     value: `${AvgExpense(totalExpense)}`,     icon: "🧾", accent: "rose"     as const },
              { label: "Monthly Net",      value: `${AvgExpense(totalBalance)}`,  icon: "💹", accent: "positive" as const },
              { label: "Survival Months",  value: "8 months", icon: "🛡️", accent: "neutral"  as const },
            ].map((item) => (
              <SummaryCard key={item.label} label={item.label} value={item.value} icon={item.icon} accent={item.accent} />
            ))}
          </div>

          {/* ── What If Simulator ──────────────────────────────────────────── */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-1">What If Simulator</h2>
              <p className="text-gray-600 text-sm">Adjust variables to see how your cash flow would change</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {[
                { placeholder: "Rent increase ($)", label: "Rent Change" },
                { placeholder: "Income change ($)",  label: "Income Change" },
                { placeholder: "New expense ($)",    label: "New Expense" },
              ].map((field) => (
                <div key={field.label}>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                    {field.label}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">$</span>
                    <input
                      type="number"
                      placeholder="0.00"
                      className="w-full pl-7 pr-4 py-2.5 border border-gray-200 rounded-xl text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 transition"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="h-48 flex items-center justify-center rounded-xl border border-dashed border-gray-200 text-gray-300 font-semibold text-sm">
              Updated forecast will appear here
            </div>
          </div>

        </div>{/* end page body */}
      </main>

      {/* ── Transaction Modal ─────────────────────────────────────────────────── */}
      <AddTransactionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleTransactionSubmit}
      />
    </div>
  );
};

export default Dashboard;