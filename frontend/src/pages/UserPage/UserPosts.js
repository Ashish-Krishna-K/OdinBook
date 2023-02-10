import { useOutletContext } from "react-router-dom"
import ViewPost from "../../components/ViewPost";
import { objectIsEmpty } from "../../helperModule";

export default function UserPosts() {
  const userToDisplay = useOutletContext();
  const {
    posts_list
  } = userToDisplay || {};
  return (
    <section>
      {
        !objectIsEmpty(userToDisplay) &&
        <>
          <ul>
            {posts_list.slice(0).reverse().map(post => {
              return (
                <ViewPost
                  key={post}
                  id={post}
                />
              )
            })}
          </ul>
        </>
      }
    </section>
  )
}