import sanitizeHtml from "sanitize-html";
import { IMetric } from "./email-templates.interfaces";

/**
 * Robust HTML Sanitization for Rich Text
 * Uses industry-standard 'sanitize-html' to strip unsafe tags and attributes.
 * @param raw - The raw HTML string or unknown value
 * @returns Sanitized safe HTML string
 */
export const sanitizeRichHtml = (raw: unknown): string => {
  return sanitizeHtml(String(raw ?? ""), {
    allowedTags: [
      "p", "br", "strong", "em", "ul", "ol", "li", "a", "span", "div",
      "b", "i", "u", "h1", "h2", "h3", "h4", "h5", "h6"
    ],
    allowedAttributes: {
      a: ["href", "name", "target", "rel"],
      span: ["style"],
      div: ["style"],
      p: ["style"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    disallowedTagsMode: "discard",
  });
};

/**
 * Check if metric is free text
 * @param m 
 * @returns 
 */
export const isFreeText = (m: IMetric) => {
  const settings = m.settings || {};
  return settings.metric_column_name === "free_text" && settings.type === "text";
};

/**
 * Check if metric is embed
 * @param m 
 * @returns 
 */
export const isEmbed = (m: IMetric) => {
  const settings = m.settings || {};
  const typeValue = String(settings.type || "").toLowerCase();
  return typeValue === "embed" || settings.is_embed === true;
};

/**
 * Safe Url parsing for embed metrics
 * @param raw 
 * @returns 
 */
export const toSafeExternalUrl = (raw: unknown): string | null => {
    try {
    const parsed = new URL(String(raw ?? ""));
    if (parsed.protocol === "http:" || parsed.protocol === "https:") return parsed.toString();
    return null;
    } catch {
    return null;
    }
 };
    