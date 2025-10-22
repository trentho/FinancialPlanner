import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../theme/colors';
import { styles } from '../styles/screens/DashboardScreen.styles';
import { getBalance, CashFlowBalance, BalanceNotInitializedError } from '../utils/cashFlowStorage';

/**
 * DashboardScreen - Main home page for the money tracking app
 * Features:
 * - Account balance with change indicator
 * - Quick stats cards (2x2 grid)
 * - Recent activity list
 * - Spending trend section
 */

// Transaction type
interface Transaction {
  id: string;
  name: string;
  category: string;
  date: string;
  amount: number;
  icon: keyof typeof Ionicons.glyphMap;
}

// Mock data for demonstration
const MOCK_DATA = {
  balance: 12345.67,
  change: 234.56,
  changePercent: 1.95,
  monthlyIncome: 5420.00,
  monthlyExpenses: 3280.50,
  savingsRate: 39.5,
  netCashFlow: 2139.50,
  recentTransactions: [
    { id: '1', name: 'Grocery Store', category: 'Food', date: 'Today', amount: -85.32, icon: 'cart-outline' as keyof typeof Ionicons.glyphMap },
    { id: '2', name: 'Salary Deposit', category: 'Income', date: 'Yesterday', amount: 2500.00, icon: 'cash-outline' as keyof typeof Ionicons.glyphMap },
    { id: '3', name: 'Electric Bill', category: 'Utilities', date: '2 days ago', amount: -120.45, icon: 'flash-outline' as keyof typeof Ionicons.glyphMap },
    { id: '4', name: 'Coffee Shop', category: 'Food', date: '3 days ago', amount: -12.50, icon: 'cafe-outline' as keyof typeof Ionicons.glyphMap },
    { id: '5', name: 'Gas Station', category: 'Transport', date: '4 days ago', amount: -45.00, icon: 'car-outline' as keyof typeof Ionicons.glyphMap },
  ],
};

