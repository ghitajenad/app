"use client"

import { useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { selectToken } from "../../redux/authSlice"
import "../../styles/visitors.css"

export const VisitorForm = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    cin: "",
    phone: "",
    email: "",
    address: "",
    visit_reason: "",
    status: "active",
    notes: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const token = useSelector(selectToken)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch("http://127.0.0.1:8004/api/visitors", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `Erreur ${response.status}: ${response.statusText}`)
      }

      await response.json() // Supprimez l'assignation à 'data'
      setSuccess(true)
      setFormData({
        firstname: "",
        lastname: "",
        cin: "",
        phone: "",
        email: "",
        address: "",
        visit_reason: "",
        status: "active",
        notes: "",
      })

      // Rediriger après 2 secondes
      setTimeout(() => {
        navigate("/admin-dashboard/visitors")
      }, 2000)
    } catch (err) {
      console.error("Error creating visitor:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate("/admin-dashboard/visitors")
  }

  return (
    <div className="visitor-form-container">
      <h2>Ajouter un nouveau visiteur</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">Visiteur créé avec succès! Redirection...</div>}

      <form onSubmit={handleSubmit} className="visitor-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="lastname">Nom*</label>
            <input
              type="text"
              className="form-control"
              id="lastname"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="firstname">Prénom*</label>
            <input
              type="text"
              className="form-control"
              id="firstname"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="cin">CIN*</label>
            <input
              type="text"
              className="form-control"
              id="cin"
              name="cin"
              value={formData.cin}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Téléphone</label>
            <input
              type="text"
              className="form-control"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Adresse</label>
          <textarea
            className="form-control"
            id="address"
            name="address"
            rows="2"
            value={formData.address}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="visit_reason">Motif de visite</label>
          <input
            type="text"
            className="form-control"
            id="visit_reason"
            name="visit_reason"
            value={formData.visit_reason}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="status">Statut</label>
          <select className="form-control" id="status" name="status" value={formData.status} onChange={handleChange}>
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
            <option value="blacklisted">Liste noire</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea
            className="form-control"
            id="notes"
            name="notes"
            rows="3"
            value={formData.notes}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="form-actions">
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
        </div>
      </form>
    </div>
  )
}
