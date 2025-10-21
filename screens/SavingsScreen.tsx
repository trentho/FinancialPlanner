import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, Alert } from 'react-native';
import SavingsGoals from '../components/SavingsGoals';
import { SavingsGoal } from '../types';

interface SavingsScreenProps {
  savingsGoals: SavingsGoal[];
  onAddSavingsGoal: (goal: SavingsGoal) => void;
  onEditSavingsGoal: (goal: SavingsGoal) => void;
  onDeleteSavingsGoal: (id: string) => void;
  onContributeToGoal: (id: string, amount: number) => void;
}

const SavingsScreen: React.FC<SavingsScreenProps> = ({
  savingsGoals,
  onAddSavingsGoal,
  onEditSavingsGoal,
  onDeleteSavingsGoal,
  onContributeToGoal,
}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <SavingsGoals
        savingsGoals={savingsGoals}
        onAddSavingsGoal={onAddSavingsGoal}
        onEditSavingsGoal={onEditSavingsGoal}
        onDeleteSavingsGoal={onDeleteSavingsGoal}
        onContributeToGoal={onContributeToGoal}
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

export default SavingsScreen;