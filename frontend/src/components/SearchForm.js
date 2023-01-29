import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosAuthInstance } from "../helperModule";


export default function SearchForm() {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState({ text: '' });

  const submitSearchReqToServer = async (data) => {
    try {
      const res = await axiosAuthInstance.post('/users/search', data);
      console.log(res.status, res.data);
      if (res.status === 200) {
        navigate('/user/search', { state: { results: res.data } });
      }
    } catch (error) {
      console.log(error.response.data);
    }
  }

  const handleSearchInput = (e) => {
    setSearchInput({
      text: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    submitSearchReqToServer({ q: searchInput.text });
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="search"></label>
      <input id="search" name="q" type="search" onChange={handleSearchInput} value={searchInput.text} required />
      <button>Search</button>
    </form>
  )
}