import { useEffect } from "react";
import { useImmer } from "use-immer";
import {
  checkForEquality,
  generateAxiosInstance,
  objectIsEmpty
} from "../helperModule";

const getNotificationFromServer = async (id) => {
  const instance = generateAxiosInstance();
  try {
    const res = await instance.get(`/users/notification/${id}`);
    return res.data;
  } catch (error) {
    console.log(error.response);
  }
}

const updateAsReadInServer = async (id) => {
  const instance = generateAxiosInstance();
  try {
    const res = await instance.put(`/users/notification/${id}/read`);
    return res.data;
  } catch (error) {
    console.log(error.response);
  }
}

export default function IndividualNotification({ id }) {
  const [noti, setNoti] = useImmer({});

  getNotificationFromServer(id).then(data => {
    if (!checkForEquality(noti, data)) {
      setNoti(data);
    }
  }).catch(error => console.log(error));

  useEffect(() => {
    updateAsReadInServer(id).then(data => {
      if (!checkForEquality(noti, data)) {
        setNoti(data);
      }
    }).catch(error => console.log(error));
  }, [])

  return (
    <>
      {
        !objectIsEmpty(noti) &&
        <p>
          <span>{`${noti.from.display_name} ${noti.message}`}</span>
          <span>{noti.is_read ? 'Read' : 'Not Read'}</span>
        </p>
      }
    </>
  )
}