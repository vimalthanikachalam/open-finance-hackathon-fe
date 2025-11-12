/**
 * Session storage utilities for managing auth state in cookies
 * Session expires after 600 seconds (10 minutes)
 */

const SESSION_EXPIRY_SECONDS = 600;

interface SessionData {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  tokenExpiresIn: number;
  tokenScope: string;
  grantedConsents: Record<string, boolean>;
  consentId: string | null;
  expiresAt: number; // Timestamp when session expires
}

/**
 * Set a cookie with name, value, and expiry
 */
function setCookie(name: string, value: string, maxAgeSeconds: number) {
  if (typeof document === "undefined") return;

  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax`;
}

/**
 * Get a cookie value by name
 */
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

/**
 * Delete a cookie by name
 */
function deleteCookie(name: string) {
  if (typeof document === "undefined") return;

  document.cookie = `${name}=; path=/; max-age=0`;
}

/**
 * Save session data to cookies
 */
export function saveSession(data: Omit<SessionData, "expiresAt">): void {
  const expiresAt = Date.now() + SESSION_EXPIRY_SECONDS * 1000;

  const sessionData: SessionData = {
    ...data,
    expiresAt,
  };

  setCookie(
    "auth_session",
    JSON.stringify(sessionData),
    SESSION_EXPIRY_SECONDS
  );
}

/**
 * Load session data from cookies
 * Returns null if session doesn't exist or has expired
 */
export function loadSession(): SessionData | null {
  const sessionStr = getCookie("auth_session");

  if (!sessionStr) return null;

  try {
    const session: SessionData = JSON.parse(sessionStr);

    // Check if session has expired
    if (Date.now() > session.expiresAt) {
      clearSession();
      return null;
    }

    return session;
  } catch (error) {
    console.error("Error parsing session data:", error);
    clearSession();
    return null;
  }
}

/**
 * Clear session data from cookies
 */
export function clearSession(): void {
  deleteCookie("auth_session");
}

/**
 * Check if a valid session exists
 */
export function hasValidSession(): boolean {
  return loadSession() !== null;
}

/**
 * Get remaining session time in seconds
 */
export function getSessionTimeRemaining(): number {
  const session = loadSession();
  if (!session) return 0;

  const remaining = Math.max(
    0,
    Math.floor((session.expiresAt - Date.now()) / 1000)
  );
  return remaining;
}
