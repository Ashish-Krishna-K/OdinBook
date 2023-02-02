import { Navigate, Outlet } from "react-router-dom";
import { getAuthTokenFromLocalStorage } from "./helperModule";
import Header from "./components/Header";

export default function App() {
  return (
    <>
      {
        !getAuthTokenFromLocalStorage() ? <Navigate to="/login" /> :
          <>
            <Header />
            <main>
              <Outlet />
            </main>
          </>
      }
    </>
  );
}

