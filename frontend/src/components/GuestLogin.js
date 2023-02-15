import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  clearLocalStorage,
  saveTokenToLocalStorage
} from "../helperModule"

export default function GuestLogin() {
  const navigate = useNavigate();
  const getGuestTokenFromServer = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_DOMAIN}/api/users/guest/login`);
      const token = res.data;
      saveTokenToLocalStorage(token);
      navigate('/');
    } catch (error) {
      console.log(error);
      console.log(error.response.status, error.response.data.message);
      if (error.response.status === 404) {
        navigate('/login');
      }
    }
  }
  const handleBtnClick = () => {
    clearLocalStorage();
    getGuestTokenFromServer();
  };
  return <button onClick={handleBtnClick}>Login as guest</button>
}