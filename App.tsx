import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import CarouselNavigation, { NavigationItem } from './components/CarouselNavigation';
import { theme } from './theme/colors';
import { styles } from './styles/App.styles';

// Import placeholder screens
import DashboardScreen from './screens/DashboardScreen';
import TransactionsScreen from './screens/TransactionsScreen';
import CategoriesScreen from './screens/CategoriesScreen';
import RecurringsScreen from './screens/RecurringsScreen';
import CashFlowScreen from './screens/CashFlowScreen';

type RootStackParamList = {
  Dashboard: undefined;
  Transactions: undefined;
  Categories: undefined;
  Recurrings: undefined;
  'Cash Flow': undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  const navigationRef = useRef<any>(null);

  const handleNavigate = (item: NavigationItem) => {
    if (navigationRef.current) {
      navigationRef.current.navigate(item);
    }
  };

  const handleSettingsPress = () => {
    // TODO: Implement settings functionality
    console.log('Settings pressed');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary.background} />
      
      {/* Header with Settings Button and User Name */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={handleSettingsPress}
          activeOpacity={0.7}
        >
          <Ionicons name="settings-outline" size={20} color={theme.colors.secondary.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.userName}>Trent</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Carousel Navigation */}
      <CarouselNavigation onNavigate={handleNavigate} initialItem="Dashboard" />

      {/* Main Content Area */}
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: theme.colors.primary.background },
          }}
          initialRouteName="Dashboard"
        >
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="Transactions" component={TransactionsScreen} />
          <Stack.Screen name="Categories" component={CategoriesScreen} />
          <Stack.Screen name="Recurrings" component={RecurringsScreen} />
          <Stack.Screen name="Cash Flow" component={CashFlowScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

