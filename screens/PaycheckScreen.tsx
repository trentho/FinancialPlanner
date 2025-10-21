import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import SalaryInput from '../components/SalaryInput';

interface PaycheckScreenProps {
  paycheck: number;
  onPaycheckChange: (paycheck: number) => void;
}

const PaycheckScreen: React.FC<PaycheckScreenProps> = ({ paycheck, onPaycheckChange }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.section}>
          <SalaryInput onPaycheckChange={onPaycheckChange} initialPaycheck={paycheck} />
        </View>
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

export default PaycheckScreen;