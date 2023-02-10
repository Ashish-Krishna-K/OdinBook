import { Navigate, Outlet } from "react-router-dom";
import { getAuthTokenFromLocalStorage } from "./helperModule";
import CreatePostSection from "./components/CreatePostOuterSection";
import Header from "./components/Header";

export default function App() {
  return (
    <>
      {
        !getAuthTokenFromLocalStorage() ? <Navigate to="/login" /> :
          <>
            <Header />
            <main>
              <CreatePostSection />
              <section className="shrink-horizontally">
                <Outlet />
              </section>
            </main>
          </>
      }
    </>
  );
}

