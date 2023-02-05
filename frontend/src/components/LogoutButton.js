import { generateAxiosInstance, clearLocalStorage } from "../helperModule";

export default function LogoutButton() {
  const postLogoutToServer = async () => {
    const instance = generateAxiosInstance();
    try {
      const res = await instance.delete('/users/logout');
      clearLocalStorage();
      window.location.reload();
    } catch (error) {
      const errorObj = {
        status: error.response.status,
        msg: error.response.data
      }
      console.log(errorObj.msg);
    }
  }
  return (
    <button onClick={postLogoutToServer}>Logout</button>
  )
}