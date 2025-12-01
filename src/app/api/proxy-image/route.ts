/**
 * API Route to proxy images for PDF rendering
 * Solves CORS issues when fetching images from backend
 */

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const imageUrl = searchParams.get("url");

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 }
      );
    }

    // Validate URL to prevent SSRF attacks
    const url = new URL(imageUrl);
    const allowedHosts = [
      "localhost:8081",
      process.env.NEXT_PUBLIC_API_URL?.replace(/^https?:\/\//, ""),
    ].filter(Boolean);

    if (!allowedHosts.some((host) => url.host === host)) {
      return NextResponse.json(
        { error: "Invalid image URL" },
        { status: 403 }
      );
    }

    // Fetch image from backend
    const response = await fetch(imageUrl, {
      headers: {
        // Forward authentication if needed
        // "Authorization": request.headers.get("authorization") || "",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch image" },
        { status: response.status }
      );
    }

    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") || "image/jpeg";

    // Return image with proper headers
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Image proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
