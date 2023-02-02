import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { generateAxiosInstance, getAuthTokenFromLocalStorage, saveTokenToLocalStorage, saveUserInfoInLocalStorage } from "../helperModule";


export default function LoginPage() {
  const navigate = useNavigate();
  const { token } = useParams();

  const getLoggedInUserFromServer = async () => {
    const instance = generateAxiosInstance();
    try {
      const res = await instance.get('/users/login/user');
      saveUserInfoInLocalStorage(res.data);
      navigate('/')
    } catch (error) {
      if (!getAuthTokenFromLocalStorage()) {
        navigate('/login')
      } else {
        if (error.response.status === 404) {
          getLoggedInUserFromServer()
        }
      }

    }
  }

  useEffect(() => {
    if (token) {
      saveTokenToLocalStorage(token);
      getLoggedInUserFromServer();
    }
  })

  return (
    <>
      {
        token ? <p>Please wait...</p> :
          <a href={`${process.env.REACT_APP_API_DOMAIN}/api/users/login/facebook`}>Login With Facebook</a>
      }
    </>
  )
}