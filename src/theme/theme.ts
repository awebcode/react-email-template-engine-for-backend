import { Theme } from "./theme.types";

export const theme: Theme = {
  colors: {
    primary: "#1F2564",    // Agency Navy
    secondary: "#334155",  // Slate 700
    text: "#0F172A",       // Slate 900
    muted: "#64748B",      // Slate 500
    background: "#F8FAFC", // Slate 50
    white: "#FFFFFF",
    border: "#E2E8F0",     // Slate 200
    success: "#10B981",    // Emerald 500
    danger: "#EF4444",     // Rose 500
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    headingSize: "28px",
    sectionTitleSize: "18px",
    bodySize: "14px",
    noteSize: "12px",
  },
}
