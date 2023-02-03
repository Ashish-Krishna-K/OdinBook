import { useEffect } from "react";
import { useImmer } from "use-immer";
import { generateAxiosInstance, getCurrentUserInfoFromLocalStorage } from "../helperModule";

export default function ViewPost({ id }) {
  const [currentUser, setCurrentUser] = useImmer(() => getCurrentUserInfoFromLocalStorage());
  const [post, setPost] = useImmer({});
  const [hasLiked, setHasLiked] = useImmer(false);
  const getPostFromServer = async (postId) => {
    const instance = generateAxiosInstance();
    try {
      const res = await instance.get(`/posts/${postId}`);
      setPost(res.data)
    } catch (error) {
      console.log(error);
    }
  }
  const updateLikesToServer = async (postId) => {
    const instance = generateAxiosInstance();
    try {
      const res = await instance.put(`/posts/${postId}/like`);
      if (res.status === 200) {
        setPost(res.data);
      }
    } catch (error) {
      console.log(error.response.data);
    }
  }
  useEffect(() => {
    getPostFromServer(id);
  }, [id]);
  useEffect(() => {
    if (post._id) {
      const result = post.post_likes.some(id => id === currentUser._id);
      setHasLiked(result);
    }
  }, [post])
  const handleLikeButton = () => {
    updateLikesToServer(id);
  }
  return (
    <>
      {
        !post._id ? <p>Loading...</p> :
          <div>
            <div className="post-author-section">
              <img src={post.post_author.display_picture} alt={post.post_author.display_name} />
              <p>{post.post_author.display_name}</p>
            </div>
            <div className="post-content-section">
              <p>{post.post_content}</p>
              <div className="post-controller-section">
                <button className={hasLiked ? 'blue' : 'normal'} onClick={handleLikeButton}>Like</button>
                <button>add comment</button>
              </div>
            </div>
            <div className="post-comments-section">
              comments section
            </div>
          </div>
      }
    </>
  )
}