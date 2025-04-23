"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { selectToken } from "../../redux/authSlice"
import "../../styles/appointments.css"
import { format, parseISO } from "date-fns"

export const AppointmentDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const token = useSelector(selectToken)

  const [appointment, setAppointment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editing, setEditing] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  const [formData, setFormData] = useState({
    date: "",
    heure: "",
    motif: "",
    statut: "",
    notes: "",
  })

  const statusOptions = [
    { value: "scheduled", label: "Programmé" },
    { value: "confirmed", label: "Confirmé" },
    { value: "completed", label: "Terminé" },
    { value: "cancelled", label: "Annulé" },
    { value: "no_show", label: "Absent" },
  ]

  const formatTime = (dateString) => {
    const options = { hour: "2-digit", minute: "2-digit", hour12: false }
    return new Date(dateString).toLocaleTimeString("fr-FR", options)
  }

  const formatTimed = (dateString) => {
    const options = { hour: "2-digit", minute: "2-digit", hour12: false }
    return new Date(dateString).toLocaleTimeString("fr-FR", options)
  }
  // const getTimeFromDate = (dateStr) => {
  //   const date = new Date(dateStr);
  //   return date.toISOString().substring(11, 16);
  // };

  const formatToHHMM = (value) => {
    if (!value) return ""

    const date = new Date(value)
    const hours = date.getHours().toString().padStart(2, "0")
    const minutes = date.getMinutes().toString().padStart(2, "0")

    return `${hours}:${minutes}` // Pas de décalage ici
  }

  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      try {
        setLoading(true)
        setError(null)

        const isRendezVous = window.location.pathname.includes("rendezvous")
        const apiUrl = isRendezVous
          ? `http://127.0.0.1:8004/api/rendezvous/${id}`
          : `http://127.0.0.1:8004/api/appointments/${id}`

        const response = await fetch(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
        })

        if (!response.ok) {
          throw new Error(`Erreur ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()

        if (data.status === "success") {
          setAppointment(data.data)

          let formattedDate = ""
          if (data.data.date) {
            formattedDate = format(parseISO(data.data.date), "yyyy-MM-dd")
          } else if (data.data.appointment_date) {
            formattedDate = format(parseISO(data.data.appointment_date), "yyyy-MM-dd")
          }

          setFormData({
            date: formattedDate,
            // j ai enleve la fct formattimed
            heure: data.data.heure || data.data.appointment_date,
            motif: data.data.motif || data.data.purpose || "",
            statut: data.data.statut || "",
            notes: data.data.notes || "",
          })
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchAppointmentDetails()
  }, [id, token])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError(null)

    try {
      setLoading(true)

      const updatedAppointment = {
        date: formData.date,
        heure: formData.heure,
        motif: formData.motif,
        statut: formData.statut,
        notes: formData.notes,
      }

      const isRendezVous = window.location.pathname.includes("rendezvous")
      const apiUrl = isRendezVous
        ? `http://127.0.0.1:8004/api/rendezvous/${id}`
        : `http://127.0.0.1:8004/api/appointments/${id}`

      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(updatedAppointment),
        credentials: "include",
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Erreur ${response.status}: ${response.statusText}`)
      }

      let data
      try {
        const responseText = await response.text()
        data = JSON.parse(responseText)
      } catch (e) {
        alert("Mise à jour effectuée, mais la réponse du serveur n'est pas au format JSON.")
        setEditing(false)
        return
      }

      if (data.status === "success") {
        setAppointment(data.data)
        setEditing(false)
        alert("Rendez-vous mis à jour avec succès!")
      } else {
        throw new Error(data.message || "Erreur lors de la mise à jour du rendez-vous")
      }
    } catch (err) {
      setSubmitError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => setEditing(false)
  const handleBack = () => navigate(-1)

  if (loading && !appointment) {
    return (
      <div className="details-rendezvous-container">
        <div className="loading-spinner">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error && !appointment) {
    return (
      <div className="details-rendezvous-container">
        <div className="alert alert-danger">
          <h4>Erreur</h4>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={handleBack}>
            Retour
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="details-rendezvous-container">
      <div className="details-rendezvous-header">
        <h2>Détails du rendez-vous</h2>
        <button className="btn btn-outline-secondary" onClick={handleBack}>
          <i className="fas fa-arrow-left"></i> Retour
        </button>
      </div>

      {appointment && (
        <div className="details-rendezvous-card">
          <div className="details-rendezvous-info">
            <h3>Informations du visiteur</h3>
            <div className="info-row">
              <div className="info-label">Nom:</div>
              <div className="info-value">{appointment.nom || appointment.visitor?.lastname || "Non spécifié"}</div>
            </div>
            <div className="info-row">
              <div className="info-label">Prénom:</div>
              <div className="info-value">{appointment.prenom || appointment.visitor?.firstname || "Non spécifié"}</div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="details-rendezvous-form">
            <h3>Informations du rendez-vous</h3>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="date">Date</label>
                {editing ? (
                  <input
                    type="date"
                    id="date"
                    name="date"
                    className="form-control"
                    value={formData.date}
                    onChange={handleChange}
                  />
                ) : (
                  <div className="form-control-plaintext">{formData.date || "Non spécifié"}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="heure">Heure</label>
                {editing ? (
                  <input
                    type="time"
                    id="heure"
                    name="heure"
                    className="form-control"
                    value={formatToHHMM(formData.heure)}
                    onChange={handleChange}
                    placeholder="HH:MM"
                  />
                ) : (
                  <div className="form-control-plaintext">{formatToHHMM(formData.heure) || "Non spécifié"}</div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="motif">Motif</label>
              {editing ? (
                <input
                  type="text"
                  id="motif"
                  name="motif"
                  className="form-control"
                  value={formData.motif}
                  onChange={handleChange}
                />
              ) : (
                <div className="form-control-plaintext">{formData.motif || "Non spécifié"}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="statut">Statut</label>
              {editing ? (
                <select
                  id="statut"
                  name="statut"
                  className="form-control"
                  value={formData.statut}
                  onChange={handleChange}
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="form-control-plaintext">{formData.statut || "Non spécifié"}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="notes">Notes</label>
              {editing ? (
                <textarea
                  id="notes"
                  name="notes"
                  className="form-control"
                  rows="4"
                  value={formData.notes}
                  onChange={handleChange}
                ></textarea>
              ) : (
                <div className="form-control-plaintext">{formData.notes || "Non spécifié"}</div>
              )}
            </div>

            {submitError && (
              <div className="alert alert-danger">
                <p>{submitError}</p>
              </div>
            )}

            <div className="details-rendezvous-actions">
              {editing ? (
                <>
                  <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                    Annuler
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Enregistrement...
                      </>
                    ) : (
                      "Enregistrer"
                    )}
                  </button>
                </>
              ) : (
                <button type="button" className="btn btn-primary" onClick={() => setEditing(true)}>
                  <i className="fas fa-edit"></i> Modifier
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default AppointmentDetails
