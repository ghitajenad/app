"use client"

import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { useSelector } from "react-redux"
import { selectIsAdmin } from "../../redux/authSlice"
import logo from "../Images/logo3.png"

export const Sidebar = ({ fixed = false, onLogout, isAdmin: isAdminProp }) => {
  const [isVisible, setIsVisible] = useState(fixed || false)
  const [isHovering, setIsHovering] = useState(false)
  const location = useLocation()
  const isAdminFromSelector = useSelector(selectIsAdmin)
  const isAdmin = isAdminProp !== undefined ? isAdminProp : isAdminFromSelector

  // Détecter si nous sommes sur la page dashboard
  const isDashboard =
    location.pathname.endsWith("dashboard") ||
    location.pathname === "/admin-dashboard" ||
    location.pathname === "/agent-dashboard"

  // Rendre le sidebar visible sur toutes les pages, mais fixe sur le dashboard
  useEffect(() => {
    if (fixed || isDashboard) {
      setIsVisible(true)
    }
  }, [fixed, isDashboard])

  // Gérer le survol pour afficher le sidebar
  const handleMouseEnter = () => {
    setIsHovering(true)
    setIsVisible(true)
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
    // Ne pas cacher le sidebar s'il est fixe ou sur le dashboard
    if (!fixed && !isDashboard) {
      setIsVisible(false)
    }
  }

  // Gérer le clic sur le bouton de déconnexion
  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout()
    }
  }

  return (
    <>
      {/* Zone de détection pour le survol sur toutes les pages */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "20px",
          height: "100vh",
          zIndex: 999,
        }}
        onMouseEnter={handleMouseEnter}
      />

      <aside
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          width: "250px",
          backgroundColor: "#fff",
          boxShadow: "2px 0 10px rgba(0, 0, 0, 0.1)",
          display: "flex",
          flexDirection: "column",
          zIndex: 1000,
          transition: "transform 0.3s ease-in-out, opacity 0.2s ease-in-out",
          transform: isVisible ? "translateX(0)" : "translateX(-100%)",
          opacity: isVisible ? 1 : 0,
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          style={{
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderBottom: "1px solid #eee",
          }}
        >
          <img
            src={logo || "/placeholder.svg"}
            alt="Ministère de la Justice"
            style={{
              width: "80px",
              height: "auto",
              marginBottom: "10px",
            }}
          />
          <h3
            style={{
              margin: 0,
              fontSize: "1rem",
              color: "#333",
              textAlign: "center",
            }}
          >
            Panneau de gestion
          </h3>
        </div>

        <nav
          style={{
            flex: 1,
            padding: "20px 0",
            overflowY: "auto",
          }}
        >
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
            }}
          >
            <li style={{ marginBottom: "5px" }}>
              <Link
                to={isAdmin ? "/admin-dashboard" : "/agent-dashboard"}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "12px 20px",
                  color: "#555",
                  textDecoration: "none",
                  transition: "background-color 0.2s, color 0.2s",
                  backgroundColor: isDashboard ? "#e3f2fd" : "transparent",
                  color: isDashboard ? "#2196f3" : "#555",
                  fontWeight: isDashboard ? 500 : "normal",
                  borderLeft: isDashboard ? "3px solid #2196f3" : "none",
                }}
              >
                <i
                  className="fas fa-tachometer-alt"
                  style={{ marginRight: "10px", width: "20px", textAlign: "center" }}
                ></i>
                <span>Tableau de bord</span>
              </Link>
            </li>

            {isAdmin && (
              <li style={{ marginBottom: "5px" }}>
                <Link
                  to="/admin-dashboard/inscription"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "12px 20px",
                    color: "#555",
                    textDecoration: "none",
                    transition: "background-color 0.2s, color 0.2s",
                    backgroundColor: location.pathname.includes("inscription") ? "#e3f2fd" : "transparent",
                    color: location.pathname.includes("inscription") ? "#2196f3" : "#555",
                    fontWeight: location.pathname.includes("inscription") ? 500 : "normal",
                    borderLeft: location.pathname.includes("inscription") ? "3px solid #2196f3" : "none",
                  }}
                >
                  <i
                    className="fas fa-user-plus"
                    style={{ marginRight: "10px", width: "20px", textAlign: "center" }}
                  ></i>
                  <span>Créer un compte</span>
                </Link>
              </li>
            )}

            <li style={{ marginBottom: "5px" }}>
              <Link
                to={isAdmin ? "/admin-dashboard/appointments-dashboard" : "/agent-dashboard/appointments-dashboard"}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "12px 20px",
                  color: "#555",
                  textDecoration: "none",
                  transition: "background-color 0.2s, color 0.2s",
                  backgroundColor: location.pathname.includes("appointments-dashboard") ? "#e3f2fd" : "transparent",
                  color: location.pathname.includes("appointments-dashboard") ? "#2196f3" : "#555",
                  fontWeight: location.pathname.includes("appointments-dashboard") ? 500 : "normal",
                  borderLeft: location.pathname.includes("appointments-dashboard") ? "3px solid #2196f3" : "none",
                }}
              >
                <i
                  className="fas fa-calendar-check"
                  style={{ marginRight: "10px", width: "20px", textAlign: "center" }}
                ></i>
                <span>Rendez-vous du jour</span>
              </Link>
            </li>

            <li style={{ marginBottom: "5px" }}>
              <Link
                to={isAdmin ? "/admin-dashboard/appointments" : "/agent-dashboard/appointments"}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "12px 20px",
                  color: "#555",
                  textDecoration: "none",
                  transition: "background-color 0.2s, color 0.2s",
                  backgroundColor:
                    location.pathname.includes("appointments") && !location.pathname.includes("dashboard")
                      ? "#e3f2fd"
                      : "transparent",
                  color:
                    location.pathname.includes("appointments") && !location.pathname.includes("dashboard")
                      ? "#2196f3"
                      : "#555",
                  fontWeight:
                    location.pathname.includes("appointments") && !location.pathname.includes("dashboard")
                      ? 500
                      : "normal",
                  borderLeft:
                    location.pathname.includes("appointments") && !location.pathname.includes("dashboard")
                      ? "3px solid #2196f3"
                      : "none",
                }}
              >
                <i
                  className="fas fa-calendar-alt"
                  style={{ marginRight: "10px", width: "20px", textAlign: "center" }}
                ></i>
                <span>Liste des rendez-vous</span>
              </Link>
            </li>

            <li style={{ marginBottom: "5px" }}>
              <Link
                to={isAdmin ? "/admin-dashboard/visitors" : "/agent-dashboard/visitors"}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "12px 20px",
                  color: "#555",
                  textDecoration: "none",
                  transition: "background-color 0.2s, color 0.2s",
                  backgroundColor: location.pathname.includes("visitors") ? "#e3f2fd" : "transparent",
                  color: location.pathname.includes("visitors") ? "#2196f3" : "#555",
                  fontWeight: location.pathname.includes("visitors") ? 500 : "normal",
                  borderLeft: location.pathname.includes("visitors") ? "3px solid #2196f3" : "none",
                }}
              >
                <i className="fas fa-users" style={{ marginRight: "10px", width: "20px", textAlign: "center" }}></i>
                <span>Gestion des visiteurs</span>
              </Link>
            </li>

            {isAdmin && (
              <li style={{ marginBottom: "5px" }}>
                <Link
                  to="/ajout-visiteur"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "12px 20px",
                    color: "#555",
                    textDecoration: "none",
                    transition: "background-color 0.2s, color 0.2s",
                    backgroundColor: location.pathname.includes("ajout-visiteur") ? "#e3f2fd" : "transparent",
                    color: location.pathname.includes("ajout-visiteur") ? "#2196f3" : "#555",
                    fontWeight: location.pathname.includes("ajout-visiteur") ? 500 : "normal",
                    borderLeft: location.pathname.includes("ajout-visiteur") ? "3px solid #2196f3" : "none",
                  }}
                >
                  <i
                    className="fas fa-user-plus"
                    style={{ marginRight: "10px", width: "20px", textAlign: "center" }}
                  ></i>
                  <span>Ajouter un visiteur</span>
                </Link>
              </li>
            )}
          </ul>
        </nav>

        <div
          style={{
            padding: "15px 20px",
            borderTop: "1px solid #eee",
          }}
        >
          <button
            style={{
              width: "100%",
              padding: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#f5f5f5",
              border: "none",
              borderRadius: "4px",
              color: "#d32f2f",
              cursor: "pointer",
              transition: "background-color 0.2s",
            }}
            onClick={handleLogoutClick}
          >
            <i className="fas fa-sign-out-alt" style={{ marginRight: "10px", width: "20px", textAlign: "center" }}></i>
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
