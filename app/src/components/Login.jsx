"use client"

import { useState } from "react"
import { useLoginMutation } from "../redux/apiSlice"
import { useDispatch } from "react-redux"
import { setCredentials } from "../redux/authSlice"
import { Link, useNavigate } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"

export const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [login, { isLoading }] = useLoginMutation()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      setError("Tous les champs sont obligatoires.")
      return
    }

    setError("")

    try {
      const response = await login({ email, password }).unwrap()

      if (response.status === "success") {
        dispatch(
          setCredentials({
            user: response.user,
            token: response.token,
          }),
        )
        console.log("Connexion réussie :", response)
        navigate("/dashboard")
      } else {
        setError(response.message || "Une erreur s'est produite.")
      }
    } catch (err) {
      console.error("Erreur de connexion:", err)
      setError(err.data?.message || "Email ou mot de passe incorrect.")
    }
  }

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="col-md-5">
        <div className="card shadow p-4">
          <h3 className="text-center mb-4">Connexion</h3>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Exemple@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Mot de passe</label>
              <input
                type="password"
                className="form-control"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span> Connexion...
                </>
              ) : (
                "Connexion"
              )}
            </button>
          </form>

          <div className="text-center mt-3">
            <p>
              Vous n'avez pas de compte ? <Link to="/Inscription">Créer un compte</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

