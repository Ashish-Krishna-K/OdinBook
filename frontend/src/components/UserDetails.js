import { useImmer } from "use-immer";
import { getCurrentUserInfoFromLocalStorage } from "../helperModule"
import FriendRequestButton from "../components/SendFriendRequest";
import FriendRequests from "./FriendRequests";
import FriendsList from "./FriendsList";
import ViewPost from "./ViewPost";

export default function UserDetails({ user }) {
  const [currentUser, setCurrentUser] = useImmer(() => getCurrentUserInfoFromLocalStorage());

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

  return (
    <section>
      <h3>{display_name}</h3>
      <img src={display_picture} alt={display_name} />
      {
        _id === currentUser._id &&
        <FriendsList id={currentUser._id} />
      }
      {
        _id !== currentUser._id &&
        <FriendRequestButton userId={_id} friends={friends_list} currentUser={currentUser._id} />
      }
      {
        _id === currentUser._id &&
        <FriendRequests requestList={friend_requests} />
      }
      <ul>Posts:
        {
          posts_list.map(post => <ViewPost key={post} id={post}/>)
        }
      </ul>
    </section>
  )
}