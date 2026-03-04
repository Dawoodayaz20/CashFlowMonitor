import useSettingsStore from "./store/useSettingsStore";
import type { Currency, DateFormat } from './store/useSettingsStore';

// ─── Currency Symbol Map ──────────────────────────────────────────────────────

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  PKR: "Rs",
  AED: "د.إ",
};

// ─── Date Formatter ───────────────────────────────────────────────────────────

const formatDateString = (dateStr: string, format: DateFormat): string => {
  const date = new Date(dateStr);
  const dd   = String(date.getDate()).padStart(2, "0");
  const mm   = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = String(date.getFullYear());

  switch (format) {
    case "MM/DD/YYYY": return `${mm}/${dd}/${yyyy}`;
    case "DD/MM/YYYY": return `${dd}/${mm}/${yyyy}`;
    case "YYYY-MM-DD": return `${yyyy}-${mm}-${dd}`;
    default:           return `${mm}/${dd}/${yyyy}`;
  }
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

const useFormatters = () => {
  const { currency, dateFormat } = useSettingsStore((s) => s.settings);

  const symbol = CURRENCY_SYMBOLS[currency] ?? "$";

  // formatCurrency(1200) → "$ 1,200" or "Rs 1,200"
  const formatCurrency = (amount: number): string => {
    return `${symbol}${amount.toLocaleString()}`;
  };

  // formatDate("2025-01-15") → "15/01/2025" based on settings
  const formatDate = (dateStr: string): string => {
    return formatDateString(dateStr, dateFormat);
  };

  // Just the symbol, useful for inline labels like inputs
  const currencySymbol = symbol;

  return { formatCurrency, formatDate, currencySymbol };
};

export default useFormatters;