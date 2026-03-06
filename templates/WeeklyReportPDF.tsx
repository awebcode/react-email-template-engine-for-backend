import { Heading, Text, Section, Link } from "@react-email/components";
import { Layout } from "../components/Layout";
import { Footer } from "../components/Footer";
import { Button } from "../components/Button";
import { theme } from "../theme/theme";
import { IMetric, IWeeklyReportPDFArgs } from "../utils/email-templates.interfaces";
import { EmailTemplateConstants } from "../utils/email-templates.constants";
import { isFreeText, isEmbed, toSafeExternalUrl, sanitizeRichHtml } from "../utils/email-templates.utils";

export const WeeklyReportPDF = ({
  partnerName,
  reportTitle,
  dateLabel,
  metricSections,
  additionalNotes,
  showPercentage = true,
  ...layoutProps
}: IWeeklyReportPDFArgs) => {
  const { appName } = EmailTemplateConstants;

  return (
    <Layout 
      previewText={`${reportTitle} for ${partnerName}`} {...layoutProps} 
      style={{
        printColorAdjust: "exact" as any,
        WebkitPrintColorAdjust: "exact" as any,
      }}>
      
      <Section style={styles.header}>
        <Text style={styles.brand}>{appName.toUpperCase()}</Text>
        <Heading style={styles.h1}>{reportTitle}</Heading>
        <Text style={styles.partnerName}>{partnerName}</Text>
        {dateLabel && <Text style={styles.dateRange}>{dateLabel}</Text>}
      </Section>

      <Section style={styles.content}>
        {(metricSections ?? []).map((section, idx) => {
          const metrics = section?.metrics ?? [];
          // Strictly Partition Metrics (Mutually Exclusive)
          const standardMetrics = metrics.filter(m => !isFreeText(m) && !isEmbed(m));
          const freeTextMetrics = metrics.filter(m => isFreeText(m));
          const embedMetrics = metrics.filter(m => isEmbed(m));

          const hasMetrics = metrics.length > 0;

          return (
            <Section key={idx} style={styles.sectionBlock}>
              <Heading as="h2" style={styles.sectionTitle}>{section?.section_name || "Performance Section"}</Heading>
              
              {/* Standard Dashboard Metrics (Table) */}
              {standardMetrics.length > 0 && (
                <Section style={styles.metricsWrapper} className="metrics-container">
                  <TableHeader showPercentage={showPercentage} />
                  {standardMetrics.map((metric, mIdx) => (
                    <StandardMetricRow 
                      key={mIdx} 
                      metric={metric} 
                      isEven={mIdx % 2 !== 0}
                      showPercentage={showPercentage}
                    />
                  ))}
                </Section>
              )}

              {/*  Observation & Free Text Blocks */}
              {freeTextMetrics.map((metric, fIdx) => (
                <FreeTextMetricRow key={fIdx} metric={metric} />
              ))}

              {/* Specialized Content & External Embed Blocks */}
              {embedMetrics.map((metric, eIdx) => (
                <EmbedMetricRow key={eIdx} metric={metric} />
              ))}

              {/* Empty Section Fallback */}
              {!hasMetrics && (
                <Section style={styles.metricsWrapper}>
                  <Text style={styles.noDataText}>No metrics configured for this section.</Text>
                </Section>
              )}
            </Section>
          );
        })}

        {/* Additional Notes (Centered) */}
        {additionalNotes && (
          <Section style={styles.notesContainer}>
            <Heading as="h2" style={styles.notesTitle}>Additional Notes</Heading>
            <div 
              style={styles.notesBody} 
              dangerouslySetInnerHTML={{ __html: sanitizeRichHtml(additionalNotes) }} 
            />
          </Section>
        )}
      </Section>

      <Footer {...layoutProps} />
    </Layout>
  );
};

/**
 * Standard Metric Row (Numeric, String, Date, Boolean)
 */
