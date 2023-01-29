import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function SearchUsers() {
  const location = useLocation();
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    setSearchResults(location.state.results);
  }, [location])

  return (
    <>
      {
        searchResults.length !== 0 &&
        <ul>
          {
            searchResults.map(result => {
              console.log(result);
              return (
                <li key={result._id}>
                  <img src={result.display_picture} alt={result.display_name} />
                  <p>{result.display_name}</p>
                </li>
              )
            })
          }
        </ul>
      }
    </>
  )

} 