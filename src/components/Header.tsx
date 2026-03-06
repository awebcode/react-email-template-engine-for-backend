import { Section, Heading, Text } from "@react-email/components";
import { theme } from "../theme/theme";
import { EmailTemplateConstants } from "../utils/email-templates.constants";

interface HeaderProps {
  appName?: string;
  subtitle?: string;
}

export const Header = ({
  appName = EmailTemplateConstants.appName,
  subtitle = "Performance Report",
}: HeaderProps) => {
  return (
    <Section style={styles.header}>
      <Text style={styles.brand}>{appName.toUpperCase()}</Text>
      <Heading as="h1" style={styles.h1}>
        {subtitle}
      </Heading>
    </Section>
  );
};

const styles = {
  header: {
    backgroundColor: `${theme.colors.primary} !important`,
    padding: "24px 28px",
    textAlign: "center" as const,
    borderBottom: `1px solid ${theme.colors.border}`,
    printColorAdjust: "exact" as any,
    WebkitPrintColorAdjust: "exact" as any,
  },
  brand: {
    fontSize: "13px",
    fontWeight: 700,
    letterSpacing: "3px",
    color: "rgba(255, 255, 255, 0.8)",         
    margin: "0 0 12px",
    textTransform: "uppercase" as const,
  },
  h1: {
    fontSize: "32px",
    fontWeight: 800,
    lineHeight: 1.15,
    margin: "0",
    color: theme.colors.white,                 
    letterSpacing: "-0.02em",
  },
};