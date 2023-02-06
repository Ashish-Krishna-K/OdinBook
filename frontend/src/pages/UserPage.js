import { useParams } from "react-router-dom";
import { useImmer } from "use-immer";
import UserDetails from "../components/UserDetails";
import { generateAxiosInstance } from "../helperModule";

const getUserFromServer = async (id) => {
  const instance = generateAxiosInstance();
  return await instance.get(`/users/${id}`);
};

export default function UserPage() {
  const { userId } = useParams();
  const [userToDisplay, setUserToDisplay] = useImmer(null);
  const [errors, setErrors] = useImmer(null);

  const userPromise = getUserFromServer(userId);
  userPromise
    .then(response => {
      const userData = response.data;
      if (userToDisplay === null) {
        setUserToDisplay(userData);
        return;
      }
      if (JSON.stringify(userToDisplay) !== JSON.stringify(userData)) {
        setUserToDisplay(userData);
        return;
      }
    })
    .catch(error => {
      if (errors === null) {
        setErrors(error.data);
      } else if (JSON.stringify(errors) !== JSON.stringify(error.data)) {
        setErrors(error.data);
      }
    })


  return (
    <>
      {
        errors && <p>{errors}</p>
      }
      {
        userToDisplay &&
        <UserDetails user={userToDisplay} key={userToDisplay.id} />
      }
    </>
  )
}