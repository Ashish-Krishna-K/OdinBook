import axios from "axios"
import { parseISO, formatDistanceToNow } from "date-fns";
import CryptoJS from "crypto-js";

export const getAuthTokenFromLocalStorage = () => {
  const token = JSON.parse(localStorage.getItem('AUTH_TOKEN'));
  return !token ? false : CryptoJS.AES.decrypt(token, process.env.REACT_APP_ENCRYPTION_SECRET).toString(CryptoJS.enc.Utf8);
}

export const saveTokenToLocalStorage = (token) => {
  const encrypted = CryptoJS.AES.encrypt(token, process.env.REACT_APP_ENCRYPTION_SECRET).toString();
  localStorage.setItem('AUTH_TOKEN', JSON.stringify(encrypted));
}

export const clearLocalStorage = () => {
  localStorage.clear();
}

export const saveUserInfoInLocalStorage = (user) => {
  localStorage.setItem('USER', JSON.stringify(user));
}

export const getCurrentUserInfoFromLocalStorage = () => {
  return JSON.parse(localStorage.getItem('USER'));
}

export const generateAxiosInstance = () => {
  const token = getAuthTokenFromLocalStorage();
  if (!token) return null;
  return axios.create({
    baseURL: `${process.env.REACT_APP_API_DOMAIN}/api`,
    headers: {
      Authorization: `Bearer ${token}`,
    }
  })
};

export const formatDatesForDisplay = (serverDate) => {
  if (!serverDate) return;
  return formatDistanceToNow(parseISO(serverDate));
};

export const objectIsEmpty = (object) => {
  return Object.keys(object).length === 0;
};

export const checkForEquality = (first, second) => {
  return JSON.stringify(first) === JSON.stringify(second);
};

export const toggleBackdrop = () => {
  const root = document.querySelector('.backdrop');
  root.classList.toggle('dim-backdrop');
}

export const getCurrentPathEnd = (path) => {
  const matchedPath = path.match(/\/[a-z]+$/g);
  return matchedPath ? matchedPath[0] : undefined
}