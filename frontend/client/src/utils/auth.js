// utils/auth.js
// Requires: npm install jwt-decode
import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = "accessToken"; // matches Login.jsx and the rest of the app

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);

export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export const getDecodedUser = () => {
  const token = getToken();
  if (!token) return null;
  try {
    return jwtDecode(token); // e.g. { id, role, exp, iat, ... }
  } catch (err) {
    return null;
  }
};

export const getUserRole = () => getDecodedUser()?.role || null;

export const isTokenExpired = () => {
  const decoded = getDecodedUser();
  if (!decoded?.exp) return true;
  return Date.now() >= decoded.exp * 1000;
};

export const isAuthenticated = () => !!getToken() && !isTokenExpired();
