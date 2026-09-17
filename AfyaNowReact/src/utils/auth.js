/* =========================================================
   AUTH SESSION HELPERS
   The real authentication happens against the backend API
   (POST /auth/register and POST /auth/login). These helpers
   persist the authenticated user + access token returned by
   the backend so the UI can stay authenticated.
========================================================= */

const USER_KEY = "afyanowUser";
const SESSION_KEY = "afyanowSession";
const TOKEN_KEY = "afyanowAccessToken";

export function saveSession(user, accessToken) {
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  if (accessToken) localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(SESSION_KEY, "true");
}

export function clearSession() {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(SESSION_KEY);
}

export function logoutUser() {
  clearSession();
}

export function isLoggedIn() {
  return localStorage.getItem(SESSION_KEY) === "true";
}

export function getUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}