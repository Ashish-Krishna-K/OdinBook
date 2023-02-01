import { useEffect } from "react";
import { useLoaderData } from "react-router-dom";
import { useImmer } from "use-immer";
import UserDetails from "../components/UserDetails";

export default function UserPage() {
  const user = useLoaderData();
  const [userState, setUserState] = useImmer({
    status: null,
    data: null,
  });
  const [errors, setErrors] = useImmer({
    status: null,
    data: null,
  });

  useEffect(() => {
    if (user.status === 200) {
      setUserState({
        status: user.status,
        data: user.data
      });
    } else {
      setErrors({
        status: user.status,
        data: user.data
      });
    }
  }, [user])

  return (
    <>
      {
        errors.data && <p>{errors.data}</p>
      }
      {
        userState.data &&
        <UserDetails user={userState.data} />
      }

    </>
  )

}