export const colors = {
  cosmos: {
    900: "#05021a",
    800: "#0a0420",
    700: "#120833",
    600: "#1c1247",
    500: "#2a1c66",
  },
  nebula: {
    pink: "#ff4dd2",
    purple: "#7c3aed",
    violet: "#a855f7",
    blue: "#3b82f6",
    cyan: "#22d3ee",
    neon: "#00f0ff",
  },
  text: {
    primary: "#f5f3ff",
    secondary: "#c7c3e0",
    muted: "#8b87a8",
  },
  glass: "rgba(255,255,255,0.06)",
  glassBorder: "rgba(255,255,255,0.12)",
  success: "#22c55e",
  danger: "#ef4444",
  warning: "#f59e0b",
} as const;

export const gradients = {
  cosmic: ["#05021a", "#120833", "#2a1c66"] as const,
  primary: ["#7c3aed", "#3b82f6"] as const,
  aurora: ["#ff4dd2", "#7c3aed", "#3b82f6", "#22d3ee"] as const,
  glow: ["#a855f7", "#22d3ee"] as const,
};
