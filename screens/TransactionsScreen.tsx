import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/colors';
import { styles } from '../styles/screens/TransactionsScreen.styles';

/**
 * TransactionsScreen - Complete transaction history with search and filtering
 * Features:
 * - Search bar with filter button
 * - Time period selector (All, Today, This Week, This Month, This Year)
 * - Transactions grouped by date
 * - Floating action button for adding transactions
 */

// Transaction type
interface Transaction {
  id: string;
  name: string;
  category: string;
  amount: number;
  date: string;
  time: string;
  icon: keyof typeof Ionicons.glyphMap;
  type: 'income' | 'expense';
}

// Grouped transactions by date
interface GroupedTransactions {
  date: string;
  transactions: Transaction[];
}

// Mock transaction data
const MOCK_TRANSACTIONS: Transaction[] = [
  // Today
  { id: '1', name: 'Starbucks Coffee', category: 'Dining', amount: -6.50, date: 'Today', time: '2:30 PM', icon: 'cafe-outline', type: 'expense' },
  { id: '2', name: 'Uber Ride', category: 'Transportation', amount: -18.75, date: 'Today', time: '12:15 PM', icon: 'car-outline', type: 'expense' },
  { id: '3', name: 'Freelance Payment', category: 'Income', amount: 450.00, date: 'Today', time: '10:00 AM', icon: 'cash-outline', type: 'income' },
  { id: '4', name: 'Grocery Store', category: 'Groceries', amount: -87.32, date: 'Today', time: '9:15 AM', icon: 'cart-outline', type: 'expense' },
  
  // Yesterday
  { id: '5', name: 'Netflix Subscription', category: 'Entertainment', amount: -15.99, date: 'Yesterday', time: '6:00 PM', icon: 'tv-outline', type: 'expense' },
  { id: '6', name: 'Salary Deposit', category: 'Income', amount: 3500.00, date: 'Yesterday', time: '9:00 AM', icon: 'wallet-outline', type: 'income' },
  { id: '7', name: 'Restaurant Dinner', category: 'Dining', amount: -65.40, date: 'Yesterday', time: '7:30 PM', icon: 'restaurant-outline', type: 'expense' },
  
  // Dec 20, 2024
  { id: '8', name: 'Electric Bill', category: 'Utilities', amount: -120.45, date: 'Dec 20, 2024', time: '3:00 PM', icon: 'flash-outline', type: 'expense' },
  { id: '9', name: 'Gas Station', category: 'Transportation', amount: -45.00, date: 'Dec 20, 2024', time: '11:30 AM', icon: 'car-outline', type: 'expense' },
  { id: '10', name: 'Amazon Purchase', category: 'Shopping', amount: -89.99, date: 'Dec 20, 2024', time: '10:00 AM', icon: 'bag-outline', type: 'expense' },
  
  // Dec 19, 2024
  { id: '11', name: 'Gym Membership', category: 'Health', amount: -49.99, date: 'Dec 19, 2024', time: '8:00 AM', icon: 'fitness-outline', type: 'expense' },
  { id: '12', name: 'Coffee Shop', category: 'Dining', amount: -5.75, date: 'Dec 19, 2024', time: '7:30 AM', icon: 'cafe-outline', type: 'expense' },
  { id: '13', name: 'Pharmacy', category: 'Health', amount: -32.50, date: 'Dec 19, 2024', time: '5:45 PM', icon: 'medical-outline', type: 'expense' },
  
  // Dec 18, 2024
  { id: '14', name: 'Internet Bill', category: 'Utilities', amount: -79.99, date: 'Dec 18, 2024', time: '2:00 PM', icon: 'wifi-outline', type: 'expense' },
  { id: '15', name: 'Movie Tickets', category: 'Entertainment', amount: -28.00, date: 'Dec 18, 2024', time: '7:00 PM', icon: 'film-outline', type: 'expense' },
  { id: '16', name: 'Bookstore', category: 'Shopping', amount: -42.50, date: 'Dec 18, 2024', time: '3:30 PM', icon: 'book-outline', type: 'expense' },
  
  // Dec 17, 2024
  { id: '17', name: 'Consulting Fee', category: 'Income', amount: 800.00, date: 'Dec 17, 2024', time: '11:00 AM', icon: 'briefcase-outline', type: 'income' },
  { id: '18', name: 'Lunch', category: 'Dining', amount: -18.50, date: 'Dec 17, 2024', time: '12:30 PM', icon: 'fast-food-outline', type: 'expense' },
  { id: '19', name: 'Parking Fee', category: 'Transportation', amount: -12.00, date: 'Dec 17, 2024', time: '9:00 AM', icon: 'car-outline', type: 'expense' },
  
  // Dec 16, 2024
  { id: '20', name: 'Spotify Premium', category: 'Entertainment', amount: -9.99, date: 'Dec 16, 2024', time: '6:00 PM', icon: 'musical-notes-outline', type: 'expense' },
];

