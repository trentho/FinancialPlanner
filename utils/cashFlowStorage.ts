import AsyncStorage from '@react-native-async-storage/async-storage';

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Predefined income categories for classification
 * Extensible for future custom categories
 */
export enum IncomeCategory {
  SALARY = 'Salary',
  FREELANCE = 'Freelance',
  INVESTMENT = 'Investment',
  BUSINESS = 'Business',
  RENTAL = 'Rental',
  GIFT = 'Gift',
  REFUND = 'Refund',
  BONUS = 'Bonus',
  OTHER = 'Other',
}

/**
 * Type alias for category values
 */
export type IncomeCategoryType = `${IncomeCategory}`;

/**
 * Represents a single income entry in the cash flow system
 */
export interface IncomeEntry {
  id: string;
  amount: number;
  date: string;
  description: string;
  category: IncomeCategoryType;
  timestamp: number;
  balanceAfter?: number;
  isRecurring?: boolean;
  recurringId?: string;
}

/**
 * Represents the current state of the cash flow balance
 */
export interface CashFlowBalance {
  initialBalance: number;
  currentBalance: number;
  lastUpdated: number;
  lastEntryId?: string;
  totalIncome: number;
  totalExpenses: number;
}

/**
 * Aggregated summary for a specific time period
 */
export interface CashFlowSummary {
  period: string;
  periodType: 'month' | 'year' | 'custom';
  totalIncome: number;
  totalExpenses: number;
  netCashFlow: number;
  entryCount: number;
  averageIncome: number;
  startBalance: number;
  endBalance: number;
  categoryBreakdown: Record<IncomeCategoryType, number>;
  trend: number;
}

/**
 * Represents a date range for filtering operations
 */
export interface DateRange {
  startDate: string;
  endDate: string;
}

/**
 * Filter criteria for querying income entries
 */
export interface IncomeFilter {
  dateRange?: DateRange;
  categories?: IncomeCategoryType[];
  minAmount?: number;
  maxAmount?: number;
  searchText?: string;
}

// ============================================================================
// Storage Keys
// ============================================================================

const CASHFLOW_STORAGE_KEYS = {
  BALANCE: '@cashflow_balance',
  INCOME_ENTRIES: '@cashflow_income_entries',
  SUMMARIES: '@cashflow_summaries',
  SETTINGS: '@cashflow_settings',
} as const;

// ============================================================================
// Custom Error Classes
// ============================================================================

export class CashFlowError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CashFlowError';
  }
}

export class ValidationError extends CashFlowError {
  constructor(field: string, message: string) {
    super(`Validation error for ${field}: ${message}`);
    this.name = 'ValidationError';
  }
}

export class StorageError extends CashFlowError {
  constructor(operation: string, originalError: Error) {
    super(`Storage operation '${operation}' failed: ${originalError.message}`);
    this.name = 'StorageError';
  }
}

export class BalanceNotInitializedError extends CashFlowError {
  constructor() {
    super('Cash flow balance has not been initialized. Please set an initial balance.');
    this.name = 'BalanceNotInitializedError';
  }
}

export class NotFoundError extends CashFlowError {
  constructor(resource: string, id: string) {
    super(`${resource} with id '${id}' not found`);
    this.name = 'NotFoundError';
  }
}

// ============================================================================
// Validation Functions
// ============================================================================

/**
 * Validate amount is a positive number with max 2 decimal places
 */
function validateAmount(amount: number): void {
  if (typeof amount !== 'number' || isNaN(amount)) {
    throw new ValidationError('amount', 'Must be a valid number');
  }
  if (amount <= 0) {
    throw new ValidationError('amount', 'Must be greater than 0');
  }
  if (!Number.isFinite(amount)) {
    throw new ValidationError('amount', 'Must be a finite number');
  }
  const decimalPlaces = (amount.toString().split('.')[1] || '').length;
  if (decimalPlaces > 2) {
    throw new ValidationError('amount', 'Maximum 2 decimal places allowed');
  }
}

/**
 * Validate date is in ISO format (YYYY-MM-DD) and not in future
 */
