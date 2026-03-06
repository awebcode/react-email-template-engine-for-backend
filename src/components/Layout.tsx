import {
  Html,
  Head,
  Body,
  Container,
  Preview,
  Font,
} from "@react-email/components";
import { theme } from "../theme/theme";

interface LayoutProps {
  children: React.ReactNode;
  previewText?: string;
  style?: React.CSSProperties;
}

export const Layout = ({
  children,
  previewText,
  style,
}: LayoutProps) => {
  return (
    <Html lang="en">
      <Head>
        <Font
          fontFamily="Inter"
          fallbackFontFamily="Arial"
          webFont={{
            url: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
        <Font
          fontFamily="Inter"
          fallbackFontFamily="Arial"
          webFont={{
            url: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZ9hiA.woff2",
            format: "woff2",
          }}
          fontWeight={600}
          fontStyle="normal"
        />
        <Font
          fontFamily="Inter"
          fallbackFontFamily="Arial"
          webFont={{
            url: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuG6fAZ9hiA.woff2",
            format: "woff2",
          }}
          fontWeight={700}
          fontStyle="normal"
        />
      </Head>
      {previewText && <Preview>{previewText}</Preview>}
      <Body style={{ ...styles.body, ...style }}>
        <Container style={styles.container}>
          {children}
        </Container>
      </Body>
    </Html>
  );
};

const styles = {
  body: {
    backgroundColor: theme.colors.background,
    fontFamily: theme.typography.fontFamily,
    padding: "48px 10px",
    WebkitFontSmoothing: "antialiased",
  },
  container: {
    backgroundColor: theme.colors.white,
    margin: "0 auto",
    width: "700px",
    maxWidth: "100%",
    borderRadius: "16px",
    border: `1px solid ${theme.colors.border}`,
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    overflow: "hidden" as const,
  },
};
