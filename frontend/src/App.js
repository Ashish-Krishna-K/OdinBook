import { Navigate, Outlet, useLoaderData } from "react-router-dom";
import { getAuthTokenFromLocalStorage, saveUserInfoInLocalStorage } from "./helperModule";
import Header from "./components/Header";
import { useEffect } from "react";

export default function App() {
  const loader = useLoaderData();

  useEffect(() => {
    saveUserInfoInLocalStorage(loader);
  }, [loader])

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

