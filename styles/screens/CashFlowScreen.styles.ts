import { StyleSheet } from 'react-native';
import { theme } from '../../theme/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary.background,
  },

  // Header Section
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xxl,
    paddingBottom: theme.spacing.lg,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.secondary.textPrimary,
    marginBottom: theme.spacing.lg,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: theme.colors.primary.backgroundTertiary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.xs,
    marginBottom: theme.spacing.md,
  },
  periodButton: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: theme.colors.primary.accent,
  },
  periodButtonText: {
    ...theme.typography.body2Bold,
    color: theme.colors.secondary.textSecondary,
  },
  periodButtonTextActive: {
    color: theme.colors.primary.textOnAccent,
  },
  currentPeriod: {
    ...theme.typography.body1,
    color: theme.colors.secondary.textSecondary,
    textAlign: 'center',
  },

  // Summary Section
  summarySection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xxl,
  },
  summaryCard: {
    backgroundColor: theme.colors.primary.backgroundTertiary,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.secondary.borderPrimary,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  summaryLabel: {
    ...theme.typography.body2,
    color: theme.colors.secondary.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  summaryAmount: {
    ...theme.typography.h2,
    marginBottom: theme.spacing.xs,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    ...theme.typography.body2Bold,
    marginLeft: theme.spacing.xs,
  },

  // Chart Section
  chartSection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xxl,
  },
  sectionHeader: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.secondary.textPrimary,
  },
  chartContainer: {
    backgroundColor: theme.colors.primary.backgroundTertiary,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.secondary.borderPrimary,
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  chart: {
    borderRadius: theme.borderRadius.md,
    marginVertical: theme.spacing.sm,
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: theme.spacing.md,
    gap: theme.spacing.xl,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: theme.spacing.sm,
  },
  legendText: {
    ...theme.typography.body2,
    color: theme.colors.secondary.textPrimary,
  },

  // Breakdown Section
  breakdownSection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xxl,
  },
  breakdownList: {
    backgroundColor: theme.colors.primary.backgroundTertiary,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.secondary.borderPrimary,
    overflow: 'hidden',
  },
  breakdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.secondary.borderSecondary,
  },
  breakdownItemLast: {
    borderBottomWidth: 0,
  },
  breakdownLeft: {
    flex: 1,
  },
  breakdownMonth: {
    ...theme.typography.body1Bold,
    color: theme.colors.secondary.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  breakdownAmounts: {
    marginTop: theme.spacing.xs,
  },
  breakdownDetail: {
    ...theme.typography.body3,
    color: theme.colors.secondary.textSecondary,
    marginBottom: theme.spacing.xs / 2,
  },
  breakdownRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  breakdownNet: {
    ...theme.typography.body1Bold,
    marginRight: theme.spacing.sm,
  },
  breakdownTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  breakdownTrendText: {
    ...theme.typography.caption,
    marginLeft: theme.spacing.xs / 2,
  },
  chevron: {
    marginLeft: theme.spacing.xs,
  },

  // Insights Section
  insightsSection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xxl,
  },
  insightsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -theme.spacing.xs / 2,
  },
  insightCard: {
    width: '48%',
    backgroundColor: theme.colors.primary.backgroundTertiary,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.secondary.borderPrimary,
    padding: theme.spacing.lg,
    marginHorizontal: '1%',
    marginBottom: theme.spacing.md,
  },
  insightIconContainer: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  insightLabel: {
    ...theme.typography.body3,
    color: theme.colors.secondary.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  insightValue: {
    ...theme.typography.h4,
    color: theme.colors.secondary.textPrimary,
  },

  // Loading state
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...theme.typography.body1,
    color: theme.colors.secondary.textSecondary,
    marginTop: theme.spacing.md,
  },

  // Month Navigation
  monthNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  navButton: {
    padding: theme.spacing.sm,
  },

  // Summary Details
  summaryDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.xs,
  },
  summaryDetailText: {
    ...theme.typography.body3,
    color: theme.colors.secondary.textSecondary,
    marginRight: theme.spacing.sm,
  },

  // Trend Card
  trendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary.backgroundTertiary,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.secondary.borderPrimary,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },

  // Income List Section
  incomeListSection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xxl,
  },
  sectionSubtitle: {
    ...theme.typography.body2,
    color: theme.colors.secondary.textSecondary,
  },
  incomeList: {
    backgroundColor: theme.colors.primary.backgroundTertiary,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.secondary.borderPrimary,
    overflow: 'hidden',
  },

  // Income Item
  incomeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.secondary.borderSecondary,
  },
  incomeItemLeft: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  incomeItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  incomeItemDate: {
    ...theme.typography.body3,
    color: theme.colors.secondary.textSecondary,
    marginRight: theme.spacing.sm,
  },
  categoryBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs / 2,
    borderRadius: theme.borderRadius.xs,
  },
  categoryBadgeText: {
    ...theme.typography.caption,
    color: theme.colors.primary.accent,
    fontWeight: '600',
  },
  incomeItemDescription: {
    ...theme.typography.body1,
    color: theme.colors.secondary.textPrimary,
  },
  incomeItemRight: {
    alignItems: 'flex-end',
  },
  incomeItemAmount: {
    ...theme.typography.body1Bold,
    color: theme.colors.status.success,
    marginBottom: theme.spacing.xs,
  },
  incomeItemActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  actionButton: {
    padding: theme.spacing.xs,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xxxl * 2,
  },
  emptyStateText: {
    ...theme.typography.body1Bold,
    color: theme.colors.secondary.textSecondary,
    marginTop: theme.spacing.lg,
  },
  emptyStateSubtext: {
    ...theme.typography.body2,
    color: theme.colors.secondary.textTertiary,
    marginTop: theme.spacing.xs,
  },

  // FAB
  fab: {
    position: 'absolute',
    bottom: theme.spacing.xxl,
    right: theme.spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary.accent,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.lg,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  modalContent: {
    backgroundColor: theme.colors.primary.backgroundSecondary,
    borderRadius: theme.borderRadius.lg,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalHeader: {
    alignItems: 'center',
    padding: theme.spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.secondary.borderPrimary,
  },
  modalTitle: {
    ...theme.typography.h3,
    color: theme.colors.secondary.textPrimary,
    marginTop: theme.spacing.md,
  },
  modalSubtitle: {
    ...theme.typography.body2,
    color: theme.colors.secondary.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
  },
  modalCloseButton: {
    position: 'absolute',
    top: theme.spacing.lg,
    right: theme.spacing.lg,
    padding: theme.spacing.xs,
  },
  modalBody: {
    padding: theme.spacing.xl,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.secondary.borderPrimary,
    gap: theme.spacing.md,
  },
  modalButton: {
    flex: 1,
    backgroundColor: theme.colors.primary.accent,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  modalButtonText: {
    ...theme.typography.body1Bold,
    color: theme.colors.primary.textOnAccent,
  },
  modalButtonSecondary: {
    flex: 1,
    backgroundColor: theme.colors.primary.backgroundTertiary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.secondary.borderPrimary,
  },
  modalButtonSecondaryText: {
    ...theme.typography.body1Bold,
    color: theme.colors.secondary.textPrimary,
  },

  // Form Styles
  formGroup: {
    marginBottom: theme.spacing.lg,
  },
  inputLabel: {
    ...theme.typography.body2Bold,
    color: theme.colors.secondary.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary.backgroundTertiary,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.secondary.borderPrimary,
    paddingHorizontal: theme.spacing.md,
  },
  inputPrefix: {
    ...theme.typography.body1Bold,
    color: theme.colors.secondary.textSecondary,
    marginRight: theme.spacing.sm,
  },
  input: {
    flex: 1,
    ...theme.typography.body1,
    color: theme.colors.secondary.textPrimary,
    paddingVertical: theme.spacing.md,
  },
  inputFull: {
    ...theme.typography.body1,
    color: theme.colors.secondary.textPrimary,
    backgroundColor: theme.colors.primary.backgroundTertiary,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.secondary.borderPrimary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
  },

  // Category Selection
  categoryScroll: {
    marginTop: theme.spacing.sm,
  },
  categoryChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary.backgroundTertiary,
    borderWidth: 1,
    borderColor: theme.colors.secondary.borderPrimary,
    marginRight: theme.spacing.sm,
  },
  categoryChipActive: {
    backgroundColor: theme.colors.primary.accent,
    borderColor: theme.colors.primary.accent,
  },
  categoryChipText: {
    ...theme.typography.body2,
    color: theme.colors.secondary.textSecondary,
  },
  categoryChipTextActive: {
    color: theme.colors.primary.textOnAccent,
    fontWeight: '600',
  },

  // Bottom spacing
  bottomSpacer: {
    height: theme.spacing.xxxl,
  },
});