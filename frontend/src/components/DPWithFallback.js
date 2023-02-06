import { useImmer } from "use-immer";
const placeholder = "../images/default.jpg"
export default function DisplayPicture({ src, alt }) {
  const [imgSrc, setImgSrc] = useImmer(src);
  const handleError = () => setImgSrc(placeholder);
  return <img src={imgSrc} onError={handleError} alt={alt} />
}