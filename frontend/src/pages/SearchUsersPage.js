import { useContext, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useImmer } from "use-immer";
import DisplayPicture from "../components/DPWithFallback";
import { CurrentUserContext } from "../context";
import { generateAxiosInstance, getCurrentUserInfoFromLocalStorage } from "../helperModule";

export default function SearchUsers() {
  const { currentUser } = useContext(CurrentUserContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q');
  const [searchResults, setSearchResults] = useImmer([]);
  const [error, setError] = useImmer(null);

  const submitSearchReqToServer = async (data) => {
    const instance = generateAxiosInstance();
    try {
      const res = await instance.post('/users/search', { q: data });
      if (res.status === 200) {
        setError(null);
        const rawSearchResults = res.data;
        if (rawSearchResults.length > 1) {
          const removedCurrentUserFromResults = rawSearchResults.filter(user => user._id !== currentUser._id);
          setSearchResults(removedCurrentUserFromResults);
        } else {
          setSearchResults(rawSearchResults);
        }
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
                      <li className="minimal-user-display" key={result._id}>
                        <DisplayPicture src={result.display_picture} alt={result.display_name} />
                        <Link to={`/user/${result._id}`}>
                          <span>{result.display_name}</span>
                          <span className={result.status_online ? 'online' : 'offline'}></span>
                        </Link>
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