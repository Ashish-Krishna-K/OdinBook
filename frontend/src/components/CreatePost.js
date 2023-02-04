import { useEffect } from "react";
import { useImmer } from "use-immer"
import { generateAxiosInstance } from "../helperModule";

export default function CreatePost({ content, postId }) {
  const [postContent, setPostContent] = useImmer({ value: '' });
  const [characterCount, setCharacterCount] = useImmer({ value: '' });
  const [isEditPost, setIsEditPost] = useImmer(false);
  const [error, setError] = useImmer({
    value: ''
  })
  const submitPostDataToServer = async (data) => {
    const instance = generateAxiosInstance();
    try {
      const res = await instance.post('/posts/create', data);
      console.log(res.data);
    } catch (error) {
      console.log(error.response.status, error.response.data);
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
  }
  useEffect(() => {
    if (content) {
      setPostContent({
        value: content
      })
      setIsEditPost(true);
    }
  }, [content])
  const handleInput = (e) => {
    setPostContent({ value: e.target.value });
    const count = e.target.value.length;
    setCharacterCount({ value: count });
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
    <>
      <form onSubmit={handleSubmit}>
        <textarea
          value={postContent.value}
          onChange={handleInput}
          placeholder="Add a post..."
          maxLength="1024"
        ></textarea>
        <span>{`${1024 - characterCount.value} of 1024 left`}</span>
        <button type="submit">Submit</button>
        {/* <button type="button">Cancel</button> */}
      </form>
      {error.value && <p>{error.value}</p>}
    </>

  )
}