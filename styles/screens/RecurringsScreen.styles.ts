import { StyleSheet } from 'react-native';
import { theme } from '../../theme/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary.background,
  },

  // Header Section
  header: {
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xxxl,
    paddingBottom: theme.spacing.lg,
    alignItems: 'center',
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.secondary.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    ...theme.typography.body2,
    color: theme.colors.secondary.textSecondary,
  },

  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: 100, // Space for FAB
  },

  // Summary Card
  summaryCard: {
    backgroundColor: theme.colors.primary.backgroundTertiary,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.secondary.borderPrimary,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
    ...theme.shadows.sm,
  },
  summaryTitle: {
    ...theme.typography.body2,
    color: theme.colors.secondary.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  summaryAmount: {
    ...theme.typography.display2,
    fontWeight: '700',
    marginBottom: theme.spacing.xl,
  },
  summaryBreakdown: {
    gap: theme.spacing.md,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryDot: {
    width: 8,
    height: 8,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.status.success,
    marginRight: theme.spacing.sm,
  },
  summaryLabel: {
    ...theme.typography.body2,
    color: theme.colors.secondary.textSecondary,
    flex: 1,
  },
  summaryValue: {
    ...theme.typography.body1Bold,
  },

  // Tabs Section
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.secondary.borderSecondary,
  },
  tab: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    position: 'relative',
  },
  tabActive: {
    // Active state handled by indicator
  },
  tabText: {
    ...theme.typography.body1Bold,
    color: theme.colors.secondary.textSecondary,
  },
  tabTextActive: {
    color: theme.colors.secondary.textPrimary,
  },
  tabIndicator: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: theme.colors.primary.accent,
    borderRadius: theme.borderRadius.xs,
  },

  // Recurring Items List
  recurringsList: {
    gap: theme.spacing.md,
  },

  // Recurring Item
  recurringItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary.backgroundTertiary,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.secondary.borderPrimary,
    padding: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    ...theme.typography.body1Bold,
    color: theme.colors.secondary.textPrimary,
    marginBottom: theme.spacing.xs / 2,
  },
  itemCategory: {
    ...theme.typography.body3,
    color: theme.colors.secondary.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  itemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  frequencyBadge: {
    backgroundColor: theme.colors.secondary.borderPrimary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs / 2,
    borderRadius: theme.borderRadius.xs,
  },
  frequencyText: {
    ...theme.typography.label3,
    color: theme.colors.secondary.textSecondary,
  },
  nextDue: {
    ...theme.typography.body3,
    color: theme.colors.secondary.textTertiary,
  },
  itemRight: {
    alignItems: 'flex-end',
    gap: theme.spacing.sm,
  },
  itemAmount: {
    ...theme.typography.body1Bold,
  },

  // Floating Action Button
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary.accent,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.lg,
  },
});