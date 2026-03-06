import { Section, Text, Link, Hr, Img } from "@react-email/components";
import { theme } from "../theme/theme";
import { EmailTemplateConstants } from "../utils/email-templates.constants";

interface FooterProps {
  appName?: string;
  supportEmail?: string;
  logoUrl?: string;
}

export const Footer = ({
  appName = EmailTemplateConstants.appName,
  supportEmail = EmailTemplateConstants.supportEmail,
  logoUrl = EmailTemplateConstants.logoUrl,
}: FooterProps) => {
  const currentYear = new Date().getFullYear();

  return (
    <Section style={styles.footer}>
      <Hr style={styles.hr} />

      <Section style={styles.brandSection}>
        <Img src={logoUrl} alt={appName} style={styles.logo} />
        <Text style={styles.brandName}>{appName}</Text>
      </Section>

      <Text style={styles.metaText}>
        © {currentYear} {appName}. All rights reserved.
      </Text>

      <Text style={styles.metaText}>
        Need help?{" "}
        <Link href={`mailto:${supportEmail}`} style={styles.link}>
          {supportEmail}
        </Link>
      </Text>
    </Section>
  );
};

const styles = {
  footer: {
    padding: "0px 12px 28px 12px",
    backgroundColor: "#FFFFFF",
    textAlign: "center" as const,
    printColorAdjust: "exact" as any,
    WebkitPrintColorAdjust: "exact" as any,
    pageBreakInside: "avoid" as any,
  },

  hr: {
    borderColor: theme.colors.border,
    marginBottom: "24px",
    width: "100%",
  },

  brandSection: {
    marginBottom: "2px",
  },

  logo: {
    display: "block",
    margin: "0 auto 12px",
    width: "28px",
    height: "32px",
  },

  brandName: {
    fontSize: "14px",
    fontWeight: 700,
    color: theme.colors.primary,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    margin: "0 0 16px",
  },

  metaText: {
    color: theme.colors.muted,
    fontSize: "12px",
    margin: "0 0 8px",
    lineHeight: "1.6",
  },

  link: {
    color: theme.colors.primary,
    fontSize: "12px",
    textDecoration: "none",
    fontWeight: 600,
  },
};
