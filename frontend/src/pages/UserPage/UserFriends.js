import { useOutletContext } from "react-router-dom"
import FriendsList from "../../components/FriendsList";
import { objectIsEmpty } from "../../helperModule";

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