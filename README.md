# Financial Planner App

A comprehensive financial planning application built with React Native and Expo, designed to help users manage their personal finances effectively.

## 🚀 Features

### Core Functionality
- **Dashboard Overview**: Comprehensive financial dashboard with charts and summaries
- **Paycheck Management**: Input and track biweekly paycheck amounts
- **Bills Management**: Add, edit, delete, and track recurring bills
- **Expenses Tracking**: Monitor day-to-day expenses separate from bills
- **Savings Goals**: Set and track progress toward savings targets
- **Transaction History**: View all financial transactions in a sortable table

### Visual Analytics
- **Pie Chart**: Visual breakdown of income vs. expenses vs. savings
- **Spending Trends**: Line graph showing spending patterns over time
- **Financial Summary**: Real-time calculations of remaining funds

### Data Persistence
- **Local Storage**: All data persists between app sessions using AsyncStorage
- **Cross-Platform**: Works on iOS, Android, and Web
- **Automatic Saving**: Data saves automatically when modified

### User Experience
- **Intuitive Navigation**: Bottom tab navigation with stack navigators
- **Responsive Design**: Optimized for both mobile and web platforms
- **Real-time Updates**: Dashboard updates immediately as you add/modify data
- **Clean UI**: Modern, card-based design with consistent styling

## 🛠️ Technology Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: React Navigation (Stack + Bottom Tabs)
- **Charts**: react-native-chart-kit with react-native-svg
- **Storage**: @react-native-async-storage/async-storage
- **Icons**: @expo/vector-icons (Ionicons)
- **Styling**: React Native StyleSheet

## 📱 Screenshots

### Dashboard
- Financial overview with pie chart
- Recent transactions list
- Quick access to bills and expenses

### Bills Management
- Add/edit/delete recurring bills
- View all bills in table format
- Automatic calculations

### Expenses Tracking
- Track daily expenses
- Separate from bills for better categorization
- Full transaction history

### Savings Goals
- Set savings targets
- Track progress with visual indicators
- Contribute to goals

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or later)
- npm or yarn
- Expo CLI: `npm install -g @expo/cli`
- For iOS: Xcode (macOS only)
- For Android: Android Studio

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/trentho/FinancialPlanner.git
   cd FinancialPlanner
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   # For web
   npm run web

   # For iOS simulator
   npm run ios

   # For Android emulator
   npm run android

   # For all platforms
   npx expo start
   ```

4. **Open the app**
   - Web: Open browser to the provided URL
   - Mobile: Scan QR code with Expo Go app

## 📂 Project Structure

```
FinancialPlanner/
├── components/           # Reusable UI components
│   ├── BillsList.tsx    # Bills management component
│   ├── ExpensesList.tsx # Expenses management component
│   ├── FinancialChart.tsx # Pie chart component
│   ├── RecentTransactions.tsx # Transaction list component
│   ├── SalaryInput.tsx  # Paycheck input component
│   ├── SavingsGoals.tsx # Savings goals component
│   └── SpendingTrends.tsx # Line chart component
├── screens/             # App screens
│   ├── HomeScreen.tsx   # Dashboard screen
│   ├── BillsScreen.tsx  # Bills management screen
│   ├── ExpensesScreen.tsx # Expenses management screen
│   ├── SavingsScreen.tsx # Savings goals screen
│   ├── PaycheckScreen.tsx # Paycheck input screen
│   ├── TransactionsScreen.tsx # Full transaction history
│   ├── AllBillsScreen.tsx # Bills table view
│   └── AllExpensesScreen.tsx # Expenses table view
├── types/               # TypeScript type definitions
│   └── index.ts         # All interface definitions
├── utils/               # Utility functions
│   └── storage.ts       # AsyncStorage functions
├── App.tsx              # Main app component with navigation
├── app.json             # Expo configuration
├── package.json         # Dependencies and scripts
└── README.md            # This file
```

## 🔧 Key Components

### Navigation Structure
- **Bottom Tabs**: Dashboard, Bills, Expenses, Savings
- **Stack Navigators**: Nested navigation for detailed views
- **Header Styling**: Consistent blue headers with back buttons

### Data Management
- **State Management**: React hooks for local state
- **Persistence**: AsyncStorage for cross-session data
- **Type Safety**: Full TypeScript implementation

### UI Components
- **Charts**: Interactive pie and line charts
- **Forms**: Input validation and error handling
- **Lists**: Scrollable lists with add/edit/delete functionality
- **Tables**: Sortable transaction tables

## 🎯 Usage Guide

### Getting Started
1. **Set Your Paycheck**: Go to the Dashboard and enter your biweekly income
2. **Add Bills**: Use the Bills tab to add recurring expenses
3. **Track Expenses**: Use the Expenses tab for day-to-day spending
4. **Set Goals**: Create savings goals in the Savings tab

### Dashboard Features
- **Financial Overview**: See your complete financial picture
- **Quick Actions**: Access recent bills and expenses
- **Visual Analytics**: Charts showing spending breakdown

### Managing Data
- **Add Items**: Use the "+" buttons on each screen
- **Edit Items**: Tap the "Edit" button on list items
- **Delete Items**: Use the "Delete" button with confirmation
- **View All**: Use "View All" buttons for table views

## 🔒 Data Privacy

- **Local Storage**: All data is stored locally on your device
- **No Cloud Sync**: No data is sent to external servers
- **Privacy First**: Your financial information stays on your device

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## 🙏 Acknowledgments

- Built with [Expo](https://expo.dev/)
- Charts powered by [react-native-chart-kit](https://github.com/indiespirit/react-native-chart-kit)
- Icons from [Ionicons](https://ionic.io/ionicons)
- Navigation by [React Navigation](https://reactnavigation.org/)
