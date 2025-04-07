"use client"

import { useState, useEffect } from "react"
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

  // Fonction pour récupérer les rendez-vous du jour
  const fetchTodayAppointments = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("Fetching appointments with token:", token ? `${token.substring(0, 10)}...` : "No token")

      // Utiliser la nouvelle API optimisée
      const response = await fetch("http://127.0.0.1:8004/api/rendezvous/today", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
      })

      // Enregistrer les informations de débogage
      const responseDebugInfo = {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries([...response.headers.entries()]),
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("API Error:", errorData)

        if (response.status === 401) {
          dispatch(logout())
          navigate("/")
          throw new Error("Session expirée. Veuillez vous reconnecter.")
        }

        throw new Error(errorData.message || `Erreur ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log("Appointments data:", data)

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
      console.error("Error fetching appointments:", err)
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

  // Essayer également l'ancienne API si la nouvelle échoue
  const fetchWithFallback = async () => {
    try {
      await fetchTodayAppointments()
    } catch (err) {
      console.log("Trying fallback API...")
      try {
        const response = await fetch("http://127.0.0.1:8004/api/appointments/today", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
        })

        if (!response.ok) {
          throw new Error(`Fallback API failed: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()

        if (data.status === "success") {
          setAppointments(data.data || [])
          setError(null)
        } else {
          throw new Error(data.message || "Erreur lors de la récupération des rendez-vous")
        }
      } catch (fallbackErr) {
        console.error("Fallback API also failed:", fallbackErr)
        setError(`Les deux APIs ont échoué. Dernière erreur: ${fallbackErr.message}`)
      } finally {
        setLoading(false)
      }
    }
  }

  // Charger les rendez-vous au chargement du composant
  useEffect(() => {
    if (isAuthenticated && token) {
      fetchWithFallback()
    }
  }, [isAuthenticated, token])

  // Utiliser des données de démonstration si l'API échoue
  const useDemoData = () => {
    const demoAppointments = [
      {
        id: 1,
        nom: "Alami",
        prenom: "Mohammed",
        date: new Date().toISOString().split("T")[0],
        heure: "10:30",
        motif: "Consultation juridique",
        statut: "confirmed",
      },
      {
        id: 2,
        nom: "Benali",
        prenom: "Fatima",
        date: new Date().toISOString().split("T")[0],
        heure: "14:00",
        motif: "Dépôt de dossier",
        statut: "scheduled",
      },
      {
        id: 3,
        nom: "Tazi",
        prenom: "Ahmed",
        date: new Date().toISOString().split("T")[0],
        heure: "16:15",
        motif: "Suivi de dossier",
        statut: "completed",
      },
    ]

    setAppointments(demoAppointments)
    setLoading(false)
    setError(null)
  }

  // Formater l'heure (HH:MM) à partir d'une date complète
  const formatTime = (timeString) => {
    if (!timeString) return "--:--"
    return timeString
  }

  // Formater la date (JJ/MM/YYYY)
  const formatDate = (dateString) => {
    if (!dateString) return "--/--/----"
    try {
      const [year, month, day] = dateString.split("-")
      return `${day}/${month}/${year}`
    } catch (e) {
      return dateString
    }
  }

  // Naviguer vers les rendez-vous à venir
  const navigateToUpcoming = () => {
    navigate("/admin-dashboard/appointments", { state: { filter: "upcoming" } })
  }

  // Naviguer vers l'historique des rendez-vous
  const navigateToHistory = () => {
    navigate("/admin-dashboard/appointments", { state: { filter: "history" } })
  }

  // Naviguer vers le formulaire de création de rendez-vous
  const navigateToNewAppointment = () => {
    navigate("/admin-dashboard/appointments/new")
  }

  // Gérer la reconnexion
  const handleReconnect = () => {
    dispatch(logout())
    navigate("/")
  }

  // Réessayer les requêtes
  const handleRetry = () => {
    fetchWithFallback()
  }

  return (
    <div className="appointments-dashboard">
      <h2>Tableau de bord des rendez-vous</h2>

      {/* Cards en haut de page */}
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

      {/* Tableau des rendez-vous du jour */}
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
                  <th>Nom et Prénom</th>
                  <th>Date</th>
                  <th>Heure</th>
                  <th>Motif</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment.id} onClick={() => navigate(`/admin-dashboard/appointments/${appointment.id}`)}>
                    <td>
                      {appointment.nom || ""} {appointment.prenom || ""}
                    </td>
                    <td>{formatDate(appointment.date)}</td>
                    <td>{formatTime(appointment.heure)}</td>
                    <td>{appointment.motif || "Non spécifié"}</td>
                    <td>
                      <span
                        className={`status-badge status-${appointment.statut === "completed" ? "completed" : appointment.statut === "confirmed" ? "confirmed" : "default"}`}
                      >
                        {appointment.statut === "completed"
                          ? "Terminé"
                          : appointment.statut === "confirmed"
                            ? "Confirmé"
                            : appointment.statut === "scheduled"
                              ? "Planifié"
                              : appointment.statut === "cancelled"
                                ? "Annulé"
                                : appointment.statut === "no_show"
                                  ? "Absent"
                                  : appointment.statut || "Non spécifié"}
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

