import { useContext, useEffect } from "react";
import { useImmer } from "use-immer"
import { ThemeContext } from "../context";
import { generateAxiosInstance } from "../helperModule";
import DisplayPicture from "./DPWithFallback";
import { Link } from "react-router-dom";

const getUserInfoFromServer = async (requestId) => {
  const instance = generateAxiosInstance();
  return await instance.get(`/users/${requestId}/short`);
};
const acceptFriendRequestToServer = async (requestId) => {
  const instance = generateAxiosInstance();
  try {
    const res = await instance.put(`/users/friend_request/${requestId}/accept`)
    console.log(res.data);
    if (res.status === 200) {
      window.location.reload();
    }
  } catch (error) {
    console.log(error.response.data);
  }
};

export default function FriendRequests({ requestList }) {
  const { theme } = useContext(ThemeContext);
  const [userItems, setUserItems] = useImmer([]);

  useEffect(() => {
    const usersListPromise = Promise.all(requestList.map(request => getUserInfoFromServer(request)));
    usersListPromise.then(users => {
      const extractedData = users.map(user => user.data);
      const removedDupes = Array.from(new Set(extractedData));
      setUserItems(removedDupes);
    }).catch(error => console.log(error.response));
  }, [requestList]);

  const handleAcceptClick = (e) => {
    acceptFriendRequestToServer(e.target.value);
  }

  return (
    <ul> Friend Requests:
      {userItems.length > 0 &&
        userItems.map(item => {
          return (
            <li className={theme === 'dark' ? 'dark-theme minimal-user-display' : 'minimal-user-display'} key={item.id}>
              <Link to={`/user/${item.id}`}>
                <span>{item.display_name}</span>
                <span className={item.status_online ? 'online' : 'offline'}></span>
              </Link>
              <DisplayPicture src={item.display_picture} alt={item.display_name} />
              <button onClick={handleAcceptClick} value={item._id}>Accept</button>
            </li>
          )
        })
      }
    </ul>
  )
}