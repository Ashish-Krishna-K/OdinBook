import { useContext } from "react";
import IndividualNotification from "../components/IndividualNotification";
import { CurrentUserContext } from "../context";

export default function Notifications() {
  const { currentUser } = useContext(CurrentUserContext);
  const { notifications } = currentUser;

  return (
    <ul>
      {
        notifications.length === 0 ?
        <li>No Notifications to display</li> :
        <>
          {
            notifications.map(item => {
              return (
                <IndividualNotification key={item} id={item}/>
              )
            })
          }
        </>
      }
    </ul>
  )
}