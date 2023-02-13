import { useContext, useEffect } from "react";
import { useImmer } from "use-immer";
import { Link } from "react-router-dom";
import Icon from '@mdi/react';
import {
  mdiThumbUp,
  mdiClose,
  mdiDeleteForever,
  mdiCommentPlus,
  mdiSquareEditOutline,
  mdiDotsHorizontal,
  mdiCommentTextMultiple,
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
import { CurrentUserContext, ThemeContext } from "../context";
import ReactLoading from 'react-loading';

export default function ViewPost({ id }) {
  const { theme } = useContext(ThemeContext);
  const { currentUser } = useContext(CurrentUserContext);
  const [post, setPost] = useImmer({});
  let hasLiked = false;
  const [editPostButtonClicked, setEditPostButtonClicked] = useImmer(false)
  const [addCommentClicked, setAddCommentClicked] = useImmer(false);
  const [viewLikes, setViewLikes] = useImmer(false);
  const [showComments, setShowComments] = useImmer(false);
  const [showPostControllerMenu, setShowPostControllerMenu] = useImmer(false);

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

  const handleShowComments = () => setShowComments(!showComments);

  const handleShowMenu = () => setShowPostControllerMenu(!showPostControllerMenu);

  return (
    <li>
      {
        objectIsEmpty(post) ? <ReactLoading type="bars" color={theme === 'dark' ? '#F0F2F5' : '#656768'} /> :
          <div className={theme === 'dark' ? "dark-theme post" : "post"}>
            <div className="post-author-section">
              <div className="post-author-details">
                <DisplayPicture src={post.post_author.display_picture} alt={post.post_author.display_name} />
                <div>
                  <Link to={`/user/${post.post_author.id}`}>
                    <span>{post.post_author.display_name}</span>
                    <span className={post.post_author.status_online ? 'online' : 'offline'}></span>
                  </Link>
                  <p>{formatDatesForDisplay(post.time_stamp)} ago</p>
                </div>
              </div>
              <div className="post-controller-section dropdown">
                {
                  post.post_author._id === currentUser._id &&
                  <>
                    {
                      <button
                        className={theme === 'dark' ? "dark-theme" : undefined}
                        onClick={handleShowMenu}
                      >
                        <Icon path={mdiDotsHorizontal} size={1} />
                      </button>
                    }
                    {
                      showPostControllerMenu &&
                      <ul className={theme === 'dark' ? 'dark-theme controller' : 'controller'}>
                        <li>
                          {
                            !editPostButtonClicked &&
                            <button
                              className={theme === 'dark' ? "dark-theme" : undefined}
                              onClick={handleEditButtonClick}
                            >
                              <Icon path={mdiSquareEditOutline} size={1} />
                              <span>Edit Post</span>
                            </button>
                          }
                        </li>
                        <li>
                          {
                            <button
                              className={theme === 'dark' ? "dark-theme" : undefined}
                              onClick={handleDeleteButtonClick}
                            >
                              <Icon path={mdiDeleteForever} size={1} />
                              <span>Delete Post</span>
                            </button>
                          }
                        </li>
                      </ul>
                    }
                  </>
                }
              </div>
              {
                editPostButtonClicked &&
                <div className={theme === 'dark' ? 'create-post-form-section modal dark-theme' : 'create-post-form-section modal'}>
                  <button
                    className={theme === 'dark' ? 'dark-theme cancel-btn' : 'cancel-btn'}
                    onClick={handleEditButtonClick}
                  >
                    <Icon path={mdiClose} size={1} />
                  </button>
                  <CreatePost content={post.post_content} postId={post._id} />
                </div>
              }
            </div>
            <div className="post-content-section">
              <p>{post.post_content}</p>
              <div className={theme === 'dark' ? 'post-stats dark-theme' : 'post-stats'}>
                <span className="dropdown">
                  {
                    post.post_likes.length > 0 ?
                      <>
                        <button
                          className={theme === 'dark' ? 'dark-theme view-likes-btn' : 'view-likes-btn'}
                          onClick={handleViewLikesButton}
                        >
                          <Icon path={mdiThumbUp} size={1} />
                          <span>{post.post_likes.length} Likes</span>
                        </button>
                        {viewLikes && <ViewLikes likesList={post.post_likes} />}
                      </> :
                      <div className={theme === 'dark' ? 'dark-theme view-likes-btn' : 'view-likes-btn'}>
                        <Icon path={mdiThumbUp} size={1} />
                        <span>{post.post_likes.length} Likes</span>
                      </div>
                  }
                </span>
                <span>
                  {post.post_comments.length} Comments
                </span>
              </div>
            </div>
            <div className="post-interaction-section">
              <button
                className={hasLiked ? 'liked' : theme === 'dark' ? 'dark-theme' : undefined}
                onClick={handleLikeButton}
              >
                <Icon path={mdiThumbUp} size={1} />
                <span>Like</span>
              </button>
              {
                !addCommentClicked ?
                  <button
                    className={theme === 'dark' ? 'dark-theme' : undefined}
                    onClick={handleAddCommentBtnClick}>
                    <Icon path={mdiCommentPlus} size={1} />
                    <span>Comment</span>
                  </button> :
                  <div className="add-comment-form-section modal">
                    <button
                      className={theme === 'dark' ? 'dark-theme cancel-btn' : 'cancel-btn'}
                      onClick={handleAddCommentBtnClick}
                    >
                      <Icon path={mdiClose} size={1} />
                    </button>
                    <AddComment parentPost={post._id} />
                  </div>
              }
            </div>
            {
              post.post_comments.length > 0 &&
              <div className="post-comments-section">
                <button
                  className={theme === 'dark' ? 'dark-theme' : undefined}
                  onClick={handleShowComments}>
                  <Icon path={mdiCommentTextMultiple} size={1} />
                  <span>Comments</span>
                </button>
                {
                  showComments &&
                  <ul>
                    {post.post_comments.map(comment => <ViewComment parentPost={post._id} commentId={comment} key={comment} />)}
                  </ul>
                }
              </div>
            }
          </div>
      }
    </li>
  )
};
