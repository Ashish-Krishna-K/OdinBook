import { useEffect } from "react";
import { useImmer } from "use-immer";
import { Link } from "react-router-dom";
import Icon from '@mdi/react';
import {
  mdiThumbUp,
  mdiClose,
  mdiDeleteForever,
  mdiCommentEdit,
} from '@mdi/js';
import {
  formatDatesForDisplay,
  generateAxiosInstance,
  getCurrentUserInfoFromLocalStorage,
  objectIsEmpty,
} from "../helperModule";
import AddComment from "./AddComment";
import DisplayPicture from "./DPWithFallback";
import ViewLikes from "./ViewLikes";

export default function ViewComment({ parentPost, commentId }) {
  const currentUser = getCurrentUserInfoFromLocalStorage();
  const [comment, setComment] = useImmer({});
  let hasLiked = false;
  const [editCommentBtnClicked, setEditCommentBtnClicked] = useImmer(false);
  const [viewLikes, setViewLikes] = useImmer(false);

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

  const handleEditButtonClick = () => setEditCommentBtnClicked(!editCommentBtnClicked);

  const handleViewLikesButton = () => setViewLikes(!viewLikes);

  const handleLikeButtonClick = () => updateLikesToServer(commentId);

  const handleDeleteButtonClick = () => deleteCommentFromServer(commentId);

  return (
    <li>
      {
        objectIsEmpty(comment) ? <p>Loading...</p> :
          <div className="comment">
            <div className="comment-author-section">
              <div className="comment-author-details">
                <DisplayPicture src={comment.comment_author.display_picture} alt={comment.comment_author.display_name} />
                <div>
                  <Link to={`/user/${comment.comment_author.id}`}>
                    {comment.comment_author.display_name}
                  </Link>
                  <p>{formatDatesForDisplay(comment.time_stamp)} ago</p>
                </div>
              </div>
              <div className="comment-controller-section">
                {
                  comment.comment_author._id === currentUser._id &&
                  <>
                    {
                      !editCommentBtnClicked ?
                        <button onClick={handleEditButtonClick}>
                          <Icon path={mdiCommentEdit} size="2.3vmax" />
                          <span>Edit Comment</span>
                        </button> :
                        <div className="add-comment-form-section modal">
                          <button
                            className="cancel-btn"
                            onClick={handleEditButtonClick}
                          >
                            <Icon path={mdiClose} size="2.3vmax" />
                          </button>
                          <AddComment parentPost={parentPost} commentId={commentId} content={comment.comment_content} />
                        </div>
                    }
                    {
                      <button onClick={handleDeleteButtonClick}>
                        <Icon path={mdiDeleteForever} size={1} />
                        <span>Delete Comment</span>
                      </button>
                    }
                  </>
                }
              </div>
            </div>
            <div className="comment-content-secion">
              <p>{comment.comment_content}</p>
              <div>
                <span className="dropdown">
                  {
                    comment.comment_likes.length > 0 ?
                      <>
                        <button
                          className="view-likes-btn"
                          onClick={handleViewLikesButton}
                        >
                          <Icon path={mdiThumbUp} size="2.3vmax" />
                          <span>{comment.comment_likes.length} Likes</span>
                        </button>
                        {viewLikes && <ViewLikes likesList={comment.comment_likes} />}
                      </> : <span>{comment.comment_likes.length} Likes</span>
                  }
                </span>
              </div>
            </div>
            <div className="comment-interaction-section">
              <button className={hasLiked ? 'liked' : 'not-liked'} onClick={handleLikeButtonClick}>
                <Icon path={mdiThumbUp} size="2.3vmax" />
                <span>Like</span>
              </button>
            </div>
          </div>
      }
    </li>
  )
}