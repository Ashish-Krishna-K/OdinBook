import { useLoaderData, Navigate } from "react-router-dom";
import Header from "./components/Header";

export default function App() {
  const authToken = useLoaderData();

  return (
    <>
      {
        !authToken ? <Navigate to="/login" /> :
          <>
            <Header />
            <main>
              <h2>Yet to implement</h2>
            </main>
          </>
      }
    </>
  );
}

