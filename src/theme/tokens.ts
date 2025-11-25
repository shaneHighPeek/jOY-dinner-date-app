export const tokens = {
  colors: {
    dark: {
      background: '#1A1A1A',
      card: '#2A2A2A',
      primary: '#ff3232',
      accent: '#FFD6A5',
      text: '#EDEDED',
      muted: '#777777',
      // Additional semantic colors
      border: '#333333',
      overlay: 'rgba(0, 0, 0, 0.5)',
      success: '#6BCB77',
      error: '#ff3232',
    },
    light: {
      background: '#FFF7F2',
      card: '#FFFFFF',
      primary: '#ff3232',
      accent: '#FFB98D',
      text: '#2D2D2D',
      muted: '#888888',
      // Additional semantic colors
      border: '#F0E4E4',
      overlay: 'rgba(0, 0, 0, 0.3)',
      success: '#4CAF50',
      error: '#FF5252',
    },
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 40,
  },
  radius: {
    s: 8,
    m: 16,
    l: 24,
    pill: 9999,
  },
  typography: {
    families: {
      // Using system fonts for now, can be replaced with custom fonts
      sans: 'System',  // SF Pro / Inter equivalent
      display: 'Georgia', // Placeholder for romantic display font
    },
    weights: {
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    sizes: {
      xs: 12,
      s: 14,
      m: 16,
      l: 18,
      xl: 24,
      xxl: 32,
      display: 40,
    },
    lineHeights: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.7,
    },
  },
  shadows: {
    light: {
      small: '0px 2px 4px rgba(0, 0, 0, 0.05)',
      medium: '0px 4px 12px rgba(0, 0, 0, 0.08)',
      large: '0px 8px 24px rgba(0, 0, 0, 0.12)',
    },
    dark: {
      small: '0px 2px 4px rgba(0, 0, 0, 0.2)',
      medium: '0px 4px 12px rgba(0, 0, 0, 0.3)',
      large: '0px 8px 24px rgba(0, 0, 0, 0.4)',
    },
  },
  animation: {
    duration: {
      fast: 200,
      normal: 300,
      slow: 500,
    },
    easing: {
      easeOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      spring: 'spring(1, 90, 10, 0)',
    },
  },
} as const;
