import { useOutletContext } from "react-router-dom"
import FriendRequests from "../../components/FriendRequests";
import { objectIsEmpty } from "../../helperModule";

export default function UserRequests() {
  const userToDisplay = useOutletContext();
  const {
    friend_requests
  } = userToDisplay || {};
  return (
    <section>
      {
        !objectIsEmpty(userToDisplay) &&
        <>
          {
            friend_requests.length > 0 ?
              <FriendRequests requestList={friend_requests} /> :
              <p>You do not have any friend requests at the moment.</p>
          }
        </>
      }
    </section>
  )
}
