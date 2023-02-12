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
    <ul> {friends.length} Friends:
      {
        friends.length !== 0 && friends.map(friend => {
          return (
            <li className="minimal-user-display" key={friend._id}>
              <DisplayPicture src={friend.display_picture} alt={friend.display_name} />
              <Link to={`/user/${friend._id}`}>
                <span>{friend.display_name}</span>
                <span className={friend.status_online ? 'online' : 'offline'}></span>
              </Link>
            </li>
          )
        })
      }
    </ul>
  )
}