import { useState } from "react";
import { useNavigate, createSearchParams } from "react-router-dom";


export default function SearchForm() {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState({ text: '' });

  const handleSearchInput = (e) => {
    setSearchInput({
      text: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate({
      pathname: '/user/search',
      search: createSearchParams({ q: searchInput.text }).toString()
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="search"></label>
      <input id="search" name="q" type="search" onChange={handleSearchInput} value={searchInput.text} required />
      <button>Search</button>
    </form>
  )
}