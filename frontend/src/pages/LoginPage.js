import {
  Navigate,
  useParams
} from "react-router-dom"
import ReactLoading from 'react-loading';

import {
  getAuthTokenFromLocalStorage,
  saveTokenToLocalStorage,
} from "../helperModule";

import GuestLogin from "../components/GuestLogin";

export default function LoginPage() {
  const { token } = useParams();

  if (token) {
    saveTokenToLocalStorage(token);
  }

  return (
    <>
      {
        getAuthTokenFromLocalStorage() ? <Navigate to='/' /> :
          <section id="login-page">
            <h1>ODINBOOK</h1>
            <div className="login-section">
              {
                token ? <ReactLoading type="bars" color={'#656768'} /> :
                  <div className="login-modal">
                    <button className="login-with-fb-btn">
                      <a href={`${process.env.REACT_APP_API_DOMAIN}/api/users/login/facebook`}>Login With Facebook</a>
                    </button>
                    <GuestLogin />
                  </div>
              }
            </div>
          </section>
      }
    </>
  )
}