import { useState } from "react";
import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from 'react-router-dom';
import { Inscription } from "./Inscription";

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError("Tous les champs sont obligatoires.");
            return;
        }

        // Clear error message if all fields are filled
        setError("");

        // You can handle form submission logic here (e.g., API request)
        console.log("Form Submitted:", { email, password });

        // Clear the form after submission
        setEmail("");
        setPassword("");
    };

    return (
        <div className="form1">
        <div className="container mt-5 content">
            <h2 className="mb-2">Espace Utilisateur</h2>
            <form onSubmit={handleSubmit} className="border rounded p-4 m-5">
                <h6>Veuillez saisir votre <strong>E-mail</strong> et votre <strong>Mot de passe</strong></h6>
                
                {/* Error message */}
                {error && <div className="alert alert-danger">{error}</div>}

                {/* Email Field */}
                <div className="row mb-3">
                    <div className="col-12">
                        <label htmlFor="email" className="form-label mb-2 "><bold>E-mail</bold></label>
                        <input
                            type="email"
                            className="form-control mb-2 "
                            id="email"
                            placeholder="Exemple@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            />
                    </div>
                </div>

                {/* Password Field */}
                <div className="row mb-3">
                    <div className="col-12">
                        <label htmlFor="password" className="form-label mb-2 "><bold>Mot de passe</bold></label>
                        <input
                            type="password"
                            className="form-control mb-2 "
                            id="password"
                            placeholder="Mot de passe"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            />
                    </div>
                </div>

                {/* Submit Button */}
                <div className="row mb-3">
                    <div className="col-12">
                        <button type="submit" className=" btnconnexion ">
                            Connexion
                        </button>
                    </div>
                </div>

                {/* Create Account Link */}
                <div className="row">
                    <div className="col-12 text-center m-2">
                        <strong>
                            Vous n'avez pas de compte ? 
                            <small>
                                <Link to="/Inscription"className="link-color"><em>Créer un compte .</em></Link>

                            </small>
                        </strong>
                    </div>
                </div>
            </form>
        </div>
                            </div>
    );
};