import Icon from '@mdi/react';
import { mdiLogout } from '@mdi/js';
import { generateAxiosInstance, clearLocalStorage } from "../helperModule";

export default function LogoutButton() {
  const postLogoutToServer = async () => {
    const instance = generateAxiosInstance();
    try {
      await instance.delete('/users/logout');
      clearLocalStorage();
      window.location.reload();
    } catch (error) {
      console.log(error.response.data);
    }
  }
  return (
    <button
      className="logout-btn"
      onClick={postLogoutToServer}>
      <Icon path={mdiLogout} size="2.3vmax" />
      <span>Logout</span>
    </button>
  )
}