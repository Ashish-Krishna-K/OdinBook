import { Link } from "react-router-dom";
import {
  clearLocalStorage,
  getCurrentUserInfoFromLocalStorage
} from "../helperModule";
import SearchForm from "./SearchForm";
import { useImmer } from "use-immer";

export default function Header() {
  const [currentUser, setCurrentUser] = useImmer(() => getCurrentUserInfoFromLocalStorage());

  const handleLogout = () => {
    clearLocalStorage();
    window.location.reload();
  };

  return (
    <header>
      <h1>
        <Link to="/">Odin Book</Link>
      </h1>
      <SearchForm />
      <div>
        {currentUser ? <Link to={`/user/${currentUser._id}`}>{currentUser.display_name}</Link> : <p>Welcome</p>}
        <button onClick={handleLogout}>Logout</button>
      </div>
    </header>
  )
}
