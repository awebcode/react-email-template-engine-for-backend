export interface IMetric {
    metric_name: string;
    metric_value: any;
    metric_compare_value?: any;
    settings: any;
  }
  
  export interface IMetricSection {
    section_name: string;
    metrics: IMetric[];
  }
  
  export interface IWeeklyReportPDFArgs {
    partnerName: string;
    reportTitle: string;
    dateLabel: string;
    metricSections: IMetricSection[];
    additionalNotes?: string;
    showPercentage?: boolean;
    appName?: string;
    logoUrl?: string;
    supportEmail?: string;
  }
  
  export interface IWeeklyUpdateEmailArgs {
    partnerName: string;
    dateLabel?: string;
    introMessage?: string;
    pdfUrl?: string;
    appName?: string;
    logoUrl?: string;
    supportEmail?: string;
  }
  
  export enum EmailTemplate {
    WEEKLY_REPORT_PDF = 'WEEKLY_REPORT_PDF',
    WEEKLY_UPDATE_EMAIL = 'WEEKLY_UPDATE_EMAIL',
  }
  
  export type EmailTemplateArgsMap = {
    [EmailTemplate.WEEKLY_REPORT_PDF]: IWeeklyReportPDFArgs;
    [EmailTemplate.WEEKLY_UPDATE_EMAIL]: IWeeklyUpdateEmailArgs;
  };