/* ============================================
   MUI Theme Configuration — Icon Commerce College
   Deep Navy + Gold brand system.
   Single source of truth: prompts/00-DESIGN-SYSTEM.md (§2–4).
   Mirrors the tokens defined in src/styles/variables.css.
   ============================================ */

import { createTheme, alpha } from '@mui/material/styles';

// Color palette. Matches the tokens in src/styles/variables.css.
const colors = {
  // Deep Navy — structure, headings, primary surfaces.
  primary: {
    main: '#1A2A52',
    light: '#2C3E6B',
    dark: '#111d3a',
    contrastText: '#FFFFFF',
  },
  // Gold — emphasis only (eyebrows, underlines, icon chips, dividers).
  secondary: {
    main: '#C8A04D',
    light: '#D8B871',
    dark: '#A8823A',
    contrastText: '#1A2A52',
  },
  // Warm Red — the single primary CTA per view ("Apply Now"/"Enquire Now").
  accent: {
    main: '#E0301E',
    light: '#F0584A',
    dark: '#B91E10',
    contrastText: '#FFFFFF',
    50: '#FDEAE8',
    100: '#F9C7C2',
    200: '#F39C92',
    300: '#ED7163',
    400: '#F0584A',
    500: '#E0301E',
    600: '#B91E10',
    700: '#A52015',
    800: '#861910',
    900: '#66120B',
  },
  // Legacy alias — components reference `palette.orange.*` for CTAs.
  orange: {
    main: '#E0301E',
    light: '#F0584A',
    dark: '#B91E10',
    50: '#FDEAE8',
    100: '#F9C7C2',
    200: '#F39C92',
    300: '#ED7163',
    400: '#F0584A',
    500: '#E0301E',
    600: '#B91E10',
    700: '#A52015',
    800: '#861910',
    900: '#66120B',
  },
  navy: {
    main: '#1A2A52',
    light: '#2C3E6B',
    dark: '#111d3a',
    50: '#EAEEF6',
    100: '#CBD3E5',
    200: '#A6B2D0',
    300: '#7E8DB6',
    400: '#5E6F9D',
    500: '#3E5184',
    600: '#2C3E6B',
    700: '#1A2A52',
    800: '#111d3a',
    900: '#0A1226',
  },
  // Gold scale — accents, dividers, badges.
  gold: {
    main: '#C8A04D',
    light: '#D8B871',
    dark: '#A8823A',
    soft: '#F3E9D2',
    50: '#FBF6EA',
    100: '#F3E9D2',
    200: '#E6D2A6',
    300: '#D8B871',
    400: '#CFAC5E',
    500: '#C8A04D',
    600: '#A8823A',
    700: '#8A6A2F',
    800: '#6C5325',
    900: '#4E3C1B',
  },
  success: {
    main: '#1E8E5A',
    light: '#4FB07F',
    dark: '#13683F',
    contrastText: '#FFFFFF',
  },
  warning: {
    main: '#E0301E',
    light: '#F0584A',
    dark: '#B91E10',
    contrastText: '#FFFFFF',
  },
  // CTA / error share the warm-red channel per the design system.
  error: {
    main: '#E0301E',
    light: '#F0584A',
    dark: '#B91E10',
    contrastText: '#FFFFFF',
  },
  info: {
    main: '#2563EB',
    light: '#5B86F0',
    dark: '#1B4BC0',
    contrastText: '#FFFFFF',
  },
  grey: {
    50: '#FAFBFD',
    100: '#F7F8FB',
    200: '#EEF1F6',
    300: '#E6E9F0',
    400: '#B5BECD',
    500: '#8E9BAD',
    600: '#5B6678',
    700: '#46505F',
    800: '#2E3744',
    900: '#14233D',
  },
  background: {
    default: '#F7F8FB',
    paper: '#FFFFFF',
    dark: '#1A2A52',
    light: '#EAEEF6',
  },
  text: {
    primary: '#14233D',
    secondary: '#5B6678',
    disabled: '#8E9BAD',
    dark: '#14233D',
    light: '#FFFFFF',
  },
  iconColors: {
    gold: '#C8A04D',
    green: '#1E8E5A',
    purple: '#6B3FA0',
    orange: '#E0301E',
    pink: '#E0301E',
    red: '#E0301E',
    teal: '#1A2A52',
    blue: '#1A2A52',
  },
  cardBg: {
    yellow: '#F3E9D2',
    green: '#E5F5EC',
    pink: '#FCE4E8',
    purple: '#EFE7F7',
    orange: '#FCEEEB',
    blue: '#EAEEF6',
  },
};

