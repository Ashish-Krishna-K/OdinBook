import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./components/Header";
import { checkUserInLocalStorage } from "./helperModule";

export default function App() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!checkUserInLocalStorage()) {
      navigate('/login')
    }
  })

  return (
    <>
      <header>
        <Header />
      </header>
      <main>
        <h2>Yet to implement</h2>
      </main>
    </>
  );
}