const DashboardScreen: React.FC = () => {
  const navigation = useNavigation();
  const [balance, setBalance] = useState<CashFlowBalance | null>(null);
  const [balanceLoading, setBalanceLoading] = useState<boolean>(true);
  const [balanceError, setBalanceError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Fetch balance function wrapped in useCallback
  const fetchBalance = useCallback(async () => {
    try {
      setBalanceError(null);
      const balanceData = await getBalance();
      setBalance(balanceData);
    } catch (error) {
      if (error instanceof BalanceNotInitializedError) {
        setBalanceError('Balance not set up. Please add your initial balance in Cash Flow.');
        setBalance(null);
      } else {
        setBalanceError('Failed to load balance. Please try again.');
        console.error('Error fetching balance:', error);
      }
    } finally {
      setBalanceLoading(false);
    }
  }, []);

  // Load balance on mount
  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  // Add navigation listener to refresh balance when returning to Dashboard
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchBalance();
    });

    return unsubscribe;
  }, [navigation, fetchBalance]);

  // Pull-to-refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchBalance();
    setRefreshing(false);
  }, [fetchBalance]);

  // Memoize formatted balance string
  const formattedBalance = useMemo(() => {
    const balanceValue = balance?.currentBalance ?? 0;
    return balanceValue.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }, [balance]);

  const isPositiveChange = useMemo(() => MOCK_DATA.change >= 0, []);

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={theme.colors.primary.accent}
        />
      }
    >
      {/* Account Balance Section */}
      <View style={styles.balanceSection}>
        <Text style={styles.balanceLabel}>Total Balance</Text>
        {balanceLoading ? (
          <View style={{ paddingVertical: 20 }}>
            <ActivityIndicator size="large" color={theme.colors.primary.accent} />
          </View>
        ) : balanceError ? (
          <>
            <Text style={[styles.balanceAmount, { color: theme.colors.status.warning }]}>
              $0.00
            </Text>
            <Text style={[styles.changeText, { color: theme.colors.status.error, marginTop: 8 }]}>
              {balanceError}
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.balanceAmount}>
              ${formattedBalance}
            </Text>
            <View style={styles.changeContainer}>
              <Ionicons
                name={isPositiveChange ? 'trending-up' : 'trending-down'}
                size={16}
                color={isPositiveChange ? theme.colors.status.success : theme.colors.status.error}
                style={styles.changeIcon}
              />
              <Text style={[
                styles.changeText,
                { color: isPositiveChange ? theme.colors.status.success : theme.colors.status.error }
              ]}>
                {isPositiveChange ? '+' : ''}${Math.abs(MOCK_DATA.change).toFixed(2)} ({isPositiveChange ? '+' : ''}{MOCK_DATA.changePercent}%)
              </Text>
            </View>
          </>
        )}
      </View>

      {/* Quick Stats Cards */}
      <View style={styles.statsSection}>
        <View style={styles.statsRow}>
          <StatCard
            icon="arrow-down-circle-outline"
            label="Monthly Income"
            value={`$${MOCK_DATA.monthlyIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
            iconColor={theme.colors.status.success}
          />
          <StatCard
            icon="arrow-up-circle-outline"
            label="Monthly Expenses"
            value={`$${MOCK_DATA.monthlyExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
            iconColor={theme.colors.status.error}
          />
        </View>
        <View style={styles.statsRow}>
          <StatCard
            icon="trending-up-outline"
            label="Savings Rate"
            value={`${MOCK_DATA.savingsRate}%`}
            iconColor={theme.colors.primary.accent}
          />
          <StatCard
            icon="wallet-outline"
            label="Net Cash Flow"
            value={`$${MOCK_DATA.netCashFlow.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
            iconColor={theme.colors.status.success}
          />
        </View>
      </View>

      {/* Recent Activity Section */}
      <View style={styles.activitySection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
        </View>
        <View style={styles.activityList}>
          {MOCK_DATA.recentTransactions.map((transaction, index) => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
              isLast={index === MOCK_DATA.recentTransactions.length - 1}
            />
          ))}
        </View>
        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>View All Transactions</Text>
          <Ionicons name="chevron-forward" size={16} color={theme.colors.primary.accent} />
        </TouchableOpacity>
      </View>

      {/* Spending Trend Section */}
      <View style={styles.chartSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Spending Trend</Text>
        </View>
        <View style={styles.chartPlaceholder}>
          <Ionicons name="bar-chart-outline" size={48} color={theme.colors.secondary.textTertiary} />
          <Text style={styles.chartPlaceholderText}>Chart visualization coming soon</Text>
        </View>
      </View>

      {/* Bottom spacing */}
      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

// StatCard Component
interface StatCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  iconColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, iconColor }) => {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statIconContainer, { backgroundColor: `${iconColor}15` }]}>
        <Ionicons name={icon} size={24} color={iconColor} />
      </View>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
};

// TransactionItem Component
interface TransactionItemProps {
  transaction: Transaction;
  isLast?: boolean;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, isLast = false }) => {
  const isExpense = transaction.amount < 0;
  
  return (
    <View style={[styles.transactionItem, isLast && styles.transactionItemLast]}>
      <View style={[
        styles.transactionIconContainer,
        { backgroundColor: isExpense ? `${theme.colors.status.error}15` : `${theme.colors.status.success}15` }
      ]}>
        <Ionicons 
          name={transaction.icon} 
          size={20} 
          color={isExpense ? theme.colors.status.error : theme.colors.status.success}
        />
      </View>
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionName}>{transaction.name}</Text>
        <Text style={styles.transactionDate}>{transaction.date}</Text>
      </View>
      <Text style={[
        styles.transactionAmount,
        { color: isExpense ? theme.colors.status.error : theme.colors.status.success }
      ]}>
        {isExpense ? '-' : '+'}${Math.abs(transaction.amount).toFixed(2)}
      </Text>
    </View>
  );
};

export default DashboardScreen;