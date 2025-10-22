/**
 * Comprehensive Theme and Design System Configuration
 * 
 * This file exports a complete design system for the Money Tracking App
 * inspired by modern fintech apps like Robinhood and Copilot Money.
 * 
 * Features:
 * - Dark mode as primary (black backgrounds)
 * - Neon blue (#00D9FF) as primary accent
 * - High contrast for readability
 * - Consistent spacing and sizing
 */

// ============================================================================
// COLOR PALETTE
// ============================================================================

/**
 * Primary Colors - Black backgrounds and neon blue accents
 */
export const primaryColors = {
  // Background colors
  background: '#000000',      // Pure black for main backgrounds
  backgroundSecondary: '#0A0A0A', // Slightly lighter black for cards/sections
  backgroundTertiary: '#141414',  // Even lighter for nested elements
  
  // Accent colors
  accent: '#00D9FF',          // Neon blue - primary accent
  accentLight: '#33E5FF',     // Lighter neon blue for hover states
  accentDark: '#00A8CC',      // Darker neon blue for pressed states
  
  // Text on accent
  textOnAccent: '#000000',    // Black text on neon blue backgrounds
};

/**
 * Secondary Colors - Grays for text and borders
 */
export const secondaryColors = {
  // Text colors
  textPrimary: '#FFFFFF',     // Primary text - white
  textSecondary: '#B0B0B0',   // Secondary text - medium gray
  textTertiary: '#707070',    // Tertiary text - darker gray
  textDisabled: '#505050',    // Disabled text - very dark gray
  
  // Border colors
  borderPrimary: '#2A2A2A',   // Primary borders
  borderSecondary: '#1F1F1F', // Secondary borders
  borderLight: '#3A3A3A',     // Light borders for contrast
  
  // Divider
  divider: '#1A1A1A',         // Divider lines
};

/**
 * Status Colors - Semantic meaning for financial data
 */
export const statusColors = {
  // Success/Gains - Green
  success: '#00D084',         // Bright green for gains
  successLight: '#33E5A8',    // Light green for hover
  successDark: '#00A866',     // Dark green for pressed
  
  // Error/Losses - Red
  error: '#FF3B30',           // Bright red for losses
  errorLight: '#FF6B63',      // Light red for hover
  errorDark: '#CC2E26',       // Dark red for pressed
  
  // Warning - Yellow/Orange
  warning: '#FFB800',         // Bright yellow for warnings
  warningLight: '#FFC933',    // Light yellow for hover
  warningDark: '#CC9200',     // Dark yellow for pressed
  
  // Info - Light blue
  info: '#00B4D8',            // Info blue
  infoLight: '#33C5E5',       // Light info blue
  infoDark: '#0090AA',        // Dark info blue
};

/**
 * Semantic Colors - Contextual usage
 */
export const semanticColors = {
  success: statusColors.success,
  successLight: statusColors.successLight,
  successDark: statusColors.successDark,
  
  error: statusColors.error,
  errorLight: statusColors.errorLight,
  errorDark: statusColors.errorDark,
  
  warning: statusColors.warning,
  warningLight: statusColors.warningLight,
  warningDark: statusColors.warningDark,
  
  info: statusColors.info,
  infoLight: statusColors.infoLight,
  infoDark: statusColors.infoDark,
};

// ============================================================================
// TYPOGRAPHY SYSTEM
// ============================================================================

/**
 * Font sizes - Consistent sizing hierarchy
 */
export const fontSizes = {
  // Display sizes
  display1: 48,  // Large headings
  display2: 40,  // Section headings
  
  // Heading sizes
  h1: 32,        // Page titles
  h2: 28,        // Section titles
  h3: 24,        // Subsection titles
  h4: 20,        // Card titles
  
  // Body sizes
  body1: 16,     // Primary body text
  body2: 14,     // Secondary body text
  body3: 12,     // Small body text
  
  // Label sizes
  label1: 14,    // Primary labels
  label2: 12,    // Secondary labels
  label3: 10,    // Small labels
  
  // Caption
  caption: 11,   // Captions and hints
};

/**
 * Font weights - Consistent weight hierarchy
 */
export const fontWeights = {
  thin: '100' as const,
  extralight: '200' as const,
  light: '300' as const,
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
  black: '900' as const,
};

/**
 * Typography presets - Ready-to-use text styles
 */
export const typography = {
  // Display
  display1: {
    fontSize: fontSizes.display1,
    fontWeight: fontWeights.bold,
    lineHeight: 56,
  },
  display2: {
    fontSize: fontSizes.display2,
    fontWeight: fontWeights.bold,
    lineHeight: 48,
  },
  
  // Headings
  h1: {
    fontSize: fontSizes.h1,
    fontWeight: fontWeights.bold,
    lineHeight: 40,
  },
  h2: {
    fontSize: fontSizes.h2,
    fontWeight: fontWeights.bold,
    lineHeight: 36,
  },
  h3: {
    fontSize: fontSizes.h3,
    fontWeight: fontWeights.semibold,
    lineHeight: 32,
  },
  h4: {
    fontSize: fontSizes.h4,
    fontWeight: fontWeights.semibold,
    lineHeight: 28,
  },
  
  // Body
  body1: {
    fontSize: fontSizes.body1,
    fontWeight: fontWeights.normal,
    lineHeight: 24,
  },
  body1Bold: {
    fontSize: fontSizes.body1,
    fontWeight: fontWeights.semibold,
    lineHeight: 24,
  },
  body2: {
    fontSize: fontSizes.body2,
    fontWeight: fontWeights.normal,
    lineHeight: 20,
  },
  body2Bold: {
    fontSize: fontSizes.body2,
    fontWeight: fontWeights.semibold,
    lineHeight: 20,
  },
  body3: {
    fontSize: fontSizes.body3,
    fontWeight: fontWeights.normal,
    lineHeight: 16,
  },
  
  // Labels
  label1: {
    fontSize: fontSizes.label1,
    fontWeight: fontWeights.semibold,
    lineHeight: 20,
  },
  label2: {
    fontSize: fontSizes.label2,
    fontWeight: fontWeights.semibold,
    lineHeight: 16,
  },
  label3: {
    fontSize: fontSizes.label3,
    fontWeight: fontWeights.bold,
    lineHeight: 14,
  },
  
  // Caption
  caption: {
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.normal,
    lineHeight: 16,
  },
  captionBold: {
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    lineHeight: 16,
  },
};