function validateDate(date: string): void {
  if (typeof date !== 'string') {
    throw new ValidationError('date', 'Must be a string');
  }
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!isoDateRegex.test(date)) {
    throw new ValidationError('date', 'Must be in YYYY-MM-DD format');
  }
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    throw new ValidationError('date', 'Must be a valid date');
  }
}

/**
 * Validate description is non-empty and within length limit
 */
function validateDescription(description: string): void {
  if (typeof description !== 'string') {
    throw new ValidationError('description', 'Must be a string');
  }
  if (description.trim().length === 0) {
    throw new ValidationError('description', 'Cannot be empty');
  }
  if (description.length > 200) {
    throw new ValidationError('description', 'Maximum 200 characters allowed');
  }
}

/**
 * Validate category is a valid IncomeCategory value
 */
function validateCategory(category: string): void {
  if (typeof category !== 'string') {
    throw new ValidationError('category', 'Must be a string');
  }
  const validCategories = Object.values(IncomeCategory);
  if (!validCategories.includes(category as IncomeCategory)) {
    throw new ValidationError('category', `Must be one of: ${validCategories.join(', ')}`);
  }
}

/**
 * Validate complete income entry
 */
function validateIncomeEntry(
  entry: Omit<IncomeEntry, 'id' | 'timestamp' | 'balanceAfter'>
): void {
  validateAmount(entry.amount);
  validateDate(entry.date);
  validateDescription(entry.description);
  validateCategory(entry.category);
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Generate UUID v4 for entry IDs
 */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Standard error handling wrapper for storage operations
 */
async function safeStorageOperation<T>(
  operation: string,
  fn: () => Promise<T>
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (error instanceof CashFlowError) {
      throw error;
    }
    throw new StorageError(operation, error as Error);
  }
}

/**
 * Calculate running balance for all entries
 */
function calculateRunningBalance(
  initialBalance: number,
  entries: IncomeEntry[]
): { entries: IncomeEntry[]; currentBalance: number; totalIncome: number } {
  let runningBalance = initialBalance;
  let totalIncome = 0;

  const sortedEntries = [...entries].sort((a, b) => {
    const dateCompare = new Date(a.date).getTime() - new Date(b.date).getTime();
    return dateCompare !== 0 ? dateCompare : a.timestamp - b.timestamp;
  });

  const updatedEntries = sortedEntries.map(entry => {
    runningBalance += entry.amount;
    totalIncome += entry.amount;
    return {
      ...entry,
      balanceAfter: runningBalance,
    };
  });

  return {
    entries: updatedEntries,
    currentBalance: runningBalance,
    totalIncome,
  };
}

/**
 * Filter entries by date range (inclusive)
 */
export function filterEntriesByDateRange(
  entries: IncomeEntry[],
  range: DateRange
): IncomeEntry[] {
  const startTime = new Date(range.startDate).getTime();
  const endTime = new Date(range.endDate).getTime();

  return entries.filter(entry => {
    const entryTime = new Date(entry.date).getTime();
    return entryTime >= startTime && entryTime <= endTime;
  });
}

/**
 * Calculate running balance from entries
 */
export function calculateRunningBalanceHelper(
  entries: IncomeEntry[],
  initialBalance: number
): number {
  return entries.reduce((balance, entry) => balance + entry.amount, initialBalance);
}

// ============================================================================
// Core CRUD Functions
// ============================================================================

/**
 * Save a new income entry and update the running balance
 */
