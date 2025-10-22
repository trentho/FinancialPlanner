import { StyleSheet } from 'react-native';
import { theme } from '../../theme/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary.background,
  },

  // Search Section
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.md,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary.backgroundTertiary,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.secondary.borderPrimary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    marginRight: theme.spacing.md,
  },
  searchIcon: {
    marginRight: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...theme.typography.body1,
    color: theme.colors.secondary.textPrimary,
  },
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: theme.colors.primary.backgroundTertiary,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.secondary.borderPrimary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Period Section
  periodSection: {
    paddingBottom: theme.spacing.lg,
  },
  periodScrollContent: {
    paddingHorizontal: theme.spacing.lg,
  },
  periodTab: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    marginRight: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary.backgroundTertiary,
    borderWidth: 1,
    borderColor: theme.colors.secondary.borderPrimary,
  },
  periodTabActive: {
    backgroundColor: theme.colors.primary.accent,
    borderColor: theme.colors.primary.accent,
  },
  periodTabText: {
    ...theme.typography.body2Bold,
    color: theme.colors.secondary.textSecondary,
  },
  periodTabTextActive: {
    color: theme.colors.primary.textOnAccent,
  },

  // List Content
  listContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: 100, // Space for FAB
  },

  // Date Group
  dateGroup: {
    marginBottom: theme.spacing.xl,
  },
  dateHeader: {
    ...theme.typography.body1Bold,
    color: theme.colors.secondary.textPrimary,
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },

  // Transaction Item
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.secondary.divider,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.md,
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
  transactionCategory: {
    ...theme.typography.body3,
    color: theme.colors.secondary.textSecondary,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    ...theme.typography.body1Bold,
    marginBottom: theme.spacing.xs / 2,
  },
  transactionTime: {
    ...theme.typography.body3,
    color: theme.colors.secondary.textSecondary,
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