import { Navigate, Outlet } from "react-router-dom";
import {
  getAuthTokenFromLocalStorage,
  getThemePreferenceFromLocalStorage,
  rootRef,
} from "./helperModule";
import CreatePostSection from "./components/CreatePostOuterSection";
import Header from "./components/Header";
import { useImmer } from "use-immer";
import { createContext } from "react";

export const ThemeContext = createContext({
  theme: 'light',
  setTheme: (theme) => theme,
})

export default function App() {
  const [theme, setTheme] = useImmer(() => getThemePreferenceFromLocalStorage());
  for (let key in rootRef) {
    if (theme === 'dark') {
      rootRef[key].classList.add('dark-theme');
    } else {
      rootRef[key].classList.remove('dark-theme');
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {
        !getAuthTokenFromLocalStorage() ? <Navigate to="/login" /> :
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
    </ThemeContext.Provider>
  );
}

