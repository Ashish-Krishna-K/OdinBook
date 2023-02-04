import { useImmer } from "use-immer";
import CreatePost from "../components/CreatePost";

export default function HomePage() {
  const [createPost, setCreatePost] = useImmer(false);
  const handleCreateButtonClick = () => setCreatePost(!createPost)
  return (
    <section>
      <h2>Home Page</h2>
      {
        !createPost ? <button onClick={handleCreateButtonClick}>Create Post</button> :
          <>
            <CreatePost />
            <button onClick={handleCreateButtonClick}>Cancel</button>
          </>
      }
    </section>
  )
}