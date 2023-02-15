import { useOutletContext } from "react-router-dom"

import { objectIsEmpty } from "../../helperModule";

import FriendsList from "../../components/FriendsList";

export default function UserFriends() {
  const userToDisplay = useOutletContext();
  const {
    id,
  } = userToDisplay || {};
  return (
    <section>
      {
        !objectIsEmpty(userToDisplay) &&
        <>
          <FriendsList id={id} />
        </>
      }
    </section>
  )
}