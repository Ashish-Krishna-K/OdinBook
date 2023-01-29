import axios from "axios"

export const getAuthTokenFromLocalStorage = () => {
  return JSON.parse(localStorage.getItem('AUTH_TOKEN')) || false
}

export const saveTokenToLocalStorage = (token) => {
  localStorage.setItem('AUTH_TOKEN', JSON.stringify(token));
}

export const clearLocalStorage = () => {
  localStorage.clear();
}

export const axiosAuthInstance = axios.create({
  baseURL: `${process.env.REACT_APP_API_DOMAIN}/api`,
  headers: {
    Authorization: `Bearer ${getAuthTokenFromLocalStorage()}`,
  }
})
