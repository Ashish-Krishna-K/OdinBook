import Icon from '@mdi/react';
import { mdiMagnify } from '@mdi/js';

import { useNavigate, createSearchParams } from "react-router-dom";
import { useImmer } from "use-immer";
import { useContext } from 'react';
import { ThemeContext } from "../context";

export default function SearchForm() {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useImmer({ text: '' });

  const handleSearchInput = (e) => {
    setSearchInput({
      text: e.target.value
    })
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    navigate({
      pathname: '/user/search',
      search: createSearchParams({ q: searchInput.text }).toString()
    });
  };

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <label htmlFor="search"></label>
      <input
        id="search"
        className={theme === 'dark' ? 'dark-theme' : undefined}
        name="q"
        type="search"
        onChange={handleSearchInput}
        value={searchInput.text}
        required
      />
      <button className={theme === 'dark' ? 'dark-theme' : undefined}>
        <Icon path={mdiMagnify} size={1} />
      </button>
    </form>
  )
}