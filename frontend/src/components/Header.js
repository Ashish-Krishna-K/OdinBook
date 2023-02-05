import { Link } from "react-router-dom";
import { useImmer } from "use-immer";
import {
  getCurrentUserInfoFromLocalStorage
} from "../helperModule";
import SearchForm from "./SearchForm";
import LogoutButton from "./LogoutButton";

export default function Header() {
  const [currentUser, setCurrentUser] = useImmer(() => getCurrentUserInfoFromLocalStorage());

  return (
    <header>
      <h1>
        <Link to="/">Odin Book</Link>
      </h1>
      <SearchForm />
      <div>
        {currentUser ? <Link to={`/user/${currentUser._id}`}>{currentUser.display_name}</Link> : <p>Welcome</p>}
        <LogoutButton />
      </div>
    </header>
  )
}
