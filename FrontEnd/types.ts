export interface FinancialData {
  monthlyIncome: number;
  fixedExpenses: number;
  variableExpenses: number;
  currentSavings: number;
  forecastPeriod: 3 | 6 | 12;
}

export interface MonthlyForecast {
  month: string;
  balance: number;
  income: number;
  expenses: number;
}

export interface RiskLevel {
  status: 'safe' | 'tight' | 'high-risk';
  label: string;
  icon: string;
}