import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useImmer } from "use-immer"
import { axiosAuthInstance } from "../helperModule";

export default function FriendRequests({ requestList }) {
  const { id } = useParams()
  const [userItems, setUserItems] = useImmer([]);

  const getUserInfoFromServer = async (requestId) => {
    try {
      const res = await axiosAuthInstance.get(`/users/${id}/request_list/${requestId}`)
      setUserItems(userItems.concat(res.data));
    } catch (error) {
      console.log(error.response.data);
    }
  }

  const updateFriendReqeuestAcceptedInServer = async (requestId) => {
    try {
      const res = await axiosAuthInstance.put(`/users/${id}/request_list/${requestId}/accept`)
      console.log(res.data);
      if (res.status === 200) {
        window.location.reload();
      }
    } catch (error) {
      console.log(error.response.data);
    }
  }

  useEffect(() => {
    requestList.forEach(id => {
      getUserInfoFromServer(id)
    });
  }, [requestList]);

  const handleAcceptClick = (e) => {
    updateFriendReqeuestAcceptedInServer(e.target.value);
  }

  return (
    <ul> Friend Requests:
      {
        userItems.map(item => {
          return (
            <li key={item.id}>
              <p>{item.display_name}</p>
              <img src={item.display_picture} alt={item.display_name} />
              <button onClick={handleAcceptClick} value={item._id}>Accept</button>
            </li>
          )
        })
      }
    </ul>
  )
}