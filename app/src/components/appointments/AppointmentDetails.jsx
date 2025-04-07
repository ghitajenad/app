"use client"

import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { selectToken } from "../../redux/authSlice"
import "../../styles/appointments.css"

export const AppointmentDetails = () => {
  const { id } = useParams()
  const [appointment, setAppointment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const token = useSelector(selectToken)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8004/api/appointments/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch appointment details")
        }

        const data = await response.json()
        setAppointment(data.data)
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchAppointment()
  }, [id, token])

  const handleCheckIn = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8004/api/appointments/${id}/check-in`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to check in visitor")
      }

      const data = await response.json()
      setAppointment(data.data)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleCheckOut = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8004/api/appointments/${id}/check-out`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to check out visitor")
      }

      const data = await response.json()
      setAppointment(data.data)
    } catch (err) {
      setError(err.message)
    }
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("fr-FR", options)
  }

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "N/A"

    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
    return new Date(dateTimeString).toLocaleDateString("fr-FR", options)
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case "scheduled":
        return "Planifié"
      case "confirmed":
        return "Confirmé"
      case "completed":
        return "Terminé"
      case "cancelled":
        return "Annulé"
      default:
        return status
    }
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "scheduled":
        return "status-scheduled"
      case "confirmed":
        return "status-confirmed"
      case "completed":
        return "status-completed"
      case "cancelled":
        return "status-cancelled"
      default:
        return ""
    }
  }

  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>
  }

  if (!appointment) {
    return <div className="alert alert-warning">Rendez-vous non trouvé</div>
  }

  return (
    <div className="appointment-details-container">
      <div className="appointment-details-header">
        <h2>Détails du Rendez-vous</h2>
        <div className="appointment-actions">
          <button className="btn btn-outline-secondary me-2" onClick={() => navigate("/admin-dashboard/appointments")}>
            <i className="fas fa-arrow-left me-1"></i> Retour
          </button>

          <button
            className="btn btn-outline-primary me-2"
            onClick={() => navigate(`/admin-dashboard/appointments/edit/${id}`)}
          >
            <i className="fas fa-edit me-1"></i> Modifier
          </button>

          {appointment.status === "scheduled" && (
            <button className="btn btn-success" onClick={handleCheckIn}>
              <i className="fas fa-sign-in-alt me-1"></i> Enregistrer l'arrivée
            </button>
          )}

          {appointment.status === "confirmed" && (
            <button className="btn btn-info" onClick={handleCheckOut}>
              <i className="fas fa-sign-out-alt me-1"></i> Enregistrer le départ
            </button>
          )}
        </div>
      </div>

      <div className="appointment-details-card">
        <div className="appointment-status">
          <span className={`status-badge ${getStatusBadgeClass(appointment.status)}`}>
            {getStatusLabel(appointment.status)}
          </span>
        </div>

        <div className="appointment-info">
          <div className="info-section">
            <h3>Informations du rendez-vous</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Date:</span>
                <span className="info-value">{formatDate(appointment.date)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Créneau horaire:</span>
                <span className="info-value">{appointment.time_slot}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Heure d'arrivée:</span>
                <span className="info-value">{formatDateTime(appointment.check_in_time)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Heure de départ:</span>
                <span className="info-value">{formatDateTime(appointment.check_out_time)}</span>
              </div>
            </div>
          </div>

          {appointment.visitor && (
            <div className="info-section">
              <h3>Informations du visiteur</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Nom:</span>
                  <span className="info-value">{appointment.visitor.lastname}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Prénom:</span>
                  <span className="info-value">{appointment.visitor.firstname}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">CIN:</span>
                  <span className="info-value">{appointment.visitor.cin}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Téléphone:</span>
                  <span className="info-value">{appointment.visitor.phone}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{appointment.visitor.email || "N/A"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Motif de visite:</span>
                  <span className="info-value">{appointment.visitor.visit_reason}</span>
                </div>
              </div>
            </div>
          )}

          {appointment.user && (
            <div className="info-section">
              <h3>Agent responsable</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Nom:</span>
                  <span className="info-value">{appointment.user.name}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Prénom:</span>
                  <span className="info-value">{appointment.user.firstname}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{appointment.user.email}</span>
                </div>
              </div>
            </div>
          )}

          {appointment.notes && (
            <div className="info-section">
              <h3>Notes</h3>
              <p className="appointment-notes">{appointment.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

