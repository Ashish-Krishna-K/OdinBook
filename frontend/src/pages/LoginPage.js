import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { saveTokenToLocalStorage } from "../helperModule";

export default function LoginPage() {
  const navigate = useNavigate()
  const { token } = useParams();

  useEffect(() => {
    if (token) {
      saveTokenToLocalStorage(token);
      navigate('/')
    }
  })

  return (
    <a href="http://localhost:8080/api/users/login/facebook">Login With Facebook</a>
  )
}