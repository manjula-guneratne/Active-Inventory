const accessTokenKey = "at";

// Get full API URL
export const getFullURL = (path) => {
  const envBase = import.meta.env.VITE_API_BASE;
  const baseURL = envBase ? envBase : "http://localhost:3000";
  return `${baseURL}${path}`;
};

// Token helpers
export const saveToken = (token) => localStorage.setItem(accessTokenKey, token);
export const getToken = () => localStorage.getItem(accessTokenKey);
export const clearToken = () => localStorage.removeItem(accessTokenKey);
export const isLoggedIn = () => !!getToken();

// Authenticated fetch
export async function authFetch(input, init = {}) {
  const token = getToken();
  const headers = new Headers(init.headers || {});

  if (token) {
    headers.set("token", `Bearer ${token}`); 
    return fetch(input, { ...init, headers });
  } else {
    throw new Error("valid token not found");
  }
}
