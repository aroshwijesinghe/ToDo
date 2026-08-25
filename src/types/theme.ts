export type ThemeMode = 'dark' | 'white' | 'purple' | 'green' | 'warm';

export interface ThemeStory {
  id: ThemeMode;
  name: string;
  tagline: string;
  story: string;
  emoji: string;
  accentColor: string;
  bgHex: string;
  cardHex: string;
  accentHex: string;
  classes: {
    appBg: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    navBg: string;
    navBorder: string;
    cardBg: string;
    cardBorder: string;
    cardHoverBorder: string;
    cardHoverGlow: string;
    inputBg: string;
    inputBorder: string;
    badgeBg: string;
    badgeText: string;
    accentBtn: string;
    accentText: string;
    topBannerGradient: string;
    progressGradient: string;
    tableHeaderBg: string;
    tableRowHover: string;
    tableBorder: string;
  };
}
