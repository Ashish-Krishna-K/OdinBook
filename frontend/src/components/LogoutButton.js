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
    <button onClick={postLogoutToServer}>Logout</button>
  )
}