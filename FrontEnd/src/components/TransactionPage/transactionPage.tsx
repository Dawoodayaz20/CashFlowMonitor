import React, { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import AddTransactionModal from "../transactionModal/addTransaction";

// ─── Types ────────────────────────────────────────────────────────────────────

type TxType = "income" | "expense";
type SortKey = "date" | "amount";
type SortDir = "asc" | "desc";

interface Transaction {
  id: number;
  type: TxType;
  label: string;
  category: string;
  date: string;         // "YYYY-MM-DD"
  amount: number;
  note?: string;
  isRecurring?: boolean;
  frequency?: "weekly" | "monthly" | "yearly";
}

interface TransactionPageProps {
  type: TxType;
}

// ─── Mock Data (swap for Zustand store later) ─────────────────────────────────

const ALL_MOCK: Transaction[] = [
  { id: 1,  type: "income",  label: "Salary",       category: "Salary",        date: "2026-02-01", amount: 3000, isRecurring: true,  frequency: "monthly" },
  { id: 2,  type: "income",  label: "Freelance",    category: "Freelance",     date: "2026-02-08", amount: 800,  isRecurring: false },
  { id: 3,  type: "income",  label: "Dividends",    category: "Investment",    date: "2026-02-14", amount: 200,  isRecurring: false },
  { id: 4,  type: "income",  label: "Rental",       category: "Rental",        date: "2026-02-15", amount: 500,  isRecurring: true,  frequency: "monthly" },
  { id: 5,  type: "income",  label: "Bonus",        category: "Salary",        date: "2026-01-20", amount: 1000, isRecurring: false },
  { id: 6,  type: "income",  label: "Consulting",   category: "Freelance",     date: "2026-01-10", amount: 600,  isRecurring: false },
  { id: 7,  type: "expense", label: "Rent",         category: "Rent",          date: "2026-02-02", amount: 900,  isRecurring: true,  frequency: "monthly" },
  { id: 8,  type: "expense", label: "Groceries",    category: "Food",          date: "2026-02-05", amount: 180,  isRecurring: false },
  { id: 9,  type: "expense", label: "Netflix",      category: "Subscriptions", date: "2026-02-06", amount: 15,   isRecurring: true,  frequency: "monthly" },
  { id: 10, type: "expense", label: "Electricity",  category: "Utilities",     date: "2026-02-10", amount: 90,   isRecurring: true,  frequency: "monthly" },
  { id: 11, type: "expense", label: "Uber",         category: "Transport",     date: "2026-02-12", amount: 40,   isRecurring: false },
  { id: 12, type: "expense", label: "Dining Out",   category: "Food",          date: "2026-01-18", amount: 75,   isRecurring: false },
  { id: 13, type: "expense", label: "Gym",          category: "Healthcare",    date: "2026-01-05", amount: 50,   isRecurring: true,  frequency: "monthly" },
];

// ─── Theme config per type ────────────────────────────────────────────────────

const THEME = {
  income: {
    accent:       "#0f766e",
    accentLight:  "#14b8a6",
    bg:           "bg-teal-600",
    bgLight:      "bg-teal-50",
    bgHover:      "hover:bg-teal-700",
    border:       "border-teal-200",
    text:         "text-teal-700",
    textAccent:   "text-teal-600",
    ring:         "focus:ring-teal-200",
    gradient:     "linear-gradient(135deg, #0f766e, #14b8a6)",
    barColor:     "#14b8a6",
    sign:         "+",
    amountColor:  "text-teal-600",
    icon:         "💰",
    label:        "Income",
  },
  expense: {
    accent:       "#be123c",
    accentLight:  "#f43f5e",
    bg:           "bg-rose-600",
    bgLight:      "bg-rose-50",
    bgHover:      "hover:bg-rose-700",
    border:       "border-rose-200",
    text:         "text-rose-700",
    textAccent:   "text-rose-600",
    ring:         "focus:ring-rose-200",
    gradient:     "linear-gradient(135deg, #be123c, #f43f5e)",
    barColor:     "#f43f5e",
    sign:         "-",
    amountColor:  "text-rose-600",
    icon:         "💸",
    label:        "Expenses",
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number) => `$${n.toLocaleString()}`;

const monthLabel = (year: number, month: number) =>
  new Date(year, month - 1, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });

// ─── Sub-components ───────────────────────────────────────────────────────────

// Stat Card
const StatCard: React.FC<{ label: string; value: string; sub?: string; gradient: string }> = ({
  label, value, sub, gradient,
}) => (
  <div className="rounded-2xl p-5 text-white shadow-md" style={{ background: gradient }}>
    <p className="text-xs font-semibold uppercase tracking-widest text-white/70 mb-2">{label}</p>
    <p className="text-2xl font-bold">{value}</p>
    {sub && <p className="text-xs text-white/60 mt-1">{sub}</p>}
  </div>
);

// Action Menu
const ActionMenu: React.FC<{
  onEdit: () => void;
  onDelete: () => void;
}> = ({ onEdit, onDelete }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition text-sm"
      >
        ···
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-8 z-20 bg-white border border-gray-100 rounded-xl shadow-lg py-1 w-32 text-sm">
            <button
              onClick={() => { onEdit(); setOpen(false); }}
              className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 font-medium transition"
            >
              ✏️ Edit
            </button>
            <button
              onClick={() => { onDelete(); setOpen(false); }}
              className="w-full text-left px-4 py-2 hover:bg-rose-50 text-rose-500 font-medium transition"
            >
              🗑️ Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const TransactionPage: React.FC<TransactionPageProps> = ({ type }) => {
  const th = THEME[type];

  // ── Date navigation state ──
  const now = new Date();
  const [year,  setYear]  = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  // ── Filter / sort / search state ──
  const [search,    setSearch]    = useState("");
  const [sortKey,   setSortKey]   = useState<SortKey>("date");
  const [sortDir,   setSortDir]   = useState<SortDir>("desc");
  const [dateFrom,  setDateFrom]  = useState("");
  const [dateTo,    setDateTo]    = useState("");

  // ── Modal state ──
  const [modalOpen,    setModalOpen]    = useState(false);
  const [editingTx,    setEditingTx]    = useState<Transaction | null>(null);

  // ── Transactions filtered by type + month (or custom date range) ──
  const monthFiltered = useMemo(() => {
    return ALL_MOCK.filter((tx) => {
      if (tx.type !== type) return false;
      if (dateFrom && tx.date < dateFrom) return false;
      if (dateTo   && tx.date > dateTo)   return false;
      if (!dateFrom && !dateTo) {
        const d = new Date(tx.date);
        if (d.getFullYear() !== year || d.getMonth() + 1 !== month) return false;
      }
      return true;
    });
  }, [type, year, month, dateFrom, dateTo]);

  // ── Search + sort ──
  const displayed = useMemo(() => {
    let rows = monthFiltered.filter((tx) => {
      const q = search.toLowerCase();
      return (
        tx.label.toLowerCase().includes(q) ||
        tx.category.toLowerCase().includes(q) ||
        (tx.note ?? "").toLowerCase().includes(q)
      );
    });
    rows.sort((a, b) => {
      const mul = sortDir === "asc" ? 1 : -1;
      if (sortKey === "amount") return (a.amount - b.amount) * mul;
      return a.date.localeCompare(b.date) * mul;
    });
    return rows;
  }, [monthFiltered, search, sortKey, sortDir]);

  // ── Summary stats ──
  const total   = monthFiltered.reduce((s, t) => s + t.amount, 0);
  const avg     = monthFiltered.length ? Math.round(total / monthFiltered.length) : 0;
  const topCat  = useMemo(() => {
    const map: Record<string, number> = {};
    monthFiltered.forEach((t) => { map[t.category] = (map[t.category] ?? 0) + t.amount; });
    return Object.entries(map).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";
  }, [monthFiltered]);

  // ── Category bar chart data ──
  const categoryData = useMemo(() => {
    const map: Record<string, number> = {};
    monthFiltered.forEach((t) => { map[t.category] = (map[t.category] ?? 0) + t.amount; });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [monthFiltered]);

  // ── Month navigation ──
  const prevMonth = () => {
    setDateFrom(""); setDateTo("");
    if (month === 1) { setMonth(12); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    setDateFrom(""); setDateTo("");
    if (month === 12) { setMonth(1); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  const handleEdit = (tx: Transaction) => {
    setEditingTx(tx);
    setModalOpen(true);
  };

  const handleDelete = (id: number) => {
    // wire to store later
    console.log("Delete transaction:", id);
  };

  const handleModalSubmit = (data: any) => {
    if (editingTx) {
      console.log("Update transaction:", editingTx.id, data);
    } else {
      console.log("Add transaction:", data);
    }
    setEditingTx(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div
        className="px-8 py-6"
        style={{ background: th.gradient }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/60 mb-1">
              {monthLabel(year, month)}
            </p>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              {th.icon} {th.label}
            </h1>
          </div>
          <button
            onClick={() => { setEditingTx(null); setModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-white/20 hover:bg-white/30 text-white border border-white/30 transition active:scale-95"
          >
            + Add {type === "income" ? "Income" : "Expense"}
          </button>
        </div>

        {/* ── Summary Cards ── */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-white/15 border border-white/20 rounded-2xl p-4 backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/60 mb-1">
              Total {th.label}
            </p>
            <p className="text-2xl font-bold text-white">{fmt(total)}</p>
          </div>
          <div className="bg-white/15 border border-white/20 rounded-2xl p-4 backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/60 mb-1">Avg per Entry</p>
            <p className="text-2xl font-bold text-white">{fmt(avg)}</p>
          </div>
          <div className="bg-white/15 border border-white/20 rounded-2xl p-4 backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/60 mb-1">Top Category</p>
            <p className="text-2xl font-bold text-white">{topCat}</p>
          </div>
        </div>
      </div>

      {/* ── Page Body ────────────────────────────────────────────────────────── */}
      <div className="px-8 py-6 space-y-6">

        {/* ── Month Navigator + Date Filter ────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-4">

          {/* Month arrows */}
          <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-4 py-2 shadow-sm">
            <button
              onClick={prevMonth}
              className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500 transition"
            >
              ←
            </button>
            <span className="text-sm font-semibold text-gray-700 min-w-[130px] text-center">
              {monthLabel(year, month)}
            </span>
            <button
              onClick={nextMonth}
              className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500 transition"
            >
              →
            </button>
          </div>

          {/* Custom date range */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Custom range:</span>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-200 text-gray-700"
            />
            <span className="text-gray-400 text-sm">→</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-200 text-gray-700"
            />
            {(dateFrom || dateTo) && (
              <button
                onClick={() => { setDateFrom(""); setDateTo(""); }}
                className="text-xs text-gray-400 hover:text-rose-500 transition font-medium"
              >
                Clear ✕
              </button>
            )}
          </div>
        </div>

        {/* ── Category Breakdown Bar Chart ─────────────────────────────────── */}
        {categoryData.length > 0 && (
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">
              Category Breakdown
            </h2>
            <div style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} margin={{ top: 0, right: 10, left: 0, bottom: 0 }} barSize={32}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12, fill: "#94a3b8", fontWeight: 500 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `$${v}`}
                    width={50}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(0,0,0,0.04)" }}
                    content={({ active, payload, label }) => {
                      if (!active || !payload?.length) return null;
                      return (
                        <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3 text-sm">
                          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">{label}</p>
                          <p className="font-bold text-gray-800">{fmt(payload[0].value as number)}</p>
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {categoryData.map((_, i) => (
                      <Cell
                        key={i}
                        fill={th.barColor}
                        opacity={1 - i * (0.12)}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ── Transactions Table ───────────────────────────────────────────── */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">

          {/* Table toolbar */}
          <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-gray-100">
            {/* Search */}
            <div className="relative flex-1 max-w-xs">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
              <input
                type="text"
                placeholder="Search transactions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-200 text-gray-700 transition"
              />
            </div>

            {/* Sort controls */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Sort:</span>
              {(["date", "amount"] as SortKey[]).map((key) => (
                <button
                  key={key}
                  onClick={() => toggleSort(key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                    sortKey === key
                      ? `${th.bg} text-white`
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {key} {sortKey === key ? (sortDir === "asc" ? "↑" : "↓") : ""}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          {displayed.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-300">
              <span className="text-4xl mb-3">{th.icon}</span>
              <p className="font-semibold text-sm">No transactions found</p>
              <p className="text-xs mt-1">Try adjusting your filters or add a new entry</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["Date", "Category", "Note", "Recurring", "Amount", ""].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayed.map((tx, i) => (
                  <tr
                    key={tx.id}
                    className={`border-b border-gray-50 hover:bg-gray-50/80 transition ${
                      i % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                    }`}
                  >
                    {/* Date */}
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                      {new Date(tx.date).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric",
                      })}
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${th.bgLight} ${th.text}`}>
                        {tx.category}
                      </span>
                    </td>

                    {/* Note / Label */}
                    <td className="px-6 py-4 text-gray-700 font-medium">
                      {tx.note ?? tx.label}
                    </td>

                    {/* Recurring */}
                    <td className="px-6 py-4">
                      {tx.isRecurring ? (
                        <span className="flex items-center gap-1 text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full w-fit">
                          🔁 {tx.frequency}
                        </span>
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
                    </td>

                    {/* Amount */}
                    <td className={`px-6 py-4 font-bold ${th.amountColor} whitespace-nowrap`}>
                      {th.sign}{fmt(tx.amount)}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <ActionMenu
                        onEdit={() => handleEdit(tx)}
                        onDelete={() => handleDelete(tx.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Table footer count */}
          {displayed.length > 0 && (
            <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between">
              <p className="text-xs text-gray-400">
                Showing <span className="font-semibold text-gray-600">{displayed.length}</span> transaction{displayed.length !== 1 ? "s" : ""}
              </p>
              <p className="text-xs font-semibold text-gray-600">
                Total: <span className={th.textAccent}>{fmt(displayed.reduce((s, t) => s + t.amount, 0))}</span>
              </p>
            </div>
          )}
        </div>

      </div>{/* end page body */}

      {/* ── Modal ─────────────────────────────────────────────────────────────── */}
      <AddTransactionModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingTx(null); }}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
};

export default TransactionPage;