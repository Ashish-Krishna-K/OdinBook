import { useImmer } from "use-immer";
import CreatePost from "../components/CreatePost";

export default function HomePage() {
  const [createPost, setCreatePost] = useImmer(false);
  const handleCreateButtonClick = () => setCreatePost(!createPost)
  return (
    <section>
      <h2>Home Page</h2>
    </section>
  )
}