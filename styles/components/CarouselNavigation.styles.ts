import { StyleSheet } from 'react-native';
import { theme } from '../../theme/colors';

export const styles = StyleSheet.create({
  container: {
    height: 64,
    backgroundColor: theme.colors.primary.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.secondary.borderPrimary,
  },
  scrollContent: {
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  itemContainer: {
    marginHorizontal: theme.spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.sm,
  },
  itemText: {
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  activeIndicator: {
    marginTop: theme.spacing.xs,
    width: 28,
    height: 3,
    backgroundColor: theme.colors.primary.accent,
    borderRadius: theme.borderRadius.xs,
  },
});