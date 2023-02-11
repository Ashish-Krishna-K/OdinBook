import { useEffect } from "react";
import { useImmer } from "use-immer"
import { generateAxiosInstance } from "../helperModule";

export default function AddComment({ parentPost, commentId, content }) {
  const [comment, setComment] = useImmer({ content: content });
  const [error, setError] = useImmer({ value: '' });
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
    <form className="add-comment-form" onSubmit={handleSubmit}>
      <textarea
        value={comment.content}
        onChange={handleInput}
        placeholder="Add comment..."
        maxLength="1024"
      ></textarea>
      {comment.content ? <p>{`${1024 - comment.content.length} of 1024 left`}</p> : <p>1024 of 1024 left</p>}
      {error.value && <p className="error">{error.value}</p>}
      <button className="submit-btn" type="submit">Submit</button>
    </form>
  )
}