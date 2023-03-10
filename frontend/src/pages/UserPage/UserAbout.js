import { useContext } from "react";
import { useOutletContext } from "react-router-dom";

import { objectIsEmpty } from "../../helperModule";
import { CurrentUserContext, ThemeContext } from "../../context";

import FriendRequestButton from "../../components/SendFriendRequest";

export default function UserAbout() {
  const { theme } = useContext(ThemeContext);
  const { currentUser } = useContext(CurrentUserContext);
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
          <div className="friend-req-btn-section">
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