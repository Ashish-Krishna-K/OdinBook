import { useEffect } from "react";
import { useImmer } from "use-immer";
import { Link } from "react-router-dom";
import Icon from '@mdi/react';
import {
  mdiThumbUp,
  mdiClose,
  mdiDeleteForever,
  mdiCommentPlus,
  mdiComment,
  mdiSquareEditOutline,
} from '@mdi/js';

import {
  formatDatesForDisplay,
  generateAxiosInstance,
  getCurrentUserInfoFromLocalStorage,
  objectIsEmpty,
  toggleBackdrop
} from "../helperModule";

import AddComment from "./AddComment";
import CreatePost from "./CreatePost";
import DisplayPicture from "./DPWithFallback";
import ViewComment from "./ViewComment";
import ViewLikes from "./ViewLikes";

export default function ViewPost({ id }) {
  const currentUser = getCurrentUserInfoFromLocalStorage();
  const [post, setPost] = useImmer({});
  let hasLiked = false;
  const [editPostButtonClicked, setEditPostButtonClicked] = useImmer(false)
  const [addCommentClicked, setAddCommentClicked] = useImmer(false);
  const [viewLikes, setViewLikes] = useImmer(false);

  const getPostFromServer = async (postId) => {
    const instance = generateAxiosInstance();
    try {
      const res = await instance.get(`/posts/${postId}`);
      if (res.data) {
        setPost(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const updateLikesToServer = async (postId) => {
    const instance = generateAxiosInstance();
    try {
      const res = await instance.put(`/posts/${postId}/like`);
      if (res.status === 200 && res.data) {
        setPost(res.data);
      }
    } catch (error) {
      console.log(error.response.data);
    }
  };
  const deletePostFromServer = async (postId) => {
    const instance = generateAxiosInstance();
    try {
      const res = await instance.delete(`/posts/${postId}`);
      if (res.status === 200) {
        window.location.reload();
      }
    } catch (error) {
      console.log(error.response.data);
    }
  };

  useEffect(() => {
    getPostFromServer(id);
  }, [id]);

  if (!objectIsEmpty(post)) {
    const result = post.post_likes.some(id => id === currentUser._id);
    hasLiked = result;
  };

  const handleEditButtonClick = () => {
    setEditPostButtonClicked(!editPostButtonClicked);
    toggleBackdrop();
  };

  const handleAddCommentBtnClick = () => {
    setAddCommentClicked(!addCommentClicked);
    toggleBackdrop();
  };

  const handleLikeButton = () => updateLikesToServer(id);

  const handleViewLikesButton = () => setViewLikes(!viewLikes);

  const handleDeleteButtonClick = () => deletePostFromServer(id);

  return (
    <li>
      {
        objectIsEmpty(post) ? <p>Loading...</p> :
          <div className="post">
            <div className="post-author-section">
              <div className="post-author-details">
                <DisplayPicture src={post.post_author.display_picture} alt={post.post_author.display_name} />
                <div>
                  <Link to={`/user/${post.post_author.id}`}>
                    {post.post_author.display_name}
                  </Link>
                  <p>{formatDatesForDisplay(post.time_stamp)} ago</p>
                </div>
              </div>
              <div className="post-controller-section">
                {post.post_author._id === currentUser._id &&
                  <>
                    {
                      !editPostButtonClicked ?
                        <button onClick={handleEditButtonClick}>
                          <Icon path={mdiSquareEditOutline} size="2.3vmax" />
                          <span>Edit Post</span>
                        </button> :
                        <div className="create-post-form-section modal">
                          <button
                            className="cancel-btn"
                            onClick={handleEditButtonClick}
                          >
                            <Icon path={mdiClose} size="2.3vmax" />
                          </button>
                          <CreatePost content={post.post_content} postId={post._id} />
                        </div>
                    }
                    {
                      <button onClick={handleDeleteButtonClick}>
                        <Icon path={mdiDeleteForever} size="2.3vmax" />
                        <span>Delete Post</span>
                      </button>
                    }
                  </>
                }
              </div>
            </div>
            <div className="post-content-section">
              <p>{post.post_content}</p>
              <div>
                <span className="dropdown">
                  {
                    post.post_likes.length > 0 ?
                      <>
                        <button
                          className="view-likes-btn"
                          onClick={handleViewLikesButton}
                        >
                          <Icon path={mdiThumbUp} size="2.3vmax" />
                          <span>{post.post_likes.length} Likes</span>
                        </button>
                        {viewLikes && <ViewLikes likesList={post.post_likes} />}
                      </> : <span>{post.post_likes.length} Likes</span>
                  }
                </span>
                <span>
                  {post.post_comments.length} Comments
                </span>
              </div>
            </div>
            <div className="post-interaction-section">
              <button className={hasLiked ? 'liked' : 'not-liked'} onClick={handleLikeButton}>
                <Icon path={mdiThumbUp} size="2.3vmax" />
                <span>Like</span>
              </button>
              {
                !addCommentClicked ?
                  <button onClick={handleAddCommentBtnClick}>
                    <Icon path={mdiCommentPlus} size="2.3vmax" />
                    <span>Comment</span>
                  </button> :
                  <div className="add-comment-form-section modal">
                    <button
                      className="cancel-btn"
                      onClick={handleAddCommentBtnClick}
                    >
                      <Icon path={mdiClose} size="2.3vmax" />
                    </button>
                    <AddComment parentPost={post._id} />
                  </div>
              }
            </div>
            {
              post.post_comments.length > 0 &&
              <div className="post-comments-section">
                <ul> Comments:
                  {post.post_comments.map(comment => <ViewComment parentPost={post._id} commentId={comment} key={comment} />)}
                </ul>
              </div>

            }
          </div>
      }
    </li>
  )
};