// Breakpoints matching CSS variables
const breakpoints = {
  values: {
    xs: 0,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    xxl: 1440,
  },
};

// Typography configuration
const typography = {
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif",
  fontFamilyHeading: "'Poppins', sans-serif",
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightSemiBold: 600,
  fontWeightBold: 700,
  fontWeightExtraBold: 800,
  h1: {
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 700,
    fontSize: 'clamp(2rem, 4vw, 3.25rem)',
    lineHeight: 1.15,
    letterSpacing: '-0.02em',
    color: colors.primary.main,
  },
  h2: {
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 700,
    fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
    lineHeight: 1.2,
    letterSpacing: '-0.02em',
    color: colors.primary.main,
  },
  h3: {
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 600,
    fontSize: 'clamp(1.25rem, 2vw, 1.6rem)',
    lineHeight: 1.25,
    color: colors.primary.main,
  },
  h4: {
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 600,
    fontSize: 'clamp(1.15rem, 1.5vw, 1.4rem)',
    lineHeight: 1.3,
    color: colors.primary.main,
  },
  h5: {
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 600,
    fontSize: 'clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem)',
    lineHeight: 1.3,
    color: colors.primary.main,
  },
  h6: {
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 600,
    fontSize: 'clamp(1.1rem, 1rem + 0.5vw, 1.25rem)',
    lineHeight: 1.4,
    color: colors.primary.main,
  },
  subtitle1: {
    fontFamily: "'Inter', sans-serif",
    fontWeight: 500,
    fontSize: '1.125rem',
    lineHeight: 1.5,
    color: colors.text.secondary,
  },
  subtitle2: {
    fontFamily: "'Inter', sans-serif",
    fontWeight: 500,
    fontSize: '0.875rem',
    lineHeight: 1.5,
    color: colors.text.secondary,
  },
  body1: {
    fontFamily: "'Inter', sans-serif",
    fontWeight: 400,
    fontSize: '1rem',
    lineHeight: 1.7,
    color: colors.text.primary,
  },
  body2: {
    fontFamily: "'Inter', sans-serif",
    fontWeight: 400,
    fontSize: '0.875rem',
    lineHeight: 1.5,
    color: colors.text.secondary,
  },
  button: {
    fontFamily: "'Inter', sans-serif",
    fontWeight: 600,
    fontSize: '0.9375rem',
    lineHeight: 1,
    textTransform: 'none',
    letterSpacing: '0.025em',
  },
  caption: {
    fontFamily: "'Inter', sans-serif",
    fontWeight: 400,
    fontSize: '0.75rem',
    lineHeight: 1.5,
    color: colors.text.secondary,
  },
  // Section "eyebrow" label — uppercase, gold, wide tracking (§3).
  overline: {
    fontFamily: "'Inter', sans-serif",
    fontWeight: 600,
    fontSize: '0.8rem',
    lineHeight: 1.5,
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    color: colors.secondary.main,
  },
};

