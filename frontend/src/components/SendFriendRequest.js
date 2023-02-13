import Icon from '@mdi/react';
import { mdiAccountPlus } from '@mdi/js';

import { generateAxiosInstance } from "../helperModule";
import { useContext } from 'react';
import { ThemeContext } from "../context";

const postFriendRequestToServer = async (userId) => {
  const instance = generateAxiosInstance();
  try {
    const res = await instance.put(`/users/${userId}/friend_request`);
    if (res.status === 200) {
      window.location.reload();
    }
  } catch (error) {
    console.log(error.response.data);
  }
}

export default function FriendRequestButton({ userId, friends, currentUser }) {
  const { theme } = useContext(ThemeContext);
  const handleButtonPress = () => {
    postFriendRequestToServer(userId);
  };
  return (
    <>
      {
        friends.includes(currentUser) ?
          <p>Friends</p> :
          <button
            className={theme === 'dark' ? 'friend-req-btn dark-theme' : 'friend-req-btn'}
            onClick={handleButtonPress}
          >
            <Icon path={mdiAccountPlus} size={1} />
            <span>Send Friend Request</span>
          </button>
      }
    </>
  )
}