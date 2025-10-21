import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './screens/HomeScreen';
import PaycheckScreen from './screens/PaycheckScreen';
import BillsScreen from './screens/BillsScreen';
import ExpensesScreen from './screens/ExpensesScreen';
import SavingsScreen from './screens/SavingsScreen';
import TransactionsScreen from './screens/TransactionsScreen';
import AllBillsScreen from './screens/AllBillsScreen';
import AllExpensesScreen from './screens/AllExpensesScreen';
import { Bill, SavingsGoal, Expense } from './types';
import {
  loadPaycheck,
  savePaycheck,
  loadBills,
  saveBills,
  loadExpenses,
  saveExpenses,
  loadSavingsGoals,
  saveSavingsGoals,
} from './utils/storage';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const BillsStack = ({ bills, onAddBill, onEditBill, onDeleteBill }: {
  bills: Bill[];
  onAddBill: (bill: Bill) => void;
  onEditBill: (bill: Bill) => void;
  onDeleteBill: (id: string) => void;
}) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen name="Bills List" options={{ title: 'Bills' }}>
        {(props) => (
          <BillsScreen
            bills={bills}
            onAddBill={onAddBill}
            onEditBill={onEditBill}
            onDeleteBill={onDeleteBill}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="AllBills" options={{ title: 'All Bills' }}>
        {(props) => (
          <AllBillsScreen bills={bills} />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

const ExpensesStack = ({ expenses, onAddExpense, onEditExpense, onDeleteExpense }: {
  expenses: Expense[];
  onAddExpense: (expense: Expense) => void;
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (id: string) => void;
}) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen name="Expenses List" options={{ title: 'Expenses' }}>
        {(props) => (
          <ExpensesScreen
            expenses={expenses}
            onAddExpense={onAddExpense}
            onEditExpense={onEditExpense}
            onDeleteExpense={onDeleteExpense}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="AllExpenses" options={{ title: 'All Transactions' }}>
        {(props) => (
          <TransactionsScreen expenses={expenses} />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default function App() {
  const [paycheck, setPaycheck] = useState<number>(0);
  const [bills, setBills] = useState<Bill[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [remainingMoney, setRemainingMoney] = useState<number>(0);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load data on app start
  useEffect(() => {
    const loadData = async () => {
      try {
        const [loadedPaycheck, loadedBills, loadedExpenses, loadedSavingsGoals] = await Promise.all([
          loadPaycheck(),
          loadBills(),
          loadExpenses(),
          loadSavingsGoals(),
        ]);

        setPaycheck(loadedPaycheck);
        setBills(loadedBills);
        setExpenses(loadedExpenses);
        setSavingsGoals(loadedSavingsGoals);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Save data whenever it changes
  useEffect(() => {
    if (!isLoading) {
      savePaycheck(paycheck);
    }
  }, [paycheck, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      saveBills(bills);
    }
  }, [bills, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      saveExpenses(expenses);
    }
  }, [expenses, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      saveSavingsGoals(savingsGoals);
    }
  }, [savingsGoals, isLoading]);

  useEffect(() => {
    const totalBills = bills.reduce((sum, bill) => sum + bill.amount, 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    setRemainingMoney(paycheck - totalBills - totalExpenses);
  }, [paycheck, bills, expenses]);

  const handleAddBill = (bill: Bill) => {
    setBills([...bills, bill]);
  };

  const handleEditBill = (updatedBill: Bill) => {
    setBills(bills.map(bill => bill.id === updatedBill.id ? updatedBill : bill));
  };

  const handleDeleteBill = (id: string) => {
    setBills(bills.filter(bill => bill.id !== id));
  };

  const handleAddExpense = (expense: Expense) => {
    setExpenses([...expenses, expense]);
  };

  const handleEditExpense = (updatedExpense: Expense) => {
    setExpenses(expenses.map(expense => expense.id === updatedExpense.id ? updatedExpense : expense));
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  const handleAddSavingsGoal = (goal: SavingsGoal) => {
    setSavingsGoals([...savingsGoals, goal]);
  };

  const handleEditSavingsGoal = (updatedGoal: SavingsGoal) => {
    setSavingsGoals(savingsGoals.map(goal => goal.id === updatedGoal.id ? updatedGoal : goal));
  };

  const handleDeleteSavingsGoal = (id: string) => {
    setSavingsGoals(savingsGoals.filter(goal => goal.id !== id));
  };

  const handleContributeToGoal = (id: string, amount: number) => {
    setSavingsGoals(savingsGoals.map(goal =>
      goal.id === id ? { ...goal, currentAmount: goal.currentAmount + amount } : goal
    ));
  };

  function DashboardStack() {
    return (
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#007AFF',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen name="Dashboard Home">
          {(props) => (
            <HomeScreen
              {...props}
              paycheck={paycheck}
              bills={bills}
              expenses={expenses}
              remainingMoney={remainingMoney}
              savingsGoals={savingsGoals}
              onAddBill={handleAddBill}
              onEditBill={handleEditBill}
              onDeleteBill={handleDeleteBill}
              onAddExpense={handleAddExpense}
              onEditExpense={handleEditExpense}
              onDeleteExpense={handleDeleteExpense}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Transactions">
          {(props) => (
            <TransactionsScreen
              {...props}
              expenses={expenses}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    );
  }

  if (isLoading) {
    return null; // Or a loading screen
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: '#666',
          headerStyle: {
            backgroundColor: '#007AFF',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Tab.Screen
          name="Dashboard"
          component={DashboardStack}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Paycheck"
          children={() => (
            <PaycheckScreen
              paycheck={paycheck}
              onPaycheckChange={setPaycheck}
            />
          )}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="cash" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Bills"
          children={() => (
            <BillsStack
              bills={bills}
              onAddBill={handleAddBill}
              onEditBill={handleEditBill}
              onDeleteBill={handleDeleteBill}
            />
          )}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="receipt" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Expenses"
          children={() => (
            <ExpensesStack
              expenses={expenses}
              onAddExpense={handleAddExpense}
              onEditExpense={handleEditExpense}
              onDeleteExpense={handleDeleteExpense}
            />
          )}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="cart" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Savings"
          children={() => (
            <SavingsScreen
              savingsGoals={savingsGoals}
              onAddSavingsGoal={handleAddSavingsGoal}
              onEditSavingsGoal={handleEditSavingsGoal}
              onDeleteSavingsGoal={handleDeleteSavingsGoal}
              onContributeToGoal={handleContributeToGoal}
            />
          )}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="wallet" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
