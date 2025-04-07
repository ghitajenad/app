"use client"

import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { logout, selectUser } from "../redux/authSlice"
import { useLogoutMutation } from "../redux/apiSlice"
import { Sidebar } from "./Sidebar"
import { Inscription } from "./Inscription"
import { VisitorsList } from "./visitors/VisitorsList"
import { AppointmentsList } from "./appointments/AppointmentsList"
import { AppointmentsDashboard } from "./appointments/AppointmentsDashboard"
import { ReportsDashboard } from "./reports/Dashboard"
import "../styles/dashboard.css"

export const AdminDashboard = () => {
  const [activeComponent, setActiveComponent] = useState("overview")
  const user = useSelector(selectUser)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [logoutApi] = useLogoutMutation()

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap()
      dispatch(logout())
      navigate("/")
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error)
      // Même en cas d'erreur, on déconnecte l'utilisateur localement
      dispatch(logout())
      navigate("/")
    }
  }

  const renderComponent = () => {
    switch (activeComponent) {
      case "inscription":
        return <Inscription />
      case "visitors":
        return <VisitorsList />
      case "appointments":
        return <AppointmentsList />
      case "appointments-dashboard":
        return <AppointmentsDashboard />
      case "reports":
        return <ReportsDashboard />
      case "overview":
      default:
        return (
          <div className="dashboard-overview">
            <h2>Tableau de bord administrateur</h2>
            <div className="welcome-card">
              <h3>
                Bienvenue, {user?.firstname} {user?.name}
              </h3>
              <p>Vous êtes connecté en tant qu'administrateur.</p>
            </div>

            <div className="dashboard-stats">
              <div className="stat-card">
                <h4>Utilisateurs</h4>
                <p className="stat-number">24</p>
              </div>
              <div className="stat-card">
                <h4>Agents</h4>
                <p className="stat-number">18</p>
              </div>
              <div className="stat-card">
                <h4>Visiteurs</h4>
                <p className="stat-number">156</p>
              </div>
              <div className="stat-card">
                <h4>Rendez-vous</h4>
                <p className="stat-number">42</p>
              </div>
            </div>

            <div className="recent-activity">
              <h3>Activité récente</h3>
              <ul className="activity-list">
                <li>
                  <span className="activity-time">10:45</span>
                  <span className="activity-text">Nouvel agent enregistré</span>
                </li>
                <li>
                  <span className="activity-time">09:30</span>
                  <span className="activity-text">Rendez-vous confirmé</span>
                </li>
                <li>
                  <span className="activity-time">Hier</span>
                  <span className="activity-text">Rapport mensuel généré</span>
                </li>
              </ul>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="dashboard-container">
      <Sidebar
        isAdmin={true}
        activeComponent={activeComponent}
        setActiveComponent={setActiveComponent}
        onLogout={handleLogout}
      />
      <main className="dashboard-content">{renderComponent()}</main>
    </div>
  )
}

