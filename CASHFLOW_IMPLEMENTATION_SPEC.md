# Cash Flow Income Tracking System - Technical Specification

**Version:** 1.0  
**Last Updated:** 2025-10-22  
**Status:** Design Phase

---

## Table of Contents

1. [Overview](#overview)
2. [Data Models & TypeScript Interfaces](#data-models--typescript-interfaces)
3. [Storage Schema Design](#storage-schema-design)
4. [Storage Utility Functions](#storage-utility-functions)
5. [Business Logic Specifications](#business-logic-specifications)
6. [Integration Points](#integration-points)
7. [Migration Strategy](#migration-strategy)
8. [Error Handling & Validation](#error-handling--validation)
9. [Performance Considerations](#performance-considerations)

---

## Overview

The Cash Flow Income Tracking System extends the existing Financial Planner app to track income entries and maintain a running cash flow balance. This system integrates with the existing [`CashFlowScreen.tsx`](screens/CashFlowScreen.tsx) and [`DashboardScreen.tsx`](screens/DashboardScreen.tsx) to provide real-time balance tracking and income management.

### Key Features
- Track individual income entries with categories
- Maintain running balance with initial balance support
- Calculate monthly/yearly summaries
- Filter and query income by date ranges
- Real-time balance updates across screens
- Efficient AsyncStorage-based persistence

### Design Principles
- **Consistency**: Follow existing patterns from [`utils/storage.ts`](utils/storage.ts)
- **Type Safety**: Leverage TypeScript for compile-time validation
- **Performance**: Optimize for mobile device constraints
- **Scalability**: Design for future database migration
- **Simplicity**: Keep AsyncStorage operations straightforward

---

## Data Models & TypeScript Interfaces

### 1. IncomeCategory Enum

```typescript
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
```

### 2. IncomeEntry Interface

```typescript
/**
 * Represents a single income entry in the cash flow system
 * 
 * @interface IncomeEntry
 * @property {string} id - Unique identifier (UUID v4 format)
 * @property {number} amount - Income amount (positive number, max 2 decimal places)
 * @property {string} date - ISO 8601 date string (YYYY-MM-DD)
 * @property {string} description - User-provided description (max 200 chars)
 * @property {IncomeCategoryType} category - Income category classification
 * @property {number} timestamp - Unix timestamp (milliseconds) for creation time
 * @property {number} [balanceAfter] - Optional: Running balance after this entry
 * @property {boolean} [isRecurring] - Optional: Flag for recurring income
 * @property {string} [recurringId] - Optional: Link to recurring income template
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
```

### 3. CashFlowBalance Interface

```typescript
/**
 * Represents the current state of the cash flow balance
 * 
 * @interface CashFlowBalance
 * @property {number} initialBalance - Starting balance set by user
 * @property {number} currentBalance - Current calculated balance
 * @property {number} lastUpdated - Unix timestamp of last balance update
 * @property {string} [lastEntryId] - Optional: ID of last processed income entry
 * @property {number} totalIncome - Cumulative income since initial balance
 * @property {number} totalExpenses - Cumulative expenses (for future integration)
 */
export interface CashFlowBalance {
  initialBalance: number;
  currentBalance: number;
  lastUpdated: number;
  lastEntryId?: string;
  totalIncome: number;
  totalExpenses: number;
}
```

### 4. CashFlowSummary Interface

```typescript
/**
 * Aggregated summary for a specific time period
 * Used for monthly/yearly calculations and reporting
 * 
 * @interface CashFlowSummary
 * @property {string} period - Period identifier (e.g., "2024-12" for Dec 2024)
 * @property {string} periodType - Type of period: 'month' | 'year' | 'custom'
 * @property {number} totalIncome - Total income for the period
 * @property {number} totalExpenses - Total expenses for the period
 * @property {number} netCashFlow - Net cash flow (income - expenses)
 * @property {number} entryCount - Number of income entries in period
 * @property {number} averageIncome - Average income per entry
 * @property {number} startBalance - Balance at period start
 * @property {number} endBalance - Balance at period end
 * @property {Record<IncomeCategoryType, number>} categoryBreakdown - Income by category
 * @property {number} trend - Percentage change from previous period
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
```

### 5. DateRange Interface

```typescript
/**
 * Represents a date range for filtering operations
 * 
 * @interface DateRange
 * @property {string} startDate - ISO 8601 date string (inclusive)
 * @property {string} endDate - ISO 8601 date string (inclusive)
 */
export interface DateRange {
  startDate: string;
  endDate: string;
}
```

### 6. IncomeFilter Interface

```typescript
/**
 * Filter criteria for querying income entries
 * 
 * @interface IncomeFilter
 * @property {DateRange} [dateRange] - Optional date range filter
 * @property {IncomeCategoryType[]} [categories] - Optional category filter
 * @property {number} [minAmount] - Optional minimum amount filter
 * @property {number} [maxAmount] - Optional maximum amount filter
 * @property {string} [searchText] - Optional text search in description
 */
export interface IncomeFilter {
  dateRange?: DateRange;
  categories?: IncomeCategoryType[];
  minAmount?: number;
  maxAmount?: number;
  searchText?: string;
}
```

---

## Storage Schema Design

### AsyncStorage Key Structure

Following the existing pattern in [`utils/storage.ts`](utils/storage.ts), all keys use lowercase with underscores:

```typescript
const CASHFLOW_STORAGE_KEYS = {
  BALANCE: '@cashflow_balance',
  INCOME_ENTRIES: '@cashflow_income_entries',
  SUMMARIES: '@cashflow_summaries',
  SETTINGS: '@cashflow_settings',
} as const;
```

### Storage Key Descriptions

| Key | Purpose | Data Type | Max Size |
|-----|---------|-----------|----------|
| `@cashflow_balance` | Current balance state | JSON (CashFlowBalance) | ~500 bytes |
| `@cashflow_income_entries` | Array of all income entries | JSON (IncomeEntry[]) | ~100KB (500 entries) |
| `@cashflow_summaries` | Cached monthly/yearly summaries | JSON (Record<string, CashFlowSummary>) | ~50KB |
| `@cashflow_settings` | User preferences and config | JSON (CashFlowSettings) | ~1KB |

### JSON Storage Formats

#### 1. Balance Storage Format

```json
{
  "initialBalance": 10000.00,
  "currentBalance": 12345.67,
  "lastUpdated": 1729562400000,
  "lastEntryId": "550e8400-e29b-41d4-a716-446655440000",
  "totalIncome": 5420.00,
  "totalExpenses": 3074.33
}
```

#### 2. Income Entries Storage Format

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "amount": 2500.00,
    "date": "2024-12-15",
    "description": "Monthly salary deposit",
    "category": "Salary",
    "timestamp": 1734220800000,
    "balanceAfter": 12500.00,
    "isRecurring": true,
    "recurringId": "rec_monthly_salary"
  },
  {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "amount": 500.00,
    "date": "2024-12-10",
    "description": "Freelance project payment",
    "category": "Freelance",
    "timestamp": 1733788800000,
    "balanceAfter": 10500.00
  }
]
```

#### 3. Summaries Storage Format

```json
{
  "2024-12": {
    "period": "2024-12",
    "periodType": "month",
    "totalIncome": 5400.00,
    "totalExpenses": 3800.00,
    "netCashFlow": 1600.00,
    "entryCount": 8,
    "averageIncome": 675.00,
    "startBalance": 10945.67,
    "endBalance": 12545.67,
    "categoryBreakdown": {
      "Salary": 2500.00,
      "Freelance": 1500.00,
      "Investment": 800.00,
      "Other": 600.00
    },
    "trend": 14.3
  },
  "2024-11": {
    "period": "2024-11",
    "periodType": "month",
    "totalIncome": 4800.00,
    "totalExpenses": 3200.00,
    "netCashFlow": 1600.00,
    "entryCount": 6,
    "averageIncome": 800.00,
    "startBalance": 9345.67,
    "endBalance": 10945.67,
    "categoryBreakdown": {
      "Salary": 2500.00,
      "Freelance": 1200.00,
      "Investment": 600.00,
      "Gift": 500.00
    },
    "trend": 0
  }
}
```

### Data Indexing Strategy

Since AsyncStorage doesn't support native indexing, we implement logical indexing:

1. **Primary Index**: Income entries stored in chronological order (newest first)
2. **Date Index**: Entries include ISO date strings for efficient filtering
3. **Category Index**: Category field enables quick category-based queries
4. **Summary Cache**: Pre-calculated summaries reduce computation overhead

**Query Optimization Techniques:**
- Keep entries array sorted by date (descending)
- Cache frequently accessed summaries
- Implement lazy loading for large datasets
- Use binary search for date range queries

---

## Storage Utility Functions

### Core CRUD Operations

#### 1. Initialize Cash Flow System

```typescript
/**
 * Initialize the cash flow system with an initial balance
 * Should be called on first app launch or when user sets up cash flow
 * 
 * @param {number} initialBalance - Starting balance amount
 * @returns {Promise<CashFlowBalance>} The initialized balance object
 * @throws {ValidationError} If initialBalance is invalid
 * @throws {StorageError} If storage operation fails
 * 
 * @example
 * const balance = await initializeCashFlow(10000.00);
 * console.log(balance.currentBalance); // 10000.00
 */
export async function initializeCashFlow(
  initialBalance: number
): Promise<CashFlowBalance>;
```

#### 2. Save Income Entry

```typescript
/**
 * Save a new income entry and update the running balance
 * Automatically calculates balanceAfter and updates currentBalance
 * 
 * @param {Omit<IncomeEntry, 'id' | 'timestamp' | 'balanceAfter'>} entry - Income entry data
 * @returns {Promise<IncomeEntry>} The saved entry with generated id and timestamp
 * @throws {ValidationError} If entry data is invalid
 * @throws {StorageError} If storage operation fails
 * @throws {BalanceNotInitializedError} If balance hasn't been initialized
 * 
 * @example
 * const entry = await saveIncomeEntry({
 *   amount: 2500.00,
 *   date: '2024-12-15',
 *   description: 'Monthly salary',
 *   category: IncomeCategory.SALARY
 * });
 */
export async function saveIncomeEntry(
  entry: Omit<IncomeEntry, 'id' | 'timestamp' | 'balanceAfter'>
): Promise<IncomeEntry>;
```

#### 3. Get Income Entries

```typescript
/**
 * Retrieve income entries with optional filtering
 * Returns entries sorted by date (newest first)
 * 
 * @param {IncomeFilter} [filter] - Optional filter criteria
 * @returns {Promise<IncomeEntry[]>} Array of matching income entries
 * @throws {StorageError} If storage operation fails
 * 
 * @example
 * // Get all entries
 * const allEntries = await getIncomeEntries();
 * 
 * // Get entries for December 2024
 * const decEntries = await getIncomeEntries({
 *   dateRange: {
 *     startDate: '2024-12-01',
 *     endDate: '2024-12-31'
 *   }
 * });
 * 
 * // Get salary entries over $2000
 * const salaryEntries = await getIncomeEntries({
 *   categories: [IncomeCategory.SALARY],
 *   minAmount: 2000
 * });
 */
export async function getIncomeEntries(
  filter?: IncomeFilter
): Promise<IncomeEntry[]>;
```

#### 4. Get Income Entry by ID

```typescript
/**
 * Retrieve a single income entry by its ID
 * 
 * @param {string} id - The income entry ID
 * @returns {Promise<IncomeEntry | null>} The entry or null if not found
 * @throws {StorageError} If storage operation fails
 * 
 * @example
 * const entry = await getIncomeEntryById('550e8400-e29b-41d4-a716-446655440000');
 * if (entry) {
 *   console.log(entry.description);
 * }
 */
export async function getIncomeEntryById(
  id: string
): Promise<IncomeEntry | null>;
```

#### 5. Update Income Entry

```typescript
/**
 * Update an existing income entry
 * Recalculates running balance for all subsequent entries
 * 
 * @param {string} id - The income entry ID to update
 * @param {Partial<Omit<IncomeEntry, 'id' | 'timestamp'>>} updates - Fields to update
 * @returns {Promise<IncomeEntry>} The updated entry
 * @throws {ValidationError} If update data is invalid
 * @throws {NotFoundError} If entry doesn't exist
 * @throws {StorageError} If storage operation fails
 * 
 * @example
 * const updated = await updateIncomeEntry('550e8400...', {
 *   amount: 2600.00,
 *   description: 'Monthly salary (adjusted)'
 * });
 */
export async function updateIncomeEntry(
  id: string,
  updates: Partial<Omit<IncomeEntry, 'id' | 'timestamp'>>
): Promise<IncomeEntry>;
```

#### 6. Delete Income Entry

```typescript
/**
 * Delete an income entry and recalculate running balance
 * 
 * @param {string} id - The income entry ID to delete
 * @returns {Promise<void>}
 * @throws {NotFoundError} If entry doesn't exist
 * @throws {StorageError} If storage operation fails
 * 
 * @example
 * await deleteIncomeEntry('550e8400-e29b-41d4-a716-446655440000');
 */
export async function deleteIncomeEntry(id: string): Promise<void>;
```

### Balance Management Functions

#### 7. Get Current Balance

```typescript
/**
 * Retrieve the current cash flow balance
 * 
 * @returns {Promise<CashFlowBalance>} Current balance state
 * @throws {BalanceNotInitializedError} If balance hasn't been initialized
 * @throws {StorageError} If storage operation fails
 * 
 * @example
 * const balance = await getCurrentBalance();
 * console.log(`Current: $${balance.currentBalance}`);
 */
export async function getCurrentBalance(): Promise<CashFlowBalance>;
```

#### 8. Update Initial Balance

```typescript
/**
 * Update the initial balance (recalculates all running balances)
 * Use with caution as this affects all historical calculations
 * 
 * @param {number} newInitialBalance - New initial balance amount
 * @returns {Promise<CashFlowBalance>} Updated balance state
 * @throws {ValidationError} If newInitialBalance is invalid
 * @throws {StorageError} If storage operation fails
 * 
 * @example
 * const balance = await updateInitialBalance(15000.00);
 */
export async function updateInitialBalance(
  newInitialBalance: number
): Promise<CashFlowBalance>;
```

#### 9. Recalculate Balance

```typescript
/**
 * Recalculate running balance from scratch
 * Useful for fixing inconsistencies or after bulk operations
 * 
 * @returns {Promise<CashFlowBalance>} Recalculated balance state
 * @throws {StorageError} If storage operation fails
 * 
 * @example
 * const balance = await recalculateBalance();
 */
export async function recalculateBalance(): Promise<CashFlowBalance>;
```

### Summary & Analytics Functions

#### 10. Get Monthly Summary

```typescript
/**
 * Get or calculate summary for a specific month
 * Uses cached summary if available and up-to-date
 * 
 * @param {string} yearMonth - Year-month string (YYYY-MM)
 * @returns {Promise<CashFlowSummary>} Monthly summary
 * @throws {ValidationError} If yearMonth format is invalid
 * @throws {StorageError} If storage operation fails
 * 
 * @example
 * const summary = await getMonthlySummary('2024-12');
 * console.log(`Net: $${summary.netCashFlow}`);
 */
export async function getMonthlySummary(
  yearMonth: string
): Promise<CashFlowSummary>;
```

#### 11. Get Yearly Summary

```typescript
/**
 * Get or calculate summary for a specific year
 * Aggregates all monthly summaries for the year
 * 
 * @param {string} year - Year string (YYYY)
 * @returns {Promise<CashFlowSummary>} Yearly summary
 * @throws {ValidationError} If year format is invalid
 * @throws {StorageError} If storage operation fails
 * 
 * @example
 * const summary = await getYearlySummary('2024');
 * console.log(`Annual income: $${summary.totalIncome}`);
 */
export async function getYearlySummary(
  year: string
): Promise<CashFlowSummary>;
```

#### 12. Get Custom Period Summary

```typescript
/**
 * Calculate summary for a custom date range
 * 
 * @param {DateRange} dateRange - Custom date range
 * @returns {Promise<CashFlowSummary>} Custom period summary
 * @throws {ValidationError} If date range is invalid
 * @throws {StorageError} If storage operation fails
 * 
 * @example
 * const summary = await getCustomPeriodSummary({
 *   startDate: '2024-10-01',
 *   endDate: '2024-12-31'
 * });
 */
export async function getCustomPeriodSummary(
  dateRange: DateRange
): Promise<CashFlowSummary>;
```

#### 13. Get Category Breakdown

```typescript
/**
 * Get income breakdown by category for a date range
 * 
 * @param {DateRange} [dateRange] - Optional date range (defaults to current month)
 * @returns {Promise<Record<IncomeCategoryType, number>>} Category totals
 * @throws {StorageError} If storage operation fails
 * 
 * @example
 * const breakdown = await getCategoryBreakdown();
 * console.log(`Salary: $${breakdown.Salary}`);
 */
export async function getCategoryBreakdown(
  dateRange?: DateRange
): Promise<Record<IncomeCategoryType, number>>;
```

### Utility Functions

#### 14. Clear All Cash Flow Data

```typescript
/**
 * Clear all cash flow data (for testing or reset)
 * WARNING: This is destructive and cannot be undone
 * 
 * @returns {Promise<void>}
 * @throws {StorageError} If storage operation fails
 * 
 * @example
 * await clearAllCashFlowData();
 */
export async function clearAllCashFlowData(): Promise<void>;
```

#### 15. Export Cash Flow Data

```typescript
/**
 * Export all cash flow data for backup or migration
 * 
 * @returns {Promise<CashFlowExportData>} Complete data export
 * @throws {StorageError} If storage operation fails
 * 
 * @example
 * const exportData = await exportCashFlowData();
 * // Save to file or send to server
 */
export interface CashFlowExportData {
  balance: CashFlowBalance;
  entries: IncomeEntry[];
  summaries: Record<string, CashFlowSummary>;
  exportDate: string;
  version: string;
}

export async function exportCashFlowData(): Promise<CashFlowExportData>;
```

#### 16. Import Cash Flow Data

```typescript
/**
 * Import cash flow data from backup or migration
 * Validates data before importing
 * 
 * @param {CashFlowExportData} data - Data to import
 * @param {boolean} [merge=false] - Whether to merge with existing data
 * @returns {Promise<void>}
 * @throws {ValidationError} If import data is invalid
 * @throws {StorageError} If storage operation fails
 * 
 * @example
 * await importCashFlowData(exportData, false);
 */
export async function importCashFlowData(
  data: CashFlowExportData,
  merge?: boolean
): Promise<void>;
```

---

## Business Logic Specifications

### 1. Running Balance Calculation Algorithm

The running balance is calculated using a forward-propagation algorithm:

```typescript
/**
 * Algorithm: Calculate Running Balance
 * 
 * Input: 
 *   - initialBalance: number
 *   - entries: IncomeEntry[] (sorted by date ascending)
 * 
 * Output:
 *   - Updated entries with balanceAfter
 *   - Final currentBalance
 * 
 * Steps:
 * 1. Start with initialBalance as runningBalance
 * 2. For each entry in chronological order:
 *    a. Add entry.amount to runningBalance
 *    b. Set entry.balanceAfter = runningBalance
 * 3. Return final runningBalance as currentBalance
 * 
 * Time Complexity: O(n) where n = number of entries
 * Space Complexity: O(1) additional space
 */

function calculateRunningBalance(
  initialBalance: number,
  entries: IncomeEntry[]
): { entries: IncomeEntry[]; currentBalance: number } {
  let runningBalance = initialBalance;
  
  // Sort entries by date (oldest first) for chronological calculation
  const sortedEntries = [...entries].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  // Calculate balance after each entry
  const updatedEntries = sortedEntries.map(entry => ({
    ...entry,
    balanceAfter: (runningBalance += entry.amount)
  }));
  
  return {
    entries: updatedEntries,
    currentBalance: runningBalance
  };
}
```

**Edge Cases:**
- Empty entries array: currentBalance = initialBalance
- Negative amounts: Not allowed (validation error)
- Same-day entries: Ordered by timestamp
- Future-dated entries: Included in calculation

### 2. Month/Year Filtering Logic

```typescript
/**
 * Algorithm: Filter Entries by Date Range
 * 
 * Input:
 *   - entries: IncomeEntry[]
 *   - dateRange: DateRange
 * 
 * Output:
 *   - Filtered entries within date range (inclusive)
 * 
 * Steps:
 * 1. Parse startDate and endDate to Date objects
 * 2. Filter entries where entry.date >= startDate AND entry.date <= endDate
 * 3. Return filtered array
 * 
 * Time Complexity: O(n) linear scan
 * Optimization: Binary search if entries are sorted
 */

function filterEntriesByDateRange(
  entries: IncomeEntry[],
  dateRange: DateRange
): IncomeEntry[] {
  const startTime = new Date(dateRange.startDate).getTime();
  const endTime = new Date(dateRange.endDate).getTime();
  
  return entries.filter(entry => {
    const entryTime = new Date(entry.date).getTime();
    return entryTime >= startTime && entryTime <= endTime;
  });
}

/**
 * Helper: Get date range for a specific month
 */
function getMonthDateRange(yearMonth: string): DateRange {
  const [year, month] = yearMonth.split('-').map(Number);
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0); // Last day of month
  
  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0]
  };
}

/**
 * Helper: Get date range for a specific year
 */
function getYearDateRange(year: string): DateRange {
  return {
    startDate: `${year}-01-01`,
    endDate: `${year}-12-31`
  };
}
```

### 3. Summary Calculation Formulas

```typescript
/**
 * Algorithm: Calculate Period Summary
 * 
 * Input:
 *   - entries: IncomeEntry[] (filtered for period)
 *   - startBalance: number (balance at period start)
 *   - previousPeriodSummary: CashFlowSummary | null
 * 
 * Output:
 *   - CashFlowSummary object
 * 
 * Formulas:
 *   totalIncome = SUM(entry.amount for all entries)
 *   totalExpenses = 0 (placeholder for future expense integration)
 *   netCashFlow = totalIncome - totalExpenses
 *   entryCount = entries.length
 *   averageIncome = totalIncome / entryCount (or 0 if no entries)
 *   endBalance = startBalance + netCashFlow
 *   trend = ((netCashFlow - previousNetCashFlow) / previousNetCashFlow) * 100
 *   categoryBreakdown = GROUP BY category, SUM(amount)
 */

function calculatePeriodSummary(
  period: string,
  periodType: 'month' | 'year' | 'custom',
  entries: IncomeEntry[],
  startBalance: number,
  previousPeriodSummary: CashFlowSummary | null
): CashFlowSummary {
  // Calculate totals
  const totalIncome = entries.reduce((sum, entry) => sum + entry.amount, 0);
  const totalExpenses = 0; // Future: integrate with expense tracking
  const netCashFlow = totalIncome - totalExpenses;
  const entryCount = entries.length;
  const averageIncome = entryCount > 0 ? totalIncome / entryCount : 0;
  const endBalance = startBalance + netCashFlow;
  
  // Calculate trend
  let trend = 0;
  if (previousPeriodSummary && previousPeriodSummary.netCashFlow !== 0) {
    trend = ((netCashFlow - previousPeriodSummary.netCashFlow) / 
             previousPeriodSummary.netCashFlow) * 100;
  }
  
  // Calculate category breakdown
  const categoryBreakdown: Record<IncomeCategoryType, number> = 
    {} as Record<IncomeCategoryType, number>;
  
  entries.forEach(entry => {
    categoryBreakdown[entry.category] = 
      (categoryBreakdown[entry.category] || 0) + entry.amount;
  });
  
  return {
    period,
    periodType,
    totalIncome,
    totalExpenses,
    netCashFlow,
    entryCount,
    averageIncome,
    startBalance,
    endBalance,
    categoryBreakdown,
    trend
  };
}
```

### 4. Initial Balance Setup Flow

```typescript
/**
 * User Flow: Initial Balance Setup
 * 
 * Step 1: Check if balance is initialized
 *   - Call getCurrentBalance()
 *   - If BalanceNotInitializedError, proceed to Step 2
 *   - If balance exists, show current balance
 * 
 * Step 2: Prompt user for initial balance
 *   - Display input form
 *   - Validate input (positive number, max 2 decimals)
 *   - Show confirmation dialog
 * 
 * Step 3: Initialize system
 *   - Call initializeCashFlow(initialBalance)
 *   - Store balance in AsyncStorage
 *   - Navigate to CashFlowScreen
 * 
 * Step 4: Optional - Add first income entry
 *   - Show "Add Income" prompt
 *   - If user adds entry, update balance immediately
 */

// Example implementation in CashFlowScreen
async function setupInitialBalance() {
  try {
    // Check if already initialized
    const balance = await getCurrentBalance();
    console.log('Balance already initialized:', balance);
  } catch (error) {
    if (error instanceof BalanceNotInitializedError) {
      // Show setup modal
      const userInput = await showInitialBalanceModal();
      
      if (userInput !== null) {
        const balance = await initializeCashFlow(userInput);
        console.log('Balance initialized:', balance);
      }
    }
  }
}
```

---

## Integration Points

### 1. CashFlowScreen Integration

**File:** [`screens/CashFlowScreen.tsx`](screens/CashFlowScreen.tsx)

#### State Management

```typescript
// Add to CashFlowScreen component
import { useState, useEffect, useCallback } from 'react';
import {
  getCurrentBalance,
  getIncomeEntries,
  getMonthlySummary,
  saveIncomeEntry,
  updateIncomeEntry,
  deleteIncomeEntry
} from '../utils/cashFlowStorage';

const CashFlowScreen: React.FC = () => {
  // State
  const [balance, setBalance] = useState<CashFlowBalance | null>(null);
  const [entries, setEntries] = useState<IncomeEntry[]>([]);
  const [monthlySummary, setMonthlySummary] = useState<CashFlowSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Load data on mount
  useEffect(() => {
    loadCashFlowData();
  }, []);
  
  const loadCashFlowData = async () => {
    try {
      setLoading(true);
      const [balanceData, entriesData, summaryData] = await Promise.all([
        getCurrentBalance(),
        getIncomeEntries({ 
          dateRange: getCurrentMonthRange() 
        }),
        getMonthlySummary(getCurrentYearMonth())
      ]);
      
      setBalance(balanceData);
      setEntries(entriesData);
      setMonthlySummary(summaryData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Event handlers
  const handleAddIncome = useCallback(async (entryData) => {
    try {
      const newEntry = await saveIncomeEntry(entryData);
      await loadCashFlowData(); // Refresh all data
    } catch (err) {
      setError(err.message);
    }
  }, []);
  
  const handleEditIncome = useCallback(async (id: string, updates) => {
    try {
      await updateIncomeEntry(id, updates);
      await loadCashFlowData(); // Refresh all data
    } catch (err) {
      setError(err.message);
    }
  }, []);
  
  const handleDeleteIncome = useCallback(async (id: string) => {
    try {
      await deleteIncomeEntry(id);
      await loadCashFlowData(); // Refresh all data
    } catch (err) {
      setError(err.message);
    }
  }, []);
  
  // ... rest of component
};
```

#### UI Updates Required

1. **Replace Mock Data**: Remove `MOCK_CASH_FLOW_DATA` and `MONTHLY_BREAKDOWN` constants
2. **Add Loading States**: Show loading indicators while fetching data
3. **Add Error Handling**: Display error messages to user
4. **Add Income Entry Modal**: Create modal for adding/editing income entries
5. **Update Summary Cards**: Use real data from `balance` and `monthlySummary` states
6. **Update Chart**: Use real data from `entries` state
7. **Update Monthly Breakdown**: Use real data from summaries

### 2. DashboardScreen Integration

**File:** [`screens/DashboardScreen.tsx`](screens/DashboardScreen.tsx)

#### Balance Display

```typescript
// Add to DashboardScreen component
import { useState, useEffect } from 'react';
import { getCurrentBalance } from '../utils/cashFlowStorage';

const DashboardScreen: React.FC = () => {
  const [cashFlowBalance, setCashFlowBalance] = useState<number | null>(null);
  
  useEffect(() => {
    loadBalance();
  }, []);
  
  const loadBalance = async () => {
    try {
      const balance = await getCurrentBalance();
      setCashFlowBalance(balance.currentBalance);
    } catch (err) {
      console.error('Failed to load cash flow balance:', err);
    }
  };
  
  // Update balance display
  return (
    <View style={styles.balanceSection}>
      <Text style={styles.balanceLabel}>Total Balance</Text>
      <Text style={styles.balanceAmount}>
        ${(cashFlowBalance || MOCK_DATA.balance).toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}
      </Text>
      {/* ... rest of component */}
    </View>
  );
};
```

#### Real-time Updates

```typescript
/**
 * Strategy: Event-based updates using React Context
 * 
 * Create a CashFlowContext to share balance state across screens
 * Update context when balance changes in any screen
 * Subscribe to context in DashboardScreen
 */

// contexts/CashFlowContext.tsx
import React, { createContext, useContext, useState, useCallback } from 'react';

interface CashFlowContextType {
  balance: CashFlowBalance | null;
  refreshBalance: () => Promise<void>;
}

const CashFlowContext = createContext<CashFlowContextType | undefined>(undefined);

export const CashFlowProvider: React.FC = ({ children }) => {
  const [balance, setBalance] = useState<CashFlowBalance | null>(null);
  
  const refreshBalance = useCallback(async () => {
    try {
      const newBalance = await getCurrentBalance();
      setBalance(newBalance);
    } catch (err) {
      console.error('Failed to refresh balance:', err);
    }
  }, []);
  
  return (
    <CashFlowContext.Provider value={{ balance, refreshBalance }}>
      {children}
    </CashFlowContext.Provider>
  );
};

export const useCashFlow = () => {
  const context = useContext(CashFlowContext);
  if (!context) {
    throw new Error('useCashFlow must be used within CashFlowProvider');
  }
  return context;
};
```

### 3. App.tsx Integration

**File:** [`App.tsx`](App.tsx)

```typescript
// Wrap app with CashFlowProvider
import { CashFlowProvider } from './contexts/CashFlowContext';

export default function App() {
  return (
    <CashFlowProvider>
      <SafeAreaView style={styles.container} edges={['top']}>
        {/* ... existing app structure */}
      </SafeAreaView>
    </CashFlowProvider>
  );
}
```

### 4. Navigation Flow

```typescript
/**
 * Navigation Scenarios:
 * 
 * 1. First-time user (no balance initialized):
 *    Dashboard -> Shows placeholder
 *    Cash Flow -> Shows setup modal -> Initialize balance -> Show main UI
 * 
 * 2. Returning user (balance exists):
 *    Dashboard -> Shows current balance from context
 *    Cash Flow -> Shows income entries and summaries
 * 
 * 3. Adding income:
 *    Cash Flow -> Tap "Add Income" -> Modal -> Save -> Refresh context -> Update Dashboard
 * 
 * 4. Editing/Deleting income:
 *    Cash Flow -> Tap entry -> Edit/Delete modal -> Save -> Refresh context -> Update Dashboard
 */
```

---

## Migration Strategy

### Phase 1: AsyncStorage (Current)

**Timeline:** Initial implementation  
**Storage:** AsyncStorage with JSON serialization  
**Capacity:** ~500 income entries (~100KB)  
**Performance:** Suitable for 1-2 years of data

**Advantages:**
- Simple implementation
- No external dependencies
- Fast for small datasets
- Built-in to React Native

**Limitations:**
- No complex queries
- Limited storage capacity
- No relationships
- Manual indexing required

### Phase 2: SQLite Migration (Future)

**Timeline:** When data exceeds 500 entries or complex queries needed  
**Storage:** SQLite database via `expo-sqlite`  
**Capacity:** Unlimited (practical limit ~100MB)  
**Performance:** Optimized for large datasets

#### Database Schema

```sql
-- Balance table
CREATE TABLE cash_flow_balance (
  id INTEGER PRIMARY KEY CHECK (id = 1), -- Singleton pattern
  initial_balance REAL NOT NULL,
  current_balance REAL NOT NULL,
  last_updated INTEGER NOT NULL,
  last_entry_id TEXT,
  total_income REAL NOT NULL DEFAULT 0,
  total_expenses REAL NOT NULL DEFAULT 0
);

-- Income entries table
CREATE TABLE income_entries (
  id TEXT PRIMARY KEY,
  amount REAL NOT NULL CHECK (amount > 0),
  date TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  timestamp INTEGER NOT NULL,
  balance_after REAL,
  is_recurring INTEGER DEFAULT 0,
  recurring_id TEXT,
  FOREIGN KEY (recurring_id) REFERENCES recurring_templates(id)
);

-- Indexes for performance
CREATE INDEX idx_income_date ON income_entries(date DESC);
CREATE INDEX idx_income_category ON income_entries(category);
CREATE INDEX idx_income_timestamp ON income_entries(timestamp DESC);

-- Summaries cache table
CREATE TABLE cash_flow_summaries (
  period TEXT PRIMARY KEY,
  period_type TEXT NOT NULL,
  total_income REAL NOT NULL,
  total_expenses REAL NOT NULL,
  net_cash_flow REAL NOT NULL,
  entry_count INTEGER NOT NULL,
  average_income REAL NOT NULL,
  start_balance REAL NOT NULL,
  end_balance REAL NOT NULL,
  category_breakdown TEXT NOT NULL, -- JSON string
  trend REAL NOT NULL,
  calculated_at INTEGER NOT NULL
);
```

#### Migration Process

```typescript
/**
 * Migration Steps:
 * 
 * 1. Detect migration need:
 *    - Check entry count > 500
 *    - Check AsyncStorage size > 100KB
 *    - User manually triggers migration
 * 
 * 2. Export AsyncStorage data:
 *    - Call exportCashFlowData()
 *    - Validate data integrity
 *    - Create backup
 * 
 * 3. Initialize SQLite database:
 *    - Create tables and indexes
 *    - Set up foreign key constraints
 * 
 * 4. Import data to SQLite:
 *    - Insert balance record
 *    - Batch insert income entries
 *    - Recalculate summaries
 * 
 * 5. Verify migration:
 *    - Compare record counts
 *    - Verify balance calculations
 *    - Test queries
 * 
 * 6. Switch storage layer:
 *    - Update storage utility functions
 *    - Clear AsyncStorage (after confirmation)
 *    - Set migration flag
 * 
 * 7. Rollback plan:
 *    - Keep AsyncStorage backup for 30 days
 *    - Provide rollback function
 *    - Log migration status
 */

async function migrateToCashFlowSQLite(): Promise<void> {
  try {
    // Step 1: Export current data
    const exportData = await exportCashFlowData();
    
    // Step 2: Initialize SQLite
    const db = await SQLite.openDatabaseAsync('cashflow.db');
    await initializeSQLiteSchema(db);
    
    // Step 3: Import data
    await importToSQLite(db, exportData);
    
    // Step 4: Verify
    const verified = await verifySQLiteMigration(db, exportData);
    if (!verified) {
      throw new Error('Migration verification failed');
    }
    
    // Step 5: Update storage flag
    await AsyncStorage.setItem('@cashflow_storage_type', 'sqlite');
    
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    // Rollback logic here
    throw error;
  }
}
```

#### Abstraction Layer

```typescript
/**
 * Storage abstraction to support both AsyncStorage and SQLite
 */

interface CashFlowStorageAdapter {
  saveIncomeEntry(entry: Omit<IncomeEntry, 'id' | 'timestamp' | 'balanceAfter'>): Promise<IncomeEntry>;
  getIncomeEntries(filter?: IncomeFilter): Promise<IncomeEntry[]>;
  updateIncomeEntry(id: string, updates: Partial<IncomeEntry>): Promise<IncomeEntry>;
  deleteIncomeEntry(id: string): Promise<void>;
  getCurrentBalance(): Promise<CashFlowBalance>;
  // ... other methods
}

class AsyncStorageAdapter implements CashFlowStorageAdapter {
  // Current implementation
}

class SQLiteAdapter implements CashFlowStorageAdapter {
  // Future SQLite implementation
}

// Factory function
function getCashFlowStorage(): CashFlowStorageAdapter {
  const storageType = await AsyncStorage.getItem('@cashflow_storage_type');
  return storageType === 'sqlite' 
    ? new SQLiteAdapter() 
    : new AsyncStorageAdapter();
}
```

---

## Error Handling & Validation

### Custom Error Classes

```typescript
/**
 * Custom error classes for cash flow operations
 */

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
```

### Validation Rules

```typescript
/**
 * Validation functions for cash flow data
 */

// Amount validation
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
  // Check decimal places
  const decimalPlaces = (amount.toString().split('.')[1] || '').length;
  if (decimalPlaces > 2) {
    throw new ValidationError('amount', 'Maximum 2 decimal places allowed');
  }
}

// Date validation
function validateDate(date: string): void {
  if (typeof date !== 'string') {
    throw new ValidationError('date', 'Must be a string');
  }
  // Check ISO format (YYYY-MM-DD)
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!isoDateRegex.test(date)) {
    throw new ValidationError('date', 'Must be in YYYY-MM-DD format');
  }
  // Check if valid date
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    throw new ValidationError('date', 'Must be a valid date');
  }
  // Check if not in future (optional, based on requirements)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (dateObj > today) {
    throw new ValidationError('date', 'Cannot be in the future');
  }
}

// Description validation
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

// Category validation
function validateCategory(category: string): void {
  if (typeof category !== 'string') {
    throw new ValidationError('category', 'Must be a string');
  }
  const validCategories = Object.values(IncomeCategory);
  if (!validCategories.includes(category as IncomeCategory)) {
    throw new ValidationError('category', `Must be one of: ${validCategories.join(', ')}`);
  }
}

// Complete entry validation
function validateIncomeEntry(
  entry: Omit<IncomeEntry, 'id' | 'timestamp' | 'balanceAfter'>
): void {
  validateAmount(entry.amount);
  validateDate(entry.date);
  validateDescription(entry.description);
  validateCategory(entry.category);
}
```

### Error Handling Pattern

```typescript
/**
 * Standard error handling pattern for storage operations
 */

async function safeStorageOperation<T>(
  operation: string,
  fn: () => Promise<T>
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (error instanceof CashFlowError) {
      // Re-throw custom errors
      throw error;
    }
    // Wrap unknown errors
    throw new StorageError(operation, error as Error);
  }
}

// Usage example
export async function saveIncomeEntry(
  entry: Omit<IncomeEntry, 'id' | 'timestamp' | 'balanceAfter'>
): Promise<IncomeEntry> {
  // Validate first
  validateIncomeEntry(entry);
  
  // Perform operation with error handling
  return safeStorageOperation('saveIncomeEntry', async () => {
    // ... implementation
  });
}
```

---

## Performance Considerations

### 1. Data Loading Optimization

```typescript
/**
 * Lazy loading strategy for large datasets
 */

// Load only recent entries initially
async function loadRecentEntries(limit: number = 50): Promise<IncomeEntry[]> {
  const allEntries = await getIncomeEntries();
  return allEntries.slice(0, limit);
}

// Load more on demand (pagination)
async function loadMoreEntries(
  offset: number,
  limit: number = 50
): Promise<IncomeEntry[]> {
  const allEntries = await getIncomeEntries();
  return allEntries.slice(offset, offset + limit);
}
```

### 2. Caching Strategy

```typescript
/**
 * In-memory cache for frequently accessed data
 */

class CashFlowCache {
  private balanceCache: CashFlowBalance | null = null;
  private balanceCacheTime: number = 0;
  private summaryCache: Map<string, CashFlowSummary> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  
  async getBalance(): Promise<CashFlowBalance> {
    const now = Date.now();
    if (this.balanceCache && (now - this.balanceCacheTime) < this.CACHE_TTL) {
      return this.balanceCache;
    }
    
    this.balanceCache = await getCurrentBalance();
    this.balanceCacheTime = now;
    return this.balanceCache;
  }
  
  invalidateBalance(): void {
    this.balanceCache = null;
    this.balanceCacheTime = 0;
  }
  
  async getSummary(period: string): Promise<CashFlowSummary> {
    if (this.summaryCache.has(period)) {
      return this.summaryCache.get(period)!;
    }
    
    const summary = await getMonthlySummary(period);
    this.summaryCache.set(period, summary);
    return summary;
  }
  
  invalidateSummary(period: string): void {
    this.summaryCache.delete(period);
  }
  
  clearAll(): void {
    this.balanceCache = null;
    this.balanceCacheTime = 0;
    this.summaryCache.clear();
  }
}

export const cashFlowCache = new CashFlowCache();
```

### 3. Batch Operations

```typescript
/**
 * Batch operations for better performance
 */

async function batchSaveIncomeEntries(
  entries: Array<Omit<IncomeEntry, 'id' | 'timestamp' | 'balanceAfter'>>
): Promise<IncomeEntry[]> {
  // Validate all entries first
  entries.forEach(validateIncomeEntry);
  
  // Get current entries and balance
  const currentEntries = await getIncomeEntries();
  const balance = await getCurrentBalance();
  
  // Generate new entries with IDs and timestamps
  const newEntries: IncomeEntry[] = entries.map(entry => ({
    ...entry,
    id: generateUUID(),
    timestamp: Date.now(),
  }));
  
  // Combine and recalculate balances
  const allEntries = [...currentEntries, ...newEntries];
  const { entries: updatedEntries, currentBalance } = 
    calculateRunningBalance(balance.initialBalance, allEntries);
  
  // Save in single operation
  await AsyncStorage.setItem(
    CASHFLOW_STORAGE_KEYS.INCOME_ENTRIES,
    JSON.stringify(updatedEntries)
  );
  
  // Update balance
  await AsyncStorage.setItem(
    CASHFLOW_STORAGE_KEYS.BALANCE,
    JSON.stringify({
      ...balance,
      currentBalance,
      lastUpdated: Date.now(),
    })
  );
  
  return newEntries;
}
```

### 4. Memory Management

```typescript
/**
 * Memory-efficient data processing
 */

// Use streaming for large datasets
async function* streamIncomeEntries(): AsyncGenerator<IncomeEntry> {
  const entries = await getIncomeEntries();
  for (const entry of entries) {
    yield entry;
  }
}

// Process in chunks
async function processEntriesInChunks<T>(
  entries: IncomeEntry[],
  chunkSize: number,
  processor: (chunk: IncomeEntry[]) => Promise<T[]>
): Promise<T[]> {
  const results: T[] = [];
  
  for (let i = 0; i < entries.length; i += chunkSize) {
    const chunk = entries.slice(i, i + chunkSize);
    const chunkResults = await processor(chunk);
    results.push(...chunkResults);
  }
  
  return results;
}
```

### 5. Performance Metrics

```typescript
/**
 * Target performance metrics
 */

const PERFORMANCE_TARGETS = {
  // Storage operations
  SAVE_ENTRY: 100, // ms
  LOAD_ENTRIES: 200, // ms
  UPDATE_ENTRY: 150, // ms
  DELETE_ENTRY: 100, // ms
  
  // Calculations
  CALCULATE_BALANCE: 50, // ms
  CALCULATE_SUMMARY: 100, // ms
  
  // UI rendering
  SCREEN_LOAD: 500, // ms
  LIST_SCROLL: 16, // ms (60 FPS)
};

// Performance monitoring
async function measurePerformance<T>(
  operation: string,
  fn: () => Promise<T>
): Promise<T> {
  const start = performance.now();
  const result = await fn();
  const duration = performance.now() - start;
  
  console.log(`[Performance] ${operation}: ${duration.toFixed(2)}ms`);
  
  return result;
}
```

---

## Appendix

### A. UUID Generation

```typescript
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
```

### B. Date Utilities

```typescript
/**
 * Date utility functions
 */

function getCurrentYearMonth(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

function getCurrentMonthRange(): DateRange {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);
  
  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
  };
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function parseDate(dateString: string): Date {
  return new Date(dateString);
}
```

### C. Testing Checklist

- [ ] Validate all input data types
- [ ] Test with empty datasets
- [ ] Test with large datasets (500+ entries)
- [ ] Test date range edge cases
- [ ] Test balance calculations with various scenarios
- [ ] Test concurrent operations
- [ ] Test error handling and recovery
- [ ] Test migration process
- [ ] Performance test on low-end devices
- [ ] Test AsyncStorage quota limits

### D. Future Enhancements

1. **Recurring Income Templates**
   - Auto-generate entries based on schedule
   - Link entries to templates
   - Edit template affects all future entries

2. **Expense Integration**
   - Track expenses alongside income
   - Calculate true net cash flow
   - Unified transaction history

3. **Multi-Currency Support**
   - Store amounts in multiple currencies
   - Exchange rate conversion
   - Currency-specific formatting

4. **Cloud Sync**
   - Backup to cloud storage
   - Sync across devices
   - Conflict resolution

5. **Advanced Analytics**
   - Income trends and forecasting
   - Category insights
   - Goal tracking
   - Budget vs actual comparisons

6. **Export/Import**
   - CSV export for spreadsheets
   - PDF reports
   - Import from bank statements

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-10-22 | Kilo Code | Initial specification |

---

**End of Specification Document**