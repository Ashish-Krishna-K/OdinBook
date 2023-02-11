import { useOutletContext } from "react-router-dom";
import {
  getCurrentUserInfoFromLocalStorage,
  objectIsEmpty,
} from "../../helperModule";
import FriendRequestButton from "../../components/SendFriendRequest";
import { useContext } from "react";
import { ThemeContext } from "../../App";

export default function UserAbout() {
  const { theme } = useContext(ThemeContext);
  const currentUser = getCurrentUserInfoFromLocalStorage();
  const userToDisplay = useOutletContext();
  const {
    id,
    email,
    friends_list,
    friend_requests,
    posts_list
  } = userToDisplay || {};
  const checkIfFriendRequestExists = () => {
    return friend_requests.some(request => request === currentUser.id);
  }
  return (
    <section>
      {
        !objectIsEmpty(userToDisplay) &&
        <>
          <div>
            {
              id !== currentUser.id &&
              <div className={theme === 'dark' ? 'friend-request-section dark-theme' : 'friend-request-section'}>
                {
                  checkIfFriendRequestExists() ? <p>Request Sent</p> :
                    <FriendRequestButton userId={id} friends={friends_list} currentUser={currentUser.id} />
                }
              </div>
            }
          </div>
          <p>{email}</p>
          <p>{friends_list.length} Friends</p>
          <p>{posts_list.length} Posts</p>
        </>
      }
    </section>
  )
}