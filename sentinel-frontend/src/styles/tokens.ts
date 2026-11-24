// Design Tokens for PROSPERITY — Terminal Workspace

export const tokens = {
  colors: {
    light: {
      bg: '#F4F7FC',
      surface: 'rgba(255, 255, 255, 0.72)',
      surfaceStrong: 'rgba(255, 255, 255, 0.92)',
      ink: '#12264A',
      muted: '#6B7C99',
      border: 'rgba(18, 38, 74, 0.08)',
      borderHover: 'rgba(47, 111, 228, 0.28)',
      primaryStart: '#2F6FE4',
      primaryEnd: '#1F55C7',
      accent: '#19D3DA',
      accentGlow: 'rgba(25, 211, 218, 0.24)',
      success: '#22C55E',
      danger: '#EF4444',
      shadow: '0 20px 60px rgba(18, 38, 74, 0.08), 0 4px 16px rgba(18, 38, 74, 0.04)',
      shadowHover: '0 28px 75px rgba(47, 111, 228, 0.16), 0 8px 24px rgba(47, 111, 228, 0.1)',
    },
    dark: {
      bg: '#0B1530',
      surface: 'rgba(18, 32, 64, 0.65)',
      surfaceStrong: 'rgba(22, 40, 78, 0.88)',
      ink: '#EAF1FF',
      muted: '#8FA3C7',
      border: 'rgba(143, 163, 199, 0.12)',
      borderHover: 'rgba(25, 211, 218, 0.32)',
      primaryStart: '#2F6FE4',
      primaryEnd: '#1F55C7',
      accent: '#19D3DA',
      accentGlow: 'rgba(25, 211, 218, 0.35)',
      success: '#22C55E',
      danger: '#EF4444',
      shadow: '0 20px 70px rgba(0, 0, 0, 0.45), 0 4px 20px rgba(0, 0, 0, 0.3)',
      shadowHover: '0 30px 85px rgba(25, 211, 218, 0.15), 0 8px 30px rgba(47, 111, 228, 0.25)',
    },
  },
  fonts: {
    heading: '"Space Grotesk", system-ui, -apple-system, sans-serif',
    body: '"DM Sans", system-ui, -apple-system, sans-serif',
    mono: '"JetBrains Mono", monospace',
  },
  radii: {
    sm: '12px',
    md: '20px',
    lg: '28px',
    full: '9999px',
  },
  motion: {
    easeEntrance: [0.22, 1, 0.36, 1] as [number, number, number, number],
    easeHover: [0.4, 0, 0.2, 1] as [number, number, number, number],
    durationMicro: 0.18, // 180ms
    durationHover: 0.35, // 350ms
    durationSection: 0.75, // 700-900ms
  },
} as const
