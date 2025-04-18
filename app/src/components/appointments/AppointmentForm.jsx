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
  })

  const [visitors, setVisitors] = useState([])
  const [availableTimeSlots, setAvailableTimeSlots] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const token = useSelector(selectToken)
  const navigate = useNavigate()

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
      const response = await fetch(`http://127.0.0.1:8004/api/available-time-slots?date=${date}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Erreur lors du chargement des créneaux")
      }

      const data = await response.json()

      let slots = data.data

      if (isEditing && currentSlot && !slots.includes(currentSlot)) {
        slots.push(currentSlot)
      }

      slots.sort()
      setAvailableTimeSlots(slots)
    } catch (err) {
      setError(err.message)
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
      const url = isEditing
        ? `http://127.0.0.1:8004/api/appointments/${id}`
        : "http://127.0.0.1:8004/api/appointments"

      const method = isEditing ? "PUT" : "POST"

      const appointmentDate = `${formData.date} ${formData.time_slot}:00`

      const payload = {
        visitor_id: formData.visitor_id,
        appointment_date: appointmentDate,
        notes: formData.notes,
        purpose: formData.purpose,
      }

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Erreur lors de l'enregistrement")
      }

      const data = await response.json()
      setSuccess(isEditing ? "Rendez-vous mis à jour avec succès" : "Rendez-vous créé avec succès")

      setTimeout(() => {
        navigate("/admin-dashboard/appointments")
      }, 2000)
    } catch (err) {
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
