export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    text: string;
    muted: string;
    background: string;
    white: string;
    border: string;
    success: string;
    danger: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  typography: {
    fontFamily: string;
    headingSize: string;
    sectionTitleSize: string;
    bodySize: string;
    noteSize: string;
  };
}
