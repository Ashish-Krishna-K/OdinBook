import { createBrowserRouter } from "react-router-dom";

import App from './App'
import ErrorPage from "./pages/ErrorPage";
import LoginPage from "./pages/LoginPage";
import SearchUsers from "./pages/SearchUsersPage";
import UserPage from "./pages/UserPage/UserPage";
import UserAbout from "./pages/UserPage/UserAbout";
import UserFriends from "./pages/UserPage/UserFriends";
import UserRequests from "./pages/UserPage/UserRequests";
import UserPosts from "./pages/UserPage/UserPosts";
import HomePage from "./pages/HomePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <HomePage />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/user/search",
        element: <SearchUsers />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/user/:userId",
        element: <UserPage />,
        errorElement: <ErrorPage />,
        children: [
          {
            path: "/user/:userId",
            element: <UserAbout />,
          },
          {
            path: "/user/:userId/friends",
            element: <UserFriends />,
          },
          {
            path: "/user/:userId/requests",
            element: <UserRequests />
          },
          {
            path: "/user/:userId/posts",
            element: <UserPosts />
          }
        ]
      }
    ]
  },
  {
    path: "/login/:token?",
    element: <LoginPage />,
    errorElement: <ErrorPage />,
  },

])

export default router;
