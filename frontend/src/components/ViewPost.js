import { useEffect } from "react";
import { useImmer } from "use-immer";
import { formatDatesForDisplay, generateAxiosInstance, getCurrentUserInfoFromLocalStorage } from "../helperModule";
import AddComment from "./AddComment";
import CreatePost from "./CreatePost";
import DisplayPicture from "./DPWithFallback";
import ViewComment from "./ViewComment";

export default function ViewPost({ id }) {
  const currentUser = getCurrentUserInfoFromLocalStorage();
  const [post, setPost] = useImmer({});
  let hasLiked = false;
  const [editPostButtonClicked, setEditPostButtonClicked] = useImmer(false)
  const [addCommentClicked, setAddCommentClicked] = useImmer(false);

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
  if (post.hasOwnProperty('_id')) {
    const result = post.post_likes.some(id => id === currentUser._id);
    hasLiked = result;
  };

  const handleEditButtonClick = () => setEditPostButtonClicked(!editPostButtonClicked);

  const handleAddCommentBtnClick = () => setAddCommentClicked(!addCommentClicked);

  const handleLikeButton = () => updateLikesToServer(id);

  const handleDeleteButtonClick = () => deletePostFromServer(id);

  return (
    <>
      {
        !post.hasOwnProperty('_id') ? <p>Loading...</p> :
          <div>
            <div className="post-author-section">
              <DisplayPicture src={post.post_author.display_picture} alt={post.post_author.display_name} />
              <p>{post.post_author.display_name}</p>
            </div>
            <div className="post-content-section">
              <p>{post.post_content}</p>
              <p>{formatDatesForDisplay(post.time_stamp)}</p>
              <div className="post-controller-section">
                <button className={hasLiked ? 'blue' : 'normal'} onClick={handleLikeButton}>Like</button>
                {
                  !addCommentClicked ? <button onClick={handleAddCommentBtnClick}>Add Comment</button> :
                    <>
                      <AddComment parentPost={post._id} />
                      <button onClick={handleAddCommentBtnClick}>Cancel</button>
                    </>
                }
                {post.post_author._id === currentUser._id &&
                  <>
                    {
                      !editPostButtonClicked ? <button onClick={handleEditButtonClick}>Edit Post</button> :
                        <>
                          <CreatePost content={post.post_content} postId={post._id} />
                          <button onClick={handleEditButtonClick}>Cancel</button>
                        </>
                    }
                    {
                      <button onClick={handleDeleteButtonClick}>Delete Post</button>
                    }
                  </>
                }

              </div>
            </div>
            <div className="post-comments-section">
              {
                post.post_comments.length > 0 &&
                <ul> Comments:
                  {post.post_comments.map(comment => <ViewComment parentPost={post._id} commentId={comment} key={comment} />)}
                </ul>
              }
            </div>
          </div>
      }
    </>
  )
};
