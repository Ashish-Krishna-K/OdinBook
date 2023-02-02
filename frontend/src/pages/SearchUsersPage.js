import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useImmer } from "use-immer";
import { axiosAuthInstance, generateAxiosInstance, getCurrentUserInfoFromLocalStorage } from "../helperModule";

export default function SearchUsers() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q');
  const [searchResults, setSearchResults] = useImmer([]);
  const [currentUser, setCurrentUser] = useImmer(() => getCurrentUserInfoFromLocalStorage());
  const [error, setError] = useImmer();

  const submitSearchReqToServer = async (data) => {
    const instance = generateAxiosInstance();
    try {
      const res = await instance.post('/users/search', { q: data });
      if (res.status === 200) {
        const rawSearchResults = res.data;
        const removedCurrentUserFromResults = rawSearchResults.filter(user => user._id !== currentUser._id);
        setSearchResults(removedCurrentUserFromResults);
      }
    } catch (error) {
      console.log(error.response.data);
      setError(error.response.data)
    }
  }

  useEffect(() => {
    submitSearchReqToServer(query);
  }, [query])

  return (
    <>
      {
        error ? <p>{error}</p> :
          <>
            {
              searchResults.length !== 0 &&
              <ul>
                {
                  searchResults.map(result => {
                    return (
                      <li key={result._id}>
                        <img src={result.display_picture} alt={result.display_name} />
                        <Link to={`/user/${result._id}`}>{result.display_name}</Link>
                      </li>
                    )
                  })
                }
              </ul>
            }
          </>
      }
    </>
  )

} 