// Shadows configuration — design-system §4 scale on the low indices
// (sm: 0 2px 8px / .06, md: 0 8px 30px / .10, lg: 0 20px 50px / .16).
const shadows = [
  'none',
  '0 2px 8px rgba(20, 35, 61, 0.06)',
  '0 2px 8px rgba(20, 35, 61, 0.06)',
  '0 4px 16px rgba(20, 35, 61, 0.08)',
  '0 8px 30px rgba(20, 35, 61, 0.10)',
  '0 8px 30px rgba(20, 35, 61, 0.10)',
  '0 12px 40px rgba(20, 35, 61, 0.12)',
  '0 16px 44px rgba(20, 35, 61, 0.14)',
  '0 20px 50px rgba(20, 35, 61, 0.16)',
  '0 20px 50px rgba(20, 35, 61, 0.16)',
  '0 12px 40px rgba(0, 0, 0, 0.12)',
  '0 12px 48px rgba(0, 0, 0, 0.15)',
  '0 16px 56px rgba(0, 0, 0, 0.15)',
  '0 16px 64px rgba(0, 0, 0, 0.18)',
  '0 20px 72px rgba(0, 0, 0, 0.18)',
  '0 20px 80px rgba(0, 0, 0, 0.2)',
  '0 24px 88px rgba(0, 0, 0, 0.2)',
  '0 24px 96px rgba(0, 0, 0, 0.22)',
  '0 28px 104px rgba(0, 0, 0, 0.22)',
  '0 28px 112px rgba(0, 0, 0, 0.24)',
  '0 32px 120px rgba(0, 0, 0, 0.24)',
  '0 32px 128px rgba(0, 0, 0, 0.26)',
  '0 36px 136px rgba(0, 0, 0, 0.26)',
  '0 36px 144px rgba(0, 0, 0, 0.28)',
  '0 40px 152px rgba(0, 0, 0, 0.28)',
];

// Warm-red glow for CTA buttons and highlights.
// Legacy exports kept as `orangeShadow*`/`amberShadow*` so existing imports work.
const ctaShadow = '0 4px 14px rgba(224, 48, 30, 0.35)';
const ctaShadowHover = '0 6px 20px rgba(224, 48, 30, 0.45)';
const orangeShadow = ctaShadow;
const orangeShadowHover = ctaShadowHover;
const amberShadow = ctaShadow;
const amberShadowHover = ctaShadowHover;

