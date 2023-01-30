import { axiosAuthInstance } from "../helperModule"

const postFriendRequestToServer = async (data) => {
  try {
    const res = await axiosAuthInstance.post('/users/:id/friend_request', data);
    console.log(res.data);
  } catch (error) {
    console.log(error.response.data);
  }
}

export default function FriendRequestButton({ userId }) {
  const handleButtonPress = () => {
    const data = { id: userId }
    postFriendRequestToServer(data);
  }
  return (
    <button onClick={handleButtonPress}>
      Send Friend Request
    </button>
  )
}