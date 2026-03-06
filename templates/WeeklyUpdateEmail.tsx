import { Section, Text, Heading } from "@react-email/components";
import { Layout } from "../components/Layout";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "../components/Button";
import { theme } from "../theme/theme";
import { IWeeklyUpdateEmailArgs } from "../utils/email-templates.interfaces";
import { EmailTemplateConstants } from "../utils/email-templates.constants";

export const WeeklyUpdateEmail = ({
  partnerName,
  dateLabel,
  introMessage,
  pdfUrl,
  appName = EmailTemplateConstants.appName,
  ...layoutProps
}: IWeeklyUpdateEmailArgs) => {
  return (
    <Layout previewText={`Performance Update: ${partnerName}`} {...layoutProps}>
      {/* Branded Header */}
      <Header appName={appName} subtitle="Performance Update" />
      
      <Section style={styles.content}>
        {/* Intro Section */}
        <Section style={styles.messageContainer}>
          <Heading as="h2" style={styles.h2}>Insights are Ready</Heading>
          <Text style={styles.text}>
            The latest performance analysis for <strong>{partnerName}</strong> is complete and ready for your review.
            {dateLabel && <> This update covers the activity from <strong>{dateLabel}</strong>.</>}
          </Text>
        </Section>

        {introMessage && (
          <Section style={styles.messageContainer}>
            <Heading as="h2" style={styles.h2}>A Note from Your Team</Heading>
            <Text style={styles.text}>
              {introMessage}
            </Text>
          </Section>
        )}

        {/* Primary Call to Action */}
        {pdfUrl && (
          <Section style={styles.ctaCard}>
            <Text style={styles.ctaLabel}>Detailed Analysis</Text>
            <Text style={styles.ctaDescription}>
              Download the full PDF report to review performance metrics, engagement insights, and key growth opportunities.
            </Text>
            <Button 
                href={pdfUrl} 
                style={styles.button}
                target="_blank"
                rel="noopener noreferrer"
            >
              Download PDF Report
            </Button>
          </Section>
        )}

        {/* Professional Sign-off */}
        <Section style={styles.footerSection}>
          <Text style={styles.closing}>
            Thank you for being a valued partner.
          </Text>
          <Text style={styles.signature}>
            The <strong>{appName}</strong> Team
          </Text>
        </Section>
      </Section>

      <Footer appName={appName} {...layoutProps} />
    </Layout>
  );
};

export default WeeklyUpdateEmail;

const styles = {
  content: {
    padding: "28px 12px",
  },
  messageContainer: {
    backgroundColor: "rgba(249, 250, 251, 1)", // Modern Gray-50
    padding: "24px 16px",
    borderRadius: "20px",
    border: `1px solid ${theme.colors.border}`,
    marginBottom: "24px",
    textAlign: "left" as const,
    printColorAdjust: "exact" as any,
    WebkitPrintColorAdjust: "exact" as any,
  },
  h2: {
    fontSize: "20px",
    fontWeight: 700,
    margin: "0 0 12px",
    color: theme.colors.text,
    letterSpacing: "-0.015em",
    textAlign: "left" as const,
  },
  text: {
    fontSize: "15px",
    color: theme.colors.secondary,
    lineHeight: "1.6",
    margin: "0",
    textAlign: "left" as const,
  },
  ctaCard: {
    textAlign: "center" as const,
    margin: "32px 0 48px",
    padding: "24px 16px",
    backgroundColor: theme.colors.background,
    borderRadius: "20px",
    border: `1px solid ${theme.colors.border}`,
  },
  ctaLabel: {
    fontSize: "12px",
    fontWeight: 700,
    color: theme.colors.primary,
    textTransform: "uppercase" as const,
    letterSpacing: "0.1em",
    marginBottom: "12px",
    margin: "0 auto 12px",
  },
  ctaDescription: {
    fontSize: "14px",
    color: theme.colors.muted,
    lineHeight: "1.5",
    marginBottom: "24px",
    maxWidth: "360px",
    margin: "0 auto 24px",
  },
  button: {
    padding: "16px 36px",
    fontSize: "15px",
    borderRadius: "12px",
    backgroundColor: theme.colors.primary,
    color: theme.colors.white,
    fontWeight: 600,
  },
  fallbackText: {
    fontSize: "12px",
    color: "#94A3B8",
    marginTop: "20px",
  },
  fallbackLink: {
    color: theme.colors.primary,
    textDecoration: "underline",
    fontWeight: 500,
  },
  footerSection: {
    borderTop: `1px solid ${theme.colors.border}`,
    paddingTop: "32px",
  },
  closing: {
    fontSize: "14px",
    color: theme.colors.muted,
    margin: "0 0 6px",
  },
  signature: {
    fontSize: "16px",
    fontWeight: 600,
    color: theme.colors.text,
    margin: 0,
  },
};