const StandardMetricRow = ({ metric, isEven, showPercentage }: { metric: IMetric, isEven: boolean, showPercentage: boolean }) => {
  const settings = metric.settings || {};
  const isNumeric = settings.type === "numeric";
  const isBoolean = settings.type === "boolean";
  const fieldType = settings.field_type;
  
  let displayValue: any = "-";
  let compareValue: any = "-";
  let prefix = "";
  let suffix = "";

  // --- BOOLEAN HANDLING ---
  if (isBoolean) {
    const renderBoolean = (value: unknown) =>
      value == null
        ? "-"
        : value
          ? <span style={{ color: theme.colors.success }}>Yes</span>
          : <span style={{ color: theme.colors.danger }}>No</span>;
    displayValue = renderBoolean(metric.metric_value);
    compareValue = renderBoolean(metric.metric_compare_value);
  } else {
    // --- NON-BOOLEAN HANDLING (Numeric, String, Date) ---
    displayValue = metric.metric_value ?? "-";
    compareValue = metric.metric_compare_value ?? "-";
    if (isNumeric) {
      prefix = fieldType === 2 ? "$ " : "";
      suffix = fieldType === 1 ? " %" : "";
    }
  }

  let percentChange: string = "—";
  let changeColor = theme.colors.text;
  
  // Only calculate change for numeric types
  if (isNumeric && showPercentage && metric?.metric_value != null && metric?.metric_compare_value != null) {
    const v = parseFloat(String(metric.metric_value));
    const vCompare = parseFloat(String(metric.metric_compare_value));
    
    if (!isNaN(v) && !isNaN(vCompare) && vCompare !== 0) {
      const changeRaw = ((v - vCompare) / Math.abs(vCompare)) * 100;
      percentChange = `${changeRaw > 0 ? "+" : ""}${changeRaw.toFixed(2)}%`;
      changeColor = changeRaw > 0 ? theme.colors.success : (changeRaw < 0 ? theme.colors.danger : theme.colors.text);
    }
  }

  return (
    <Section style={isEven ? styles.tableRowEven : styles.tableRow}>
      <table style={styles.table}>
        <tbody>
          <tr>
            <td style={styles.tableCell}><strong>{metric?.metric_name || "Unnamed Metric"}</strong></td>
            <td style={styles.tableCellCenter}>{prefix}{displayValue}{suffix}</td>
            {showPercentage && <td style={styles.tableCellCenter}>{prefix}{compareValue}{suffix}</td>}
            {showPercentage && (
              <td style={{ ...styles.tableCellCenter, color: changeColor, fontWeight: 600 }}>
                {percentChange}
              </td>
            )}
          </tr>
        </tbody>
      </table>
    </Section>
  );
};

/**
 * Specialized Centered Free Text Component
 */
const FreeTextMetricRow = ({ metric }: { metric: IMetric }) => (
  <Section style={styles.freeTextBlock}>
    <Text style={styles.rowTitleLabel}>{metric?.metric_name || "OBSERVATION"}</Text>
    <Section style={styles.freeTextContainer}>
      <div 
        style={styles.centeredHtmlBody} 
        dangerouslySetInnerHTML={{ 
          __html: sanitizeRichHtml(metric?.metric_value?.value ?? metric?.metric_value ?? "No details provided.") 
        }} 
      />
    </Section>
  </Section>
);

/**
 * Specialized Centered Embed Component (No IFrame for PDF)
 */
const EmbedMetricRow = ({ metric }: { metric: IMetric }) => {
  const rawUrl = typeof metric?.metric_value === "object" ? metric?.metric_value?.value : metric?.metric_value;
  const url = toSafeExternalUrl(rawUrl);

  return (
    <Section style={styles.embedBlock}>
      <Text style={styles.rowTitleLabel}>{metric?.metric_name || "LINKED CONTENT"}</Text>
      {url ? (
        <Section style={styles.embedActionContainer}>
          <Section>
            <Button 
              href={url} 
              style={styles.actionButtonStyle}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Live Content
            </Button>
          </Section>
        </Section>
      ) : (
        <Text style={styles.noDataMuted}>No URL available</Text>
      )}
    </Section>
  );
};

const TableHeader = ({ showPercentage }: { showPercentage: boolean }) => (
  <Section style={styles.tableHeaderSection}>
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.tableHeaderCell}>Performance Metric</th>
          <th style={styles.tableHeaderCellCenter}>Current</th>
          {showPercentage && <th style={styles.tableHeaderCellCenter}>Previous</th>}
          {showPercentage && <th style={styles.tableHeaderCellCenter}>Change (%)</th>}
        </tr>
      </thead>
    </table>
  </Section>
);

export default WeeklyReportPDF;


