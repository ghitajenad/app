"use client"

import { useState, useEffect, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { selectToken, logout } from "../../redux/authSlice"
import "../../styles/visitors.css"

export const VisitorsList = () => {
  const [visitors, setVisitors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState("created_at")
  const [sortDirection, setSortDirection] = useState("desc")

  // État pour le modal d'édition
  const [showEditModal, setShowEditModal] = useState(false)
  const [currentVisitor, setCurrentVisitor] = useState(null)
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

  // État pour le modal de confirmation de suppression
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [visitorToDelete, setVisitorToDelete] = useState(null)

  const token = useSelector(selectToken)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const modalRef = useRef(null)

  // Fermer le modal si on clique en dehors
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowEditModal(false)
        setShowDeleteModal(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [modalRef])

  // Récupérer la liste des visiteurs
  const fetchVisitors = async () => {
    setLoading(true)
    try {
      if (!token) {
        console.error("No authentication token available")
        setError("Vous n'êtes pas authentifié. Veuillez vous reconnecter.")
        setLoading(false)
        return
      }

      let url = `http://127.0.0.1:8004/api/visitors?page=${currentPage}&sort_field=${sortField}&sort_direction=${sortDirection}`

      if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}`
      }

      console.log("Fetching visitors with URL:", url)

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
      })

      if (!response.ok) {
        if (response.status === 401) {
          dispatch(logout())
          navigate("/")
          throw new Error("Votre session a expiré. Veuillez vous reconnecter.")
        }
        throw new Error("Impossible de récupérer la liste des visiteurs.")
      }

      const data = await response.json()
      console.log("Visitors data:", data)

      setVisitors(data.data.data || [])
      setTotalPages(Math.ceil((data.data.total || 0) / (data.data.per_page || 10)))
      setLoading(false)
    } catch (err) {
      console.error("Error fetching visitors:", err)
      setError(err.message)
      setLoading(false)
    }
  }

  // Récupérer les détails d'un visiteur
  const fetchVisitorDetails = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8004/api/visitors/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Impossible de récupérer les détails du visiteur.")
      }

      const data = await response.json()
      return data.data
    } catch (err) {
      console.error("Error fetching visitor details:", err)
      throw err
    }
  }

  // Mettre à jour un visiteur
  const updateVisitor = async (id, visitorData) => {
    try {
      const response = await fetch(`http://127.0.0.1:8004/api/visitors/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(visitorData),
        credentials: "include",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Impossible de mettre à jour le visiteur.")
      }

      const data = await response.json()
      return data.data
    } catch (err) {
      console.error("Error updating visitor:", err)
      throw err
    }
  }

  // Supprimer un visiteur
  const deleteVisitor = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8004/api/visitors/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Impossible de supprimer le visiteur.")
      }

      return true
    } catch (err) {
      console.error("Error deleting visitor:", err)
      throw err
    }
  }

  useEffect(() => {
    if (token) {
      fetchVisitors()
    }
  }, [currentPage, searchTerm, sortField, sortDirection, token])

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setCurrentPage(1) // Reset to first page on new search
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleAddVisitor = () => {
    navigate("/admin-dashboard/visitors/new")
  }

  // Ouvrir le modal d'édition
  const handleEditClick = async (e, id) => {
    e.stopPropagation()
    try {
      const visitor = await fetchVisitorDetails(id)
      setCurrentVisitor(visitor)
      setFormData({
        firstname: visitor.firstname || "",
        lastname: visitor.lastname || "",
        cin: visitor.cin || "",
        phone: visitor.phone || "",
        email: visitor.email || "",
        address: visitor.address || "",
        visit_reason: visitor.visit_reason || "",
        status: visitor.status || "active",
        notes: visitor.notes || "",
      })
      setShowEditModal(true)
    } catch (err) {
      alert("Erreur lors de la récupération des détails du visiteur.")
    }
  }

  // Gérer les changements dans le formulaire
  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Soumettre le formulaire d'édition
  const handleSubmitEdit = async (e) => {
    e.preventDefault()
    try {
      await updateVisitor(currentVisitor.id, formData)
      setShowEditModal(false)
      fetchVisitors() // Rafraîchir la liste
      alert("Visiteur mis à jour avec succès!")
    } catch (err) {
      alert("Erreur lors de la mise à jour du visiteur: " + err.message)
    }
  }

  // Ouvrir le modal de confirmation de suppression
  const handleDeleteClick = (e, visitor) => {
    e.stopPropagation()
    setVisitorToDelete(visitor)
    setShowDeleteModal(true)
  }

  // Confirmer la suppression
  const confirmDelete = async () => {
    try {
      await deleteVisitor(visitorToDelete.id)
      setShowDeleteModal(false)
      fetchVisitors() // Rafraîchir la liste
      alert("Visiteur supprimé avec succès!")
    } catch (err) {
      alert("Erreur lors de la suppression du visiteur: " + err.message)
    }
  }

  return (
    <div className="visitors-container">
      <div className="visitors-header">
        <h2>Gestion des Visiteurs</h2>
        <button className="btn btn-primary" onClick={handleAddVisitor}>
          <i className="fas fa-plus"></i> Nouveau Visiteur
        </button>
      </div>

      <div className="visitors-filters">
        <form onSubmit={handleSearch} className="search-form">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Rechercher par nom, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="btn btn-outline-primary">
              <i className="fas fa-search"></i>
            </button>
          </div>
        </form>
      </div>

      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger">
          <p>{error}</p>
          <button className="btn btn-primary mt-2" onClick={fetchVisitors}>
            Réessayer
          </button>
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-hover visitors-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort("lastname")} className="sortable">
                    Nom{" "}
                    {sortField === "lastname" && (
                      <i className={`fas fa-sort-${sortDirection === "asc" ? "up" : "down"}`}></i>
                    )}
                  </th>
                  <th onClick={() => handleSort("firstname")} className="sortable">
                    Prénom{" "}
                    {sortField === "firstname" && (
                      <i className={`fas fa-sort-${sortDirection === "asc" ? "up" : "down"}`}></i>
                    )}
                  </th>
                  <th onClick={() => handleSort("email")} className="sortable">
                    Email{" "}
                    {sortField === "email" && (
                      <i className={`fas fa-sort-${sortDirection === "asc" ? "up" : "down"}`}></i>
                    )}
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {visitors.length > 0 ? (
                  visitors.map((visitor) => (
                    <tr key={visitor.id}>
                      <td>{visitor.lastname}</td>
                      <td>{visitor.firstname}</td>
                      <td>{visitor.email || "-"}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={(e) => handleEditClick(e, visitor.id)}
                        >
                          <i className="fas fa-edit"></i> Éditer
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={(e) => handleDeleteClick(e, visitor)}
                        >
                          <i className="fas fa-trash"></i> Supprimer
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
                      Aucun visiteur trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination-container">
              <ul className="pagination">
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Précédent
                  </button>
                </li>

                {[...Array(totalPages).keys()].map((page) => (
                  <li key={page + 1} className={`page-item ${currentPage === page + 1 ? "active" : ""}`}>
                    <button className="page-link" onClick={() => handlePageChange(page + 1)}>
                      {page + 1}
                    </button>
                  </li>
                ))}

                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Suivant
                  </button>
                </li>
              </ul>
            </div>
          )}
        </>
      )}

      {/* Modal d'édition personnalisé */}
      {showEditModal && (
        <div className="custom-modal-overlay">
          <div className="custom-modal" ref={modalRef}>
            <div className="custom-modal-header">
              <h3>Modifier le visiteur</h3>
              <button className="close-button" onClick={() => setShowEditModal(false)}>
                ×
              </button>
            </div>
            <div className="custom-modal-body">
              <form onSubmit={handleSubmitEdit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Nom</label>
                    <input
                      type="text"
                      className="form-control"
                      name="lastname"
                      value={formData.lastname}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Prénom</label>
                    <input
                      type="text"
                      className="form-control"
                      name="firstname"
                      value={formData.firstname}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>CIN</label>
                    <input
                      type="text"
                      className="form-control"
                      name="cin"
                      value={formData.cin}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Téléphone</label>
                    <input
                      type="text"
                      className="form-control"
                      name="phone"
                      value={formData.phone}
                      onChange={handleFormChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                  />
                </div>

                <div className="form-group">
                  <label>Adresse</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    name="address"
                    value={formData.address}
                    onChange={handleFormChange}
                  ></textarea>
                </div>

                <div className="form-group">
                  <label>Motif de visite</label>
                  <input
                    type="text"
                    className="form-control"
                    name="visit_reason"
                    value={formData.visit_reason}
                    onChange={handleFormChange}
                  />
                </div>

                <div className="form-group">
                  <label>Statut</label>
                  <select className="form-control" name="status" value={formData.status} onChange={handleFormChange}>
                    <option value="active">Actif</option>
                    <option value="inactive">Inactif</option>
                    <option value="blacklisted">Liste noire</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Notes</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    name="notes"
                    value={formData.notes}
                    onChange={handleFormChange}
                  ></textarea>
                </div>

                <div className="custom-modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                    Annuler
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Enregistrer les modifications
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmation de suppression personnalisé */}
      {showDeleteModal && (
        <div className="custom-modal-overlay">
          <div className="custom-modal custom-modal-sm" ref={modalRef}>
            <div className="custom-modal-header">
              <h3>Confirmer la suppression</h3>
              <button className="close-button" onClick={() => setShowDeleteModal(false)}>
                ×
              </button>
            </div>
            <div className="custom-modal-body">
              {visitorToDelete && (
                <p>
                  Êtes-vous sûr de vouloir supprimer le visiteur{" "}
                  <strong>
                    {visitorToDelete.firstname} {visitorToDelete.lastname}
                  </strong>{" "}
                  ?
                  <br />
                  Cette action est irréversible.
                </p>
              )}
            </div>
            <div className="custom-modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
                Annuler
              </button>
              <button className="btn btn-danger" onClick={confirmDelete}>
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

