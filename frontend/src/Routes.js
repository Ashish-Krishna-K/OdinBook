import { createBrowserRouter } from "react-router-dom";
import App from './App'
import { getAuthTokenFromLocalStorage } from "./helperModule";
import ErrorPage from "./pages/ErrorPage";
import LoginPage from "./pages/LoginPage";
import SearchUsers from "./pages/SearchUsersPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    loader: () => getAuthTokenFromLocalStorage()
  },
  {
    path: "/login/:token?",
    element: <LoginPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/user/search",
    element: <SearchUsers />,
    errorElement: <ErrorPage />,
  }
])

export default router