// Time period options
const TIME_PERIODS = ['All', 'Today', 'This Week', 'This Month', 'This Year'];

const TransactionsScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('All');

  // Event handlers wrapped in useCallback
  const handleAddTransaction = useCallback(() => {
    // Add transaction logic will be implemented
    console.log('Add transaction');
  }, []);

  const handleEditTransaction = useCallback((id: string) => {
    // Edit transaction logic will be implemented
    console.log('Edit transaction:', id);
  }, []);

  const handleDeleteTransaction = useCallback((id: string) => {
    // Delete transaction logic will be implemented
    console.log('Delete transaction:', id);
  }, []);

  // Group transactions by date
  const groupedTransactions: GroupedTransactions[] = useMemo(() => {
    return MOCK_TRANSACTIONS.reduce((acc, transaction) => {
      const existingGroup = acc.find(group => group.date === transaction.date);
      if (existingGroup) {
        existingGroup.transactions.push(transaction);
      } else {
        acc.push({
          date: transaction.date,
          transactions: [transaction],
        });
      }
      return acc;
    }, [] as GroupedTransactions[]);
  }, []);

  return (
    <View style={styles.container}>
      {/* Search and Filter Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color={theme.colors.secondary.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search transactions..."
            placeholderTextColor={theme.colors.secondary.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options-outline" size={24} color={theme.colors.secondary.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Time Period Selector */}
      <View style={styles.periodSection}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.periodScrollContent}
        >
          {TIME_PERIODS.map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodTab,
                selectedPeriod === period && styles.periodTabActive,
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text
                style={[
                  styles.periodTabText,
                  selectedPeriod === period && styles.periodTabTextActive,
                ]}
              >
                {period}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Transactions List */}
      <FlatList
        data={groupedTransactions}
        keyExtractor={(item) => item.date}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.dateGroup}>
            {/* Date Header */}
            <Text style={styles.dateHeader}>{item.date}</Text>
            
            {/* Transactions for this date */}
            {item.transactions.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))}
          </View>
        )}
      />

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={handleAddTransaction}>
        <Ionicons name="add" size={28} color={theme.colors.primary.textOnAccent} />
      </TouchableOpacity>
    </View>
  );
};

// Transaction Item Component
interface TransactionItemProps {
  transaction: Transaction;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
  const isExpense = transaction.type === 'expense';
  const iconColor = isExpense ? theme.colors.status.error : theme.colors.status.success;
  const amountColor = isExpense ? theme.colors.status.error : theme.colors.status.success;

  return (
    <View style={styles.transactionItem}>
      {/* Icon */}
      <View style={[styles.iconContainer, { backgroundColor: `${iconColor}15` }]}>
        <Ionicons name={transaction.icon} size={24} color={iconColor} />
      </View>

      {/* Transaction Details */}
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionName}>{transaction.name}</Text>
        <Text style={styles.transactionCategory}>{transaction.category}</Text>
      </View>

      {/* Amount and Time */}
      <View style={styles.transactionRight}>
        <Text style={[styles.transactionAmount, { color: amountColor }]}>
          {isExpense ? '-' : '+'}${Math.abs(transaction.amount).toFixed(2)}
        </Text>
        <Text style={styles.transactionTime}>{transaction.time}</Text>
      </View>
    </View>
  );
};

export default TransactionsScreen;