export async function saveIncomeEntry(
  entry: Omit<IncomeEntry, 'id' | 'timestamp' | 'balanceAfter'>
): Promise<IncomeEntry> {
  validateIncomeEntry(entry);

  return safeStorageOperation('saveIncomeEntry', async () => {
    const balance = await getBalance();
    const entries = await getIncomeEntries();

    const newEntry: IncomeEntry = {
      ...entry,
      id: generateUUID(),
      timestamp: Date.now(),
    };

    const allEntries = [...entries, newEntry];
    const { entries: updatedEntries, currentBalance, totalIncome } = 
      calculateRunningBalance(balance.initialBalance, allEntries);

    await AsyncStorage.setItem(
      CASHFLOW_STORAGE_KEYS.INCOME_ENTRIES,
      JSON.stringify(updatedEntries)
    );

    const updatedBalance: CashFlowBalance = {
      ...balance,
      currentBalance,
      totalIncome,
      lastUpdated: Date.now(),
      lastEntryId: newEntry.id,
    };

    await AsyncStorage.setItem(
      CASHFLOW_STORAGE_KEYS.BALANCE,
      JSON.stringify(updatedBalance)
    );

    return updatedEntries.find(e => e.id === newEntry.id)!;
  });
}

/**
 * Retrieve income entries with optional filtering
 */
export async function getIncomeEntries(filter?: IncomeFilter): Promise<IncomeEntry[]> {
  return safeStorageOperation('getIncomeEntries', async () => {
    const data = await AsyncStorage.getItem(CASHFLOW_STORAGE_KEYS.INCOME_ENTRIES);
    let entries: IncomeEntry[] = data ? JSON.parse(data) : [];

    if (!filter) {
      return entries.sort((a, b) => b.timestamp - a.timestamp);
    }

    if (filter.dateRange) {
      entries = filterEntriesByDateRange(entries, filter.dateRange);
    }

    if (filter.categories && filter.categories.length > 0) {
      entries = entries.filter(e => filter.categories!.includes(e.category));
    }

    if (filter.minAmount !== undefined) {
      entries = entries.filter(e => e.amount >= filter.minAmount!);
    }

    if (filter.maxAmount !== undefined) {
      entries = entries.filter(e => e.amount <= filter.maxAmount!);
    }

    if (filter.searchText) {
      const searchLower = filter.searchText.toLowerCase();
      entries = entries.filter(e =>
        e.description.toLowerCase().includes(searchLower)
      );
    }

    return entries.sort((a, b) => b.timestamp - a.timestamp);
  });
}

/**
 * Retrieve a single income entry by its ID
 */
export async function getIncomeEntryById(id: string): Promise<IncomeEntry | null> {
  return safeStorageOperation('getIncomeEntryById', async () => {
    const entries = await getIncomeEntries();
    return entries.find(e => e.id === id) || null;
  });
}

/**
 * Update an existing income entry
 */
export async function updateIncomeEntry(
  id: string,
  updates: Partial<Omit<IncomeEntry, 'id' | 'timestamp'>>
): Promise<IncomeEntry> {
  if (updates.amount !== undefined) validateAmount(updates.amount);
  if (updates.date !== undefined) validateDate(updates.date);
  if (updates.description !== undefined) validateDescription(updates.description);
  if (updates.category !== undefined) validateCategory(updates.category);

  return safeStorageOperation('updateIncomeEntry', async () => {
    const entries = await getIncomeEntries();
    const entryIndex = entries.findIndex(e => e.id === id);

    if (entryIndex === -1) {
      throw new NotFoundError('Income entry', id);
    }

    const updatedEntry = {
      ...entries[entryIndex],
      ...updates,
    };

    entries[entryIndex] = updatedEntry;

    const balance = await getBalance();
    const { entries: recalculatedEntries, currentBalance, totalIncome } = 
      calculateRunningBalance(balance.initialBalance, entries);

    await AsyncStorage.setItem(
      CASHFLOW_STORAGE_KEYS.INCOME_ENTRIES,
      JSON.stringify(recalculatedEntries)
    );

    const updatedBalance: CashFlowBalance = {
      ...balance,
      currentBalance,
      totalIncome,
      lastUpdated: Date.now(),
    };

    await AsyncStorage.setItem(
      CASHFLOW_STORAGE_KEYS.BALANCE,
      JSON.stringify(updatedBalance)
    );

    return recalculatedEntries.find(e => e.id === id)!;
  });
}

/**
 * Delete an income entry and recalculate running balance
 */
