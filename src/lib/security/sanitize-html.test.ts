import { sanitizeRichText } from "./sanitize-html";

const DANGEROUS =
  /<script|<style|<iframe|<svg|<object|<embed|<form|\son\w+\s*=|javascript:|expression\(|url\(/i;

describe("sanitizeRichText", () => {
  it("returns an empty string for empty input", () => {
    expect(sanitizeRichText("")).toBe("");
  });

  it("keeps escaped text", () => {
    expect(sanitizeRichText("<p>a &lt; b</p>")).toBe("<p>a &lt; b</p>");
  });

  it.each([
    ["script", "<script>alert(1)</script><p>ok</p>"],
    ["style", "<style>body{display:none}</style><p>ok</p>"],
    ["iframe", '<iframe src="https://evil.test">x</iframe><p>ok</p>'],
    ["object", '<object data="x"></object><p>ok</p>'],
    ["form", '<form action="https://evil.test"><input></form><p>ok</p>'],
  ])("drops %s tags and their content", (_n, html) => {
    expect(sanitizeRichText(html)).toBe("<p>ok</p>");
  });

  it("strips event handlers", () => {
    expect(sanitizeRichText('<p onclick="alert(1)">x</p>')).toBe("<p>x</p>");
    const img = sanitizeRichText(
      '<img src="https://x.test/a.png" onerror="alert(1)">'
    );
    expect(img).not.toMatch(DANGEROUS);
    expect(img).toContain('src="https://x.test/a.png"');
  });

  it.each([
    "javascript:alert(1)",
    "JaVaScRiPt:alert(1)",
    "data:text/html;base64,PHNjcmlwdD4=",
    "vbscript:msgbox(1)",
  ])("removes dangerous link href %p but keeps the text", (href) => {
    const out = sanitizeRichText(`<a href="${href}">click</a>`);
    expect(out).toContain("click");
    expect(out).not.toMatch(/javascript:|vbscript:|data:/i);
  });

  it("allows http, https and mailto links", () => {
    expect(sanitizeRichText('<a href="https://x.test">a</a>')).toContain(
      'href="https://x.test"'
    );
    expect(sanitizeRichText('<a href="mailto:a@x.test">a</a>')).toContain(
      'href="mailto:a@x.test"'
    );
  });

  it("forces rel on target=_blank links and normalizes other targets", () => {
    const blank = sanitizeRichText(
      '<a href="https://x.test" target="_blank">x</a>'
    );
    expect(blank).toContain('rel="noopener noreferrer nofollow"');
    const top = sanitizeRichText(
      '<a href="https://x.test" target="_top">x</a>'
    );
    expect(top).toContain('target="_blank"');
    expect(top).toContain('rel="noopener noreferrer nofollow"');
  });

  it("removes svg", () => {
    const out = sanitizeRichText(
      '<svg onload="alert(1)"><circle/></svg><p>ok</p>'
    );
    expect(out).toBe("<p>ok</p>");
  });

  it("only allows raster data URIs on images", () => {
    const ok = sanitizeRichText(
      '<img src="data:image/png;base64,iVBORw0KGgo=" alt="a">'
    );
    expect(ok).toContain("data:image/png;base64,iVBORw0KGgo=");

    expect(
      sanitizeRichText('<img src="data:image/svg+xml;base64,PHN2Zz4=">')
    ).toBe("");
    expect(sanitizeRichText('<img src="data:text/html;base64,AAAA">')).toBe("");
    expect(sanitizeRichText('<img src="javascript:alert(1)">')).toBe("");
  });

  it("only allows colour styles", () => {
    const ok = sanitizeRichText(
      '<span style="color: rgb(230, 0, 0); background-color: #fff">x</span>'
    );
    expect(ok).toMatch(/color:\s*rgb\(230, 0, 0\)/);
    expect(ok).toMatch(/background-color:\s*#fff/);

    const bad = sanitizeRichText(
      '<span style="color:red;background:url(javascript:alert(1));position:fixed">x</span>'
    );
    expect(bad).not.toMatch(DANGEROUS);
    expect(bad).not.toContain("position");
    expect(bad).toMatch(/color:\s*red/);

    expect(
      sanitizeRichText('<span style="color:expression(alert(1))">x</span>')
    ).not.toMatch(/expression/);
  });

  it("keeps only ql- classes", () => {
    expect(sanitizeRichText('<p class="evil">x</p>')).toBe("<p>x</p>");
    expect(sanitizeRichText('<pre class="ql-syntax">c</pre>')).toBe(
      '<pre class="ql-syntax">c</pre>'
    );
  });

  it("preserves typical Quill output", () => {
    const quill =
      "<h2>Title</h2><p><strong>b</strong> <em>i</em> <u>u</u> <s>s</s> x<sub>1</sub><sup>2</sup></p>" +
      '<ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>item</li></ol>' +
      '<blockquote>q</blockquote><pre class="ql-syntax" spellcheck="false">code</pre>';
    const out = sanitizeRichText(quill);
    for (const fragment of [
      "<h2>Title</h2>",
      "<strong>b</strong>",
      "<em>i</em>",
      "<u>u</u>",
      "<s>s</s>",
      "<sub>1</sub>",
      "<sup>2</sup>",
      'data-list="bullet"',
      "<blockquote>q</blockquote>",
      'class="ql-syntax"',
    ]) {
      expect(out).toContain(fragment);
    }
    expect(out).not.toContain("contenteditable");
  });
});
