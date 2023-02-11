import { useContext } from "react";
import { useImmer } from "use-immer"
import { ThemeContext } from "../App";
import { generateAxiosInstance } from "../helperModule";

export default function CreatePost({ content, postId }) {
  const { theme } = useContext(ThemeContext);
  const [postContent, setPostContent] = useImmer({ value: content });
  const [isEditPost, setIsEditPost] = useImmer(false);
  const [error, setError] = useImmer({
    value: ''
  });

  if (content && !isEditPost) {
    setIsEditPost(true);
  }

  const submitPostDataToServer = async (data) => {
    const instance = generateAxiosInstance();
    try {
      const res = await instance.post('/posts/create', data);
      console.log(res.data);
      window.location.reload();
    } catch (error) {
      console.log(error.response.status, error.response.data);
      setError({ value: error.response.data });
    }
  };
  const submitEditPostToServer = async (data) => {
    const instance = generateAxiosInstance();
    try {
      const res = await instance.put(`/posts/${postId}/edit`, data);
      window.location.reload();
    } catch (error) {
      console.log(error.response.status, error.response.data);
      setError({ value: error.response.data });
    }
  };

  const handleInput = (e) => {
    setPostContent({ value: e.target.value });
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditPost) {
      submitEditPostToServer({ content: postContent.value });
    } else {
      submitPostDataToServer({ content: postContent.value });
    }
  }
  return (
    <form className="create-post-form" onSubmit={handleSubmit}>
      <textarea
        className={theme === 'dark' ? 'dark-theme' : undefined}
        value={postContent.value}
        onChange={handleInput}
        placeholder="Add a post..."
        maxLength="1024"
      ></textarea>
      {postContent.value ? <p>{`${1024 - postContent.value.length} of 1024 left`}</p> : <p>1024 of 1024 left</p>}
      {error.value && <p className="error">{error.value}</p>}
      <button className="submit-btn" type="submit">Submit</button>
    </form>
  )
}