import { create } from "zustand";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Currency   = "USD" | "EUR" | "GBP" | "PKR" | "AED";
export type DateFormat = "MM/DD/YYYY" | "DD/MM/YYYY" | "YYYY-MM-DD";
export type BudgetLimits = {
  [category: string]: number;
}

export interface CurrencyBudgetLimits {
  Rent:          number;
  Food:          number;
  Transport:     number;
  Utilities:     number;
  Healthcare:    number;
  Entertainment: number;
  Subscriptions: number;
  Other:         number;
  [key: string]: number;
}

export interface NotificationSettings {
  lowBalanceAlert:     boolean;
  lowBalanceThreshold: number;
  monthlySummary:      boolean;
  recurringReminders:  boolean;
}

export interface AppSettings {
  currency:      Currency;
  dateFormat:    DateFormat;
  defaultPage:   string;
  budgetLimits:  BudgetLimits;
  notifications: NotificationSettings;
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULT_SETTINGS: AppSettings = {
  currency:    "USD",
  dateFormat:  "MM/DD/YYYY",
  defaultPage: "/dashboard",
  budgetLimits: {
    Rent:          0,
    Food:          0,
    Transport:     0,
    Utilities:     0,
    Healthcare:    0,
    Entertainment: 0,
    Subscriptions: 0,
    Other:         0,
  },
  notifications: {
    lowBalanceAlert:     true,
    lowBalanceThreshold: 100,
    monthlySummary:      true,
    recurringReminders:  false,
  },
};

const STORAGE_KEY = "cashflow_settings";

// ─── localStorage helpers (swap these two for API calls later) ────────────────

const loadFromStorage = (): AppSettings => {
  // ↓ SWAP: replace with → const res = await fetch("/api/settings")
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
};

const saveToStorage = (settings: AppSettings): void => {
  // ↓ SWAP: replace with → await fetch("/api/settings", { method: "PUT", body: JSON.stringify(settings) })
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
};

// ─── Store Interface ──────────────────────────────────────────────────────────

interface SettingsState {
  settings: AppSettings;
  loading:  boolean;
  error:    string | null;

  fetchSettings: () => Promise<void>;
  saveSettings:  (updated: AppSettings) => Promise<void>;
}

// ─── Store ────────────────────────────────────────────────────────────────────

const useSettingsStore = create<SettingsState>((set) => ({
  settings: DEFAULT_SETTINGS,
  loading:  false,
  error:    null,

  // ── Fetch ─────────────────────────────────────────────────────────────────
  // Currently reads from localStorage.
  // TO SWAP TO DB: replace loadFromStorage() with your API call.
  fetchSettings: async () => {
    set({ loading: true, error: null });
    try {
      const settings = loadFromStorage();
      set({ settings });
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  // ── Save ──────────────────────────────────────────────────────────────────
  // Currently writes to localStorage.
  // TO SWAP TO DB: replace saveToStorage() with your API call.
  saveSettings: async (updated: AppSettings) => {
    set({ loading: true, error: null });
    try {
      saveToStorage(updated);
      set({ settings: updated });
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },
}));

export default useSettingsStore;