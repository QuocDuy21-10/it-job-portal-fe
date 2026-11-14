// URL parsers drop tab and newline, so "/\t/evil.com" would be read as "//evil.com".
const CONTROL_CHARS = /[\u0000-\u001f\u007f]/;

/**
 * Returns `value` only when it is a path on this site ("/x"); otherwise `fallback`.
 * "//host" and "/\host" are rejected: browsers treat both as another origin.
 */
export function safeInternalPath(
  value: string | null | undefined,
  fallback: string
): string {
  if (
    !value ||
    value[0] !== "/" ||
    value[1] === "/" ||
    value[1] === "\\" ||
    CONTROL_CHARS.test(value)
  ) {
    return fallback;
  }
  return value;
}
