"use client"

import { useState } from "react"
import { useRegisterMutation } from "../redux/apiSlice"
import "../styles/inscription.css"

export const Inscription = () => {
  const [formData, setFormData] = useState({
    name: "",
    firstname: "",
    email: "",
    password: "",
    cin: "",
    role: "",
    tel: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [register, { isLoading }] = useRegisterMutation()

  // Regex patterns
  const nomRegex = /^[A-Za-zÀ-ÿ]+$/ // Caractères alphabétiques (incluant les accents)
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/ // Format email
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/ // Mot de passe fort

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { name, firstname, email, password, cin, role, tel } = formData

    // Vérification des champs vides
    if (!name || !firstname || !email || !password || !cin || !role || !tel) {
      setError("Tous les champs sont obligatoires.")
      return
    }

    // Validation du nom
    if (!nomRegex.test(name)) {
      setError("Le nom ne doit contenir que des lettres.")
      return
    }

    // Validation de l'email
    if (!emailRegex.test(email)) {
      setError("Veuillez entrer un email valide.")
      return
    }

    // Validation du mot de passe
    if (!passwordRegex.test(password)) {
      setError(
        "Le mot de passe doit comporter au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.",
      )
      return
    }

    setError("")
    setSuccess("")

    try {
      const response = await register(formData).unwrap()
      console.log("Inscription réussie:", response)

      // Réinitialiser le formulaire
      setFormData({
        name: "",
        firstname: "",
        email: "",
        password: "",
        cin: "",
        role: "",
        tel: "",
      })

      setSuccess("Utilisateur créé avec succès!")
    } catch (err) {
      console.error("Erreur d'inscription:", err)
      setError(err.data?.message || "Une erreur s'est produite lors de l'inscription.")
    }
  }

  return (
    <div className="inscription-container">
      <h2>Créer un nouveau compte</h2>
      <p className="inscription-subtitle">Créez un compte pour un nouvel administrateur ou agent</p>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit} className="inscription-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">Nom</label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              placeholder="Nom de famille"
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
              placeholder="Prénom"
              value={formData.firstname}
              onChange={handleChange}
              required
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
            placeholder="Email professionnel"
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
            placeholder="Mot de passe"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <small className="form-text text-muted">
            Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un
            caractère spécial.
          </small>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="cin">CIN</label>
            <input
              type="text"
              className="form-control"
              id="cin"
              name="cin"
              placeholder="Carte d'identité nationale"
              value={formData.cin}
              onChange={handleChange}
              required
            />
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
              <option value="">Sélectionner un rôle</option>
              <option value="admin">Administrateur</option>
              <option value="agent">Agent</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="tel">Téléphone</label>
          <input
            type="tel"
            className="form-control"
            id="tel"
            name="tel"
            placeholder="Numéro de téléphone"
            value={formData.tel}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary inscription-button" disabled={isLoading}>
          {isLoading ? "Création en cours..." : "Créer le compte"}
        </button>
      </form>
    </div>
  )
}

