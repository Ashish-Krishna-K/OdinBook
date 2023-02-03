import { useImmer } from "use-immer"
import { generateAxiosInstance } from "../helperModule";

export default function CreatePost() {
  const [focused, setFocused] = useImmer(false);
  const [postContent, setPostContent] = useImmer({ value: '' });

  const submitPostDataToServer = async (data) => {
    const instance = generateAxiosInstance()
    try {
      const res = await instance.post('/posts/create', data);
      console.log(res.data);
    } catch (error) {
      console.log(error.response.status, error.response.data);
    }
  };
  const handleInput = (e) => {
    setPostContent({ value: e.target.value })
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    submitPostDataToServer({ content: postContent.value });
  }
  return (
    <form onSubmit={handleSubmit}>
      {focused && <span>A Maximum of 1024 characters is allowed!</span>}
      <textarea
        value={postContent.value}
        onChange={handleInput}
        onFocus={() => { setFocused(true) }}
        onBlur={() => { setFocused(false) }}
        placeholder="Add a post..."
        maxLength="1024"
      ></textarea>
      <button type="submit">Submit</button>
    </form>
  )
}