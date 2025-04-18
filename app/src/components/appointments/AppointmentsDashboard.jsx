"use client"

import { useState, useEffect, useCallback } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { selectToken, selectIsAuthenticated, logout } from "../../redux/authSlice"
import "../../styles/appointments.css"

export const AppointmentsDashboard = () => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [debugInfo, setDebugInfo] = useState(null)

  const token = useSelector(selectToken)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const fetchTodayAppointments = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("http://127.0.0.1:8004/api/rendezvous/today", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
      })

      const responseDebugInfo = {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries([...response.headers.entries()]),
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        if (response.status === 401) {
          dispatch(logout())
          navigate("/")
          throw new Error("Session expirée. Veuillez vous reconnecter.")
        }
        throw new Error(errorData.message || `Erreur ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      if (data.status === "success") {
        setAppointments(data.data || [])
        setDebugInfo({
          responseInfo: responseDebugInfo,
          dataInfo: {
            count: data.count || 0,
            debug_info: data.debug_info || {},
          },
        })
      } else {
        throw new Error(data.message || "Erreur lors de la récupération des rendez-vous")
      }
    } catch (err) {
      setError(err.message)
      setDebugInfo((prev) => ({
        ...prev,
        error: err.toString(),
        stack: err.stack,
      }))
    } finally {
      setLoading(false)
    }
  }

  const fetchWithFallback = useCallback(async () => {
    await fetchTodayAppointments()
  }, [token, isAuthenticated, navigate, dispatch])

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchWithFallback()
    }
  }, [isAuthenticated, token, fetchWithFallback])

  const useDemoData = () => {
    const demoAppointments = [
      {
        id: 1,
        visitor_name: "Mohammed Alami",
        slot: "10:30",
        motif: "Consultation juridique",
        statut: "confirmé",
      },
      {
        id: 2,
        visitor_name: "Fatima Benali",
        slot: "14:00",
        motif: "Dépôt de dossier",
        statut: "programmé",
      },
      {
        id: 3,
        visitor_name: "Ahmed Tazi",
        slot: "16:15",
        motif: "Suivi de dossier",
        statut: "terminé",
      },
    ]
    setAppointments(demoAppointments)
    setLoading(false)
    setError(null)
  }

  const formatTime = (timeString) => {
    if (!timeString) return "--:--"
    return timeString
  }

  const navigateToNewAppointment = () => {
    navigate("/admin-dashboard/appointments/new")
  }

  const navigateToUpcoming = () => {
    navigate("/admin-dashboard/appointments", { state: { filter: "upcoming" } })
  }

  const navigateToHistory = () => {
    navigate("/admin-dashboard/appointments", { state: { filter: "history" } })
  }

  const handleReconnect = () => {
    dispatch(logout())
    navigate("/")
  }

  const handleRetry = () => {
    fetchTodayAppointments()
  }

  return (
    <div className="appointments-dashboard">
      <h2>Tableau de bord des rendez-vous</h2>

      <div className="dashboard-cards">
        <div className="dashboard-card upcoming" onClick={navigateToUpcoming}>
          <div className="card-icon">
            <i className="fas fa-calendar-alt"></i>
          </div>
          <div className="card-content">
            <h3>Rendez-vous à venir</h3>
            <p>Voir tous les rendez-vous futurs</p>
          </div>
        </div>

        <div className="dashboard-card history" onClick={navigateToHistory}>
          <div className="card-icon">
            <i className="fas fa-history"></i>
          </div>
          <div className="card-content">
            <h3>Historique</h3>
            <p>Rendez-vous passés et annulés</p>
          </div>
        </div>
      </div>

      <div className="today-appointments">
        <div className="appointments-header">
          <h3>Rendez-vous du jour</h3>
          <button className="btn btn-primary" onClick={navigateToNewAppointment}>
            <i className="fas fa-plus"></i> Nouveau rendez-vous
          </button>
        </div>

        {loading ? (
          <div className="text-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Chargement...</span>
            </div>
          </div>
        ) : error ? (
          <div className="alert alert-danger">
            <p>{error}</p>
            <p>
              Vérifiez que votre serveur backend est en cours d'exécution et que vous êtes correctement authentifié.
            </p>
            <div className="mt-3">
              <button className="btn btn-primary me-2" onClick={handleRetry}>
                Réessayer
              </button>
              <button className="btn btn-outline-primary me-2" onClick={handleReconnect}>
                Se reconnecter
              </button>
              <button className="btn btn-outline-secondary" onClick={useDemoData}>
                Utiliser des données de démonstration
              </button>
            </div>
            {debugInfo && (
              <div className="mt-3">
                <h5>Informations de débogage:</h5>
                <pre className="debug-info">{JSON.stringify(debugInfo, null, 2)}</pre>
              </div>
            )}
          </div>
        ) : appointments.length === 0 ? (
          <div className="empty-state">
            <div className="alert alert-info">
              <p>Aucun rendez-vous prévu aujourd'hui.</p>
              <p>Vous pouvez créer un nouveau rendez-vous en cliquant sur le bouton "Nouveau rendez-vous".</p>
            </div>
            <div className="mt-3">
              <button className="btn btn-outline-secondary" onClick={useDemoData}>
                Afficher des données de démonstration
              </button>
            </div>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover appointments-table">
              <thead>
                <tr>
                  <th>Créneau</th>
                  <th>Visiteur</th>
                  <th>Motif</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr
                    key={appointment.id}
                    onClick={() =>
                      navigate(`/admin-dashboard/appointments/${appointment.id}`)
                    }
                  >
                    <td>{formatTime(appointment.slot || appointment.heure)}</td>
                    <td>
                      {appointment.visitor_name ||
                        `${appointment.nom || ""} ${appointment.prenom || ""}`}
                    </td>
                    <td>{appointment.motif || "Non spécifié"}</td>
                    <td>
                      <span
                        className={`status-badge status-${
                          appointment.statut === "terminé"
                            ? "completed"
                            : appointment.statut === "confirmé"
                            ? "confirmed"
                            : "default"
                        }`}
                      >
                        {appointment.statut || "Non spécifié"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
