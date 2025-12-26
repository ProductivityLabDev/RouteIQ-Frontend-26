import { jwtDecode } from "jwt-decode";

/**
 * Decode a JWT token safely.
 * Returns `null` if the token is invalid.
 */
export function decodeToken<T extends object = Record<string, unknown>>(
  token: string
): T | null {
  try {
    return jwtDecode<T>(token);
  } catch (e) {
    console.error("Invalid token", e);
    return null;
  }
}


