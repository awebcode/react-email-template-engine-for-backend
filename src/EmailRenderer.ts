import { render } from "@react-email/render";
import * as React from "react";
import WeeklyReportPDF from "./templates/WeeklyReportPDF";
import WeeklyUpdateEmail from "./templates/WeeklyUpdateEmail";
import {
  EmailTemplate,
  EmailTemplateArgsMap,
} from "./utils/email-templates.interfaces";

class EmailRenderer {
  private static readonly templateMap: {
    [K in EmailTemplate]: React.FC<EmailTemplateArgsMap[K]>;
  } = {
    [EmailTemplate.WEEKLY_REPORT_PDF]: WeeklyReportPDF,
    [EmailTemplate.WEEKLY_UPDATE_EMAIL]: WeeklyUpdateEmail
  };

  /**
   * Render Email Template
   *
   * Renders a typed email template into an HTML string.
   *
   * @returns Promise<string> Rendered HTML output
   *
   * @example
   * ```ts
   * const html = await EmailRenderer.render(
   *   EmailTemplate.WEEKLY_REPORT_PDF,
   *   { partnerName: "Acme Corp", dateLabel: "Feb 24, 2025 –Mar 2, 2025" ... }
   * );
   * ```
   */
  static async render<T extends EmailTemplate>(
    templateType: T,
    args: EmailTemplateArgsMap[T]
  ): Promise<string> {
    const Component = this.templateMap[templateType];

    if (!Component) {
      throw new Error(`Template type "${templateType}" not recognized.`);
    }

    const element = React.createElement(Component, args);

    return await render(element);
  }
}

export default EmailRenderer;