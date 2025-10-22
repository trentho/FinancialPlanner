import { StyleSheet } from 'react-native';
import { theme } from '../theme/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.primary.background,
  },
  settingsButton: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.primary.backgroundTertiary,
    borderWidth: 1,
    borderColor: theme.colors.secondary.borderPrimary,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.secondary.textPrimary,
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 32,
  },
});