const styles = {
  header: {
    backgroundColor: `${theme.colors.primary} !important`,
    color: `${theme.colors.white} !important`,
    padding: "24px 28px 12px 28px",
    textAlign: "center" as const,
    borderBottom: `1px solid ${theme.colors.border}`,
    printColorAdjust: "exact" as any,
    WebkitPrintColorAdjust: "exact" as any,
    pageBreakAfter: "avoid" as any, 
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
  partnerName: {
    fontSize: "20px", 
    fontWeight: 600, 
    margin: "0 0 8px",
    marginTop: "4px",
    pageBreakInside: "avoid" as any, 
    color: "rgba(255, 255, 255, 0.9)",
  },
  dateRange: {
    fontSize: "15px", 
    fontWeight: 500,
    color: "rgba(255, 255, 255, 0.7)", 
  },
  content: {
    padding: "32px 16px",
  },
  // --- PAGE BREAK CONTROL ---
  sectionBlock: {
    marginBottom: "48px",
    pageBreakInside: "avoid" as any, 
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: 700,
    marginBottom: "16px",
    color: theme.colors.text,
    borderLeft: `5px solid ${theme.colors.primary}`,
    paddingLeft: "14px",
    pageBreakAfter: "avoid" as any, 
  },
  metricsWrapper: {
    border: `1px solid ${theme.colors.border}`,
    borderRadius: "12px",
    overflow: "hidden" as const,
    backgroundColor: theme.colors.white,
    pageBreakInside: "avoid" as any, 
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
    printColorAdjust: "exact" as any,
    WebkitPrintColorAdjust: "exact" as any,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
    tableLayout: "fixed" as const,
  },
  tableHeaderSection: {
    backgroundColor: theme.colors.background,
    borderBottom: `1px solid ${theme.colors.border}`,
  },
  tableHeaderCell: {
    padding: "16px",
    fontSize: "10px",
    fontWeight: 700,
    textAlign: "left" as const,
    color: theme.colors.muted,
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
    width: "40%",
  },
  tableHeaderCellCenter: {
    padding: "16px",
    fontSize: "10px",
    fontWeight: 700,
    textAlign: "center" as const,
    color: theme.colors.muted,
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
  },
  tableRow: {
    backgroundColor: theme.colors.white,
    borderBottom: `1px solid ${theme.colors.border}`,
  },
  tableRowEven: {
    backgroundColor: theme.colors.background,
    borderBottom: `1px solid ${theme.colors.border}`,
  },
  tableCell: {
    padding: "16px",
    fontSize: "14px",
    color: theme.colors.text,
    width: "40%",
  },
  tableCellCenter: {
    padding: "16px",
    fontSize: "14px",
    textAlign: "center" as const,
    color: theme.colors.text,
  },
  freeTextBlock: {
    padding: "32px 24px",
    textAlign: "center" as const,
    borderBottom: `1px solid ${theme.colors.border}`,
    backgroundColor: theme.colors.white,
    printColorAdjust: "exact" as any,
    WebkitPrintColorAdjust: "exact" as any,
    pageBreakInside: "avoid" as any, 
  },
  embedBlock: {
    padding: "40px 24px",
    textAlign: "center" as const,
    borderBottom: `1px solid ${theme.colors.border}`,
    backgroundColor: theme.colors.white,
    printColorAdjust: "exact" as any,
    WebkitPrintColorAdjust: "exact" as any,
    pageBreakInside: "avoid" as any, 
  },
  rowTitleLabel: {
    fontSize: "11px",
    fontWeight: 800,
    textTransform: "uppercase" as const,
    color: theme.colors.primary,
    marginBottom: "16px",
    letterSpacing: "0.1em",
  },
  centeredHtmlBody: {
    fontSize: "15px",
    lineHeight: "1.7",
    color: theme.colors.text,
    maxWidth: "540px",
    margin: "0 auto",
  },
  freeTextContainer: {
    backgroundColor: "rgba(249, 250, 251, 1)", // Modern Gray-50
    padding: "24px 16px",
    borderRadius: "16px",
    border: `1px solid ${theme.colors.border}`,
    maxWidth: "580px",
    margin: "0 auto",
    pageBreakInside: "avoid" as any, 
    printColorAdjust: "exact" as any,
    WebkitPrintColorAdjust: "exact" as any,
  },
  embedActionContainer: {
    backgroundColor: "rgba(248, 250, 252, 1)", // Modern slate-50
    padding: "24px 16px",
    borderRadius: "16px",
    border: `1px solid ${theme.colors.border}`,
    maxWidth: "520px",
    margin: "0 auto",
    pageBreakInside: "avoid" as any, 
    printColorAdjust: "exact" as any,
    WebkitPrintColorAdjust: "exact" as any,
  },
  embedUrlStyle: {
    fontSize: "15px",
    color: theme.colors.primary,
    fontWeight: 700,
    wordBreak: "break-all" as const,
    display: "block",
    marginBottom: "20px",
    textDecoration: "underline",
  },
  actionButtonStyle: {
    display: "inline-block",
    padding: "12px 24px",
    backgroundColor: `${theme.colors.primary} !important`,
    color: "#FFFFFF !important",
    fontSize: "14px",
    fontWeight: 700,
    borderRadius: "8px",
    textDecoration: "none",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    printColorAdjust: "exact" as any,
    WebkitPrintColorAdjust: "exact" as any,
  },
  noDataMuted: {
    fontSize: "12px",
    color: theme.colors.muted,
    fontStyle: "italic",
  },
  noDataText: {
    padding: "24px",
    textAlign: "center" as const,
    fontSize: "14px",
    color: theme.colors.muted,
  },
  notesContainer: {
    marginTop: "24px",
    padding: "40px 32px",
    backgroundColor: theme.colors.background,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: "16px",
    textAlign: "center" as const,
    pageBreakInside: "avoid" as any, 
  },
  notesTitle: {
    fontSize: "20px",
    fontWeight: 700,
    marginBottom: "16px",
    color: theme.colors.text,
    pageBreakInside: "avoid" as any, 
  },
  notesBody: {
    fontSize: "15px",
    lineHeight: "1.7",
    color: theme.colors.secondary,
    maxWidth: "620px",
    margin: "0 auto",
    pageBreakInside: "avoid" as any, 
  },
};