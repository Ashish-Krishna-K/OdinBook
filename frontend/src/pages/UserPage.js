import { useEffect } from "react";
import { useLoaderData } from "react-router-dom";
import { useImmer } from "use-immer";
import FriendRequestButton from "../components/SendFriendRequest";
import UserDetails from "../components/UserDetails";
import { getCurrentUserInfoFromLocalStorage } from "../helperModule"

export default function UserPage() {
  const user = useLoaderData();
  const [userState, setUserState] = useImmer({
    status: null,
    data: null,
  });
  const [errors, setErrors] = useImmer({
    status: null,
    data: null,
  });
  const [currentUser, setCurrentUser] = useImmer(() => getCurrentUserInfoFromLocalStorage());

  useEffect(() => {
    if (user.status === 200) {
      setUserState({
        status: user.status,
        data: user.data
      });
    } else {
      setErrors({
        status: user.status,
        data: user.data
      });
    }
  }, [user])

  return (
    <>
      {
        errors.data && <p>{errors.data}</p>
      }
      {
        userState.data && <UserDetails user={userState.data} />
      }
      {
        userState.data && userState.data._id !== currentUser._id ?
          <FriendRequestButton userId={userState.data._id}/> : <></>
      }
    </>
  )

}