import React, { useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Alert, TextInput } from 'react-native';
import { SavingsGoal } from '../types';

interface SavingsGoalsProps {
  savingsGoals: SavingsGoal[];
  onAddSavingsGoal: (goal: SavingsGoal) => void;
  onEditSavingsGoal: (goal: SavingsGoal) => void;
  onDeleteSavingsGoal: (id: string) => void;
  onContributeToGoal: (id: string, amount: number) => void;
}

const SavingsGoals: React.FC<SavingsGoalsProps> = ({
  savingsGoals,
  onAddSavingsGoal,
  onEditSavingsGoal,
  onDeleteSavingsGoal,
  onContributeToGoal,
}) => {
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState('');
  const [contributionAmount, setContributionAmount] = useState('');
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [editingGoalName, setEditingGoalName] = useState('');
  const [editingGoalTarget, setEditingGoalTarget] = useState('');
  const [editingGoalCurrent, setEditingGoalCurrent] = useState('');

  const handleEditGoal = (goal: SavingsGoal) => {
    setEditingGoalId(goal.id);
    setEditingGoalName(goal.name);
    setEditingGoalCurrent(goal.currentAmount.toString());
    setEditingGoalTarget(goal.targetAmount.toString());
  };

  const handleSaveEdit = () => {
    if (editingGoalId && editingGoalName && editingGoalTarget && editingGoalCurrent) {
      const parsedTarget = parseFloat(editingGoalTarget);
      const parsedCurrent = parseFloat(editingGoalCurrent);
      if (!isNaN(parsedTarget) && parsedTarget > 0 && !isNaN(parsedCurrent) && parsedCurrent >= 0) {
        const updatedGoal: SavingsGoal = {
          id: editingGoalId,
          name: editingGoalName,
          targetAmount: parsedTarget,
          currentAmount: parsedCurrent,
        };
        onEditSavingsGoal(updatedGoal);
        setEditingGoalId(null);
        setEditingGoalName('');
        setEditingGoalTarget('');
        setEditingGoalCurrent('');
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingGoalId(null);
    setEditingGoalName('');
    setEditingGoalTarget('');
    setEditingGoalCurrent('');
  };
  const [isInitialized, setIsInitialized] = useState(false);

  React.useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);
    }
  }, []);

  const handleAddGoal = () => {
    if (newGoalName && newGoalTarget) {
      const parsedTarget = parseFloat(newGoalTarget);
      if (!isNaN(parsedTarget) && parsedTarget > 0) {
        const goal: SavingsGoal = {
          id: Date.now().toString(),
          name: newGoalName,
          targetAmount: parsedTarget,
          currentAmount: 0,
        };
        onAddSavingsGoal(goal);
        setNewGoalName('');
        setNewGoalTarget('');
      } else {
        Alert.alert('Invalid Target', 'Please enter a valid positive number for the target amount.');
      }
    } else {
      Alert.alert('Missing Information', 'Please enter both goal name and target amount.');
    }
  };

  const handleContribute = (goalId: string) => {
    if (contributionAmount) {
      const parsedAmount = parseFloat(contributionAmount);
      if (!isNaN(parsedAmount) && parsedAmount > 0) {
        onContributeToGoal(goalId, parsedAmount);
        setContributionAmount('');
        setSelectedGoalId(null);
      } else {
        Alert.alert('Invalid Amount', 'Please enter a valid positive number.');
      }
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete Goal', 'Are you sure you want to delete this savings goal?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', onPress: () => onDeleteSavingsGoal(id) },
    ]);
  };


  const renderGoal = ({ item }: { item: SavingsGoal }) => {
    const progress = item.currentAmount / item.targetAmount;
    const remaining = item.targetAmount - item.currentAmount;

    if (editingGoalId === item.id) {
      return (
        <View style={styles.editContainer}>
          <Text style={styles.editTitle}>Edit Savings Goal</Text>
          <TextInput
            style={styles.input}
            placeholder="Goal name"
            value={editingGoalName}
            onChangeText={setEditingGoalName}
          />
          <View style={styles.inputContainer}>
            <Text style={styles.dollarSign}>$</Text>
            <TextInput
              style={styles.inputWithDollar}
              placeholder="Current amount"
              value={editingGoalCurrent}
              onChangeText={setEditingGoalCurrent}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.dollarSign}>$</Text>
            <TextInput
              style={styles.inputWithDollar}
              placeholder="Target amount"
              value={editingGoalTarget}
              onChangeText={setEditingGoalTarget}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button title="Save" onPress={handleSaveEdit} color="#28a745" />
            <Button title="Cancel" onPress={handleCancelEdit} color="#6c757d" />
          </View>
        </View>
      );
    }

    return (
      <View style={styles.goalItem}>
        <Text style={styles.goalName}>{item.name}</Text>
        <Text style={styles.goalAmount}>
          ${item.currentAmount.toFixed(2)} / ${item.targetAmount.toFixed(2)}
        </Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${Math.min(progress * 100, 100)}%` }]} />
        </View>
        <Text style={styles.remainingText}>${remaining.toFixed(2)} remaining</Text>

        {selectedGoalId === item.id ? (
          <View style={styles.contributionContainer}>
            <View style={styles.contributionInputContainer}>
              <Text style={styles.dollarSign}>$</Text>
              <TextInput
                style={styles.contributionInputWithDollar}
                placeholder="0.00"
                value={contributionAmount}
                onChangeText={setContributionAmount}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.buttonContainer}>
              <Button title="Contribute" onPress={() => handleContribute(item.id)} color="#28a745" />
              <Button title="Cancel" onPress={() => setSelectedGoalId(null)} color="#6c757d" />
            </View>
          </View>
        ) : (
          <View style={styles.buttonContainer}>
            <Button title="Contribute" onPress={() => setSelectedGoalId(item.id)} color="#28a745" />
            <Button title="Edit" onPress={() => handleEditGoal(item)} color="#FFA500" />
            <Button title="Delete" onPress={() => handleDelete(item.id)} color="#FF6384" />
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Savings Goals</Text>
      <View style={styles.addGoalContainer}>
        <TextInput
          style={styles.input}
          placeholder="Goal name"
          value={newGoalName}
          onChangeText={setNewGoalName}
        />
        <View style={styles.inputContainer}>
          <Text style={styles.dollarSign}>$</Text>
          <TextInput
            style={styles.inputWithDollar}
            placeholder="0.00"
            value={newGoalTarget}
            onChangeText={setNewGoalTarget}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.addButton}>
          <Button title="Add Goal" onPress={handleAddGoal} color="#007AFF" />
        </View>
      </View>
      <FlatList
        data={savingsGoals}
        renderItem={renderGoal}
        keyExtractor={(item) => item.id}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No savings goals added yet</Text>
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
  addGoalContainer: {
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
  goalItem: {
    backgroundColor: '#fafafa',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    minHeight: 80,
  },
  goalName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  goalAmount: {
    fontSize: 16,
    marginBottom: 10,
    color: '#28a745',
  },
  progressBar: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginBottom: 5,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#28a745',
    borderRadius: 5,
  },
  remainingText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  contributionContainer: {
    marginTop: 10,
  },
  contributionInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  contributionInputWithDollar: {
    flex: 1,
    padding: 8,
    fontSize: 16,
  },
  contributionInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
    marginBottom: 10,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
});

export default SavingsGoals;