import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Expense } from '../types';

interface TransactionsScreenProps {
  expenses: Expense[];
}

const TransactionsScreen: React.FC<TransactionsScreenProps> = ({ expenses }) => {
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'name'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const sortedExpenses = [...expenses].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'date':
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
        break;
      case 'amount':
        comparison = a.amount - b.amount;
        break;
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
    }

    return sortOrder === 'desc' ? -comparison : comparison;
  });

  const handleSort = (column: 'date' | 'amount' | 'name') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => handleSort('name')} style={styles.headerCell}>
        <Text style={[styles.headerText, sortBy === 'name' && styles.activeSort]}>
          Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleSort('amount')} style={styles.headerCell}>
        <Text style={[styles.headerText, sortBy === 'amount' && styles.activeSort]}>
          Amount {sortBy === 'amount' && (sortOrder === 'asc' ? '↑' : '↓')}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleSort('date')} style={styles.headerCell}>
        <Text style={[styles.headerText, sortBy === 'date' && styles.activeSort]}>
          Date {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderTransaction = ({ item }: { item: Expense }) => (
    <View style={styles.transactionRow}>
      <Text style={styles.transactionName}>{item.name}</Text>
      <Text style={styles.transactionAmount}>-${item.amount.toFixed(2)}</Text>
      <Text style={styles.transactionDate}>
        {new Date(item.date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })}
      </Text>
    </View>
  );

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>All Transactions</Text>
        <View style={styles.summary}>
          <Text style={styles.summaryText}>Total Transactions: {expenses.length}</Text>
          <Text style={styles.summaryText}>Total Spent: ${totalExpenses.toFixed(2)}</Text>
        </View>
        {renderHeader()}
        <FlatList
          data={sortedExpenses}
          renderItem={renderTransaction}
          keyExtractor={(item) => item.id}
          style={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No transactions yet</Text>
          }
        />
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
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  summary: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  headerCell: {
    flex: 1,
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  activeSort: {
    textDecorationLine: 'underline',
  },
  list: {
    flex: 1,
  },
  transactionRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginBottom: 5,
    borderRadius: 8,
    alignItems: 'center',
  },
  transactionName: {
    flex: 2,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  transactionAmount: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6384',
    textAlign: 'center',
  },
  transactionDate: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 50,
  },
});

export default TransactionsScreen;