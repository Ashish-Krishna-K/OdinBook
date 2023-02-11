import { useImmer } from "use-immer";
import { toggleBackdrop } from '../helperModule';
import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js';

import CreatePost from './CreatePost';
import { useContext } from "react";
import { ThemeContext } from "../App";

export default function CreatePostSection() {
  const { theme } = useContext(ThemeContext);
  const [createPost, setCreatePost] = useImmer(false);
  const handleCreateButtonClick = () => {
    setCreatePost(!createPost);
    toggleBackdrop();
  };
  return (
    <section className="create-post">
      {
        !createPost ?
          <button
            id="create-post"
            onClick={handleCreateButtonClick}
          >
            <h2>Share your thoughts...</h2>
          </button> :
          <div
            className={theme === 'dark' ? 'create-post-form-section modal dark-theme' : 'create-post-form-section modal'}
          >
            <button
              className={theme === 'dark' ? "dark-theme cancel-btn" : "cancel-btn"}
              onClick={handleCreateButtonClick}
            >
              <Icon path={mdiClose} size={1} />
            </button>
            <CreatePost />
          </div>
      }
    </section>
  )
}