import { useContext, useEffect } from "react";
import { useImmer } from "use-immer";
import { Link } from "react-router-dom";
import Icon from '@mdi/react';
import {
  mdiThumbUp,
  mdiClose,
  mdiDeleteForever,
  mdiCommentEdit,
  mdiDotsHorizontal
} from '@mdi/js';
import {
  formatDatesForDisplay,
  generateAxiosInstance,
  objectIsEmpty,
  toggleBackdrop,
} from "../helperModule";
import AddComment from "./AddComment";
import DisplayPicture from "./DPWithFallback";
import ViewLikes from "./ViewLikes";
import { CurrentUserContext, ThemeContext } from "../context";

export default function ViewComment({ parentPost, commentId }) {
  const { theme } = useContext(ThemeContext);
  const {currentUser} = useContext(CurrentUserContext);
  const [comment, setComment] = useImmer({});
  let hasLiked = false;
  const [editCommentBtnClicked, setEditCommentBtnClicked] = useImmer(false);
  const [viewLikes, setViewLikes] = useImmer(false);
  const [showControllerMenu, setShowControllerMenu] = useImmer(false);

  const getCommentFromServer = async (id) => {
    const instance = generateAxiosInstance();
    try {
      const res = await instance.get(`/posts/${parentPost}/comments/${id}`);
      if (res.data) {
        setComment(res.data);
      }
    } catch (error) {
      console.log(error.response, id);
    }
  };
  const updateLikesToServer = async (id) => {
    const instance = generateAxiosInstance();
    try {
      const res = await instance.put(`/posts/${parentPost}/comments/${id}/like`);
      if (res.status === 200 && res.data) {
        setComment(res.data);
      }
    } catch (error) {
      console.log(error.response.data);
    }
  };
  const deleteCommentFromServer = async (id) => {
    const instance = generateAxiosInstance();
    try {
      const res = await instance.delete(`/posts/${parentPost}/comments/${id}`);
      if (res.status === 200) {
        window.location.reload();
      }
    } catch (error) {
      console.log(error.response.data);
    }
  };

  useEffect(() => {
    getCommentFromServer(commentId);
  }, [commentId]);

  if (!objectIsEmpty(comment)) {
    const result = comment.comment_likes.some(id => id === currentUser._id);
    hasLiked = result;
  }

  const handleEditButtonClick = () => {
    setEditCommentBtnClicked(!editCommentBtnClicked);
    toggleBackdrop();
  }

  const handleViewLikesButton = () => setViewLikes(!viewLikes);

  const handleLikeButtonClick = () => updateLikesToServer(commentId);

  const handleDeleteButtonClick = () => deleteCommentFromServer(commentId);

  const handleShowMenu = () => setShowControllerMenu(!showControllerMenu);

  return (
    <li>
      {
        objectIsEmpty(comment) ? <p>Loading...</p> :
          <div className={theme === 'dark' ? "dark-theme comment" : "comment"}>
            <div className="comment-author-section">
              <div className="comment-author-details">
                <DisplayPicture src={comment.comment_author.display_picture} alt={comment.comment_author.display_name} />
                <div>
                  <Link to={`/user/${comment.comment_author.id}`}>
                    <span>{comment.comment_author.display_name}</span>
                    <span className={comment.comment_author.status_online ? 'online' : 'offline'}></span>
                  </Link>
                  <p>{formatDatesForDisplay(comment.time_stamp)} ago</p>
                </div>
              </div>
              <div className="comment-controller-section dropdown">
                {
                  comment.comment_author._id === currentUser._id &&
                  <>
                    {
                      <button
                        className={theme === 'dark' ? 'dark-theme' : undefined}
                        onClick={handleShowMenu}>
                        <Icon path={mdiDotsHorizontal} size={1} />
                      </button>
                    }
                    {
                      showControllerMenu &&
                      <ul className={theme === 'dark' ? 'dark-theme controller' : 'controller'}>
                        <li>
                          {
                            !editCommentBtnClicked &&
                            <button
                              className={theme === 'dark' ? 'dark-theme' : undefined}
                              onClick={handleEditButtonClick}
                            >
                              <Icon path={mdiCommentEdit} size={1} />
                              <span>Edit Comment</span>
                            </button>
                          }
                        </li>
                        <li>
                          {
                            <button
                              className={theme === 'dark' ? 'dark-theme' : undefined}
                              onClick={handleDeleteButtonClick}
                            >
                              <Icon path={mdiDeleteForever} size={1} />
                              <span>Delete Comment</span>
                            </button>
                          }
                        </li>
                      </ul>
                    }
                  </>
                }
              </div>
              {editCommentBtnClicked &&
                <div className="add-comment-form-section modal">
                  <button
                    className={theme === 'dark' ? 'dark-theme cancel-btn' : 'cancel-btn'}
                    onClick={handleEditButtonClick}
                  >
                    <Icon path={mdiClose} size={1} />
                  </button>
                  <AddComment parentPost={parentPost} commentId={commentId} content={comment.comment_content} />
                </div>
              }
            </div>
            <div className="comment-content-section">
              <p>{comment.comment_content}</p>
              <div className="comment-stats">
                <span className="dropdown">
                  {
                    comment.comment_likes.length > 0 ?
                      <>
                        <button
                          className={theme === 'dark' ? 'dark-theme view-likes-btn' : "view-likes-btn"}
                          onClick={handleViewLikesButton}
                        >
                          <Icon path={mdiThumbUp} size={1} />
                          <span>{comment.comment_likes.length} Likes</span>
                        </button>
                        {viewLikes && <ViewLikes likesList={comment.comment_likes} />}
                      </> : <span>{comment.comment_likes.length} Likes</span>
                  }
                </span>
              </div>
            </div>
            <div className="comment-interaction-section">
              <button
                className={hasLiked ? 'liked comment-like-btn' : theme === 'dark' ? 'dark-theme comment-like-btn' : 'comment-like=btn'}
                onClick={handleLikeButtonClick}
              >
                <Icon path={mdiThumbUp} size={1} />
                <span>Like</span>
              </button>
            </div>
          </div>
      }
    </li>
  )
}