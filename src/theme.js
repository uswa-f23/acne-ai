// AcneAI Design System — Soft Feminine Theme
// Palette: light blush hero, barely-pink cards, dusty rose accents, mild depth only

export const theme = {
  colors: {
    // ── PRIMARY: Soft Blush → Dusty Rose ─────────────────────────────────
    primary: {
      50:  '#fff5f9',   // near-white blush — page bg
      100: '#ffe8f2',   // petal soft — section washes
      200: '#ffd0e6',   // light blush — badges, dividers
      300: '#ffadd0',   // candy blush — borders
      400: '#ff80b5',   // medium pink — hover states
      500: '#f5629d',   // core brand pink — buttons, icons
      600: '#de4080',   // rich pink — active states
      700: '#b82d65',   // deep rose — text accents
      800: '#8f1f4c',   // wine rose — rare dark use
      900: '#661535',   // deep garnet
      950: '#3d0a1f',   // near-black rose — footer only
    },

    // ── MAUVE / DUSTY ROSE ────────────────────────────────────────────────
    mauve: {
      50:  '#fdf0f2',   // barely blush
      100: '#fae0e4',   // soft dusty pink — feature section bg
      200: '#f5c2cb',   // muted rose — card borders
      300: '#eda0ae',   // warm mauve — icons on light bg
      400: '#e07a8d',   // dusty rose — promo section bg
      500: '#c95570',   // true mauve — sale headlines
      600: '#a83a55',   // moody rose
      700: '#852b42',   // plum-rose — dark cards
      800: '#621e30',   // deep plum — footer
      900: '#42131f',
      950: '#280b13',
    },

    // ── CREAM / WARM WHITE ────────────────────────────────────────────────
    cream: {
      50:  '#ffffff',
      100: '#fdf8f5',   // warm white — page bg
      200: '#faf2ec',   // vanilla
      300: '#f5e8df',
      400: '#ecddd2',
      500: '#ddc9b8',
      600: '#c4a48e',
      700: '#9e7d62',
      800: '#72533a',
      900: '#4a3322',
      950: '#2c1d12',
    },

    // ── NEUTRAL ───────────────────────────────────────────────────────────
    neutral: {
      50:  '#fafaf9',
      100: '#f5f5f4',
      200: '#e8e5e3',
      300: '#d4cfc9',
      400: '#b0a89f',
      500: '#8a7f76',
      600: '#6b605a',
      700: '#534d48',
      800: '#3d3936',
      900: '#2a2623',
      950: '#1a1614',
    },

    // ── SEMANTIC TOKENS ───────────────────────────────────────────────────
    semantic: {
      pageBackground: '#fff5f9',
      cardBackground: '#ffffff',
      sectionLight:   '#fae0e4',
      sectionMid:     '#ffd0e6',
      sectionDark:    '#621e30',
      textHeading:    '#3d3936',
      textBody:       '#6b605a',
      textMuted:      '#b0a89f',
      textOnDark:     '#fff5f9',
      textAccent:     '#b82d65',
      borderLight:    '#ffd0e6',
      borderMid:      '#eda0ae',
      borderDark:     '#a83a55',
    },

    background: {
      page:        'linear-gradient(160deg, #fff5f9 0%, #fdf8f5 100%)',
      heroBlush:   'linear-gradient(135deg, #ffe8f2 0%, #ffd0e6 100%)',
      featureWash: 'linear-gradient(160deg, #fdf8f5 0%, #fae0e4 100%)',
      salePink:    'linear-gradient(135deg, #f5c2cb 0%, #ffd0e6 100%)',
      footer:      'linear-gradient(135deg, #621e30 0%, #42131f 100%)',
    },
  },

  typography: {
    fonts: {
      heading: '"Playfair Display", "Crimson Pro", Georgia, serif',
      body:    '"Quicksand", "Nunito", sans-serif',
    },
    sizes: {
      xs: '0.75rem', sm: '0.875rem', base: '1rem', lg: '1.125rem',
      xl: '1.25rem', '2xl': '1.5rem', '3xl': '1.875rem',
      '4xl': '2.25rem', '5xl': '3rem', '6xl': '3.75rem',
    },
  },

  spacing: {
    xs: '0.5rem', sm: '1rem', md: '1.5rem', lg: '2rem',
    xl: '3rem', '2xl': '4rem', '3xl': '6rem',
  },

  borderRadius: {
    sm: '0.5rem', md: '1rem', lg: '1.5rem', xl: '2rem', full: '9999px',
  },

  shadows: {
    sm:      '0 2px 8px rgba(245, 98, 157, 0.08)',
    md:      '0 4px 16px rgba(245, 98, 157, 0.10)',
    lg:      '0 8px 28px rgba(245, 98, 157, 0.13)',
    xl:      '0 16px 40px rgba(245, 98, 157, 0.16)',
    glow:    '0 0 24px rgba(245, 98, 157, 0.22)',
    dustySm: '0 2px 8px rgba(201, 85, 112, 0.10)',
    dustyMd: '0 4px 16px rgba(201, 85, 112, 0.14)',
    dustyLg: '0 8px 28px rgba(201, 85, 112, 0.18)',
  },

  animations: {
    duration: { fast: '150ms', normal: '300ms', slow: '500ms' },
    easing: {
      smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
  },
};

export default theme;