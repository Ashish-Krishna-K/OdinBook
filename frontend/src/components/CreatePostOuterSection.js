import { useImmer } from "use-immer";
import { toggleBackdrop } from '../helperModule';
import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js';

import CreatePost from './CreatePost';

export default function CreatePostSection() {
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
            Share your thoughts
          </button> :
          <div className="create-post-form-section modal">
            <button
              className="cancel-btn"
              onClick={handleCreateButtonClick}
            >
              <Icon path={mdiClose} size="2.3vmax" />
            </button>
            <CreatePost />
          </div>
      }
    </section>
  )
}