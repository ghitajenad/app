"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { selectToken } from "../../redux/authSlice"
import "../../styles/appointments.css"

export const AppointmentDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const token = useSelector(selectToken)

  const [appointment, setAppointment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editing, setEditing] = useState(false)

  // État pour les champs modifiables
  const [formData, setFormData] = useState({
    date: "",
    heure: "",
    motif: "",
    statut: "",
    notes: "",
  })

  // Options pour les statuts
  const statusOptions = [
    { value: "programmé", label: "Programmé" },
    { value: "confirmé", label: "Confirmé" },
    { value: "terminé", label: "Terminé" },
    { value: "annulé", label: "Annulé" },
    { value: "absent", label: "Absent" },
  ]

  // Récupérer les détails du rendez-vous
  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      try {
        setLoading(true)
        setError(null)

        // Déterminer quelle API utiliser en fonction de l'URL
        const isRendezVous = window.location.pathname.includes("rendezvous")
        const apiUrl = isRendezVous
          ? `http://127.0.0.1:8004/api/rendezvous/${id}`
          : `http://127.0.0.1:8004/api/appointments/${id}`

        console.log("Fetching appointment details from:", apiUrl)

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
        console.log("Appointment data:", data)

        if (data.status === "success") {
          setAppointment(data.data)

          // Formater la date pour l'input date
          let formattedDate = ""
          if (data.data.date) {
            formattedDate = data.data.date
          } else if (data.data.appointment_date) {
            formattedDate = data.data.appointment_date.split("T")[0]
          }

          setFormData({
            date: formattedDate,
            heure: data.data.heure || "",
            motif: data.data.motif || data.data.purpose || "",
            statut: data.data.statut || data.data.status || "programmé",
            notes: data.data.notes || "",
          })
        } else {
          throw new Error(data.message || "Erreur lors de la récupération des détails du rendez-vous")
        }
      } catch (err) {
        console.error("Error fetching appointment details:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (token && id) {
      fetchAppointmentDetails()
    }
  }, [id, token])

  // Gérer les changements dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Soumettre les modifications
  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)

      const updatedAppointment = {
        date: formData.date,
        heure: formData.heure,
        motif: formData.motif,
        statut: formData.statut,
        notes: formData.notes,
      }

      console.log("Updating appointment with data:", updatedAppointment)

      // Déterminer quelle API utiliser en fonction de l'URL
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
        console.error("Error response:", errorText)
        throw new Error(`Erreur ${response.status}: ${response.statusText}`)
      }

      // Tenter de parser la réponse comme JSON
      let data
      try {
        const responseText = await response.text()
        data = JSON.parse(responseText)
      } catch (e) {
        console.error("Failed to parse response as JSON:", e)
        alert("Mise à jour effectuée, mais la réponse du serveur n'est pas au format JSON.")
        setEditing(false)
        return
      }

      if (data.status === "success") {
        // Mettre à jour les données locales
        setAppointment(data.data)
        setEditing(false)
        alert("Rendez-vous mis à jour avec succès!")
      } else {
        throw new Error(data.message || "Erreur lors de la mise à jour du rendez-vous")
      }
    } catch (err) {
      console.error("Error updating appointment:", err)
      setError(err.message)
      alert(`Erreur: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Annuler l'édition
  const handleCancel = () => {
    setEditing(false)
  }

  // Retourner à la liste des rendez-vous
  const handleBack = () => {
    navigate(-1)
  }

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
                <input
                  type="text"
                  id="date"
                  name="date"
                  className="form-control"
                  value={formData.date}
                  onChange={handleChange}
                  disabled={!editing}
                  placeholder="YYYY-MM-DD"
                />
              </div>

              <div className="form-group">
                <label htmlFor="heure">Heure</label>
                <input
                  type="text"
                  id="heure"
                  name="heure"
                  className="form-control"
                  value={formData.heure}
                  onChange={handleChange}
                  disabled={!editing}
                  placeholder="HH:MM"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="motif">Motif</label>
              <input
                type="text"
                id="motif"
                name="motif"
                className="form-control"
                value={formData.motif}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>

            <div className="form-group">
              <label htmlFor="statut">Statut</label>
              <select
                id="statut"
                name="statut"
                className="form-control"
                value={formData.statut}
                onChange={handleChange}
                disabled={!editing}
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                name="notes"
                className="form-control"
                rows="4"
                value={formData.notes}
                onChange={handleChange}
                disabled={!editing}
              ></textarea>
            </div>

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
