import React from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { Bill } from '../types';

interface AllBillsScreenProps {
  bills: Bill[];
}

const AllBillsScreen: React.FC<AllBillsScreenProps> = ({ bills }) => {
  const renderBill = ({ item }: { item: Bill }) => (
    <View style={styles.tableRow}>
      <Text style={[styles.tableCell, styles.nameCell]}>{item.name}</Text>
      <Text style={[styles.tableCell, styles.amountCell]}>${item.amount.toFixed(2)}</Text>
      <Text style={[styles.tableCell, styles.categoryCell]}>{item.category || 'N/A'}</Text>
      <Text style={[styles.tableCell, styles.frequencyCell]}>{item.frequency || 'N/A'}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>All Bills</Text>

        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderCell, styles.nameCell]}>Name</Text>
          <Text style={[styles.tableHeaderCell, styles.amountCell]}>Amount</Text>
          <Text style={[styles.tableHeaderCell, styles.categoryCell]}>Category</Text>
          <Text style={[styles.tableHeaderCell, styles.frequencyCell]}>Frequency</Text>
        </View>

        {/* Table Body */}
        <FlatList
          data={bills}
          renderItem={renderBill}
          keyExtractor={(item) => item.id}
          style={styles.table}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No bills added yet</Text>
            </View>
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
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  table: {
    flex: 1,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 5,
  },
  tableHeaderCell: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tableCell: {
    fontSize: 14,
    textAlign: 'center',
    color: '#333',
  },
  nameCell: {
    flex: 2,
    textAlign: 'left',
  },
  amountCell: {
    flex: 1.5,
  },
  categoryCell: {
    flex: 1.5,
  },
  frequencyCell: {
    flex: 1.5,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
});

export default AllBillsScreen;