import { Link } from "react-router-dom";
import Icon from '@mdi/react';
import { mdiThemeLightDark } from '@mdi/js';

import {
  getCurrentUserInfoFromLocalStorage,
  rootRef,
  setThemePreferenceToLocalStorage
} from "../helperModule";
import SearchForm from "./SearchForm";
import LogoutButton from "./LogoutButton";
import DisplayPicture from "./DPWithFallback";
import { useContext } from "react";
import { ThemeContext } from "../App";

export default function Header() {
  const currentUser = getCurrentUserInfoFromLocalStorage();
  const { theme, setTheme } = useContext(ThemeContext)

  const changeTheme = () => {
    setThemePreferenceToLocalStorage(theme === 'dark' ? 'light' : 'dark');
    setTheme(theme === 'dark' ? 'light' : 'dark');
    for (let key in rootRef) {
      if (theme === 'dark') {
        rootRef[key].classList.remove('dark-theme');
      } else {
        rootRef[key].classList.add('dark-theme');
      }
    }
  }

  return (
    <header className={theme === 'dark' ? 'dark-theme' : undefined}>
      <h1>
        <Link to="/">ODINBOOK</Link>
      </h1>
      <SearchForm />
      <div className="current-user-section">
        <DisplayPicture src={currentUser.display_picture} alt={currentUser.display_name} />
        <ul className="user-dropdown-menu">
          <li>
            <Link to={`/user/${currentUser._id}`}>{currentUser.display_name}</Link>
          </li>
          <li>
            <button onClick={changeTheme}>
              <Icon path={mdiThemeLightDark} size={1} />
              <span>
                {
                  theme === 'dark' ? "Light Mode" : "Dark Mode"
                }
              </span>
            </button>
          </li>
          <li>
            <LogoutButton />
          </li>
        </ul>
      </div>
    </header>
  )
}
