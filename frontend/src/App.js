import { Navigate, Outlet } from "react-router-dom";
import { getAuthTokenFromLocalStorage } from "./helperModule";
import { useImmer } from "use-immer";
import CreatePost from "./components/CreatePost";
import Header from "./components/Header";

export default function App() {
  const [createPost, setCreatePost] = useImmer(false);
  const handleCreateButtonClick = () => setCreatePost(!createPost);
  return (
    <>
      {
        !getAuthTokenFromLocalStorage() ? <Navigate to="/login" /> :
          <>
            <Header />
            <main>
              {
                !createPost ? <button onClick={handleCreateButtonClick}>Create Post</button> :
                  <>
                    <CreatePost />
                    <button onClick={handleCreateButtonClick}>Cancel</button>
                  </>
              }
              <Outlet />
            </main>
          </>
      }
    </>
  );
}

