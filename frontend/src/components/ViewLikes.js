import { useImmer } from "use-immer"
import { checkForEquality, generateAxiosInstance } from "../helperModule";

const getLikedUserInfoFromServer = async (userId) => {
  const instance = generateAxiosInstance();
  return await instance.get(`/users/${userId}/short`);
}

export default function ViewLikes({ likesList }) {
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
  }).catch(error => console.log(error.response));
  return (
    <ul className="liked-users-list">
      {
        likedUsers.length === 0 ? <li>Loading...</li> :
          likedUsers.map(user => <li key={user.id}>{user.display_name}</li>)
      }
    </ul>
  )
}
