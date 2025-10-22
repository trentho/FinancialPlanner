import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/colors';
import { styles } from '../styles/screens/RecurringsScreen.styles';

/**
 * RecurringsScreen - Recurring transactions management
 * Features:
 * - Header with title, count, and monthly total
 * - Summary card showing income vs expenses breakdown
 * - Frequency filter tabs (All, Monthly, Weekly)
 * - List of recurring transaction cards with toggle switches
 * - Floating action button for adding new recurring items
 */

// Recurring transaction type
interface RecurringTransaction {
  id: string;
  name: string;
  category: string;
  amount: number;
  frequency: 'Monthly' | 'Weekly' | 'Bi-weekly' | 'Yearly';
  nextDue: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  type: 'income' | 'expense';
  isActive: boolean;
}

// Mock recurring transactions data
const INITIAL_RECURRINGS: RecurringTransaction[] = [
  // Expenses
  { id: '1', name: 'Rent', category: 'Housing', amount: -1500.00, frequency: 'Monthly', nextDue: 'Jan 1', icon: 'home-outline', iconColor: '#F72585', type: 'expense', isActive: true },
  { id: '2', name: 'Netflix', category: 'Entertainment', amount: -15.99, frequency: 'Monthly', nextDue: 'Dec 25', icon: 'tv-outline', iconColor: '#9D4EDD', type: 'expense', isActive: true },
  { id: '3', name: 'Spotify', category: 'Entertainment', amount: -9.99, frequency: 'Monthly', nextDue: 'Dec 28', icon: 'musical-notes-outline', iconColor: '#9D4EDD', type: 'expense', isActive: true },
  { id: '4', name: 'Gym Membership', category: 'Health', amount: -49.99, frequency: 'Monthly', nextDue: 'Jan 5', icon: 'fitness-outline', iconColor: '#06FFA5', type: 'expense', isActive: true },
  { id: '5', name: 'Phone Bill', category: 'Utilities', amount: -85.00, frequency: 'Monthly', nextDue: 'Dec 30', icon: 'phone-portrait-outline', iconColor: '#00B4D8', type: 'expense', isActive: true },
  { id: '6', name: 'Internet', category: 'Utilities', amount: -79.99, frequency: 'Monthly', nextDue: 'Jan 3', icon: 'wifi-outline', iconColor: '#00B4D8', type: 'expense', isActive: true },
  { id: '7', name: 'Car Insurance', category: 'Insurance', amount: -125.00, frequency: 'Monthly', nextDue: 'Jan 10', icon: 'car-outline', iconColor: '#FFB800', type: 'expense', isActive: true },
  { id: '8', name: 'Car Payment', category: 'Transportation', amount: -350.00, frequency: 'Monthly', nextDue: 'Jan 8', icon: 'car-sport-outline', iconColor: '#FFB800', type: 'expense', isActive: true },
  { id: '9', name: 'Health Insurance', category: 'Insurance', amount: -200.00, frequency: 'Monthly', nextDue: 'Jan 1', icon: 'medical-outline', iconColor: '#06FFA5', type: 'expense', isActive: true },
  { id: '10', name: 'Amazon Prime', category: 'Shopping', amount: -14.99, frequency: 'Monthly', nextDue: 'Jan 12', icon: 'bag-outline', iconColor: '#FF006E', type: 'expense', isActive: false },
  { id: '11', name: 'Cloud Storage', category: 'Technology', amount: -9.99, frequency: 'Monthly', nextDue: 'Dec 27', icon: 'cloud-outline', iconColor: '#4CC9F0', type: 'expense', isActive: true },
  { id: '12', name: 'Meal Prep Service', category: 'Food', amount: -120.00, frequency: 'Weekly', nextDue: 'Dec 24', icon: 'restaurant-outline', iconColor: '#FF6B63', type: 'expense', isActive: true },
  
  // Income
  { id: '13', name: 'Salary', category: 'Income', amount: 4500.00, frequency: 'Bi-weekly', nextDue: 'Dec 27', icon: 'wallet-outline', iconColor: '#00D084', type: 'income', isActive: true },
  { id: '14', name: 'Freelance Contract', category: 'Income', amount: 1200.00, frequency: 'Monthly', nextDue: 'Jan 1', icon: 'briefcase-outline', iconColor: '#00D9FF', type: 'income', isActive: true },
];

// Frequency filter options
const FREQUENCY_FILTERS = ['All', 'Monthly', 'Weekly'];

