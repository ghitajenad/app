"use client"

import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { logout, selectUser } from "../redux/authSlice"
import { useLogoutMutation } from "../redux/apiSlice"
import { Sidebar } from "./Sidebar"
import { VisitorsList } from "./visitors/VisitorsList"
import { AppointmentsList } from "./appointments/AppointmentsList"
import "../styles/dashboard.css"

export const AgentDashboard = () => {
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
      dispatch(logout())
      navigate("/")
    }
  }

  const renderComponent = () => {
    switch (activeComponent) {
      case "visitors":
        return <VisitorsList />
      case "appointments":
        return <AppointmentsList />
      case "overview":
      default:
        return (
          <div className="dashboard-overview">
            <h2>Tableau de bord agent</h2>
            <div className="welcome-card">
              <h3>
                Bienvenue, {user?.firstname} {user?.name}
              </h3>
              <p>Vous êtes connecté en tant qu'agent.</p>
            </div>

            <div className="dashboard-stats">
              <div className="stat-card">
                <h4>Visiteurs aujourd'hui</h4>
                <p className="stat-number">12</p>
              </div>
              <div className="stat-card">
                <h4>Rendez-vous</h4>
                <p className="stat-number">8</p>
              </div>
              <div className="stat-card">
                <h4>En attente</h4>
                <p className="stat-number">3</p>
              </div>
            </div>

            <div className="upcoming-appointments">
              <h3>Prochains rendez-vous</h3>
              <table className="appointments-table">
                <thead>
                  <tr>
                    <th>Heure</th>
                    <th>Visiteur</th>
                    <th>Motif</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>11:00</td>
                    <td>Ahmed Benali</td>
                    <td>Consultation juridique</td>
                    <td>
                      <span className="status-confirmed">Confirmé</span>
                    </td>
                  </tr>
                  <tr>
                    <td>13:30</td>
                    <td>Fatima Zahra</td>
                    <td>Dépôt de dossier</td>
                    <td>
                      <span className="status-pending">En attente</span>
                    </td>
                  </tr>
                  <tr>
                    <td>15:00</td>
                    <td>Karim Alaoui</td>
                    <td>Suivi de dossier</td>
                    <td>
                      <span className="status-confirmed">Confirmé</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="dashboard-container">
      <Sidebar
        isAdmin={false}
        activeComponent={activeComponent}
        setActiveComponent={setActiveComponent}
        onLogout={handleLogout}
      />
      <main className="dashboard-content">{renderComponent()}</main>
    </div>
  )
}