export async function deleteIncomeEntry(id: string): Promise<void> {
  return safeStorageOperation('deleteIncomeEntry', async () => {
    const entries = await getIncomeEntries();
    const entryIndex = entries.findIndex(e => e.id === id);

    if (entryIndex === -1) {
      throw new NotFoundError('Income entry', id);
    }

    const filteredEntries = entries.filter(e => e.id !== id);

    const balance = await getBalance();
    const { entries: recalculatedEntries, currentBalance, totalIncome } = 
      calculateRunningBalance(balance.initialBalance, filteredEntries);

    await AsyncStorage.setItem(
      CASHFLOW_STORAGE_KEYS.INCOME_ENTRIES,
      JSON.stringify(recalculatedEntries)
    );

    const updatedBalance: CashFlowBalance = {
      ...balance,
      currentBalance,
      totalIncome,
      lastUpdated: Date.now(),
    };

    await AsyncStorage.setItem(
      CASHFLOW_STORAGE_KEYS.BALANCE,
      JSON.stringify(updatedBalance)
    );
  });
}

// ============================================================================
// Balance Management Functions
// ============================================================================

/**
 * Retrieve the current cash flow balance
 */
export async function getBalance(): Promise<CashFlowBalance> {
  return safeStorageOperation('getBalance', async () => {
    const data = await AsyncStorage.getItem(CASHFLOW_STORAGE_KEYS.BALANCE);
    
    if (!data) {
      throw new BalanceNotInitializedError();
    }

    return JSON.parse(data);
  });
}

/**
 * Set the initial balance (first-time setup)
 */
export async function setInitialBalance(amount: number): Promise<CashFlowBalance> {
  validateAmount(amount);

  return safeStorageOperation('setInitialBalance', async () => {
    const balance: CashFlowBalance = {
      initialBalance: amount,
      currentBalance: amount,
      lastUpdated: Date.now(),
      totalIncome: 0,
      totalExpenses: 0,
    };

    await AsyncStorage.setItem(
      CASHFLOW_STORAGE_KEYS.BALANCE,
      JSON.stringify(balance)
    );

    return balance;
  });
}

/**
 * Update the current balance by a specific amount
 */
export async function updateBalance(amount: number): Promise<CashFlowBalance> {
  return safeStorageOperation('updateBalance', async () => {
    const balance = await getBalance();
    
    const updatedBalance: CashFlowBalance = {
      ...balance,
      currentBalance: balance.currentBalance + amount,
      lastUpdated: Date.now(),
    };

    await AsyncStorage.setItem(
      CASHFLOW_STORAGE_KEYS.BALANCE,
      JSON.stringify(updatedBalance)
    );

    return updatedBalance;
  });
}

/**
 * Recalculate running balance from scratch
 */
export async function recalculateBalance(): Promise<CashFlowBalance> {
  return safeStorageOperation('recalculateBalance', async () => {
    const balance = await getBalance();
    const entries = await getIncomeEntries();

    const { entries: recalculatedEntries, currentBalance, totalIncome } = 
      calculateRunningBalance(balance.initialBalance, entries);

    await AsyncStorage.setItem(
      CASHFLOW_STORAGE_KEYS.INCOME_ENTRIES,
      JSON.stringify(recalculatedEntries)
    );

    const updatedBalance: CashFlowBalance = {
      ...balance,
      currentBalance,
      totalIncome,
      lastUpdated: Date.now(),
    };

    await AsyncStorage.setItem(
      CASHFLOW_STORAGE_KEYS.BALANCE,
      JSON.stringify(updatedBalance)
    );

    return updatedBalance;
  });
}

// ============================================================================
// Summary Functions
// ============================================================================

/**
 * Get or calculate summary for a specific month
 */
