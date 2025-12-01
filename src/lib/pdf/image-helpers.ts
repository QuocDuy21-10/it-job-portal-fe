/**
 * Image Helper Functions for PDF Rendering
 * Handles image URL conversion and data URI generation
 */

/**
 * Convert backend image URL to proxied URL for PDF rendering
 * This solves CORS issues when rendering PDFs
 */
export function getProxiedImageUrl(imageUrl?: string): string | undefined {
  if (!imageUrl) return undefined;

  // If already a data URI, return as is
  if (imageUrl.startsWith("data:")) {
    return imageUrl;
  }

  // If it's a relative URL or backend URL, proxy it
  try {
    const url = new URL(imageUrl, window.location.origin);
    
    // If it's from the backend API, proxy it
    if (
      url.host === "localhost:8081" ||
      url.host === new URL(process.env.NEXT_PUBLIC_API_URL || "").host
    ) {
      return `/api/proxy-image?url=${encodeURIComponent(imageUrl)}`;
    }

    // For external URLs (CDN, etc.), return as is
    return imageUrl;
  } catch (error) {
    console.error("Invalid image URL:", imageUrl, error);
    return undefined;
  }
}

/**
 * Convert image URL to base64 data URI
 * Alternative approach for handling images in PDF
 */
export async function getImageAsDataUri(
  imageUrl: string
): Promise<string | null> {
  try {
    const response = await fetch(imageUrl);
    
    if (!response.ok) {
      console.error("Failed to fetch image:", response.statusText);
      return null;
    }

    const blob = await response.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          reject(new Error("Failed to convert image to data URI"));
        }
      };
      
      reader.onerror = () => {
        reject(new Error("Failed to read image blob"));
      };
      
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error converting image to data URI:", error);
    return null;
  }
}

/**
 * Preload and convert image to data URI for PDF rendering
 * Use this before generating PDF to ensure images are embedded
 */
export async function preloadImageAsDataUri(
  imageUrl?: string
): Promise<string | undefined> {
  if (!imageUrl) return undefined;

  // If already a data URI, return as is
  if (imageUrl.startsWith("data:")) {
    return imageUrl;
  }

  try {
    // Use proxy URL for fetching
    const proxiedUrl = getProxiedImageUrl(imageUrl);
    
    if (!proxiedUrl) {
      return undefined;
    }

    const dataUri = await getImageAsDataUri(proxiedUrl);
    return dataUri || undefined;
  } catch (error) {
    console.error("Failed to preload image:", error);
    return undefined;
  }
}
