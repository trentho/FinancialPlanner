import React, { useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Alert, TextInput, TouchableOpacity } from 'react-native';
import { Expense } from '../types';

interface ExpensesListProps {
  expenses: Expense[];
  onAddExpense: (expense: Expense) => void;
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (id: string) => void;
  onViewAll?: () => void;
}

const ExpensesList: React.FC<ExpensesListProps> = ({ expenses, onAddExpense, onEditExpense, onDeleteExpense, onViewAll }) => {
  const [newExpenseName, setNewExpenseName] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);
  const [editingExpenseName, setEditingExpenseName] = useState('');
  const [editingExpenseAmount, setEditingExpenseAmount] = useState('');

  const handleEditExpense = (expense: Expense) => {
    setEditingExpenseId(expense.id);
    setEditingExpenseName(expense.name);
    setEditingExpenseAmount(expense.amount.toString());
  };

  const handleSaveEdit = () => {
    if (editingExpenseId && editingExpenseName && editingExpenseAmount) {
      const parsedAmount = parseFloat(editingExpenseAmount);
      if (!isNaN(parsedAmount) && parsedAmount > 0) {
        const updatedExpense: Expense = {
          id: editingExpenseId,
          name: editingExpenseName,
          amount: parsedAmount,
          date: new Date().toISOString().split('T')[0],
        };
        onEditExpense(updatedExpense);
        setEditingExpenseId(null);
        setEditingExpenseName('');
        setEditingExpenseAmount('');
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingExpenseId(null);
    setEditingExpenseName('');
    setEditingExpenseAmount('');
  };
  const [isInitialized, setIsInitialized] = useState(false);

  React.useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);
    }
  }, []);

  const handleAddExpense = () => {
    if (newExpenseName && newExpenseAmount) {
      const parsedAmount = parseFloat(newExpenseAmount);
      if (!isNaN(parsedAmount) && parsedAmount > 0) {
        const expense: Expense = {
          id: Date.now().toString(),
          name: newExpenseName,
          amount: parsedAmount,
          date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
        };
        onAddExpense(expense);
        setNewExpenseName('');
        setNewExpenseAmount('');
      } else {
        Alert.alert('Invalid Amount', 'Please enter a valid positive number for the expense amount.');
      }
    } else {
      Alert.alert('Missing Information', 'Please enter both expense name and amount.');
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete Expense', 'Are you sure you want to delete this expense?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', onPress: () => onDeleteExpense(id) },
    ]);
  };


  const renderExpense = ({ item }: { item: Expense }) => {
    if (editingExpenseId === item.id) {
      return (
        <View style={styles.editContainer}>
          <Text style={styles.editTitle}>Edit Expense</Text>
          <TextInput
            style={styles.editInput}
            placeholder="Expense name"
            value={editingExpenseName}
            onChangeText={setEditingExpenseName}
          />
          <View style={styles.editInputContainer}>
            <Text style={styles.dollarSign}>$</Text>
            <TextInput
              style={styles.editInputWithDollar}
              placeholder="0.00"
              value={editingExpenseAmount}
              onChangeText={setEditingExpenseAmount}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.editButtonContainer}>
            <Button title="Save" onPress={handleSaveEdit} color="#28a745" />
            <Button title="Cancel" onPress={handleCancelEdit} color="#6c757d" />
          </View>
        </View>
      );
    }

    return (
      <View style={styles.expenseItem}>
        <View style={styles.expenseInfo}>
          <Text style={styles.expenseName}>{item.name}</Text>
          <Text style={styles.expenseDate}>{item.date}</Text>
        </View>
        <Text style={styles.expenseAmount}>${item.amount.toFixed(2)}</Text>
        <View style={styles.buttonContainer}>
          <Button title="Edit" onPress={() => handleEditExpense(item)} color="#FFA500" />
          <Button title="Delete" onPress={() => handleDelete(item.id)} color="#FF6384" />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Expenses</Text>
      <View style={styles.addExpenseContainer}>
        <TextInput
          style={styles.input}
          placeholder="Expense name"
          value={newExpenseName}
          onChangeText={setNewExpenseName}
        />
        <View style={styles.inputContainer}>
          <Text style={styles.dollarSign}>$</Text>
          <TextInput
            style={styles.inputWithDollar}
            placeholder="0.00"
            value={newExpenseAmount}
            onChangeText={setNewExpenseAmount}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.addButton}>
          <Button title="Add Expense" onPress={handleAddExpense} color="#007AFF" />
        </View>
      </View>
      <View style={styles.viewAllContainer}>
        <TouchableOpacity onPress={onViewAll}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={expenses}
        renderItem={renderExpense}
        keyExtractor={(item) => item.id}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No expenses added yet</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  addExpenseContainer: {
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  dollarSign: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    paddingLeft: 12,
    paddingRight: 5,
  },
  inputWithDollar: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  input: {
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  addButton: {
    marginTop: 10,
  },
  list: {
    flex: 1,
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fafafa',
    borderRadius: 8,
    marginBottom: 5,
  },
  expenseInfo: {
    flex: 1,
  },
  expenseName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  expenseDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
    color: '#FF6384',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 5,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  editTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  editContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#FFA500',
    minHeight: 120,
  },
  editInput: {
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  editInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  editInputWithDollar: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  editButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  viewAllContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 15,
  },
  viewAllText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
});

export default ExpensesList;