import { useEffect } from "react";
import { useImmer } from "use-immer"
import { generateAxiosInstance } from "../helperModule";

export default function AddComment({ parentPost, commentId, content }) {
  const [comment, setComment] = useImmer({ content: '' });
  const [error, setError] = useImmer({ value: '' });
  const [characterCount, setCharacterCount] = useImmer({ value: '' });
  const [isEditComment, setIsEditComment] = useImmer(false);

  const postCommentToServer = async (data) => {
    const instance = generateAxiosInstance();
    try {
      const res = await instance.post(`/posts/${parentPost}/comments/create`, data);
      if (res.status === 200) {
        window.location.reload();
      }
    } catch (error) {
      console.log(error.response.status, error.response.data);
      setError({ value: error.response.data });
    }
  };
  const postEditCommentToServer = async (data) => {
    const instance = generateAxiosInstance();
    try {
      const res = await instance.put(`/posts/${parentPost}/comments/${commentId}/edit`, data);
      if (res.status === 200) {
        window.location.reload();
      }
    } catch (error) {
      console.log(error.response.status, error.response.data);
      setError({ value: error.response.data });
    }
  };

  useEffect(() => {
    if (content) {
      setComment({
        content: content
      });
      setIsEditComment(true);
    }
  }, [content]);

  const handleInput = (e) => {
    setComment({
      content: e.target.value
    });
    const count = 1024 - e.target.value.length;
    setCharacterCount({
      value: count
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditComment) {
      postEditCommentToServer({ content: comment.content });
    } else {
      postCommentToServer({ content: comment.content })
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <textarea
          value={comment.content}
          onChange={handleInput}
          placeholder="Add comment..."
          maxLength="1024"
        ></textarea>
        <span>{`${characterCount.value} of 1024 left`}</span>
        <button type="submit">Submit</button>
      </form>
      {error.value && <p>{error.value}</p>}
    </>
  )
}