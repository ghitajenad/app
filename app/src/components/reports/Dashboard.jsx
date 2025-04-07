"use client"

import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { selectToken } from "../../redux/authSlice"
import "../../styles/reports.css"

export const ReportsDashboard = () => {
  const [generalStats, setGeneralStats] = useState(null)
  const [appointmentStats, setAppointmentStats] = useState(null)
  const [visitorStats, setVisitorStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(1)).toISOString().split("T")[0], // First day of current month
    endDate: new Date().toISOString().split("T")[0], // Today
  })

  const token = useSelector(selectToken)

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true)
      try {
        // Fetch general stats
        const generalResponse = await fetch("http://127.0.0.1:8004/api/stats/general", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (!generalResponse.ok) {
          throw new Error("Failed to fetch general statistics")
        }

        const generalData = await generalResponse.json()
        setGeneralStats(generalData.data)

        // Fetch appointment stats with date range
        const appointmentResponse = await fetch(
          `http://127.0.0.1:8004/api/stats/appointments?start_date=${dateRange.startDate}&end_date=${dateRange.endDate}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        )

        if (!appointmentResponse.ok) {
          throw new Error("Failed to fetch appointment statistics")
        }

        const appointmentData = await appointmentResponse.json()
        setAppointmentStats(appointmentData.data)

        // Fetch visitor stats
        const visitorResponse = await fetch("http://127.0.0.1:8004/api/stats/visitors", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (!visitorResponse.ok) {
          throw new Error("Failed to fetch visitor statistics")
        }

        const visitorData = await visitorResponse.json()
        setVisitorStats(visitorData.data)

        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchStats()
  }, [token, dateRange])

  const handleDateRangeChange = (e) => {
    setDateRange({
      ...dateRange,
      [e.target.name]: e.target.value,
    })
  }

  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>
  }

  return (
    <div className="reports-dashboard-container">
      <h2>Tableau de Bord Analytique</h2>

      <div className="stats-overview">
        {generalStats && (
          <div className="stats-cards">
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-users"></i>
              </div>
              <div className="stat-content">
                <h3>Visiteurs</h3>
                <p className="stat-number">{generalStats.total_visitors}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-calendar-check"></i>
              </div>
              <div className="stat-content">
                <h3>Rendez-vous</h3>
                <p className="stat-number">{generalStats.total_appointments}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <div className="stat-content">
                <h3>Complétés</h3>
                <p className="stat-number">{generalStats.completed_appointments}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-calendar-day"></i>
              </div>
              <div className="stat-content">
                <h3>Aujourd'hui</h3>
                <p className="stat-number">{generalStats.today_appointments}</p>
              </div>
            </div>
          </div>
        )}

        <div className="date-range-filter">
          <h3>Filtrer par période</h3>
          <div className="date-inputs">
            <div className="form-group">
              <label htmlFor="startDate">Date de début</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                className="form-control"
                value={dateRange.startDate}
                onChange={handleDateRangeChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="endDate">Date de fin</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                className="form-control"
                value={dateRange.endDate}
                onChange={handleDateRangeChange}
              />
            </div>
          </div>
        </div>
      </div>

      {appointmentStats && (
        <div className="stats-section">
          <h3>Statistiques des Rendez-vous</h3>

          <div className="stats-grid">
            <div className="stats-card">
              <h4>Répartition par statut</h4>
              <div className="status-distribution">
                {appointmentStats.status_stats.map((stat) => (
                  <div key={stat.status} className="status-item">
                    <div className="status-label">
                      <span className={`status-badge status-${stat.status}`}>
                        {stat.status === "scheduled"
                          ? "Planifié"
                          : stat.status === "confirmed"
                            ? "Confirmé"
                            : stat.status === "completed"
                              ? "Terminé"
                              : "Annulé"}
                      </span>
                    </div>
                    <div className="status-bar">
                      <div
                        className={`status-progress status-${stat.status}`}
                        style={{
                          width: `${(stat.count / appointmentStats.status_stats.reduce((acc, curr) => acc + curr.count, 0)) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <div className="status-count">{stat.count}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="stats-card">
              <h4>Durée moyenne des visites</h4>
              <div className="avg-duration">
                <div className="duration-icon">
                  <i className="fas fa-clock"></i>
                </div>
                <div className="duration-value">{appointmentStats.avg_duration} minutes</div>
              </div>
            </div>
          </div>

          <div className="stats-card daily-stats">
            <h4>Rendez-vous par jour</h4>
            <div className="daily-chart">
              {appointmentStats.daily_stats.map((stat) => (
                <div key={stat.day} className="daily-bar">
                  <div className="bar-label">
                    {new Date(stat.day).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                  </div>
                  <div className="bar-container">
                    <div
                      className="bar-value"
                      style={{
                        height: `${(stat.count / Math.max(...appointmentStats.daily_stats.map((s) => s.count))) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <div className="bar-count">{stat.count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {visitorStats && (
        <div className="stats-section">
          <h3>Statistiques des Visiteurs</h3>

          <div className="stats-grid">
            <div className="stats-card">
              <h4>Visiteurs fréquents</h4>
              <div className="frequent-visitors">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Visiteur</th>
                      <th>CIN</th>
                      <th>Visites</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visitorStats.frequent_visitors.slice(0, 5).map((visitor) => (
                      <tr key={visitor.id}>
                        <td>
                          {visitor.firstname} {visitor.lastname}
                        </td>
                        <td>{visitor.cin}</td>
                        <td>{visitor.appointments_count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="stats-card">
              <h4>Motifs de visite</h4>
              <div className="visit-reasons">
                {visitorStats.visit_reasons.slice(0, 5).map((reason, index) => (
                  <div key={index} className="reason-item">
                    <div className="reason-text">{reason.visit_reason}</div>
                    <div className="reason-bar">
                      <div
                        className="reason-progress"
                        style={{
                          width: `${(reason.count / visitorStats.visit_reasons.reduce((acc, curr) => acc + curr.count, 0)) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <div className="reason-count">{reason.count}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="export-section">
        <h3>Exporter les rapports</h3>
        <div className="export-buttons">
          <button className="btn btn-outline-primary">
            <i className="fas fa-file-excel me-2"></i>
            Exporter en Excel
          </button>
          <button className="btn btn-outline-danger">
            <i className="fas fa-file-pdf me-2"></i>
            Exporter en PDF
          </button>
        </div>
      </div>
    </div>
  )
}

