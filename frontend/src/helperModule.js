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

export const getUserFromServer = async (params) => {
  const instance = generateAxiosInstance();
  try {
    const res = await instance.get(`/users/${params.id}`);
    const toReturn = {
      status: res.status,
      data: res.data,
    }
    return toReturn;
  } catch (error) {
    const toReturn = {
      status: error.response.status,
      data: error.response.data,
    }
    return toReturn;
  }
};
