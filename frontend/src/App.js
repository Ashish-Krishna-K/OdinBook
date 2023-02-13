import { Navigate, Outlet } from "react-router-dom";
import {
  getAuthTokenFromLocalStorage,
  getThemePreferenceFromLocalStorage,
  generateAxiosInstance,
  rootRef,
  checkForEquality,
} from "./helperModule";
import CreatePostSection from "./components/CreatePostOuterSection";
import Header from "./components/Header";
import { useImmer } from "use-immer";
import { ThemeContext, CurrentUserContext } from "./context";
import { useEffect } from "react";

export default function App() {
  const [currentUser, setCurrentUser] = useImmer(null);
  const [theme, setTheme] = useImmer(() => getThemePreferenceFromLocalStorage());
  for (let key in rootRef) {
    if (theme === 'dark') {
      rootRef[key].classList.add('dark-theme');
    } else {
      rootRef[key].classList.remove('dark-theme');
    }
  };

  const getLoggedInUserFromServer = async () => {
    const instance = generateAxiosInstance();
    try {
      const res = await instance.get('/users/login/user');
      const user = res.data;
      if (!currentUser && !checkForEquality(currentUser, user)) {
        setCurrentUser(user);
      }
    } catch (error) {
      console.log(error.response);
    }
  }

  useEffect(() => {
    console.log(currentUser);
    if (getAuthTokenFromLocalStorage()) {
      getLoggedInUserFromServer();
    }
  });

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <CurrentUserContext.Provider value={{ currentUser }}>
        {
          !getAuthTokenFromLocalStorage() ? <Navigate to="/login" /> :
            <>
              {
                currentUser &&
                <>
                  <Header />
                  <main>
                    <section className="shrink-horizontally">
                      <CreatePostSection />
                      <Outlet />
                    </section>
                  </main>
                </>
              }
            </>
        }
      </CurrentUserContext.Provider>
    </ThemeContext.Provider>
  );
}

