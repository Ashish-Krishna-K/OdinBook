import { useImmer } from "use-immer";

import {
  checkForEquality,
  generateAxiosInstance
} from "../helperModule";

import ViewPost from "../components/ViewPost";

const getNewsFeed = async () => {
  const instance = generateAxiosInstance();
  return await instance.get('/posts/newsfeed');
}

export default function HomePage() {
  const [feed, setFeed] = useImmer(null);
  const [error, setError] = useImmer(null);

  const feedPromise = getNewsFeed();
  feedPromise
    .then(response => {
      const data = response.data;
      if (feed === null) {
        setFeed(data);
      } else if (!checkForEquality(feed, data)) {
        setFeed(data);
      }
    })
    .catch(err => {
      if (error === null) {
        setError(err)
      } else if (!checkForEquality(error, err)) {
        setError(err);
      }
    })
  const uniqueFeed = Array.from(new Set(feed));
  return (
    <section className="content">
      <div className="news-feed">
        {
          feed &&
          <ul>
            {uniqueFeed.map(post => <ViewPost key={post} id={post} />)}
          </ul>
        }
      </div>
    </section>
  )
}