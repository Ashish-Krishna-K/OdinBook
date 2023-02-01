import { axiosAuthInstance } from "./helperModule";

export const getUserFromServer = async (params) => {
  try {
    const res = await axiosAuthInstance.get(`/users/${params.id}`);
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

export const getLoggedInUserFromServer = async () => {
  try {
    const res = await axiosAuthInstance.get('/users/login/user');
    return res.data;
  } catch (error) {
    return error.response.data;
  }
}
