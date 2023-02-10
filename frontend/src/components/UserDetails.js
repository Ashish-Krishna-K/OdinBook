import { getCurrentUserInfoFromLocalStorage } from "../helperModule"
import FriendRequestButton from "./SendFriendRequest";
import FriendRequests from "./FriendRequests";
import FriendsList from "./FriendsList";
import ViewPost from "./ViewPost";
import DisplayPicture from "./DPWithFallback";

export default function UserDetails({ user }) {
  const currentUser = getCurrentUserInfoFromLocalStorage();
  const {
    uid,
    email,
    display_name,
    friends_list,
    friend_requests,
    posts_list,
    display_picture,
    _id,
  } = user;
  const reversedPostsList = posts_list.slice(0).reverse();
  const checkIfFriendRequestExists = () => {
    return friend_requests.some(request => request === currentUser.id);
  }
  return (
    <section>
      <section className="user-details-section">
        <div className="user-info-section">
          <h3>{display_name}</h3>
          <DisplayPicture src={display_picture} alt={display_name} />
          {
            _id !== currentUser._id &&
            <div className="friend-request-section">
              {
                checkIfFriendRequestExists() ? <p>Request Sent</p> :
                  <FriendRequestButton userId={_id} friends={friends_list} currentUser={currentUser._id} />
              }
            </div>
          }
        </div>
        <div className="user-friends-section">
          <div>
            {
              _id === currentUser._id &&
              <FriendsList id={currentUser._id} />
            }
          </div>
          <div>
            {
              _id === currentUser._id &&
              <FriendRequests requestList={friend_requests} />
            }
          </div>
        </div>
      </section>
      <section className="user-posts-section">
        <ul>Posts:
          {reversedPostsList.map(post => <ViewPost key={post} id={post} />)}
        </ul>
      </section>
    </section>
  )
}