import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from './App'
import ErrorPage from "./pages/ErrorPage";
import LoginPage from "./pages/LoginPage";

export default function RouteSwitch() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} errorElement={<ErrorPage />} />
        <Route path="/login/:token?" element={<LoginPage />} errorElement={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  )
}
