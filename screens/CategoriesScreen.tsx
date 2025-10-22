import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/colors';
import { styles } from '../styles/screens/CategoriesScreen.styles';

/**
 * CategoriesScreen - Category management with spending breakdown
 * Features:
 * - Header with title and category count
 * - Toggle between Expenses and Income categories
 * - 2-column grid layout of category cards
 * - Each card shows icon, name, amount, percentage, and progress bar
 * - Floating action button for adding categories
 */

// Category type
interface Category {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  amount: number;
  percentage: number;
  color: string;
  type: 'expense' | 'income';
}

// Mock category data
const MOCK_CATEGORIES: Category[] = [
  // Expenses
  { id: '1', name: 'Groceries', icon: 'cart-outline', amount: 485.32, percentage: 18.5, color: '#00D084', type: 'expense' },
  { id: '2', name: 'Dining', icon: 'restaurant-outline', amount: 342.75, percentage: 13.1, color: '#FF6B63', type: 'expense' },
  { id: '3', name: 'Transportation', icon: 'car-outline', amount: 298.50, percentage: 11.4, color: '#FFB800', type: 'expense' },
  { id: '4', name: 'Utilities', icon: 'flash-outline', amount: 245.89, percentage: 9.4, color: '#00B4D8', type: 'expense' },
  { id: '5', name: 'Entertainment', icon: 'game-controller-outline', amount: 189.45, percentage: 7.2, color: '#9D4EDD', type: 'expense' },
  { id: '6', name: 'Shopping', icon: 'bag-outline', amount: 425.99, percentage: 16.3, color: '#FF006E', type: 'expense' },
  { id: '7', name: 'Health', icon: 'fitness-outline', amount: 156.75, percentage: 6.0, color: '#06FFA5', type: 'expense' },
  { id: '8', name: 'Education', icon: 'book-outline', amount: 125.00, percentage: 4.8, color: '#4CC9F0', type: 'expense' },
  { id: '9', name: 'Housing', icon: 'home-outline', amount: 850.00, percentage: 32.5, color: '#F72585', type: 'expense' },
  { id: '10', name: 'Other', icon: 'ellipsis-horizontal-outline', amount: 95.85, percentage: 3.7, color: '#B5B5B5', type: 'expense' },
  
  // Income
  { id: '11', name: 'Salary', icon: 'wallet-outline', amount: 4500.00, percentage: 75.0, color: '#00D084', type: 'income' },
  { id: '12', name: 'Freelance', icon: 'briefcase-outline', amount: 850.00, percentage: 14.2, color: '#00D9FF', type: 'income' },
  { id: '13', name: 'Investments', icon: 'trending-up-outline', amount: 425.50, percentage: 7.1, color: '#FFB800', type: 'income' },
  { id: '14', name: 'Gifts', icon: 'gift-outline', amount: 150.00, percentage: 2.5, color: '#FF6B63', type: 'income' },
  { id: '15', name: 'Other', icon: 'cash-outline', amount: 74.50, percentage: 1.2, color: '#B5B5B5', type: 'income' },
];

const CategoriesScreen: React.FC = () => {
  const [selectedType, setSelectedType] = useState<'expense' | 'income'>('expense');

  // Event handlers wrapped in useCallback
  const handleAddCategory = useCallback(() => {
    // Add category logic will be implemented
    console.log('Add category');
  }, []);

  const handleEditCategory = useCallback((id: string) => {
    // Edit category logic will be implemented
    console.log('Edit category:', id);
  }, []);

  const handleDeleteCategory = useCallback((id: string) => {
    // Delete category logic will be implemented
    console.log('Delete category:', id);
  }, []);

  const handleTypeChange = useCallback((type: 'expense' | 'income') => {
    setSelectedType(type);
  }, []);

  // Filter categories by type and calculate totals
  const { filteredCategories, totalAmount, categoryCount } = useMemo(() => {
    const filtered = MOCK_CATEGORIES.filter(cat => cat.type === selectedType);
    const total = filtered.reduce((sum, cat) => sum + cat.amount, 0);
    const count = filtered.length;
    
    return {
      filteredCategories: filtered,
      totalAmount: total,
      categoryCount: count
    };
  }, [selectedType]);

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>Categories</Text>
        <Text style={styles.subtitle}>
          {categoryCount} {selectedType === 'expense' ? 'Expense' : 'Income'} Categories
        </Text>
        <Text style={styles.totalAmount}>
          ${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </Text>
      </View>

      {/* Category Type Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedType === 'expense' && styles.tabActive]}
          onPress={() => handleTypeChange('expense')}
        >
          <Text style={[styles.tabText, selectedType === 'expense' && styles.tabTextActive]}>
            Expenses
          </Text>
          {selectedType === 'expense' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, selectedType === 'income' && styles.tabActive]}
          onPress={() => handleTypeChange('income')}
        >
          <Text style={[styles.tabText, selectedType === 'income' && styles.tabTextActive]}>
            Income
          </Text>
          {selectedType === 'income' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>
      </View>

      {/* Categories Grid */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.gridContainer}
        showsVerticalScrollIndicator={false}
      >
        {filteredCategories.map((category, index) => (
          <CategoryCard key={category.id} category={category} isEven={index % 2 === 0} />
        ))}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={handleAddCategory}>
        <Ionicons name="add" size={28} color={theme.colors.primary.textOnAccent} />
      </TouchableOpacity>
    </View>
  );
};

// Category Card Component
interface CategoryCardProps {
  category: Category;
  isEven: boolean;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, isEven }) => {
  return (
    <View style={[styles.categoryCard, isEven ? styles.cardLeft : styles.cardRight]}>
      {/* Icon Container */}
      <View style={[styles.iconContainer, { backgroundColor: `${category.color}20` }]}>
        <Ionicons name={category.icon} size={32} color={category.color} />
      </View>

      {/* Category Info */}
      <Text style={styles.categoryName}>{category.name}</Text>
      <Text style={styles.categoryAmount}>
        ${category.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </Text>
      <Text style={styles.categoryPercentage}>{category.percentage}% of total</Text>

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View 
          style={[
            styles.progressBarFill, 
            { 
              width: `${category.percentage}%`,
              backgroundColor: category.color 
            }
          ]} 
        />
      </View>
    </View>
  );
};

export default CategoriesScreen;