import { useContext } from "react";
import { useImmer } from "use-immer";
import {
  Link,
  Outlet,
  useLocation,
  useParams,
} from "react-router-dom";

import {
  generateAxiosInstance,
  objectIsEmpty,
  getCurrentPathEnd,
} from "../../helperModule";
import {
  CurrentUserContext,
  ThemeContext
} from "../../context";

import DisplayPicture from "../../components/DPWithFallback";

const getUserFromServer = async (id) => {
  const instance = generateAxiosInstance();
  return await instance.get(`/users/${id}`);
};

export default function UserPage() {
  const { theme } = useContext(ThemeContext);
  const { currentUser } = useContext(CurrentUserContext);
  const location = useLocation();
  const { userId } = useParams();
  const [userToDisplay, setUserToDisplay] = useImmer({});
  const [errors, setErrors] = useImmer(null);
  let currentPath = {
    path: "home"
  }

  switch (getCurrentPathEnd(location.pathname)) {
    case ('/posts'):
      currentPath.path = "posts";
      break;
    case ('/friends'):
      currentPath.path = "friends";
      break;
    case ('/requests'):
      currentPath.path = "requests";
      break;
    default:
      currentPath.path = "home";
  }


  const userPromise = getUserFromServer(userId);
  userPromise
    .then(response => {
      const userData = response.data;
      if (objectIsEmpty(userToDisplay)) {
        setUserToDisplay(userData);
        return;
      }
      if (JSON.stringify(userToDisplay) !== JSON.stringify(userData)) {
        setUserToDisplay(userData);
        return;
      }
    })
    .catch(error => {
      if (errors === null) {
        setErrors(error.data);
      } else if (JSON.stringify(errors) !== JSON.stringify(error.data)) {
        setErrors(error.data);
      }
    })
  const {
    display_name,
    display_picture,
    status_online,
  } = userToDisplay || {};

  return (
    <>
      {
        errors && <p>{errors}</p>
      }
      <nav className="user-page-navigation">
        <ul>
          <li className={currentPath.path === "home" ? 'highlight' : undefined}>
            <Link to={`/user/${userId}/`}>About</Link>
          </li>
          <li className={currentPath.path === "posts" ? 'highlight' : undefined}>
            <Link to={`/user/${userId}/posts`}>Posts</Link>
          </li>
          <li className={currentPath.path === "friends" ? 'highlight' : undefined}>
            <Link to={`/user/${userId}/friends`}>Friends</Link>
          </li>
          {
            userId === currentUser.id &&
            <li className={currentPath.path === "requests" ? 'highlight' : undefined}>
              <Link to={`/user/${userId}/requests`}>Requests</Link>
            </li>
          }
        </ul>
      </nav>
      <section className={theme === 'dark' ? 'dark-theme' : undefined}>
        {
          !objectIsEmpty(userToDisplay) &&
          <section
            className={theme === 'dark' ? 'dark-theme user-name-and-image' : 'user-name-and-image'}
          >
            <DisplayPicture src={display_picture} alt={display_name} />
            <h3>
              <span>{display_name}</span>
              <span className={status_online ? 'online' : 'offline'}></span>
            </h3>
          </section>
        }
        <Outlet context={userToDisplay} />
      </section>
    </>
  )
}