// Create theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: colors.primary,
    secondary: colors.secondary,
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    info: colors.info,
    grey: colors.grey,
    background: colors.background,
    text: colors.text,
    accent: colors.accent,
    orange: colors.orange,
    navy: colors.navy,
    gold: colors.gold,
    iconColors: colors.iconColors,
    cardBg: colors.cardBg,
    divider: colors.grey[300],
    action: {
      active: colors.primary.main,
      hover: alpha(colors.primary.main, 0.06),
      selected: alpha(colors.primary.main, 0.12),
      disabled: colors.grey[400],
      disabledBackground: colors.grey[200],
      focus: alpha(colors.primary.main, 0.12),
    },
  },
  breakpoints,
  typography,
  shadows,
  shape: {
    borderRadius: 10,
  },
  spacing: 8,
  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
      spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
  },
  zIndex: {
    mobileStepper: 100,
    fab: 105,
    speedDial: 105,
    appBar: 200,
    drawer: 400,
    modal: 600,
    snackbar: 800,
    tooltip: 900,
  },
  components: {
    // Global CSS Baseline
    MuiCssBaseline: {
      styleOverrides: {
        '*': {
          boxSizing: 'border-box',
          margin: 0,
          padding: 0,
        },
        html: {
          scrollBehavior: 'smooth',
          WebkitTextSizeAdjust: '100%',
        },
        body: {
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          overflowX: 'hidden',
        },
        '::selection': {
          backgroundColor: colors.primary.main,
          color: '#FFFFFF',
        },
        '::-webkit-scrollbar': {
          width: 8,
          height: 8,
        },
        '::-webkit-scrollbar-track': {
          background: colors.grey[200],
          borderRadius: 4,
        },
        '::-webkit-scrollbar-thumb': {
          background: colors.primary.main,
          borderRadius: 4,
          '&:hover': {
            background: colors.primary.dark,
          },
        },
      },
    },
    // Button Component
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '12px 24px',
          fontWeight: 600,
          fontSize: '0.9375rem',
          textTransform: 'none',
          transition: 'all 0.25s ease',
          '&:focus-visible': {
            outline: `2px solid ${colors.gold.main}`,
            outlineOffset: 2,
          },
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: shadows[4],
            transform: 'translateY(-2px)',
          },
        },
        // Navy = structure. Primary buttons are Deep Navy.
        containedPrimary: {
          backgroundColor: colors.primary.main,
          color: colors.primary.contrastText,
          '&:hover': {
            backgroundColor: colors.primary.light,
            transform: 'translateY(-2px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        // Gold = emphasis. Use sparingly.
        containedSecondary: {
          backgroundColor: colors.secondary.main,
          color: colors.secondary.contrastText,
          '&:hover': {
            backgroundColor: colors.secondary.dark,
          },
        },
        // Warm Red CTA — the single primary action per view ("Apply Now").
        containedError: {
          background: `linear-gradient(135deg, ${colors.accent.main} 0%, ${colors.accent.light} 100%)`,
          color: colors.accent.contrastText,
          boxShadow: ctaShadow,
          '&:hover': {
            background: `linear-gradient(135deg, ${colors.accent.light} 0%, ${colors.accent.main} 100%)`,
            boxShadow: ctaShadowHover,
            transform: 'translateY(-2px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
          },
        },
        outlinedPrimary: {
          borderColor: colors.primary.main,
          color: colors.primary.main,
          '&:hover': {
            backgroundColor: alpha(colors.primary.main, 0.08),
            borderColor: colors.primary.main,
          },
        },
        outlinedSecondary: {
          borderColor: colors.secondary.main,
          color: colors.secondary.main,
          '&:hover': {
            backgroundColor: alpha(colors.secondary.main, 0.08),
            borderColor: colors.secondary.main,
          },
        },
        text: {
          '&:hover': {
            backgroundColor: alpha(colors.primary.main, 0.08),
          },
        },
        sizeLarge: {
          padding: '16px 32px',
          fontSize: '1rem',
        },
        sizeSmall: {
          padding: '8px 16px',
          fontSize: '0.8125rem',
        },
      },
    },
    // Icon Button
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.25s ease',
          '&:hover': {
            backgroundColor: alpha(colors.primary.main, 0.1),
          },
        },
      },
    },
    // Card Component
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: shadows[1], // shadow-sm
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: shadows[4], // shadow-md on lift
            transform: 'translateY(-4px)',
          },
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 24,
          '&:last-child': {
            paddingBottom: 24,
          },
        },
      },
    },
    // Paper Component
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        rounded: {
          borderRadius: 16,
        },
        elevation1: {
          boxShadow: shadows[2],
        },
        elevation2: {
          boxShadow: shadows[4],
        },
        elevation3: {
          boxShadow: shadows[6],
        },
      },
    },
    // AppBar Component
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
          backgroundImage: 'none',
        },
        colorPrimary: {
          backgroundColor: 'transparent',
        },
      },
    },
    // Toolbar Component
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: 80,
          '@media (min-width: 600px)': {
            minHeight: 80,
          },
        },
      },
    },
    // TextField/Input Components
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        fullWidth: true,
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            transition: 'all 0.25s ease',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: colors.primary.main,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: colors.primary.main,
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.primary.main,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.primary.main,
          },
        },
        notchedOutline: {
          borderColor: colors.grey[300],
          transition: 'border-color 0.25s ease',
        },
        input: {
          padding: '14px 16px',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: colors.text.secondary,
          '&.Mui-focused': {
            color: colors.primary.main,
          },
        },
      },
    },
    // Select Component
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
        select: {
          '&:focus': {
            backgroundColor: 'transparent',
          },
        },
      },
    },
    // Menu Component
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
          boxShadow: shadows[8],
          marginTop: 8,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          padding: '12px 16px',
          transition: 'background-color 0.2s ease',
          '&:hover': {
            backgroundColor: alpha(colors.primary.main, 0.08),
          },
          '&.Mui-selected': {
            backgroundColor: alpha(colors.primary.main, 0.12),
            '&:hover': {
              backgroundColor: alpha(colors.primary.main, 0.16),
            },
          },
        },
      },
    },
    // Chip Component
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          fontWeight: 500,
          transition: 'all 0.2s ease',
        },
        filled: {
          '&:hover': {
            boxShadow: shadows[2],
          },
        },
        outlined: {
          borderWidth: 1.5,
        },
        colorPrimary: {
          backgroundColor: colors.primary.main,
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: colors.primary.light,
          },
        },
        colorSecondary: {
          backgroundColor: colors.secondary.main,
          color: colors.background.default,
        },
      },
    },
    // Avatar Component
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
        colorDefault: {
          backgroundColor: colors.grey[200],
          color: colors.text.primary,
        },
      },
    },
    // Badge Component
    MuiBadge: {
      styleOverrides: {
        badge: {
          fontWeight: 600,
        },
        colorPrimary: {
          backgroundColor: colors.primary.main,
          color: '#FFFFFF',
        },
      },
    },
    // Tabs Component
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: 48,
        },
        indicator: {
          height: 3,
          borderRadius: '3px 3px 0 0',
          backgroundColor: colors.primary.main,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          minHeight: 48,
          padding: '12px 24px',
          fontWeight: 600,
          fontSize: '0.9375rem',
          textTransform: 'none',
          transition: 'all 0.2s ease',
          '&.Mui-selected': {
            color: colors.primary.main,
          },
          '&:hover': {
            color: colors.primary.main,
            opacity: 1,
          },
        },
      },
    },
    // Slider Component
    MuiSlider: {
      styleOverrides: {
        root: {
          height: 6,
          '&.Mui-disabled': {
            color: colors.grey[400],
          },
        },
        track: {
          border: 'none',
          background: `linear-gradient(90deg, ${colors.primary.main}, ${colors.primary.light})`,
        },
        rail: {
          opacity: 0.3,
          backgroundColor: colors.grey[400],
        },
        thumb: {
          width: 20,
          height: 20,
          backgroundColor: colors.primary.main,
          boxShadow: amberShadow,
          '&:hover, &.Mui-focusVisible': {
            boxShadow: amberShadowHover,
          },
          '&:before': {
            display: 'none',
          },
        },
        valueLabel: {
          borderRadius: 8,
          backgroundColor: colors.primary.main,
          '&:before': {
            display: 'none',
          },
        },
        mark: {
          backgroundColor: colors.grey[400],
          width: 4,
          height: 4,
          borderRadius: 2,
        },
        markActive: {
          backgroundColor: colors.primary.light,
        },
      },
    },
    // Switch Component
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 48,
          height: 26,
          padding: 0,
        },
        switchBase: {
          padding: 2,
          '&.Mui-checked': {
            transform: 'translateX(22px)',
            color: colors.background.default,
            '& + .MuiSwitch-track': {
              backgroundColor: colors.primary.main,
              opacity: 1,
            },
          },
        },
        thumb: {
          width: 22,
          height: 22,
          boxShadow: shadows[2],
        },
        track: {
          borderRadius: 13,
          backgroundColor: colors.grey[400],
          opacity: 1,
          transition: 'background-color 0.3s ease',
        },
      },
    },
    // Checkbox Component
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: colors.grey[400],
          '&.Mui-checked': {
            color: colors.primary.main,
          },
        },
      },
    },
    // Radio Component
    MuiRadio: {
      styleOverrides: {
        root: {
          color: colors.grey[400],
          '&.Mui-checked': {
            color: colors.primary.main,
          },
        },
      },
    },
    // Tooltip Component
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: colors.primary.main,
          color: colors.background.default,
          fontSize: '0.8125rem',
          fontWeight: 500,
          padding: '8px 12px',
          borderRadius: 8,
          boxShadow: shadows[4],
        },
        arrow: {
          color: colors.primary.main,
        },
      },
    },
    // Dialog/Modal Component
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
          boxShadow: shadows[12],
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: '1.5rem',
          fontWeight: 700,
          fontFamily: typography.fontFamilyHeading,
          padding: '24px 24px 16px',
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: '16px 24px',
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '16px 24px 24px',
          gap: 12,
        },
      },
    },
    // Drawer Component
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRadius: '24px 24px 0 0',
          boxShadow: shadows[10],
        },
      },
    },
    // Snackbar Component
    MuiSnackbar: {
      styleOverrides: {
        root: {
          '& .MuiPaper-root': {
            borderRadius: 12,
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 500,
        },
        standardSuccess: {
          backgroundColor: alpha(colors.success.main, 0.12),
          color: colors.success.dark,
        },
        standardError: {
          backgroundColor: alpha(colors.error.main, 0.12),
          color: colors.error.dark,
        },
        standardWarning: {
          backgroundColor: alpha(colors.warning.main, 0.12),
          color: colors.warning.dark,
        },
        standardInfo: {
          backgroundColor: alpha(colors.info.main, 0.12),
          color: colors.info.dark,
        },
      },
    },
    // Accordion Component
    MuiAccordion: {
      defaultProps: {
        disableGutters: true,
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
          '&:before': {
            display: 'none',
          },
          '&.Mui-expanded': {
            margin: 0,
          },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          padding: '16px 0',
          minHeight: 'auto',
          '&.Mui-expanded': {
            minHeight: 'auto',
          },
        },
        content: {
          margin: 0,
          '&.Mui-expanded': {
            margin: 0,
          },
        },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          padding: '0 0 16px',
        },
      },
    },
    // Divider Component
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: colors.grey[200],
        },
      },
    },
    // Skeleton Component
    MuiSkeleton: {
      styleOverrides: {
        root: {
          backgroundColor: colors.grey[200],
        },
        rectangular: {
          borderRadius: 8,
        },
      },
    },
    // Backdrop Component
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundColor: alpha(colors.primary.main, 0.7),
          backdropFilter: 'blur(4px)',
        },
      },
    },
    // Link Component
    MuiLink: {
      defaultProps: {
        underline: 'none',
      },
      styleOverrides: {
        root: {
          color: colors.primary.main,
          fontWeight: 500,
          transition: 'color 0.2s ease',
          '&:hover': {
            color: colors.primary.light,
          },
        },
      },
    },
    // Breadcrumbs Component
    MuiBreadcrumbs: {
      styleOverrides: {
        separator: {
          color: colors.grey[400],
        },
      },
    },
    // Pagination Component
    MuiPagination: {
      styleOverrides: {
        root: {
          '& .MuiPaginationItem-root': {
            fontWeight: 500,
            '&.Mui-selected': {
              backgroundColor: colors.primary.main,
              color: '#FFFFFF',
              '&:hover': {
                backgroundColor: colors.primary.light,
              },
            },
          },
        },
      },
    },
    // Table Component
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: colors.grey[200],
          padding: '16px',
        },
        head: {
          fontWeight: 600,
          backgroundColor: colors.grey[100],
          color: colors.text.primary,
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: alpha(colors.primary.main, 0.04),
          },
        },
      },
    },
    // List Component
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          '&.Mui-selected': {
            backgroundColor: alpha(colors.primary.main, 0.12),
            '&:hover': {
              backgroundColor: alpha(colors.primary.main, 0.16),
            },
          },
          '&:hover': {
            backgroundColor: alpha(colors.primary.main, 0.08),
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: 40,
          color: colors.primary.main,
        },
      },
    },
    // Bottom Navigation Component (Mobile)
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          height: 64,
          backgroundColor: colors.background.default,
          borderTop: `1px solid ${colors.grey[200]}`,
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          minWidth: 'auto',
          padding: '8px 12px',
          color: colors.text.secondary,
          '&.Mui-selected': {
            color: colors.primary.main,
          },
        },
        label: {
          fontSize: '0.6875rem',
          fontWeight: 500,
          '&.Mui-selected': {
            fontSize: '0.6875rem',
          },
        },
      },
    },
    // Fab Component
    MuiFab: {
      styleOverrides: {
        root: {
          boxShadow: amberShadow,
          '&:hover': {
            boxShadow: amberShadowHover,
          },
        },
        primary: {
          background: `linear-gradient(135deg, ${colors.accent.main} 0%, ${colors.accent.light} 100%)`,
          color: colors.accent.contrastText,
        },
      },
    },
    // Speed Dial Component
    MuiSpeedDial: {
      styleOverrides: {
        fab: {
          background: `linear-gradient(135deg, ${colors.accent.main} 0%, ${colors.accent.light} 100%)`,
          color: colors.accent.contrastText,
          boxShadow: amberShadow,
          '&:hover': {
            background: `linear-gradient(135deg, ${colors.accent.light} 0%, ${colors.accent.main} 100%)`,
            boxShadow: amberShadowHover,
          },
        },
      },
    },
    MuiSpeedDialAction: {
      styleOverrides: {
        fab: {
          backgroundColor: colors.background.default,
          color: colors.primary.main,
          boxShadow: shadows[4],
          '&:hover': {
            backgroundColor: colors.grey[100],
          },
        },
      },
    },
  },
});

// Export theme and colors for use in styled components
export { colors, ctaShadow, ctaShadowHover, orangeShadow, orangeShadowHover, amberShadow, amberShadowHover };
export default theme;
