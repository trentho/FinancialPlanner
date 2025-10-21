import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView, Platform, Text } from 'react-native';
import FinancialChart from '../components/FinancialChart';
import SpendingTrends from '../components/SpendingTrends';
import RecentTransactions from '../components/RecentTransactions';
import { Bill, SavingsGoal, Expense } from '../types';

interface HomeScreenProps {
  navigation: any;
  paycheck: number;
  bills: Bill[];
  expenses: Expense[];
  remainingMoney: number;
  savingsGoals: SavingsGoal[];
  onAddBill: (bill: Bill) => void;
  onEditBill: (bill: Bill) => void;
  onDeleteBill: (id: string) => void;
  onAddExpense: (expense: Expense) => void;
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (id: string) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({
  navigation,
  paycheck,
  bills,
  expenses,
  remainingMoney,
  savingsGoals,
  onAddBill,
  onEditBill,
  onDeleteBill,
  onAddExpense,
  onEditExpense,
  onDeleteExpense,
}) => {

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView contentInsetAdjustmentBehavior="automatic">
          <View style={styles.section}>
            <FinancialChart
              salary={paycheck}
              bills={bills}
              remainingMoney={remainingMoney}
              savingsGoals={savingsGoals}
              expenses={expenses}
            />
          </View>
          <View style={styles.section}>
            <SpendingTrends expenses={expenses} />
          </View>
          <View style={styles.section}>
            <RecentTransactions
              expenses={expenses}
              onViewAllTransactions={() => navigation.navigate('Transactions')}
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
});

export default HomeScreen;