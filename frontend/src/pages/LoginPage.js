import { useNavigate, useParams } from "react-router-dom"
import GuestLogin from "../components/GuestLogin";
import {
  generateAxiosInstance,
  getAuthTokenFromLocalStorage,
  saveTokenToLocalStorage,
  saveUserInfoInLocalStorage
} from "../helperModule";

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

  if (token) {
    saveTokenToLocalStorage(token);
    getLoggedInUserFromServer();
  }

  return (
    <section id="login-page">
      <h1>ODINBOOK</h1>
      <div className="login-section">
        {
          token ? <p>Please wait...</p> :
            <div className="login-modal">
              <button className="login-with-fb-btn">
                <a href={`${process.env.REACT_APP_API_DOMAIN}/api/users/login/facebook`}>Login With Facebook</a>
              </button>
              <GuestLogin />
            </div>
        }
      </div>
    </section>
  )
}