import { Link } from "react-router-dom";
import Icon from '@mdi/react';
import {
  mdiThemeLightDark,
  mdiMenu,
  mdiClose,
} from '@mdi/js';

import {
  rootRef,
  setThemePreferenceToLocalStorage
} from "../helperModule";

import SearchForm from "./SearchForm";
import LogoutButton from "./LogoutButton";
import DisplayPicture from "./DPWithFallback";
import { useContext } from "react";
import { CurrentUserContext, ThemeContext } from "../context";
import { useImmer } from "use-immer";

export default function Header() {
  const { currentUser } = useContext(CurrentUserContext);
  const { theme, setTheme } = useContext(ThemeContext);
  const [showMenu, setShowMenu] = useImmer(false);

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
  };

  const handleShowBtnClick = () => setShowMenu(!showMenu);

  return (
    <header className={theme === 'dark' ? 'dark-theme' : undefined}>
      <h1>
        <Link to="/">ODINBOOK</Link>
      </h1>
      <button className={theme === 'dark' ? 'dark-theme nav-controller' : 'nav-controller'}
        onClick={handleShowBtnClick}>
        {
          !showMenu ? <Icon path={mdiMenu} size={1} /> :
            <Icon path={mdiClose} size={1} />
        }
      </button>
      <ul className={theme === 'dark' ? 'navigation-horizontal dark-theme' : "navigation-horizontal"}>
        <li>
          <SearchForm />
        </li>
        <Link to="/notifications">Notifications</Link>
        <li className="current-user-section">
          <DisplayPicture src={currentUser.display_picture} alt={currentUser.display_name} />
          <ul
            className="user-dropdown-menu"
          >
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
        </li>
      </ul>
      {
        showMenu &&
        <ul className={theme === 'dark' ? 'navigation-vertical dark-theme' : "navigation-vertical"}>
          <li>
            <SearchForm />
          </li>
          <li className="current-user">
            <span>
              <DisplayPicture src={currentUser.display_picture} alt={currentUser.display_name} />
            </span>
            <span>
              <Link to={`/user/${currentUser._id}`}>{currentUser.display_name}</Link>
            </span>
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
      }
    </header>
  )
}
