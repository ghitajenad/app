"use client"

import { useState } from "react"
import { useSelector } from "react-redux"
import { selectToken } from "../redux/authSlice"
import "../styles/auth.css"

export const Inscription = () => {
  const [formData, setFormData] = useState({
    name: "",
    firstname: "",
    email: "",
    password: "",
    cin: "",
    role: "agent", // Par défaut, on crée un agent
    tel: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const token = useSelector(selectToken)

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
      // Validation des champs
      if (
        !formData.name ||
        !formData.firstname ||
        !formData.email ||
        !formData.password ||
        !formData.cin ||
        !formData.tel
      ) {
        throw new Error("Tous les champs sont obligatoires.")
      }

      // Validation de l'email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        throw new Error("Veuillez entrer une adresse email valide.")
      }

      // Validation du mot de passe
      if (formData.password.length < 8) {
        throw new Error("Le mot de passe doit contenir au moins 8 caractères.")
      }

      const response = await fetch("http://127.0.0.1:8004/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
        credentials: "include",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || `Erreur ${response.status}: ${response.statusText}`)
      }

      setSuccess(true)
      setFormData({
        name: "",
        firstname: "",
        email: "",
        password: "",
        cin: "",
        role: "agent",
        tel: "",
      })
    } catch (err) {
      console.error("Error creating user:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Créer un nouveau compte</h2>
          <p className="auth-subtitle">Ajouter un administrateur ou un agent</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">Compte créé avec succès!</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Nom</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="firstname">Prénom</label>
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
              <label htmlFor="email">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Mot de passe</label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="8"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="cin">CIN</label>
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
              <label htmlFor="tel">Téléphone</label>
              <input
                type="text"
                className="form-control"
                id="tel"
                name="tel"
                value={formData.tel}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="role">Rôle</label>
            <select
              className="form-control"
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="agent">Agent</option>
              <option value="admin">Administrateur</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary btn-block auth-button" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Création en cours...
              </>
            ) : (
              "Créer le compte"
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Inscription
