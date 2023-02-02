import { createBrowserRouter } from "react-router-dom";
import { getUserFromServer } from "./helperModule";

import App from './App'
import ErrorPage from "./pages/ErrorPage";
import LoginPage from "./pages/LoginPage";
import SearchUsers from "./pages/SearchUsersPage";
import UserPage from "./pages/UserPage";
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
        path: "/user/:id",
        element: <UserPage />,
        errorElement: <ErrorPage />,
        loader: ({ params }) => {
          return getUserFromServer(params)
        },
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
