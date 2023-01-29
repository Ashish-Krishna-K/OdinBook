import axios from "axios"

export const AxiosInstance = axios.create({
  baseURL: `http://localhost:8080/api`
})

export const checkUserInLocalStorage = () => {
  return window.localStorage.getItem('AUTH_TOKEN') ? true : false
}

export const saveTokenToLocalStorage = (token) => {
  window.localStorage.setItem('AUTH_TOKEN', JSON.stringify(token));
}