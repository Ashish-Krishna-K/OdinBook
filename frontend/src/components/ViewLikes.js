import { useContext } from "react";
import { Link } from "react-router-dom";
import { useImmer } from "use-immer"
import { checkForEquality, generateAxiosInstance } from "../helperModule";
import { ThemeContext } from "../context";
import ReactLoading from 'react-loading';

const getLikedUserInfoFromServer = async (userId) => {
  const instance = generateAxiosInstance();
  return await instance.get(`/users/${userId}/short`);
}

export default function ViewLikes({ likesList }) {
  const { theme } = useContext(ThemeContext);
  const [likedUsers, setLikedUsers] = useImmer([]);
  const likesListPromise = Promise.all(likesList.map(user => getLikedUserInfoFromServer(user)));
  likesListPromise.then(users => {
    const extractedData = users.map(user => user.data);
    const removedDupes = Array.from(new Set(extractedData));
    if (removedDupes.length > 0 && likedUsers.length === 0) {
      setLikedUsers(removedDupes);
    } else if (!checkForEquality(removedDupes, likedUsers)) {
      setLikedUsers(removedDupes);
    }
    console.log(likedUsers);
  }).catch(error => console.log(error.response));
  return (
    <ul className={theme === 'dark' ? 'dark-theme liked-users-list' : 'liked-users-list'}>
      {
        likedUsers.length === 0 ?
          <li>
            <ReactLoading type="bars" color={'#F0F2F5'} />
          </li> :
          likedUsers.map(user => {
            return (
              <li className="liked-users" key={user.id}>
                <Link to={`/user/${user.id}`}>
                  <span>{user.display_name}</span>
                  <span className={user.status_online ? 'online' : 'offline'}></span>
                </Link>
              </li>
            )
          })
      }
    </ul>
  )
}
