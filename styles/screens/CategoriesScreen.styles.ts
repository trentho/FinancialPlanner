import { StyleSheet, Dimensions } from 'react-native';
import { theme } from '../../theme/colors';

const { width } = Dimensions.get('window');
const cardWidth = (width - (theme.spacing.lg * 2) - theme.spacing.md) / 2;

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
    marginBottom: theme.spacing.md,
  },
  totalAmount: {
    ...theme.typography.h2,
    color: theme.colors.primary.accent,
    fontWeight: '700',
  },

  // Tabs Section
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
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

  // Grid Section
  scrollView: {
    flex: 1,
  },
  gridContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: 100, // Space for FAB
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  // Category Card
  categoryCard: {
    width: cardWidth,
    backgroundColor: theme.colors.primary.backgroundTertiary,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.secondary.borderPrimary,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  cardLeft: {
    marginRight: theme.spacing.md / 2,
  },
  cardRight: {
    marginLeft: theme.spacing.md / 2,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  categoryName: {
    ...theme.typography.body1Bold,
    color: theme.colors.secondary.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  categoryAmount: {
    ...theme.typography.h4,
    color: theme.colors.secondary.textPrimary,
    marginBottom: theme.spacing.xs / 2,
  },
  categoryPercentage: {
    ...theme.typography.body3,
    color: theme.colors.secondary.textSecondary,
    marginBottom: theme.spacing.md,
  },

  // Progress Bar
  progressBarContainer: {
    height: 6,
    backgroundColor: theme.colors.secondary.borderSecondary,
    borderRadius: theme.borderRadius.xs,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: theme.borderRadius.xs,
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