import { useImmer } from "use-immer";
import placeholder from "../images/default.webp";


export default function DisplayPicture({ src, alt }) {
  const [imgSrc, setImgSrc] = useImmer(src);
  const handleError = () => setImgSrc(placeholder);
  return (
    <img
      width="50"
      height="50"
      src={imgSrc}
      onError={handleError}
      alt={alt}
    />
  )
}