import { useContext } from "react";
import { useImmer } from "use-immer";
import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js';

import { toggleBackdrop } from '../helperModule';
import { ThemeContext } from "../context";

import CreatePost from './CreatePost';

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
            className={theme === 'dark' ? 'dark-theme' : undefined}
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