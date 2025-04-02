import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"
import { selectIsAuthenticated } from "../redux/authSlice"

export const ProtectedRoute = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated)

  // If not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  // If authenticated, render the child routes
  return <Outlet />
}

