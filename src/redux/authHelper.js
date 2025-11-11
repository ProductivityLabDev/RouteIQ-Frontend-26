import jwt_decode from "jwt-decode";

export function decodeToken(token) {
  try {
    return jwt_decode(token);
  } catch (e) {
    console.error("Invalid token", e);
    return null;
  }
}
