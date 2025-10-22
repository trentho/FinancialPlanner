import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/colors';
import { styles } from '../styles/screens/CashFlowScreen.styles';
import {
  IncomeEntry,
  CashFlowBalance,
  CashFlowSummary,
  IncomeCategory,
  IncomeCategoryType,
  getBalance,
  setInitialBalance,
  getIncomeEntries,
  saveIncomeEntry,
  updateIncomeEntry,
  deleteIncomeEntry,
  getMonthlySummary,
  BalanceNotInitializedError,
  ValidationError,
  DateRange,
} from '../utils/cashFlowStorage';

/**
 * CashFlowScreen - Complete cash flow management with real data integration
 * Features:
 * - Initial balance setup for first-time users
 * - Income entry management (add, edit, delete)
 * - Month/year navigation
 * - Real-time balance tracking
 * - Monthly summaries and insights
 */

const CashFlowScreen: React.FC = () => {
  // State Management
  const [incomeEntries, setIncomeEntries] = useState<IncomeEntry[]>([]);
  const [balance, setBalance] = useState<CashFlowBalance | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBalanceSetup, setShowBalanceSetup] = useState(false);
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<IncomeEntry | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [summary, setSummary] = useState<CashFlowSummary | null>(null);

  // Form state
  const [formAmount, setFormAmount] = useState('');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formDescription, setFormDescription] = useState('');
  const [formCategory, setFormCategory] = useState<IncomeCategoryType>(IncomeCategory.SALARY);
  const [initialBalanceInput, setInitialBalanceInput] = useState('');

  // Load entries for selected period
  const loadEntriesForPeriod = useCallback(async () => {
    try {
      const startDate = new Date(selectedYear, selectedMonth - 1, 1);
      const endDate = new Date(selectedYear, selectedMonth, 0);
      
      const dateRange: DateRange = {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
      };

      const entries = await getIncomeEntries({ dateRange });
      setIncomeEntries(entries);

      // Load summary
      const monthlySummary = await getMonthlySummary(selectedYear, selectedMonth);
      setSummary(monthlySummary);
    } catch (err) {
      console.error('Load entries error:', err);
      setError('Failed to load entries for this period.');
    }
  }, [selectedMonth, selectedYear]);

  // Load initial data
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const balanceData = await getBalance();
      setBalance(balanceData);
      
      await loadEntriesForPeriod();
    } catch (err) {
      if (err instanceof BalanceNotInitializedError) {
        setShowBalanceSetup(true);
      } else {
        setError('Failed to load data. Please try again.');
        console.error('Load data error:', err);
      }
    } finally {
      setLoading(false);
    }
  }, [loadEntriesForPeriod]);

  // Load balance and entries on mount
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Reload entries when month/year changes (but NOT when balance changes to avoid circular dependency)
  useEffect(() => {
    if (balance) {
      loadEntriesForPeriod();
    }
  }, [selectedMonth, selectedYear, balance, loadEntriesForPeriod]);

  // Handle pull-to-refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  // Handle initial balance setup
  const handleSetInitialBalance = useCallback(async () => {
    try {
      const amount = parseFloat(initialBalanceInput);
      if (isNaN(amount) || amount <= 0) {
        Alert.alert('Invalid Amount', 'Please enter a valid positive number.');
        return;
      }

      const newBalance = await setInitialBalance(amount);
      setBalance(newBalance);
      setShowBalanceSetup(false);
      setInitialBalanceInput('');
      await loadEntriesForPeriod();
    } catch (err) {
      if (err instanceof ValidationError) {
        Alert.alert('Validation Error', err.message);
      } else {
        Alert.alert('Error', 'Failed to set initial balance. Please try again.');
      }
    }
  }, [initialBalanceInput, loadEntriesForPeriod]);

  // Open income form for adding
  const handleAddIncome = useCallback(() => {
    setEditingEntry(null);
    setFormAmount('');
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormDescription('');
    setFormCategory(IncomeCategory.SALARY);
    setShowIncomeForm(true);
  }, []);

  // Open income form for editing
  const handleEditIncome = useCallback((entry: IncomeEntry) => {
    setEditingEntry(entry);
    setFormAmount(entry.amount.toString());
    setFormDate(entry.date);
    setFormDescription(entry.description);
    setFormCategory(entry.category);
    setShowIncomeForm(true);
  }, []);

  // Save income entry (add or update)
  const handleSaveIncome = useCallback(async () => {
    try {
      const amount = parseFloat(formAmount);
      if (isNaN(amount) || amount <= 0) {
        Alert.alert('Invalid Amount', 'Please enter a valid positive number.');
        return;
      }

      if (!formDescription.trim()) {
        Alert.alert('Invalid Description', 'Please enter a description.');
        return;
      }

      const entryData = {
        amount,
        date: formDate,
        description: formDescription.trim(),
        category: formCategory,
      };

      if (editingEntry) {
        await updateIncomeEntry(editingEntry.id, entryData);
      } else {
        await saveIncomeEntry(entryData);
      }

      setShowIncomeForm(false);
      await loadData();
    } catch (err) {
      if (err instanceof ValidationError) {
        Alert.alert('Validation Error', err.message);
      } else {
        Alert.alert('Error', 'Failed to save income entry. Please try again.');
      }
    }
  }, [formAmount, formDate, formDescription, formCategory, editingEntry, loadData]);

  // Delete income entry
  const handleDeleteIncome = useCallback((entry: IncomeEntry) => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this income entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteIncomeEntry(entry.id);
              await loadData();
            } catch (err) {
              Alert.alert('Error', 'Failed to delete entry. Please try again.');
            }
          },
        },
      ]
    );
  }, [loadData]);

  // Navigate to previous month
  const handlePreviousMonth = useCallback(() => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  }, [selectedMonth, selectedYear]);

  // Navigate to next month
  const handleNextMonth = useCallback(() => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  }, [selectedMonth, selectedYear]);

  // Memoized filtered entries (already filtered by loadEntriesForPeriod)
  const displayEntries = useMemo(() => incomeEntries, [incomeEntries]);

  // Memoized month name
  const monthName = useMemo(() => {
    const date = new Date(selectedYear, selectedMonth - 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }, [selectedMonth, selectedYear]);

  // Render income entry item
  const renderIncomeItem = useCallback(({ item }: { item: IncomeEntry }) => {
    const date = new Date(item.date);
    const formattedDate = date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });

    return (
      <View style={styles.incomeItem}>
        <View style={styles.incomeItemLeft}>
          <View style={styles.incomeItemHeader}>
            <Text style={styles.incomeItemDate}>{formattedDate}</Text>
            <View style={[styles.categoryBadge, { backgroundColor: `${theme.colors.primary.accent}20` }]}>
              <Text style={styles.categoryBadgeText}>{item.category}</Text>
            </View>
          </View>
          <Text style={styles.incomeItemDescription}>{item.description}</Text>
        </View>
        <View style={styles.incomeItemRight}>
          <Text style={styles.incomeItemAmount}>
            ${item.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Text>
          <View style={styles.incomeItemActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleEditIncome(item)}
            >
              <Ionicons name="pencil" size={18} color={theme.colors.primary.accent} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleDeleteIncome(item)}
            >
              <Ionicons name="trash-outline" size={18} color={theme.colors.status.error} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }, [handleEditIncome, handleDeleteIncome]);

  // Empty state component
  const renderEmptyState = useCallback(() => (
    <View style={styles.emptyState}>
      <Ionicons name="wallet-outline" size={64} color={theme.colors.secondary.textTertiary} />
      <Text style={styles.emptyStateText}>No income entries for this month</Text>
      <Text style={styles.emptyStateSubtext}>Tap the + button to add your first entry</Text>
    </View>
  ), []);

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={theme.colors.primary.accent} />
        <Text style={styles.loadingText}>Loading cash flow data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary.accent}
          />
        }
      >
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.title}>Cash Flow</Text>
          
          {/* Month/Year Navigation */}
          <View style={styles.monthNavigation}>
            <TouchableOpacity
              style={styles.navButton}
              onPress={handlePreviousMonth}
            >
              <Ionicons name="chevron-back" size={24} color={theme.colors.secondary.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.currentPeriod}>{monthName}</Text>
            <TouchableOpacity
              style={styles.navButton}
              onPress={handleNextMonth}
            >
              <Ionicons name="chevron-forward" size={24} color={theme.colors.secondary.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Summary Section */}
        {balance && summary && (
          <View style={styles.summarySection}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Current Balance</Text>
              <Text style={[styles.summaryAmount, { color: theme.colors.primary.accent }]}>
                ${balance.currentBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Text>
            </View>
            
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Monthly Income</Text>
              <Text style={[styles.summaryAmount, { color: theme.colors.status.success }]}>
                ${summary.totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Text>
              <View style={styles.summaryDetail}>
                <Text style={styles.summaryDetailText}>
                  {summary.entryCount} {summary.entryCount === 1 ? 'entry' : 'entries'}
                </Text>
                {summary.entryCount > 0 && (
                  <Text style={styles.summaryDetailText}>
                    • Avg: ${summary.averageIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Text>
                )}
              </View>
            </View>

            {summary.trend !== 0 && (
              <View style={styles.trendCard}>
                <Ionicons
                  name={summary.trend >= 0 ? 'trending-up' : 'trending-down'}
                  size={20}
                  color={summary.trend >= 0 ? theme.colors.status.success : theme.colors.status.error}
                />
                <Text style={[
                  styles.trendText,
                  { color: summary.trend >= 0 ? theme.colors.status.success : theme.colors.status.error }
                ]}>
                  {Math.abs(summary.trend).toFixed(1)}% vs last month
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Income List */}
        <View style={styles.incomeListSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Income Entries</Text>
            <Text style={styles.sectionSubtitle}>
              {displayEntries.length} {displayEntries.length === 1 ? 'entry' : 'entries'}
            </Text>
          </View>
          
          <FlatList
            data={displayEntries}
            renderItem={renderIncomeItem}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={renderEmptyState}
            scrollEnabled={false}
            contentContainerStyle={styles.incomeList}
          />
        </View>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* FAB - Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleAddIncome}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color={theme.colors.primary.textOnAccent} />
      </TouchableOpacity>

      {/* Initial Balance Setup Modal */}
      <Modal
        visible={showBalanceSetup}
        transparent
        animationType="fade"
        onRequestClose={() => {}}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Ionicons name="wallet" size={48} color={theme.colors.primary.accent} />
              <Text style={styles.modalTitle}>Set Initial Balance</Text>
              <Text style={styles.modalSubtitle}>
                Enter your starting balance to begin tracking your cash flow
              </Text>
            </View>
            
            <View style={styles.modalBody}>
              <Text style={styles.inputLabel}>Initial Balance</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.inputPrefix}>$</Text>
                <TextInput
                  style={styles.input}
                  value={initialBalanceInput}
                  onChangeText={setInitialBalanceInput}
                  placeholder="0.00"
                  placeholderTextColor={theme.colors.secondary.textTertiary}
                  keyboardType="decimal-pad"
                  autoFocus
                />
              </View>
            </View>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleSetInitialBalance}
            >
              <Text style={styles.modalButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Income Entry Form Modal */}
      <Modal
        visible={showIncomeForm}
        transparent
        animationType="slide"
        onRequestClose={() => setShowIncomeForm(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingEntry ? 'Edit Income' : 'Add Income'}
              </Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowIncomeForm(false)}
              >
                <Ionicons name="close" size={24} color={theme.colors.secondary.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Amount *</Text>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputPrefix}>$</Text>
                  <TextInput
                    style={styles.input}
                    value={formAmount}
                    onChangeText={setFormAmount}
                    placeholder="0.00"
                    placeholderTextColor={theme.colors.secondary.textTertiary}
                    keyboardType="decimal-pad"
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Date *</Text>
                <TextInput
                  style={styles.inputFull}
                  value={formDate}
                  onChangeText={setFormDate}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={theme.colors.secondary.textTertiary}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Description *</Text>
                <TextInput
                  style={styles.inputFull}
                  value={formDescription}
                  onChangeText={setFormDescription}
                  placeholder="e.g., Monthly salary"
                  placeholderTextColor={theme.colors.secondary.textTertiary}
                  maxLength={200}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Category *</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                  {Object.values(IncomeCategory).map((category) => (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.categoryChip,
                        formCategory === category && styles.categoryChipActive,
                      ]}
                      onPress={() => setFormCategory(category)}
                    >
                      <Text
                        style={[
                          styles.categoryChipText,
                          formCategory === category && styles.categoryChipTextActive,
                        ]}
                      >
                        {category}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalButtonSecondary}
                onPress={() => setShowIncomeForm(false)}
              >
                <Text style={styles.modalButtonSecondaryText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleSaveIncome}
              >
                <Text style={styles.modalButtonText}>
                  {editingEntry ? 'Update' : 'Save'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CashFlowScreen;