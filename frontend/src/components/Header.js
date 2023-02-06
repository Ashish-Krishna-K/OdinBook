import { Link } from "react-router-dom";
import {
  getCurrentUserInfoFromLocalStorage
} from "../helperModule";
import SearchForm from "./SearchForm";
import LogoutButton from "./LogoutButton";
import DisplayPicture from "./DPWithFallback";

export default function Header() {
  const currentUser = getCurrentUserInfoFromLocalStorage();
  return (
    <header>
      <h1>
        <Link to="/">Odin Book</Link>
      </h1>
      <SearchForm />
      <div>
        {currentUser ?
          <>
            <DisplayPicture src={currentUser.display_picture} alt={currentUser.display_name} />
            <Link to={`/user/${currentUser._id}`}>{currentUser.display_name}</Link>
          </> : <p>Welcome</p>}
        <LogoutButton />
      </div>
    </header>
  )
}
