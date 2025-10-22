import { StyleSheet } from 'react-native';
import { theme } from '../../theme/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary.background,
  },
  
  // Balance Section
  balanceSection: {
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xxxl,
    paddingBottom: theme.spacing.xxl,
    alignItems: 'center',
  },
  balanceLabel: {
    ...theme.typography.body2,
    color: theme.colors.secondary.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  balanceAmount: {
    ...theme.typography.display1,
    color: theme.colors.secondary.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeIcon: {
    marginRight: theme.spacing.xs,
  },
  changeText: {
    ...theme.typography.body1Bold,
  },
  
  // Stats Section
  statsSection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xxl,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.primary.backgroundTertiary,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.secondary.borderPrimary,
    padding: theme.spacing.lg,
    marginHorizontal: theme.spacing.xs / 2,
    ...theme.shadows.sm,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  statLabel: {
    ...theme.typography.body3,
    color: theme.colors.secondary.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  statValue: {
    ...theme.typography.h4,
    color: theme.colors.secondary.textPrimary,
  },
  
  // Activity Section
  activitySection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.secondary.textPrimary,
  },
  activityList: {
    backgroundColor: theme.colors.primary.backgroundTertiary,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.secondary.borderPrimary,
    overflow: 'hidden',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.secondary.borderSecondary,
  },
  transactionItemLast: {
    borderBottomWidth: 0,
  },
  transactionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionName: {
    ...theme.typography.body1Bold,
    color: theme.colors.secondary.textPrimary,
    marginBottom: theme.spacing.xs / 2,
  },
  transactionDate: {
    ...theme.typography.body3,
    color: theme.colors.secondary.textSecondary,
  },
  transactionAmount: {
    ...theme.typography.body1Bold,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.lg,
    marginTop: theme.spacing.md,
  },
  viewAllText: {
    ...theme.typography.body1Bold,
    color: theme.colors.primary.accent,
    marginRight: theme.spacing.xs,
  },
  
  // Chart Section
  chartSection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xxl,
  },
  chartPlaceholder: {
    backgroundColor: theme.colors.primary.backgroundTertiary,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.secondary.borderPrimary,
    padding: theme.spacing.xxxl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  chartPlaceholderText: {
    ...theme.typography.body2,
    color: theme.colors.secondary.textTertiary,
    marginTop: theme.spacing.md,
  },
  
  // Bottom spacing
  bottomSpacer: {
    height: theme.spacing.xxxl,
  },
});