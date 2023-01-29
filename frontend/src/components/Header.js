import { Link } from "react-router-dom";
import { clearLocalStorage } from "../helperModule";
import SearchForm from "./SearchForm";

export default function Header() {
  const handleLogout = () => {
    clearLocalStorage();
    window.location.reload(); 
  }
  return (
    <header>
      <h1>
        <Link to="/">Odin Book</Link>
      </h1>
      <SearchForm />
      <button onClick={handleLogout}>Logout</button>
    </header>
  )
}
