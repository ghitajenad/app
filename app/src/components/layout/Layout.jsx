"use client"

import { useEffect } from "react"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { selectIsAuthenticated, logout, selectIsAdmin } from "../../redux/authSlice"
import { useLogoutMutation } from "../../redux/apiSlice"
import { Sidebar } from "./Sidebar"
import "../../styles/layout.css"

export const Layout = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const isAdmin = useSelector(selectIsAdmin)
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [logoutApi] = useLogoutMutation()

  // Vérifier si nous sommes sur la page dashboard
  const isDashboard =
    location.pathname.endsWith("dashboard") ||
    location.pathname === "/admin-dashboard" ||
    location.pathname === "/agent-dashboard"

  // Rediriger vers la page de connexion si non authentifié
  useEffect(() => {
    if (!isAuthenticated && !location.pathname.startsWith("/login")) {
      navigate("/")
    }
  }, [isAuthenticated, location.pathname, navigate])

  // Gérer la déconnexion
  const handleLogout = async () => {
    try {
      // Appel à l'API de déconnexion
      await logoutApi().unwrap()
      console.log("Déconnexion API réussie")
    } catch (error) {
      console.error("Erreur lors de la déconnexion API:", error)
    } finally {
      // Même en cas d'erreur, on déconnecte l'utilisateur localement
      dispatch(logout())
      // Redirection vers la page de connexion
      navigate("/")
    }
  }

  // Déterminer la classe de thème
  const themeClass = isAdmin ? "admin-theme" : "agent-theme"

  return (
    <div className={`layout-container ${themeClass}`}>
      <Sidebar fixed={isDashboard} onLogout={handleLogout} isAdmin={isAdmin} />

      <main className={`main-content ${isDashboard ? "with-fixed-sidebar" : ""}`}>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
