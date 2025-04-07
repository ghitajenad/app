"use client"

import { useState, useEffect } from "react"
import { useLoginMutation } from "../redux/apiSlice"
import { useDispatch, useSelector } from "react-redux"
import { loginStart, loginSuccess, loginFailure, selectAuthError, selectIsLoading } from "../redux/authSlice"
import { useNavigate } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"
import "../styles/auth.css"
import logo from "./Images/logo3.png"

export const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [login] = useLoginMutation()

  const authError = useSelector(selectAuthError)
  const isLoading = useSelector(selectIsLoading)

  useEffect(() => {
    if (authError) {
      setError(authError)
    }
  }, [authError])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      setError("Tous les champs sont obligatoires.")
      return
    }

    setError("")
    dispatch(loginStart())

    try {
      console.log("Tentative de connexion avec:", { email, password: "***" })
      const response = await login({ email, password }).unwrap()
      console.log("Login response:", response)

      if (response.status === "success") {
        console.log("Authentification réussie. Token:", response.token)
        console.log("Utilisateur:", response.user)

        // Vérifier que le token est bien présent
        if (!response.token) {
          throw new Error("Le serveur n'a pas renvoyé de token d'authentification.")
        }

        dispatch(
          loginSuccess({
            user: response.user,
            token: response.token,
          }),
        )

        // Vérifier que le token est bien stocké dans localStorage
        setTimeout(() => {
          const storedToken = localStorage.getItem("token")
          console.log("Token stocké dans localStorage:", storedToken)

          if (!storedToken) {
            console.warn("Le token n'a pas été correctement stocké dans localStorage!")
          }
        }, 100)

        // Redirection en fonction du rôle
        if (response.user.role === "admin") {
          navigate("/admin-dashboard")
        } else {
          navigate("/agent-dashboard")
        }
      } else {
        console.error("Erreur de statut:", response.status, response.message)
        dispatch(loginFailure(response.message || "Une erreur s'est produite."))
      }
    } catch (err) {
      console.error("Erreur complète:", err)

      // Afficher plus de détails sur l'erreur
      if (err.data) {
        console.error("Détails de l'erreur:", err.data)
        dispatch(loginFailure(err.data.message || "Email ou mot de passe incorrect."))
      } else if (err.error) {
        console.error("Erreur réseau:", err.error)
        dispatch(loginFailure("Erreur de connexion au serveur. Veuillez réessayer."))
      } else {
        console.error("Erreur inconnue:", err)
        dispatch(loginFailure("Une erreur inconnue s'est produite."))
      }
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <img src={logo || "/placeholder.svg"} alt="Ministère de la Justice" className="auth-logo" />
          <h2>Connexion</h2>
          <p className="auth-subtitle">Panneau d'administration - Ministère de la Justice</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Votre email professionnel"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block auth-button" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Connexion en cours...
              </>
            ) : (
              "Se connecter"
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>© {new Date().getFullYear()} Ministère de la Justice - Tous droits réservés</p>
        </div>
      </div>
    </div>
  )
}

export default Login

