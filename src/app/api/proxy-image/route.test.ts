/** @jest-environment node */
import { NextRequest } from "next/server";
import { GET } from "./route";

const fetchMock = jest.fn();
global.fetch = fetchMock as unknown as typeof fetch;

const PNG_BYTES = new Uint8Array([0x89, 0x50, 0x4e, 0x47]);

function call(path?: string) {
  const url = new URL("http://localhost:3000/api/proxy-image");
  if (path !== undefined) url.searchParams.set("path", path);
  return GET(new NextRequest(url));
}

function upstream(
  body: BodyInit | null,
  headers: Record<string, string> = {},
  status = 200
) {
  return new Response(body, {
    status,
    headers: { "content-type": "image/png", ...headers },
  });
}

function streamOf(...chunkSizes: number[]) {
  return new ReadableStream<Uint8Array>({
    start(controller) {
      chunkSizes.forEach((size) => controller.enqueue(new Uint8Array(size)));
      controller.close();
    },
  });
}

beforeEach(() => {
  fetchMock.mockReset();
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => jest.restoreAllMocks());

describe("GET /api/proxy-image", () => {
  it("proxies an image from the configured origin with safe headers", async () => {
    fetchMock.mockResolvedValue(upstream(PNG_BYTES));

    const res = await call("/images/avatar/1.png");

    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("image/png");
    expect(res.headers.get("x-content-type-options")).toBe("nosniff");
    expect(res.headers.get("cache-control")).toBe("private, max-age=3600");
    expect(res.headers.get("access-control-allow-origin")).toBeNull();
    expect(new Uint8Array(await res.arrayBuffer())).toEqual(PNG_BYTES);

    const [target, init] = fetchMock.mock.calls[0];
    expect((target as URL).href).toBe(
      "http://localhost:8081/images/avatar/1.png"
    );
    expect(init.redirect).toBe("error");
    expect(init.signal).toBeInstanceOf(AbortSignal);
  });

  it("ignores the removed `url` parameter", async () => {
    const url = new URL("http://localhost:3000/api/proxy-image");
    url.searchParams.set("url", "http://localhost:8081/images/a.png");
    const res = await GET(new NextRequest(url));
    expect(res.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each([
    ["missing", undefined],
    ["empty", ""],
    ["outside /images/", "/etc/passwd"],
    ["absolute URL", "http://evil.test/images/x.png"],
    ["protocol-relative", "//evil.test/images/x.png"],
    ["double slash inside", "/images//evil.test/x.png"],
    ["dot-dot", "/images/../secret"],
    ["encoded dot-dot", "/images/%2e%2e/secret"],
    ["upper-case encoded dot-dot", "/images/%2E%2E/secret"],
    ["encoded slash", "/images/a%2fb.png"],
    ["encoded backslash", "/images/a%5cb.png"],
    ["encoded nul", "/images/a%00b.png"],
    ["backslash", "/images/a\\b.png"],
    ["query", "/images/a.png?x=1"],
    ["hash", "/images/a.png#x"],
    ["control character", "/images/a\u0001b.png"],
  ])("rejects a %s path with 400 and never fetches", async (_name, path) => {
    const res = await call(path);
    expect(res.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns 502 when the upstream request fails (network, timeout or redirect)", async () => {
    fetchMock.mockRejectedValue(new TypeError("fetch failed"));
    expect((await call("/images/a.png")).status).toBe(502);
  });

  it("passes through the upstream error status", async () => {
    fetchMock.mockResolvedValue(upstream(null, {}, 404));
    expect((await call("/images/missing.png")).status).toBe(404);
  });

  it.each(["image/svg+xml", "text/html", "application/octet-stream", ""])(
    "rejects upstream content-type %p with 415",
    async (contentType) => {
      fetchMock.mockResolvedValue(
        upstream(PNG_BYTES, { "content-type": contentType })
      );
      expect((await call("/images/a.png")).status).toBe(415);
    }
  );

  it("accepts a content-type with parameters", async () => {
    fetchMock.mockResolvedValue(
      upstream(PNG_BYTES, { "content-type": "Image/JPEG; charset=binary" })
    );
    const res = await call("/images/a.jpg");
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("image/jpeg");
  });

  it("rejects an oversized declared content-length with 413", async () => {
    fetchMock.mockResolvedValue(
      upstream(PNG_BYTES, { "content-length": String(6 * 1024 * 1024) })
    );
    expect((await call("/images/big.png")).status).toBe(413);
  });

  it("rejects an oversized streamed body without content-length with 413", async () => {
    const mb = 1024 * 1024;
    fetchMock.mockResolvedValue(upstream(streamOf(3 * mb, 3 * mb)));
    expect((await call("/images/big.png")).status).toBe(413);
  });

  it("returns 502 for an empty body", async () => {
    fetchMock.mockResolvedValue(upstream(null));
    expect((await call("/images/empty.png")).status).toBe(502);
  });
});
