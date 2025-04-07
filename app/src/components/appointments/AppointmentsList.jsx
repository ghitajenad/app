"use client"

import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { selectToken } from "../../redux/authSlice"
import "../../styles/appointments.css"

export const AppointmentsList = () => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [dateFilter, setDateFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")

  const token = useSelector(selectToken)
  const navigate = useNavigate()

  const fetchAppointments = async () => {
    setLoading(true)
    try {
      let url = `http://127.0.0.1:8004/api/appointments?page=${currentPage}`

      if (dateFilter) {
        url += `&date=${dateFilter}`
      }

      if (statusFilter) {
        url += `&status=${statusFilter}`
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch appointments")
      }

      const data = await response.json()
      setAppointments(data.data.data)
      setTotalPages(Math.ceil(data.data.total / data.data.per_page))
      setLoading(false)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAppointments()
  }, [currentPage, dateFilter, statusFilter, token])

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleViewAppointment = (id) => {
    navigate(`/admin-dashboard/appointments/${id}`)
  }

  const handleAddAppointment = () => {
    navigate("/admin-dashboard/appointments/new")
  }

  const handleCheckIn = async (id, e) => {
    e.stopPropagation()
    try {
      const response = await fetch(`http://127.0.0.1:8004/api/appointments/${id}/check-in`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to check in visitor")
      }

      fetchAppointments() // Refresh the list
    } catch (err) {
      setError(err.message)
    }
  }

  const handleCheckOut = async (id, e) => {
    e.stopPropagation()
    try {
      const response = await fetch(`http://127.0.0.1:8004/api/appointments/${id}/check-out`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to check out visitor")
      }

      fetchAppointments() // Refresh the list
    } catch (err) {
      setError(err.message)
    }
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("fr-FR", options)
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "scheduled":
        return "status-scheduled"
      case "confirmed":
        return "status-confirmed"
      case "completed":
        return "status-completed"
      case "cancelled":
        return "status-cancelled"
      default:
        return ""
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case "scheduled":
        return "Planifié"
      case "confirmed":
        return "Confirmé"
      case "completed":
        return "Terminé"
      case "cancelled":
        return "Annulé"
      default:
        return status
    }
  }

  return (
    <div className="appointments-container">
      <div className="appointments-header">
        <h2>Gestion des Rendez-vous</h2>
        <button className="btn btn-primary" onClick={handleAddAppointment}>
          <i className="fas fa-plus"></i> Nouveau Rendez-vous
        </button>
      </div>

      <div className="appointments-filters">
        <div className="filter-group">
          <label htmlFor="date-filter">Date:</label>
          <input
            type="date"
            id="date-filter"
            className="form-control"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="status-filter">Statut:</label>
          <select
            id="status-filter"
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Tous les statuts</option>
            <option value="scheduled">Planifié</option>
            <option value="confirmed">Confirmé</option>
            <option value="completed">Terminé</option>
            <option value="cancelled">Annulé</option>
          </select>
        </div>

        <button
          className="btn btn-outline-secondary"
          onClick={() => {
            setDateFilter("")
            setStatusFilter("")
          }}
        >
          Réinitialiser
        </button>
      </div>

      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-hover appointments-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Date</th>
                  <th>Créneau</th>
                  <th>Visiteur</th>
                  <th>Agent</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.length > 0 ? (
                  appointments.map((appointment) => (
                    <tr key={appointment.id} onClick={() => handleViewAppointment(appointment.id)}>
                      <td>{appointment.id}</td>
                      <td>{formatDate(appointment.date)}</td>
                      <td>{appointment.time_slot}</td>
                      <td>
                        {appointment.visitor
                          ? `${appointment.visitor.firstname} ${appointment.visitor.lastname}`
                          : "N/A"}
                      </td>
                      <td>{appointment.user ? `${appointment.user.firstname} ${appointment.user.name}` : "N/A"}</td>
                      <td>
                        <span className={`status-badge ${getStatusBadgeClass(appointment.status)}`}>
                          {getStatusLabel(appointment.status)}
                        </span>
                      </td>
                      <td>
                        <div className="appointment-actions">
                          <button
                            className="btn btn-sm btn-outline-primary me-1"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleViewAppointment(appointment.id)
                            }}
                          >
                            <i className="fas fa-eye"></i>
                          </button>

                          {appointment.status === "scheduled" && (
                            <button
                              className="btn btn-sm btn-success me-1"
                              onClick={(e) => handleCheckIn(appointment.id, e)}
                              title="Enregistrer l'arrivée"
                            >
                              <i className="fas fa-sign-in-alt"></i>
                            </button>
                          )}

                          {appointment.status === "confirmed" && (
                            <button
                              className="btn btn-sm btn-info me-1"
                              onClick={(e) => handleCheckOut(appointment.id, e)}
                              title="Enregistrer le départ"
                            >
                              <i className="fas fa-sign-out-alt"></i>
                            </button>
                          )}

                          {(appointment.status === "scheduled" || appointment.status === "confirmed") && (
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={(e) => {
                                e.stopPropagation()
                                // Implement cancel functionality
                              }}
                              title="Annuler"
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">
                      Aucun rendez-vous trouvé
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
    </div>
  )
}

