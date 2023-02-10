import { useEffect } from "react";
import { useImmer } from "use-immer"
import { generateAxiosInstance } from "../helperModule";
import DisplayPicture from "./DPWithFallback";

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
            <li key={item.id}>
              <p>{item.display_name}</p>
              <DisplayPicture src={item.display_picture} alt={item.display_name} />
              <button onClick={handleAcceptClick} value={item._id}>Accept</button>
            </li>
          )
        })
      }
    </ul>
  )
}