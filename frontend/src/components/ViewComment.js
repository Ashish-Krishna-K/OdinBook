import { useEffect } from "react";
import { useImmer } from "use-immer";
import { formatDatesForDisplay, generateAxiosInstance, getCurrentUserInfoFromLocalStorage } from "../helperModule";
import AddComment from "./AddComment";
import DisplayPicture from "./DPWithFallback";

export default function ViewComment({ parentPost, commentId }) {
  const currentUser = getCurrentUserInfoFromLocalStorage();
  const [comment, setComment] = useImmer({});
  let hasLiked = false;
  const [editCommentBtnClicked, setEditCommentBtnClicked] = useImmer(false);

  const getCommentFromServer = async (id) => {
    const instance = generateAxiosInstance();
    try {
      const res = await instance.get(`/posts/${parentPost}/comments/${id}`);
      if (res.data) {
        setComment(res.data);
      }
    } catch (error) {
      console.log(error);
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

  if (comment.hasOwnProperty('_id')) {
    const result = comment.comment_likes.some(id => id === currentUser._id);
    hasLiked = result;
  }

  const handleEditButtonClick = () => setEditCommentBtnClicked(!editCommentBtnClicked);

  const handleLikeButtonClick = () => updateLikesToServer(commentId);

  const handleDeleteButtonClick = () => deleteCommentFromServer(commentId);

  return (
    <li>
      {
        !comment.hasOwnProperty('_id') ? <p>Loading...</p> :
          <div>
            <div className="comment-author-section">
              <DisplayPicture src={comment.comment_author.display_picture} alt={comment.comment_author.display_name} />
              <p>{comment.comment_author.display_name}</p>
            </div>
            <div className="comment-content-secion">
              <p>{comment.comment_content}</p>
              <p>{formatDatesForDisplay(comment.time_stamp)}</p>
            </div>
            <div className="comment-controller-section">
              <button className={hasLiked ? 'blue' : 'normal'} onClick={handleLikeButtonClick}>Like</button>
              {
                comment.comment_author._id === currentUser._id &&
                <>
                  {
                    !editCommentBtnClicked ? <button onClick={handleEditButtonClick}>Edit Comment</button> :
                      <>
                        <AddComment parentPost={parentPost} commentId={commentId} content={comment.comment_content} />
                        <button onClick={handleEditButtonClick}>Cancel</button>
                      </>
                  }
                  {
                    <button onClick={handleDeleteButtonClick}>Delete Comment</button>
                  }
                </>
              }
            </div>
          </div>
      }
    </li>
  )
}