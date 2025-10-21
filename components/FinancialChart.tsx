import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { Bill, SavingsGoal, Expense } from '../types';

interface FinancialChartProps {
  salary: number;
  bills: Bill[];
  remainingMoney: number;
  savingsGoals?: SavingsGoal[];
  expenses?: Expense[];
}

const FinancialChart: React.FC<FinancialChartProps> = ({ salary, bills, remainingMoney, savingsGoals = [], expenses = [] }) => {
  const totalBills = bills.reduce((sum, bill) => sum + bill.amount, 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalSavings = savingsGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const availableForSavings = Math.max(remainingMoney - totalSavings - totalExpenses, 0);

  const data = totalBills > 0 || totalExpenses > 0 || remainingMoney > 0 ? [
    {
      name: 'Bills',
      amount: totalBills,
      color: '#FF6384',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: 'Expenses',
      amount: totalExpenses,
      color: '#FFA500',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: 'Savings',
      amount: totalSavings,
      color: '#28a745',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: 'Available',
      amount: availableForSavings,
      color: '#36A2EB',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
  ] : [];

  const chartConfig = {
    backgroundGradientFrom: '#1E2923',
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: '#08130D',
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };

  return (
    <View style={styles.container}>
      {data.length > 0 ? (
        <View style={styles.chartContainer}>
          <PieChart
            data={data}
            width={Dimensions.get('window').width - 40}
            height={220}
            chartConfig={chartConfig}
            accessor="amount"
            backgroundColor="transparent"
            paddingLeft="15"
            hasLegend={false}
          />
        </View>
      ) : (
        <Text style={styles.noDataText}>Add your paycheck and bills to see the chart</Text>
      )}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#FF6384' }]} />
          <Text style={styles.legendText}>Bills: ${totalBills.toFixed(2)}</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#FFA500' }]} />
          <Text style={styles.legendText}>Expenses: ${totalExpenses.toFixed(2)}</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#28a745' }]} />
          <Text style={styles.legendText}>Savings: ${totalSavings.toFixed(2)}</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#36A2EB' }]} />
          <Text style={styles.legendText}>Available: ${availableForSavings.toFixed(2)}</Text>
        </View>
      </View>
      <View style={styles.summary}>
        <Text style={styles.summaryText}>Total Paycheck: ${salary.toFixed(2)}</Text>
        <Text style={styles.summaryText}>Total Bills: ${totalBills.toFixed(2)}</Text>
        <Text style={styles.summaryText}>Total Expenses: ${totalExpenses.toFixed(2)}</Text>
        <Text style={styles.summaryText}>Total Savings: ${totalSavings.toFixed(2)}</Text>
        <Text style={[styles.summaryText, availableForSavings >= 0 ? styles.positiveRemaining : styles.negativeRemaining]}>
          Available for Savings: ${availableForSavings.toFixed(2)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 0,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  summary: {
    marginTop: 20,
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    padding: 15,
    borderRadius: 10,
    width: '100%',
  },
  summaryText: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  positiveRemaining: {
    color: '#36A2EB',
  },
  negativeRemaining: {
    color: '#FF6384',
  },
  noDataText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginVertical: 20,
  },
  legend: {
    marginTop: 20,
    width: '100%',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#333',
  },
  chartContainer: {
    alignItems: 'center',
  },
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centeredChart: {
    alignSelf: 'center',
  },
});

export default FinancialChart;