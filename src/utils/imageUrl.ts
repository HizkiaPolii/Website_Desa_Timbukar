/**
 * Image URL Helper Utility
 * Handles conversion of relative backend URLs to full URLs
 * Works with images from both local storage and backend API
 */

/**
 * Convert relative or partial image paths to full URLs
 * @param imagePath - The image path (can be relative like "/uploads/..." or full URL)
 * @param fallback - Fallback image if path is empty
 * @returns Full image URL ready for use in Next.js Image component
 */
export const getImageUrl = (
  imagePath: string | null | undefined,
  fallback: string = "/images/placeholder.svg"
): string => {
  if (!imagePath) return fallback;

  // Already a full URL (http/https)
  if (imagePath.startsWith("http")) {
    // Fix: Remove /api/ from URL if it's there (backend issue)
    // https://api.desatimbukar.id/api/uploads/... → https://api.desatimbukar.id/uploads/...
    if (imagePath.includes("/api/uploads/")) {
      return imagePath.replace("/api/uploads/", "/uploads/");
    }
    return imagePath;
  }

  // Relative path from backend API
  if (imagePath.startsWith("/uploads/")) {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.desatimbukar.id/api";
    const baseUrl = apiUrl.replace("/api", "");
    return `${baseUrl}${imagePath}`;
  }

  // Local image path
  if (imagePath.startsWith("/images/")) return imagePath;

  // Fallback: assume relative path, construct to images
  return `/images/${imagePath}`;
};

/**
 * Format image URL for Next.js Image component
 * Ensures the URL is properly formatted for image optimization
 * @param imagePath - The image path
 * @param fallback - Fallback image if path is empty
 * @returns Formatted image URL
 */
export const formatImageUrl = (
  imagePath: string | null | undefined,
  fallback: string = "/images/placeholder.svg"
): string => {
  return getImageUrl(imagePath, fallback);
};

/**
 * Get image dimension hints for optimization
 * Returns width and height for better Next.js Image optimization
 * @param type - Type of image ('avatar', 'card', 'hero', 'thumbnail')
 * @returns Object with width and height
 */
export const getImageDimensions = (
  type: "avatar" | "card" | "hero" | "thumbnail" = "card"
) => {
  const dimensions = {
    avatar: { width: 128, height: 128 },
    card: { width: 400, height: 300 },
    hero: { width: 1200, height: 600 },
    thumbnail: { width: 200, height: 200 },
  };

  return dimensions[type];
};
