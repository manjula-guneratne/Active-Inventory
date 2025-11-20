const accessTokenKey = "at";
export const getFullURL = (path) => {
  const baseURL = `${import.meta.env.VITE_API_BASE}` || `http://localhost:3000`;
  return `${baseURL}${path}`;
};

export const saveToken = (token) => {
  localStorage.setItem(accessTokenKey, token);
};

export const getToken = () => localStorage.getItem(accessTokenKey);

export const clearToken = () => localStorage.removeItem(accessTokenKey);

export const isLoggedIn = () => {
  const token = getToken();
  console.log("token from local storage", token)
  if (token) {
    return true;
  }
  return false;
};

export async function authFetch(input, init) {
  const token = getToken();
  const headers = new Headers(init.header || {});
  if (token) {
    headers.set("token", token);
    return fetch(input, { ...init, headers });
  } else {
    throw new Error("valid token not found");
  }
}
