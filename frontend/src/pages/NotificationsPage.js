import { useContext } from "react";

import { CurrentUserContext } from "../context";

import IndividualNotification from "../components/IndividualNotification";

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