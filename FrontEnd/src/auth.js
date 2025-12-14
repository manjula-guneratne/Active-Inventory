const accessTokenKey = "at";

// -------------------------------
// Get full API URL
// -------------------------------
export const getFullURL = (path) => {
  // MUST match your .env variable name
  const baseURL =
    import.meta.env.VITE_API_URL || "http://localhost:3000";

  return `${baseURL}${path}`;
};

// -------------------------------
// Token helpers
// -------------------------------
export const saveToken = (token) => {
  localStorage.setItem(accessTokenKey, token);
};

export const getToken = () => {
  return localStorage.getItem(accessTokenKey);
};

export const clearToken = () => {
  localStorage.removeItem(accessTokenKey);
};

export const isLoggedIn = () => {
  return !!getToken();
};

// -------------------------------
// Authenticated fetch
// -------------------------------
export async function authFetch(path, init = {}) {
  const token = getToken();
  if (!token) {
    throw new Error("Valid token not found");
  }

  const headers = new Headers(init.headers || {});
  headers.set("Content-Type", "application/json");

  // Standard way to send JWT
  headers.set("Authorization", `Bearer ${token}`);

  return fetch(getFullURL(path), {
    ...init,
    headers,
  });
}
