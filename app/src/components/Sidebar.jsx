"use client"
import { useSelector } from "react-redux"
import { selectUser } from "../redux/authSlice"
import logo from "./Images/logo3.png"
import "../styles/sidebar.css"

export const Sidebar = ({ isAdmin, activeComponent, setActiveComponent, onLogout }) => {
  const user = useSelector(selectUser)

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img src={logo || "/placeholder.svg"} alt="Ministère de la Justice" className="sidebar-logo" />
        <h3>Panneau de gestion</h3>
      </div>

      <div className="user-info">
        <div className="user-avatar">
          {user?.firstname?.charAt(0)}
          {user?.name?.charAt(0)}
        </div>
        <div className="user-details">
          <p className="user-name">
            {user?.firstname} {user?.name}
          </p>
          <p className="user-role">{isAdmin ? "Administrateur" : "Agent"}</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul>
          <li className={activeComponent === "overview" ? "active" : ""} onClick={() => setActiveComponent("overview")}>
            <i className="fas fa-tachometer-alt"></i>
            Tableau de bord
          </li>

          {isAdmin && (
            <li
              className={activeComponent === "inscription" ? "active" : ""}
              onClick={() => setActiveComponent("inscription")}
            >
              <i className="fas fa-user-plus"></i>
              Créer un compte
            </li>
          )}

          <li className={activeComponent === "visitors" ? "active" : ""} onClick={() => setActiveComponent("visitors")}>
            <i className="fas fa-users"></i>
            Gestion des visiteurs
          </li>

          <li
            className={activeComponent === "appointments-dashboard" ? "active" : ""}
            onClick={() => setActiveComponent("appointments-dashboard")}
          >
            <i className="fas fa-calendar-check"></i>
            Tableau des rendez-vous
          </li>

          <li
            className={activeComponent === "appointments" ? "active" : ""}
            onClick={() => setActiveComponent("appointments")}
          >
            <i className="fas fa-calendar-alt"></i>
            Liste des rendez-vous
          </li>

          <li className={activeComponent === "reports" ? "active" : ""} onClick={() => setActiveComponent("reports")}>
            <i className="fas fa-chart-bar"></i>
            Rapports & Statistiques
          </li>

          <li className={activeComponent === "settings" ? "active" : ""} onClick={() => setActiveComponent("settings")}>
            <i className="fas fa-cog"></i>
            Paramètres
          </li>
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button className="logout-button" onClick={onLogout}>
          <i className="fas fa-sign-out-alt"></i>
          Déconnexion
        </button>
      </div>
    </aside>
  )
}

