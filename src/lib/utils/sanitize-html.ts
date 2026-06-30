/**
 * Server-safe HTML sanitizer with strict allowlist approach.
 * Only permits known safe tags and attributes — everything else is stripped.
 * This protects against XSS from AI-generated HTML content (Gemini pipeline).
 */

const ALLOWED_TAGS = new Set([
  "h1", "h2", "h3", "h4", "h5", "h6",
  "p", "br", "hr",
  "ul", "ol", "li",
  "strong", "em", "b", "i", "u", "s",
  "a", "span", "div",
  "table", "thead", "tbody", "tr", "th", "td",
  "blockquote", "code", "pre",
]);

const ALLOWED_ATTRS: Record<string, Set<string>> = {
  a: new Set(["href", "title", "target", "rel"]),
  th: new Set(["colspan", "rowspan"]),
  td: new Set(["colspan", "rowspan"]),
};

/** Strip all HTML tags that aren't in the allowlist */
export function sanitizeHtml(html: string): string {
  if (!html) return "";

  // 1. Remove all <script> and <style> blocks entirely (content + tags)
  let sanitized = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");

  // 2. Remove HTML comments
  sanitized = sanitized.replace(/<!--[\s\S]*?-->/g, "");

  // 3. Process each HTML tag
  sanitized = sanitized.replace(/<\/?([a-z][a-z0-9]*)\b([^>]*)?\/?>/gi, (match, tagName: string, attrs: string) => {
    const tag = tagName.toLowerCase();

    // If tag is not in allowlist, remove it entirely
    if (!ALLOWED_TAGS.has(tag)) return "";

    // Closing tag — allow it
    if (match.startsWith("</")) return `</${tag}>`;

    // Self-closing tags like <br/> <hr/>
    const isSelfClosing = match.endsWith("/>");

    // Filter attributes
    const allowedAttrs = ALLOWED_ATTRS[tag];
    let safeAttrs = "";

    if (allowedAttrs && attrs) {
      const attrMatches = attrs.matchAll(/([a-z][a-z0-9-]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|(\S+)))?/gi);
      for (const attrMatch of attrMatches) {
        const attrName = attrMatch[1].toLowerCase();
        const attrValue = attrMatch[2] ?? attrMatch[3] ?? attrMatch[4] ?? "";

        if (!allowedAttrs.has(attrName)) continue;

        // Block dangerous URI schemes in href
        if (attrName === "href") {
          const trimmedVal = attrValue.trim().toLowerCase();
          if (
            trimmedVal.startsWith("javascript:") ||
            trimmedVal.startsWith("vbscript:") ||
            trimmedVal.startsWith("data:")
          ) {
            continue;
          }
        }

        safeAttrs += ` ${attrName}="${escapeAttrValue(attrValue)}"`;
      }
    }

    // Force rel="noopener noreferrer" and target="_blank" on all links
    if (tag === "a") {
      if (!safeAttrs.includes('rel=')) {
        safeAttrs += ' rel="noopener noreferrer"';
      }
      if (!safeAttrs.includes('target=')) {
        safeAttrs += ' target="_blank"';
      }
    }

    return isSelfClosing ? `<${tag}${safeAttrs} />` : `<${tag}${safeAttrs}>`;
  });

  // 4. Remove any remaining event handlers that slipped through
  sanitized = sanitized.replace(/\bon\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "");

  return sanitized.trim();
}

/** Escape attribute values to prevent attribute injection */
function escapeAttrValue(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
