import React, { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from 'react-router-dom';

export const Inscription = () => {
  const navigate = useNavigate(); // Call useNavigate hook at the top of the component
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    cin: "",
    role: "",
    tel: ""
  });
  const [error, setError] = useState("");

  // Regex patterns
  const nomRegex = /^[A-Za-zÀ-ÿ]+$/;  // Only alphabetic characters (including accented)
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;  // Simple email pattern
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;  // Strong password (min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { nom, prenom, email, password, cin, role, tel } = formData;

    // Check for empty fields
    if (!nom || !prenom || !email || !password || !cin || !role || !tel) {
      setError("Tous les champs sont obligatoires.");
      return;
    }

    // Validate "Nom" (alphabetic characters only)
    if (!nomRegex.test(nom)) {
      setError("Le nom ne doit contenir que des lettres.");
      return;
    }

    // Validate email
    if (!emailRegex.test(email)) {
      setError("Veuillez entrer un email valide.");
      return;
    }

    // Validate password (strong password)
    if (!passwordRegex.test(password)) {
      setError("Le mot de passe doit comporter au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.");
      return;
    }

    setError("");  // Clear error if all validations pass
    console.log("Form Data Submitted:", formData);

    // Clear the form after submission
    setFormData({
      nom: "",
      prenom: "",
      email: "",
      password: "",
      cin: "",
      role: "",
      tel: ""
    });

    // Navigate to login page after successful submission
    navigate('/Login');  // Use navigate here to redirect
  };

  return (
    <div className="container mt-5">
      <h2>Formulaire d'Inscription</h2>
      <form onSubmit={handleSubmit}>
        <h6>Veuillez remplir le formulaire ci-dessous :</h6>

        {/* Display error message if any */}
        {error && <div className="alert alert-danger">{error}</div>}

        {/* Nom */}
        <div className="mb-3">
          <label htmlFor="nom" className="form-label">Nom</label>
          <input
            type="text"
            className="form-control"
            id="nom"
            name="nom"
            placeholder="Votre nom"
            value={formData.nom}
            onChange={handleChange}
            required
          />
        </div>

        {/* Prénom */}
        <div className="mb-3">
          <label htmlFor="prenom" className="form-label">Prénom</label>
          <input
            type="text"
            className="form-control"
            id="prenom"
            name="prenom"
            placeholder="Votre prénom"
            value={formData.prenom}
            onChange={handleChange}
            required
          />
        </div>

        {/* E-mail */}
        <div className="mb-3">
          <label htmlFor="email" className="form-label">E-mail</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            placeholder="Votre e-mail"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Mot de Passe */}
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Mot de Passe</label>
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
        </div>

        {/* CIN */}
        <div className="mb-3">
          <label htmlFor="cin" className="form-label">CIN</label>
          <input
            type="text"
            className="form-control"
            id="cin"
            name="cin"
            placeholder="Votre CIN (8 chiffres)"
            value={formData.cin}
            onChange={handleChange}
            required
          />
        </div>

        {/* Role */}
        <div className="mb-3">
          <label htmlFor="role" className="form-label">Role</label>
          <select
            className="form-control"
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="">Sélectionner un rôle</option>
            <option value="admin">Admin</option>
            <option value="user">Agent</option>
          </select>
        </div>

        {/* Tel */}
        <div className="mb-3">
          <label htmlFor="tel" className="form-label">Numéro de téléphone</label>
          <input
            type="tel"
            className="form-control"
            id="tel"
            name="tel"
            placeholder="Votre numéro de téléphone"
            value={formData.tel}
            onChange={handleChange}
            required
          />
        </div>

        {/* Submit button */}
        <button type="submit" className="btn btn-primary">
          S'inscrire
        </button>
      </form>
    </div>
  );
};
