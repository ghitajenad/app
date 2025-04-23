"use client"

import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { selectToken } from "../../redux/authSlice"
import "../../styles/appointments.css"

export const AppointmentForm = () => {
  const { id } = useParams()
  const isEditing = !!id

  const [formData, setFormData] = useState({
    visitor_id: "",
    date: "",
    time_slot: "",
    notes: "",
    purpose: "",
    status: "scheduled", // Ajouter une valeur par défaut pour le statut
  })

  const [visitors, setVisitors] = useState([])
  const [availableTimeSlots, setAvailableTimeSlots] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const token = useSelector(selectToken)
  const navigate = useNavigate()

  // Ajouter cette constante après les autres déclarations de variables
  const statusOptions = [
    { value: "scheduled", label: "Programmé" },
    { value: "confirmed", label: "Confirmé" },
    { value: "completed", label: "Terminé" },
    { value: "cancelled", label: "Annulé" },
    { value: "no_show", label: "Absent" },
  ]

  // Récupérer les visiteurs
  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8004/api/visitors", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error("Erreur lors du chargement des visiteurs")
        }

        const data = await response.json()
        setVisitors(data.data.data)
      } catch (err) {
        setError(err.message)
      }
    }

    fetchVisitors()
  }, [token])

  // Charger rendez-vous existant si édition
  useEffect(() => {
    if (isEditing) {
      const fetchAppointment = async () => {
        setLoading(true)
        try {
          const response = await fetch(`http://127.0.0.1:8004/api/appointments/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          })

          if (!response.ok) {
            throw new Error("Erreur lors du chargement du rendez-vous")
          }

          const data = await response.json()

          const dateTime = new Date(data.data.appointment_date)
          const date = dateTime.toISOString().split("T")[0]
          const time = dateTime.toTimeString().slice(0, 5)

          setFormData({
            visitor_id: data.data.visitor_id,
            date: date,
            time_slot: time,
            notes: data.data.notes || "",
            purpose: data.data.purpose || "",
            status: data.data.status || "scheduled",
          })

          fetchTimeSlots(date, time)
          setLoading(false)
        } catch (err) {
          setError(err.message)
          setLoading(false)
        }
      }

      fetchAppointment()
    }
  }, [id, isEditing, token])

  const fetchTimeSlots = async (date, currentSlot = "") => {
    if (!date) return

    try {
      setAvailableTimeSlots([]) // Réinitialiser les créneaux pendant le chargement

      console.log("Récupération des créneaux pour la date:", date)

      const response = await fetch(`http://127.0.0.1:8004/api/available-time-slots?date=${date}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()
      console.log("Réponse des créneaux:", data)

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors du chargement des créneaux")
      }

      if (data.status !== "success") {
        throw new Error(data.message || "Erreur lors du chargement des créneaux")
      }

      const slots = data.data || []

      if (isEditing && currentSlot && !slots.includes(currentSlot)) {
        slots.push(currentSlot)
      }

      slots.sort()
      setAvailableTimeSlots(slots)
    } catch (err) {
      console.error("Erreur lors du chargement des créneaux:", err)
      setError(`Erreur lors du chargement des créneaux: ${err.message}`)
      setAvailableTimeSlots([]) // Réinitialiser en cas d'erreur
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value,
    })

    if (name === "date") {
      fetchTimeSlots(value)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Validation côté client
      if (!formData.visitor_id) {
        throw new Error("Veuillez sélectionner un visiteur")
      }
      if (!formData.date) {
        throw new Error("Veuillez sélectionner une date")
      }
      if (!formData.time_slot) {
        throw new Error("Veuillez sélectionner un créneau horaire")
      }
      if (!formData.purpose) {
        throw new Error("Veuillez indiquer le motif du rendez-vous")
      }

      const url = isEditing ? `http://127.0.0.1:8004/api/appointments/${id}` : "http://127.0.0.1:8004/api/appointments"

      const method = isEditing ? "PUT" : "POST"

      // Formater la date au format ISO pour s'assurer qu'elle est bien envoyée
      // La conversion au format français sera gérée côté serveur
      const formattedDate = formData.date // Garder le format YYYY-MM-DD du champ date HTML

      console.log("Envoi des données:", {
        visitor_id: formData.visitor_id,
        date: formattedDate,
        time_slot: formData.time_slot,
        purpose: formData.purpose,
        notes: formData.notes,
      })

      const payload = {
        visitor_id: formData.visitor_id,
        date: formattedDate,
        time_slot: formData.time_slot,
        purpose: formData.purpose,
        notes: formData.notes,
        status: formData.status,
      }

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      console.log("Réponse du serveur:", data)

      if (!response.ok) {
        // Afficher les erreurs de validation spécifiques si disponibles
        if (data.errors) {
          const errorMessages = Object.values(data.errors).flat().join("\n")
          throw new Error(`Erreurs de validation:\n${errorMessages}`)
        }

        // Sinon, afficher le message d'erreur général
        throw new Error(data.message || "Erreur lors de l'enregistrement")
      }

      setSuccess(isEditing ? "Rendez-vous mis à jour avec succès" : "Rendez-vous créé avec succès")

      setTimeout(() => {
        navigate("/admin-dashboard/appointments")
      }, 2000)
    } catch (err) {
      console.error("Erreur:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="appointment-form-container">
      <h2>{isEditing ? "Modifier le Rendez-vous" : "Nouveau Rendez-vous"}</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit} className="appointment-form">
        <div className="form-group">
          <label htmlFor="visitor_id">Visiteur</label>
          <select
            id="visitor_id"
            name="visitor_id"
            className="form-select"
            value={formData.visitor_id}
            onChange={handleChange}
            required
          >
            <option value="">Sélectionner un visiteur</option>
            {visitors.map((visitor) => (
              <option key={visitor.id} value={visitor.id}>
                {visitor.firstname} {visitor.lastname} - {visitor.cin}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            className="form-control"
            value={formData.date}
            onChange={handleChange}
            min={new Date().toISOString().split("T")[0]}
            onKeyDown={(e) => e.preventDefault()}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="time_slot">Créneau horaire</label>
          <select
            id="time_slot"
            name="time_slot"
            className="form-select"
            value={formData.time_slot}
            onChange={handleChange}
            required
            disabled={!formData.date || availableTimeSlots.length === 0}
          >
            <option value="">Sélectionner un créneau</option>
            {availableTimeSlots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
          {formData.date && availableTimeSlots.length === 0 && (
            <small className="text-danger">
              Aucun créneau disponible pour cette date. Veuillez choisir une autre date.
            </small>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="purpose">Motif de la visite</label>
          <input
            type="text"
            id="purpose"
            name="purpose"
            className="form-control"
            value={formData.purpose}
            onChange={handleChange}
            required
          />
        </div>

        {/* Ajouter le champ de sélection du statut avant le champ des notes */}
        <div className="form-group">
          <label htmlFor="status">Statut</label>
          <select
            id="status"
            name="status"
            className="form-select"
            value={formData.status}
            onChange={handleChange}
            required
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
            value={formData.notes}
            onChange={handleChange}
            rows="3"
          ></textarea>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={() => navigate("/admin-dashboard/appointments")}>
            Annuler
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Enregistrement...
              </>
            ) : isEditing ? (
              "Mettre à jour"
            ) : (
              "Créer le rendez-vous"
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
