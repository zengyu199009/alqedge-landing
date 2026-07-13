/**
 * Unified error handler for frontend API calls.
 * Maps technical error messages to user-friendly messages.
 */

const ERROR_MAP: Record<string, string> = {
  "NetworkError": "Unable to connect to the server. Please check your internet connection and try again.",
  "AbortError": "The request timed out. Please try again.",
  "Failed to fetch": "Unable to connect to the server. Please check your internet connection and try again.",
  "Internal Server Error": "Something went wrong on our end. Please try again later.",
  "Service Unavailable": "Our service is temporarily unavailable. Please try again in a few minutes.",
  "Gateway Timeout": "The server is taking too long to respond. Please try again.",
  "Bad Gateway": "We're experiencing connectivity issues. Please try again later.",
  "Forbidden": "You don't have permission to perform this action.",
  "Not Found": "The requested resource was not found.",
  "Unauthorized": "Your session has expired. Please sign in again.",
  "Too Many Requests": "You've made too many requests. Please wait a moment and try again.",
};

/**
 * Convert a technical error to a user-friendly message.
 * @param error - The error object or message
 * @returns A user-friendly error message string
 */
export function toUserFriendlyError(error: unknown): string {
  if (!error) return "An unexpected error occurred. Please try again.";

  // If it's an Error object with a message
  const message = typeof error === "string" ? error : (error as Error)?.message || String(error);

  // Check for exact matches
  if (ERROR_MAP[message]) return ERROR_MAP[message];

  // Check for partial matches (case-insensitive)
  const lowerMsg = message.toLowerCase();
  for (const [key, friendly] of Object.entries(ERROR_MAP)) {
    if (lowerMsg.includes(key.toLowerCase())) return friendly;
  }

  // Check for HTTP status codes
  const statusMatch = message.match(/HTTP\s+(\d+)/);
  if (statusMatch) {
    const status = parseInt(statusMatch[1]);
    if (status >= 500) return "Our server encountered an error. Please try again later.";
    if (status === 429) return "You've made too many requests. Please wait a moment and try again.";
    if (status === 403) return "You don't have permission to perform this action.";
    if (status === 404) return "The requested resource was not found.";
    if (status === 401) return "Your session has expired. Please sign in again.";
  }

  // Check for common patterns
  if (lowerMsg.includes("timeout") || lowerMsg.includes("timed out")) {
    return "The request timed out. Please try again.";
  }
  if (lowerMsg.includes("network") || lowerMsg.includes("connection") || lowerMsg.includes("econnrefused")) {
    return "Unable to connect to the server. Please check your internet connection.";
  }
  if (lowerMsg.includes("rate limit") || lowerMsg.includes("too many")) {
    return "You've made too many requests. Please wait a moment and try again.";
  }
  if (lowerMsg.includes("not found") || lowerMsg.includes("404")) {
    return "The requested resource was not found.";
  }
  if (lowerMsg.includes("unauthorized") || lowerMsg.includes("unauthenticated") || lowerMsg.includes("invalid token")) {
    return "Your session has expired. Please sign in again.";
  }

  // Default fallback - don't expose technical details
  return "An unexpected error occurred. Please try again.";
}

/**
 * Wrapper for fetch that provides user-friendly error messages.
 */
export async function safeFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  try {
    const response = await fetch(input, init);
    if (!response.ok) {
      const errorText = `HTTP ${response.status}: ${response.statusText}`;
      throw new Error(errorText);
    }
    return response;
  } catch (error) {
    // Re-throw with user-friendly message
    const friendlyMessage = toUserFriendlyError(error);
    throw new Error(friendlyMessage);
  }
}
