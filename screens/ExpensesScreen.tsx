import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ExpensesList from '../components/ExpensesList';
import { Expense } from '../types';

interface ExpensesScreenProps {
  expenses: Expense[];
  onAddExpense: (expense: Expense) => void;
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (id: string) => void;
}

const ExpensesScreen: React.FC<ExpensesScreenProps> = ({ expenses, onAddExpense, onEditExpense, onDeleteExpense }) => {
  const navigation = useNavigation();

  const handleViewAll = () => {
    navigation.navigate('AllExpenses' as never);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ExpensesList
        expenses={expenses}
        onAddExpense={onAddExpense}
        onEditExpense={onEditExpense}
        onDeleteExpense={onDeleteExpense}
        onViewAll={handleViewAll}
      />
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
});

export default ExpensesScreen;