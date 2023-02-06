import { createBrowserRouter } from "react-router-dom";

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
        path: "/user/:userId",
        element: <UserPage />,
        errorElement: <ErrorPage />,
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
