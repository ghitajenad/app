"use client"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { clearCredentials, selectIsAuthenticated } from "../redux/authSlice"
import { useLogoutMutation } from "../redux/apiSlice"
import "../App.css"
import logo3 from "./Images/logo3.png"

export const Navbar = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [logout] = useLogoutMutation()

  const handleLogout = async () => {
    try {
      // Call the logout endpoint
      await logout().unwrap()
      // Clear credentials from Redux store and localStorage
      dispatch(clearCredentials())
      // Redirect to login page
      navigate("/")
    } catch (error) {
      console.error("Logout failed:", error)
      // Even if the API call fails, clear credentials locally
      dispatch(clearCredentials())
      navigate("/")
    }
  }

  return (
    <nav className="navbar navbar-expand-lg bgnav">
      <div className="container-fluid">
        <img src={logo3 || "/placeholder.svg"} alt="" width="450" height="200" className="text-start d-block" />

        {isAuthenticated && (
          <div className="d-flex">
            <button onClick={handleLogout} className="btn btn-outline-dark">
              Déconnexion
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}

