import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useImmer } from "use-immer";
import { generateAxiosInstance } from "../helperModule";
import DisplayPicture from "./DPWithFallback";

export default function FriendsList({ id }) {
  const [friends, setFriends] = useImmer([]);

  const getFriendsListFromServer = async (userId) => {
    const instance = generateAxiosInstance();
    try {
      const res = await instance.get(`/users/${userId}/friends`);
      setFriends(res.data);
    } catch (error) {
      console.log(error.response);
    }
  }

  useEffect(() => {
    getFriendsListFromServer(id);
  }, [id]);

  return (
    <ul> Friends:
      {
        friends.length !== 0 && friends.map(friend => {
          return (
            <li key={friend._id}>
              <DisplayPicture src={friend.display_picture} alt={friend.display_name} />
              <Link to={`/user/${friend._id}`}>{friend.display_name}</Link>
            </li>
          )
        })
      }
    </ul>
  )
}