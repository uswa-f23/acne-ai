// AcneAI Design System - Pastel Feminine Theme

export const theme = {
  colors: {
    // Primary pastel palette
    primary: {
      50: '#fef1f7',
      100: '#fee5f0',
      200: '#fecce3',
      300: '#ffa3ca',
      400: '#ff6ba6',
      500: '#f83c87',
      600: '#e51d6b',
      700: '#c71254',
      800: '#a41247',
      900: '#89133f',
    },
    
    // Soft lavender accents
    lavender: {
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7',
      600: '#9333ea',
      700: '#7e22ce',
      800: '#6b21a8',
      900: '#581c87',
    },
    
    // Mint/sage green
    mint: {
      50: '#f0fdf9',
      100: '#ccfbef',
      200: '#9af6e1',
      300: '#5fead0',
      400: '#2dd4b8',
      500: '#14b8a6',
      600: '#0d9488',
      700: '#0f766e',
      800: '#115e59',
      900: '#134e4a',
    },
    
    // Soft peach
    peach: {
      50: '#fff7ed',
      100: '#ffedd5',
      200: '#fed7aa',
      300: '#fdba74',
      400: '#fb923c',
      500: '#f97316',
      600: '#ea580c',
      700: '#c2410c',
      800: '#9a3412',
      900: '#7c2d12',
    },
    
    // Neutral tones
    neutral: {
      50: '#fafaf9',
      100: '#f5f5f4',
      200: '#e7e5e4',
      300: '#d6d3d1',
      400: '#a8a29e',
      500: '#78716c',
      600: '#57534e',
      700: '#44403c',
      800: '#292524',
      900: '#1c1917',
    },
    
    // Background gradients
    background: {
      light: 'linear-gradient(135deg, #fef1f7 0%, #f0fdf9 100%)',
      soft: 'linear-gradient(135deg, #faf5ff 0%, #fff7ed 100%)',
      dreamy: 'linear-gradient(135deg, #fee5f0 0%, #e9d5ff 50%, #ccfbef 100%)',
    }
  },
  
  typography: {
    fonts: {
      heading: '"Crimson Pro", "Playfair Display", Georgia, serif',
      body: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      accent: '"Quicksand", "Nunito", sans-serif',
    },
    sizes: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem',// 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem',    // 48px
      '6xl': '3.75rem', // 60px
    },
  },
  
  spacing: {
    xs: '0.5rem',   // 8px
    sm: '1rem',     // 16px
    md: '1.5rem',   // 24px
    lg: '2rem',     // 32px
    xl: '3rem',     // 48px
    '2xl': '4rem',  // 64px
    '3xl': '6rem',  // 96px
  },
  
  borderRadius: {
    sm: '0.5rem',   // 8px
    md: '1rem',     // 16px
    lg: '1.5rem',   // 24px
    xl: '2rem',     // 32px
    full: '9999px',
  },
  
  shadows: {
    sm: '0 2px 8px rgba(248, 60, 135, 0.08)',
    md: '0 4px 16px rgba(248, 60, 135, 0.12)',
    lg: '0 8px 32px rgba(248, 60, 135, 0.16)',
    xl: '0 16px 48px rgba(248, 60, 135, 0.2)',
    glow: '0 0 32px rgba(248, 60, 135, 0.3)',
  },
  
  animations: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    easing: {
      smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
  },
};

export default theme;