/**
 * Utility functions for email verification
 */

/**
 * Validate OTP format (6 digits)
 */
export function isValidOTP(otp: string): boolean {
  return /^\d{6}$/.test(otp);
}

/**
 * Format time remaining (seconds to MM:SS)
 */
export function formatTimeRemaining(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

/**
 * Mask email for display (e.g., "user@example.com" -> "u***@example.com")
 */
export function maskEmail(email: string): string {
  if (!email || !email.includes("@")) return email;
  
  const [localPart, domain] = email.split("@");
  if (localPart.length <= 2) return email;
  
  const maskedLocal = localPart[0] + "***" + localPart[localPart.length - 1];
  return `${maskedLocal}@${domain}`;
}

/**
 * Check if verification code is expired
 */
export function isCodeExpired(expiryTime: Date | string): boolean {
  const expiry = new Date(expiryTime);
  return new Date() > expiry;
}

/**
 * Calculate time remaining until expiry
 */
export function getTimeUntilExpiry(expiryTime: Date | string): number {
  const expiry = new Date(expiryTime);
  const now = new Date();
  const diff = expiry.getTime() - now.getTime();
  return Math.max(0, Math.floor(diff / 1000)); // seconds
}
