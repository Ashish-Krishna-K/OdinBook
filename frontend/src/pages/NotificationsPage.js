import { useContext } from "react";
import { useImmer } from "use-immer";
import { CurrentUserContext } from "../context";
import { checkForEquality, generateAxiosInstance } from "../helperModule";

const getNotificationFromServer = async (id) => {
  const instance = generateAxiosInstance();
  try {
    const res = await instance.get(`/users/notification/${id}`);
    return res.data
  } catch (error) {
    console.log(error.response);
  }
}

export default function Notifications() {
  const { currentUser } = useContext(CurrentUserContext);
  const { notifications } = currentUser;
  const [noti, setNoti] = useImmer([]);

  const allNotiPromise = Promise.all(notifications.map(item => getNotificationFromServer(item)));
  allNotiPromise.then(data => {
    if (!checkForEquality(noti, data)) {
      setNoti(data);
    }
  }).catch()

  return (
    <ul>
      {
        noti.length === 0 ? <li>No notifications to display</li> :
          <>
            {
              noti.map(item => {
                return (
                  <li key={item.id}>
                    {`${item.from.display_name} ${item.message}`}
                  </li>
                )
              })
            }
          </>
      }
    </ul>
  )
}