import React, { useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Alert, TextInput, TouchableOpacity } from 'react-native';
import { Bill } from '../types';

interface BillsListProps {
  bills: Bill[];
  onAddBill: (bill: Bill) => void;
  onEditBill: (bill: Bill) => void;
  onDeleteBill: (id: string) => void;
  onViewAll?: () => void;
}

const BillsList: React.FC<BillsListProps> = ({ bills, onAddBill, onEditBill, onDeleteBill, onViewAll }) => {
  const [newBillName, setNewBillName] = useState('');
  const [newBillAmount, setNewBillAmount] = useState('');
  const [editingBillId, setEditingBillId] = useState<string | null>(null);
  const [editingBillName, setEditingBillName] = useState('');
  const [editingBillAmount, setEditingBillAmount] = useState('');

  const handleEditBill = (bill: Bill) => {
    setEditingBillId(bill.id);
    setEditingBillName(bill.name);
    setEditingBillAmount(bill.amount.toString());
  };

  const handleSaveEdit = () => {
    if (editingBillId && editingBillName && editingBillAmount) {
      const parsedAmount = parseFloat(editingBillAmount);
      if (!isNaN(parsedAmount) && parsedAmount > 0) {
        const updatedBill: Bill = {
          id: editingBillId,
          name: editingBillName,
          amount: parsedAmount,
        };
        onEditBill(updatedBill);
        setEditingBillId(null);
        setEditingBillName('');
        setEditingBillAmount('');
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingBillId(null);
    setEditingBillName('');
    setEditingBillAmount('');
  };
  const [isInitialized, setIsInitialized] = useState(false);

  React.useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);
    }
  }, []);

  const handleAddBill = () => {
    if (newBillName && newBillAmount) {
      const parsedAmount = parseFloat(newBillAmount);
      if (!isNaN(parsedAmount) && parsedAmount > 0) {
        const bill: Bill = {
          id: Date.now().toString(),
          name: newBillName,
          amount: parsedAmount,
        };
        onAddBill(bill);
        setNewBillName('');
        setNewBillAmount('');
      } else {
        Alert.alert('Invalid Amount', 'Please enter a valid positive number for the bill amount.');
      }
    } else {
      Alert.alert('Missing Information', 'Please enter both bill name and amount.');
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete Bill', 'Are you sure you want to delete this bill?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', onPress: () => onDeleteBill(id) },
    ]);
  };


  const renderBill = ({ item }: { item: Bill }) => {
    if (editingBillId === item.id) {
      return (
        <View style={styles.editContainer}>
          <Text style={styles.editTitle}>Edit Bill</Text>
          <TextInput
            style={styles.editInput}
            placeholder="Bill name"
            value={editingBillName}
            onChangeText={setEditingBillName}
          />
          <View style={styles.editInputContainer}>
            <Text style={styles.dollarSign}>$</Text>
            <TextInput
              style={styles.editInputWithDollar}
              placeholder="0.00"
              value={editingBillAmount}
              onChangeText={setEditingBillAmount}
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
      <View style={styles.billItem}>
        <Text style={styles.billName}>{item.name}</Text>
        <Text style={styles.billAmount}>${item.amount.toFixed(2)}</Text>
        <View style={styles.buttonContainer}>
          <Button title="Edit" onPress={() => handleEditBill(item)} color="#FFA500" />
          <Button title="Delete" onPress={() => handleDelete(item.id)} color="#FF6384" />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bills</Text>
      <View style={styles.addBillContainer}>
        <TextInput
          style={styles.input}
          placeholder="Bill name"
          value={newBillName}
          onChangeText={setNewBillName}
        />
        <View style={styles.inputContainer}>
          <Text style={styles.dollarSign}>$</Text>
          <TextInput
            style={styles.inputWithDollar}
            placeholder="0.00"
            value={newBillAmount}
            onChangeText={setNewBillAmount}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.addButton}>
          <Button title="Add Bill" onPress={handleAddBill} color="#007AFF" />
        </View>
      </View>
      <View style={styles.viewAllContainer}>
        <TouchableOpacity onPress={onViewAll}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={bills}
        renderItem={renderBill}
        keyExtractor={(item) => item.id}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No bills added yet</Text>
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
  addBillContainer: {
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
  billItem: {
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
  billName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  billAmount: {
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

export default BillsList;