const RecurringsScreen: React.FC = () => {
  const [recurrings, setRecurrings] = useState<RecurringTransaction[]>(INITIAL_RECURRINGS);
  const [selectedFrequency, setSelectedFrequency] = useState('All');

  // Toggle recurring item active state
  const toggleRecurring = useCallback((id: string) => {
    setRecurrings(prev =>
      prev.map(item =>
        item.id === id ? { ...item, isActive: !item.isActive } : item
      )
    );
  }, []);

  // Event handlers wrapped in useCallback
  const handleAddRecurring = useCallback(() => {
    // Add recurring logic will be implemented
    console.log('Add recurring');
  }, []);

  const handleEditRecurring = useCallback((id: string) => {
    // Edit recurring logic will be implemented
    console.log('Edit recurring:', id);
  }, []);

  const handleDeleteRecurring = useCallback((id: string) => {
    setRecurrings(prev => prev.filter(item => item.id !== id));
  }, []);

  const handleFrequencyChange = useCallback((frequency: string) => {
    setSelectedFrequency(frequency);
  }, []);

  // Filter recurrings by frequency
  const filteredRecurrings = useMemo(() => {
    return selectedFrequency === 'All'
      ? recurrings
      : recurrings.filter(item => item.frequency === selectedFrequency);
  }, [recurrings, selectedFrequency]);

  // Calculate totals for active items
  const { monthlyIncome, monthlyExpenses, netMonthly, activeRecurrings } = useMemo(() => {
    const activeItems = recurrings.filter(item => item.isActive);
    
    const income = activeItems
      .filter(item => item.type === 'income')
      .reduce((sum, item) => {
        // Convert to monthly amount
        let monthlyAmount = item.amount;
        if (item.frequency === 'Weekly') monthlyAmount *= 4.33;
        if (item.frequency === 'Bi-weekly') monthlyAmount *= 2.17;
        if (item.frequency === 'Yearly') monthlyAmount /= 12;
        return sum + monthlyAmount;
      }, 0);

    const expenses = Math.abs(activeItems
      .filter(item => item.type === 'expense')
      .reduce((sum, item) => {
        // Convert to monthly amount
        let monthlyAmount = item.amount;
        if (item.frequency === 'Weekly') monthlyAmount *= 4.33;
        if (item.frequency === 'Bi-weekly') monthlyAmount *= 2.17;
        if (item.frequency === 'Yearly') monthlyAmount /= 12;
        return sum + monthlyAmount;
      }, 0));

    const net = income - expenses;

    return {
      monthlyIncome: income,
      monthlyExpenses: expenses,
      netMonthly: net,
      activeRecurrings: activeItems
    };
  }, [recurrings]);

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>Recurring</Text>
        <Text style={styles.subtitle}>
          {activeRecurrings.length} active recurring items
        </Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Monthly Recurring Total</Text>
          <Text style={[
            styles.summaryAmount,
            { color: netMonthly >= 0 ? theme.colors.status.success : theme.colors.status.error }
          ]}>
            {netMonthly >= 0 ? '+' : '-'}${Math.abs(netMonthly).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Text>
          
          <View style={styles.summaryBreakdown}>
            <View style={styles.summaryItem}>
              <View style={styles.summaryDot} />
              <Text style={styles.summaryLabel}>Income</Text>
              <Text style={[styles.summaryValue, { color: theme.colors.status.success }]}>
                ${monthlyIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Text>
            </View>
            
            <View style={styles.summaryItem}>
              <View style={[styles.summaryDot, { backgroundColor: theme.colors.status.error }]} />
              <Text style={styles.summaryLabel}>Expenses</Text>
              <Text style={[styles.summaryValue, { color: theme.colors.status.error }]}>
                ${monthlyExpenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Text>
            </View>
          </View>
        </View>

        {/* Frequency Tabs */}
        <View style={styles.tabsContainer}>
          {FREQUENCY_FILTERS.map((frequency) => (
              <TouchableOpacity
                key={frequency}
                style={[styles.tab, selectedFrequency === frequency && styles.tabActive]}
                onPress={() => handleFrequencyChange(frequency)}
              >
              <Text style={[
                styles.tabText,
                selectedFrequency === frequency && styles.tabTextActive
              ]}>
                {frequency}
              </Text>
              {selectedFrequency === frequency && <View style={styles.tabIndicator} />}
            </TouchableOpacity>
          ))}
        </View>

        {/* Recurring Items List */}
        <View style={styles.recurringsList}>
          {filteredRecurrings.map((item) => (
            <RecurringItem 
              key={item.id} 
              item={item} 
              onToggle={() => toggleRecurring(item.id)}
            />
          ))}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={handleAddRecurring}>
        <Ionicons name="add" size={28} color={theme.colors.primary.textOnAccent} />
      </TouchableOpacity>
    </View>
  );
};

// Recurring Item Component
interface RecurringItemProps {
  item: RecurringTransaction;
  onToggle: () => void;
}

const RecurringItem: React.FC<RecurringItemProps> = ({ item, onToggle }) => {
  const isExpense = item.type === 'expense';
  const amountColor = isExpense ? theme.colors.status.error : theme.colors.status.success;

  return (
    <View style={styles.recurringItem}>
      {/* Icon */}
      <View style={[styles.iconContainer, { backgroundColor: `${item.iconColor}20` }]}>
        <Ionicons name={item.icon} size={24} color={item.iconColor} />
      </View>

      {/* Item Details */}
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemCategory}>{item.category}</Text>
        <View style={styles.itemMeta}>
          <View style={styles.frequencyBadge}>
            <Text style={styles.frequencyText}>{item.frequency}</Text>
          </View>
          <Text style={styles.nextDue}>Next: {item.nextDue}</Text>
        </View>
      </View>

      {/* Amount and Toggle */}
      <View style={styles.itemRight}>
        <Text style={[styles.itemAmount, { color: amountColor }]}>
          {isExpense ? '-' : '+'}${Math.abs(item.amount).toFixed(2)}
        </Text>
        <Switch
          value={item.isActive}
          onValueChange={onToggle}
          trackColor={{ 
            false: theme.colors.secondary.borderPrimary, 
            true: theme.colors.primary.accent 
          }}
          thumbColor={theme.colors.secondary.textPrimary}
          ios_backgroundColor={theme.colors.secondary.borderPrimary}
        />
      </View>
    </View>
  );
};

export default RecurringsScreen;