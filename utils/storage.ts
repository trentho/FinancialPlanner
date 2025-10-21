import AsyncStorage from '@react-native-async-storage/async-storage';
import { Bill, Expense, SavingsGoal } from '../types';

const STORAGE_KEYS = {
  PAYCHECK: 'paycheck',
  BILLS: 'bills',
  EXPENSES: 'expenses',
  SAVINGS_GOALS: 'savingsGoals',
};

// Paycheck storage
export const savePaycheck = async (paycheck: number): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.PAYCHECK, paycheck.toString());
  } catch (error) {
    console.error('Error saving paycheck:', error);
  }
};

export const loadPaycheck = async (): Promise<number> => {
  try {
    const paycheck = await AsyncStorage.getItem(STORAGE_KEYS.PAYCHECK);
    return paycheck ? parseFloat(paycheck) : 0;
  } catch (error) {
    console.error('Error loading paycheck:', error);
    return 0;
  }
};

// Bills storage
export const saveBills = async (bills: Bill[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(bills));
  } catch (error) {
    console.error('Error saving bills:', error);
  }
};

export const loadBills = async (): Promise<Bill[]> => {
  try {
    const bills = await AsyncStorage.getItem(STORAGE_KEYS.BILLS);
    return bills ? JSON.parse(bills) : [];
  } catch (error) {
    console.error('Error loading bills:', error);
    return [];
  }
};

// Expenses storage
export const saveExpenses = async (expenses: Expense[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
  } catch (error) {
    console.error('Error saving expenses:', error);
  }
};

export const loadExpenses = async (): Promise<Expense[]> => {
  try {
    const expenses = await AsyncStorage.getItem(STORAGE_KEYS.EXPENSES);
    return expenses ? JSON.parse(expenses) : [];
  } catch (error) {
    console.error('Error loading expenses:', error);
    return [];
  }
};

// Savings goals storage
export const saveSavingsGoals = async (goals: SavingsGoal[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SAVINGS_GOALS, JSON.stringify(goals));
  } catch (error) {
    console.error('Error saving savings goals:', error);
  }
};

export const loadSavingsGoals = async (): Promise<SavingsGoal[]> => {
  try {
    const goals = await AsyncStorage.getItem(STORAGE_KEYS.SAVINGS_GOALS);
    return goals ? JSON.parse(goals) : [];
  } catch (error) {
    console.error('Error loading savings goals:', error);
    return [];
  }
};

// Clear all data (for development/testing)
export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
  } catch (error) {
    console.error('Error clearing data:', error);
  }
};