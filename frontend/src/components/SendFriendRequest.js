import { axiosAuthInstance, generateAxiosInstance } from "../helperModule"

const postFriendRequestToServer = async (data) => {
  const instance = generateAxiosInstance();
  try {
    const res = await instance.post('/users/:id/friend_request', data);
    console.log(res.data);
    if (res.status === 200) {
      window.location.reload();
    }
  } catch (error) {
    console.log(error.response.data);
  }
}

export default function FriendRequestButton({ userId, friends, currentUser }) {
  const handleButtonPress = () => {
    const data = { id: userId }
    postFriendRequestToServer(data);
  };
  return (
    <>
      {
        friends.includes(currentUser) ?
          <p>Friends</p>
          : <button onClick={handleButtonPress}>Send Friend Request</button>
      }
    </>
  )
}