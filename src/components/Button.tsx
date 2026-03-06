import { Button as EmailButton } from "@react-email/components";
import * as React from "react";
import { theme } from "../theme/theme";

// Custom props you want to add
interface CustomButtonProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

// Merge with anchor props from EmailButton
export type ButtonProps = CustomButtonProps &
  React.ComponentPropsWithoutRef<typeof EmailButton>;

// ForwardRef wrapper for EmailButton
export const Button = React.forwardRef<HTMLAnchorElement, ButtonProps>(
  ({ children, style, ...props }, ref) => {
    return (
      <EmailButton
        ref={ref}
        style={{
          ...styles.button,
          ...style,
        }}
        {...props} 
      >
        {children}
      </EmailButton>
    );
  }
);

Button.displayName = "Button";

// Default inline styles
const styles = {
  button: {
    backgroundColor: `${theme.colors.primary} !important`,
    color: `${theme.colors.white} !important`,
    padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
    borderRadius: "6px",
    textDecoration: "none",
    fontFamily: theme.typography.fontFamily,
    fontSize: "14px",
    fontWeight: 600,
    display: "inline-block",
    textAlign: "center" as const,
    printColorAdjust: "exact" as any,
    WebkitPrintColorAdjust: "exact" as any,
  },
};