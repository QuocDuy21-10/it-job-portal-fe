import sanitizeHtml from "sanitize-html";

// Allowlist mirrors what RichTextEditor (Quill) can produce, plus nothing else.
const COLOR_VALUE = [
  /^#[0-9a-f]{3,8}$/i,
  /^rgba?\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*(,\s*(0|1|0?\.\d+)\s*)?\)$/i,
  /^[a-z]{3,20}$/i,
];

// Quill embeds pasted/uploaded images as base64; raster only (no SVG).
const SAFE_DATA_IMAGE =
  /^data:image\/(png|jpeg|gif|webp);base64,[a-z0-9+/=]+$/i;

const OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "h1",
    "h2",
    "h3",
    "p",
    "br",
    "strong",
    "b",
    "em",
    "i",
    "u",
    "s",
    "del",
    "blockquote",
    "pre",
    "code",
    "ul",
    "ol",
    "li",
    "sub",
    "sup",
    "a",
    "span",
    "img",
  ],
  allowedAttributes: {
    a: ["href", "target", "rel"],
    img: ["src", "alt", "width", "height"],
    li: ["data-list"],
    "*": ["class", "style"],
  },
  allowedClasses: { "*": ["ql-*"] },
  allowedStyles: {
    "*": { color: COLOR_VALUE, "background-color": COLOR_VALUE },
  },
  allowedSchemes: ["http", "https", "mailto"],
  allowedSchemesByTag: { img: ["http", "https", "data"] },
  // Drop the content of these too, not just the tag.
  nonTextTags: [
    "script",
    "style",
    "textarea",
    "option",
    "iframe",
    "object",
    "embed",
    "form",
    "noscript",
  ],
  transformTags: {
    a: (tagName, attribs) =>
      attribs.target
        ? {
            tagName,
            attribs: {
              ...attribs,
              target: "_blank",
              rel: "noopener noreferrer nofollow",
            },
          }
        : { tagName, attribs },
    img: (tagName, attribs) => {
      const src = attribs.src ?? "";
      if (src.startsWith("data:") && !SAFE_DATA_IMAGE.test(src)) {
        const rest = { ...attribs };
        delete rest.src;
        return { tagName, attribs: rest };
      }
      return { tagName, attribs };
    },
  },
  // An <img> whose src was rejected is meaningless; remove it.
  exclusiveFilter: (frame) => frame.tag === "img" && !frame.attribs.src,
};

export function sanitizeRichText(html: string): string {
  return sanitizeHtml(html, OPTIONS);
}