export async function getMonthlySummary(
  year: number,
  month: number
): Promise<CashFlowSummary> {
  return safeStorageOperation('getMonthlySummary', async () => {
    const yearMonth = `${year}-${String(month).padStart(2, '0')}`;
    
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    
    const dateRange: DateRange = {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    };

    const entries = await getIncomeEntries({ dateRange });
    const balance = await getBalance();

    const totalIncome = entries.reduce((sum, e) => sum + e.amount, 0);
    const totalExpenses = 0;
    const netCashFlow = totalIncome - totalExpenses;
    const entryCount = entries.length;
    const averageIncome = entryCount > 0 ? totalIncome / entryCount : 0;

    const categoryBreakdown: Record<IncomeCategoryType, number> = 
      {} as Record<IncomeCategoryType, number>;
    
    entries.forEach(entry => {
      categoryBreakdown[entry.category] = 
        (categoryBreakdown[entry.category] || 0) + entry.amount;
    });

    // Calculate trend - but don't recursively call getMonthlySummary to avoid infinite loops
    // Instead, just calculate from the previous month's entries directly
    const previousMonth = month === 1 ? 12 : month - 1;
    const previousYear = month === 1 ? year - 1 : year;
    let trend = 0;

    try {
      const prevStartDate = new Date(previousYear, previousMonth - 1, 1);
      const prevEndDate = new Date(previousYear, previousMonth, 0);
      
      const prevDateRange: DateRange = {
        startDate: prevStartDate.toISOString().split('T')[0],
        endDate: prevEndDate.toISOString().split('T')[0],
      };

      const prevEntries = await getIncomeEntries({ dateRange: prevDateRange });
      const prevTotalIncome = prevEntries.reduce((sum, e) => sum + e.amount, 0);
      const prevNetCashFlow = prevTotalIncome; // No expenses yet
      
      if (prevNetCashFlow !== 0) {
        trend = ((netCashFlow - prevNetCashFlow) / prevNetCashFlow) * 100;
      }
    } catch {
      // No previous data, trend remains 0
    }

    const sortedEntries = entries.sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    const startBalance = sortedEntries.length > 0 && sortedEntries[0].balanceAfter
      ? sortedEntries[0].balanceAfter - sortedEntries[0].amount
      : balance.currentBalance - totalIncome;
    
    const endBalance = startBalance + netCashFlow;

    return {
      period: yearMonth,
      periodType: 'month',
      totalIncome,
      totalExpenses,
      netCashFlow,
      entryCount,
      averageIncome,
      startBalance,
      endBalance,
      categoryBreakdown,
      trend,
    };
  });
}

/**
 * Get or calculate summary for a specific year
 */
export async function getYearlySummary(year: number): Promise<CashFlowSummary> {
  return safeStorageOperation('getYearlySummary', async () => {
    const dateRange: DateRange = {
      startDate: `${year}-01-01`,
      endDate: `${year}-12-31`,
    };

    const entries = await getIncomeEntries({ dateRange });
    const balance = await getBalance();

    const totalIncome = entries.reduce((sum, e) => sum + e.amount, 0);
    const totalExpenses = 0;
    const netCashFlow = totalIncome - totalExpenses;
    const entryCount = entries.length;
    const averageIncome = entryCount > 0 ? totalIncome / entryCount : 0;

    const categoryBreakdown: Record<IncomeCategoryType, number> = 
      {} as Record<IncomeCategoryType, number>;
    
    entries.forEach(entry => {
      categoryBreakdown[entry.category] = 
        (categoryBreakdown[entry.category] || 0) + entry.amount;
    });

    let trend = 0;
    try {
      const previousSummary = await getYearlySummary(year - 1);
      if (previousSummary.netCashFlow !== 0) {
        trend = ((netCashFlow - previousSummary.netCashFlow) / 
                 previousSummary.netCashFlow) * 100;
      }
    } catch {
      // No previous data, trend remains 0
    }

    const sortedEntries = entries.sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    const startBalance = sortedEntries.length > 0 && sortedEntries[0].balanceAfter
      ? sortedEntries[0].balanceAfter - sortedEntries[0].amount
      : balance.currentBalance - totalIncome;
    
    const endBalance = startBalance + netCashFlow;

    return {
      period: `${year}`,
      periodType: 'year',
      totalIncome,
      totalExpenses,
      netCashFlow,
      entryCount,
      averageIncome,
      startBalance,
      endBalance,
      categoryBreakdown,
      trend,
    };
  });
}