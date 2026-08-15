import { marked } from "marked";

// Configure marked parser for GitHub Flavored Markdown (GFM)
marked.setOptions({
  gfm: true,
  breaks: true,
});

/**
 * Render Markdown to HTML using industry-standard 'marked' library
 * Utility Layer - Pure Function wrapper
 */
export function renderMarkdown(text) {
  if (!text || typeof text !== "string") return "";
  try {
    return marked.parse(text);
  } catch (error) {
    console.error("Markdown parse error:", error);
    return text;
  }
}