// ============================================================================
// SPACING SYSTEM
// ============================================================================

/**
 * Spacing scale - 8px base unit for consistent spacing
 * Follows 8px grid system for mobile design
 */
export const spacing = {
  // Base units
  xs: 4,      // 4px - minimal spacing
  sm: 8,      // 8px - small spacing
  md: 12,     // 12px - medium spacing
  lg: 16,     // 16px - large spacing
  xl: 20,     // 20px - extra large spacing
  xxl: 24,    // 24px - 2x extra large
  xxxl: 32,   // 32px - 3x extra large
  
  // Specific use cases
  padding: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
  },
  margin: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
  },
  
  // Component-specific spacing
  component: {
    paddingHorizontal: 16,  // Horizontal padding for cards/containers
    paddingVertical: 12,    // Vertical padding for cards/containers
    borderRadius: 12,       // Standard border radius
    borderRadiusLarge: 16,  // Large border radius
    borderRadiusSmall: 8,   // Small border radius
  },
};

// ============================================================================
// BORDER RADIUS SYSTEM
// ============================================================================

export const borderRadius = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

// ============================================================================
// SHADOW SYSTEM
// ============================================================================

/**
 * Shadow presets for elevation and depth
 * Note: React Native uses elevation on Android and shadow properties on iOS
 */
export const shadows = {
  // Elevation levels
  none: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
};

// ============================================================================
// COMPLETE THEME OBJECT
// ============================================================================

/**
 * Complete theme object - Use this as the main theme export
 * Can be passed to context providers or used directly throughout the app
 */
export const theme = {
  colors: {
    primary: primaryColors,
    secondary: secondaryColors,
    status: statusColors,
    semantic: semanticColors,
  },
  typography,
  spacing,
  borderRadius,
  shadows,
  
  // Convenience accessors
  get background() {
    return primaryColors.background;
  },
  get accent() {
    return primaryColors.accent;
  },
  get textPrimary() {
    return secondaryColors.textPrimary;
  },
  get textSecondary() {
    return secondaryColors.textSecondary;
  },
  get success() {
    return statusColors.success;
  },
  get error() {
    return statusColors.error;
  },
  get warning() {
    return statusColors.warning;
  },
};

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/**
 * USAGE EXAMPLES - How to use this theme throughout your app
 * 
 * 1. COLORS
 * --------
 * import { theme, primaryColors, statusColors } from './theme/colors';
 * 
 * // Using theme object
 * const backgroundColor = theme.background;
 * const accentColor = theme.accent;
 * 
 * // Using specific color systems
 * const gainColor = statusColors.success;
 * const lossColor = statusColors.error;
 * 
 * // In React Native styles
 * const styles = StyleSheet.create({
 *   container: {
 *     backgroundColor: theme.background,
 *     borderColor: theme.colors.secondary.borderPrimary,
 *   },
 *   button: {
 *     backgroundColor: theme.accent,
 *     color: theme.colors.primary.textOnAccent,
 *   },
 * });
 * 
 * 2. TYPOGRAPHY
 * ---------------
 * import { typography, fontSizes, fontWeights } from './theme/colors';
 * 
 * // Using typography presets
 * const styles = StyleSheet.create({
 *   title: typography.h1,
 *   subtitle: typography.body1Bold,
 *   caption: typography.caption,
 * });
 * 
 * // Using individual values
 * const styles = StyleSheet.create({
 *   customText: {
 *     fontSize: fontSizes.body1,
 *     fontWeight: fontWeights.semibold,
 *   },
 * });
 * 
 * 3. SPACING
 * -----------
 * import { spacing } from './theme/colors';
 * 
 * const styles = StyleSheet.create({
 *   container: {
 *     paddingHorizontal: spacing.component.paddingHorizontal,
 *     paddingVertical: spacing.component.paddingVertical,
 *     marginBottom: spacing.lg,
 *   },
 *   card: {
 *     padding: spacing.md,
 *     marginVertical: spacing.sm,
 *   },
 * });
 * 
 * 4. SHADOWS
 * -----------
 * import { shadows } from './theme/colors';
 * 
 * const styles = StyleSheet.create({
 *   card: {
 *     ...shadows.md,
 *     borderRadius: 12,
 *   },
 *   button: {
 *     ...shadows.lg,
 *   },
 * });
 * 
 * 5. COMPLETE THEME USAGE
 * -------------------------
 * import { theme } from './theme/colors';
 * 
 * // Create a theme context
 * const ThemeContext = React.createContext(theme);
 * 
 * // Use in components
 * const MyComponent = () => {
 *   const appTheme = useContext(ThemeContext);
 *   
 *   return (
 *     <View style={{
 *       backgroundColor: appTheme.background,
 *       padding: appTheme.spacing.lg,
 *     }}>
 *       <Text style={{
 *         color: appTheme.textPrimary,
 *         ...appTheme.typography.h1,
 *       }}>
 *         Title
 *       </Text>
 *     </View>
 *   );
 * };
 */

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default theme;
