import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BillsList from '../components/BillsList';
import { Bill } from '../types';

interface BillsScreenProps {
  bills: Bill[];
  onAddBill: (bill: Bill) => void;
  onEditBill: (bill: Bill) => void;
  onDeleteBill: (id: string) => void;
}

const BillsScreen: React.FC<BillsScreenProps> = ({ bills, onAddBill, onEditBill, onDeleteBill }) => {
  const navigation = useNavigation();

  const handleViewAll = () => {
    navigation.navigate('AllBills' as never);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <BillsList
        bills={bills}
        onAddBill={onAddBill}
        onEditBill={onEditBill}
        onDeleteBill={onDeleteBill}
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

export default BillsScreen;