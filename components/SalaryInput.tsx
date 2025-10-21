import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

interface SalaryInputProps {
  onPaycheckChange: (paycheck: number) => void;
  initialPaycheck?: number;
}

const SalaryInput: React.FC<SalaryInputProps> = ({ onPaycheckChange, initialPaycheck = 0 }) => {
  const [paycheck, setPaycheck] = useState<string>(initialPaycheck === 0 ? '' : initialPaycheck.toString());

  const handleSubmit = () => {
    const parsedPaycheck = parseFloat(paycheck);
    if (!isNaN(parsedPaycheck)) {
      onPaycheckChange(parsedPaycheck);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Biweekly Paycheck:</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.dollarSign}>$</Text>
        <TextInput
          style={styles.inputWithDollar}
          value={paycheck}
          onChangeText={setPaycheck}
          placeholder="0.00"
          keyboardType="numeric"
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Update Paycheck" onPress={handleSubmit} color="#007AFF" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 8,
    marginBottom: 15,
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
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  buttonContainer: {
    marginTop: 10,
  },
});

export default SalaryInput;