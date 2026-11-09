/**
 * Image proxy for the PDF renderer (avoids CORS on backend images).
 * Takes a backend `path`, never a URL: the target host always comes from env, and the
 * response is restricted to small raster images.
 */
import { NextRequest, NextResponse } from "next/server";
import { env } from "@/shared/config/env";

const ALLOWED_PREFIX = "/images/";
const MAX_BYTES = 5 * 1024 * 1024;
const TIMEOUT_MS = 5_000;
// SVG is deliberately excluded: served from our origin it could run script.
const ALLOWED_CONTENT_TYPE = /^image\/(png|jpeg|gif|webp|avif)$/;
// Backslash, "?", "#", "//", "..", and percent-encoded dot / slash / backslash / NUL.
const UNSAFE_PATH = /[\\?#]|\/\/|\.\.|%2e|%2f|%5c|%00/i;

const hasControlChar = (value: string) =>
  [...value].some((char) => {
    const code = char.charCodeAt(0);
    return code < 0x20 || code === 0x7f;
  });

const fail = (message: string, status: number) =>
  NextResponse.json({ error: message }, { status });

function resolveTarget(path: string | null): URL | null {
  if (
    !path ||
    !path.startsWith(ALLOWED_PREFIX) ||
    UNSAFE_PATH.test(path) ||
    hasControlChar(path)
  ) {
    return null;
  }

  const target = new URL(path, env.API_URL);
  const valid =
    target.origin === env.API_URL &&
    target.pathname.startsWith(ALLOWED_PREFIX) &&
    !target.search &&
    !target.hash;

  return valid ? target : null;
}

async function readLimited(response: Response): Promise<Buffer | "too-large"> {
  const reader = response.body?.getReader();
  if (!reader) return Buffer.alloc(0);

  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > MAX_BYTES) {
      await reader.cancel();
      return "too-large";
    }
    chunks.push(value);
  }
  return Buffer.concat(chunks);
}

export async function GET(request: NextRequest) {
  const target = resolveTarget(request.nextUrl.searchParams.get("path"));
  if (!target) return fail("Invalid image path", 400);

  let upstream: Response;
  try {
    upstream = await fetch(target, {
      redirect: "error",
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
  } catch (error) {
    console.error("Image proxy upstream error:", error);
    return fail("Failed to fetch image", 502);
  }

  if (!upstream.ok) return fail("Failed to fetch image", upstream.status);

  const contentType =
    upstream.headers.get("content-type")?.split(";")[0].trim().toLowerCase() ??
    "";
  if (!ALLOWED_CONTENT_TYPE.test(contentType)) {
    await upstream.body?.cancel();
    return fail("Unsupported image type", 415);
  }

  if (Number(upstream.headers.get("content-length")) > MAX_BYTES) {
    await upstream.body?.cancel();
    return fail("Image too large", 413);
  }

  const body = await readLimited(upstream);
  if (body === "too-large") return fail("Image too large", 413);
  if (body.length === 0) return fail("Empty image", 502);

  return new NextResponse(new Uint8Array(body), {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "private, max-age=3600",
    },
  });
}

export const dynamic = "force-dynamic";
