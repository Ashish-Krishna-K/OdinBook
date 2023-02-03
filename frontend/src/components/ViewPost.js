import { useImmer } from "use-immer";
import { generateAxiosInstance } from "../helperModule";

export default function ViewPost({id}) {
  const [post, setPost] = useImmer({});
  const getPostFromServer = async (postId) => {
    const instance = generateAxiosInstance();
    try {
      const res = inst
    } catch (error) {
      
    }
  } 
}