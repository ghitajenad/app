import "./App.css"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { selectIsAuthenticated, selectIsAdmin, selectIsAgent } from "./redux/authSlice"
import { Login } from "./components/Login"
import { AdminDashboard } from "./components/AdminDashboard"
import { AgentDashboard } from "./components/AgentDashboard"
import { AppointmentForm } from "./components/appointments/AppointmentForm"
import { AppointmentDetails } from "./components/appointments/AppointmentDetails"
import { AppointmentsList } from "./components/appointments/AppointmentsList"
import { AppointmentsDashboard } from "./components/appointments/AppointmentsDashboard"
import { Inscription } from "./components/Inscription"
import { VisitorsList } from "./components/visitors/VisitorsList"
import { VisitorForm } from "./components/visitors/VisitorForm"
import { Layout } from "./components/layout/Layout"

// Composant de protection des routes admin
const AdminRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const isAdmin = useSelector(selectIsAdmin)

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  if (!isAdmin) {
    return <Navigate to="/agent-dashboard" replace />
  }

  return children
}

// Composant de protection des routes agent
const AgentRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const isAgent = useSelector(selectIsAgent)
  const isAdmin = useSelector(selectIsAdmin)

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  if (!isAgent && !isAdmin) {
    return <Navigate to="/" replace />
  }

  return children
}

// Redirection si déjà authentifié
const PublicRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const isAdmin = useSelector(selectIsAdmin)

  if (isAuthenticated) {
    if (isAdmin) {
      return <Navigate to="/admin-dashboard" replace />
    } else {
      return <Navigate to="/agent-dashboard" replace />
    }
  }

  return children
}

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          {/* Route publique - Login */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          {/* Routes protégées avec Layout */}
          <Route element={<Layout />}>
            {/* Routes Admin */}
            <Route
              path="/admin-dashboard"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />

            <Route
              path="/admin-dashboard/inscription"
              element={
                <AdminRoute>
                  <Inscription />
                </AdminRoute>
              }
            />

            <Route
              path="/admin-dashboard/appointments"
              element={
                <AdminRoute>
                  <AppointmentsList />
                </AdminRoute>
              }
            />

            <Route
              path="/admin-dashboard/appointments-dashboard"
              element={
                <AdminRoute>
                  <AppointmentsDashboard />
                </AdminRoute>
              }
            />

            <Route
              path="/admin-dashboard/appointments/new"
              element={
                <AdminRoute>
                  <AppointmentForm />
                </AdminRoute>
              }
            />

            <Route
              path="/admin-dashboard/appointments/:id"
              element={
                <AdminRoute>
                  <AppointmentDetails />
                </AdminRoute>
              }
            />

            <Route
              path="/admin-dashboard/rendezvous/:id"
              element={
                <AdminRoute>
                  <AppointmentDetails />
                </AdminRoute>
              }
            />

            <Route
              path="/admin-dashboard/appointments/edit/:id"
              element={
                <AdminRoute>
                  <AppointmentForm />
                </AdminRoute>
              }
            />

            <Route
              path="/admin-dashboard/visitors"
              element={
                <AdminRoute>
                  <VisitorsList />
                </AdminRoute>
              }
            />

            <Route
              path="/ajout-visiteur"
              element={
                <AdminRoute>
                  <VisitorForm />
                </AdminRoute>
              }
            />

            {/* Routes Agent */}
            <Route
              path="/agent-dashboard"
              element={
                <AgentRoute>
                  <AgentDashboard />
                </AgentRoute>
              }
            />

            <Route
              path="/agent-dashboard/appointments"
              element={
                <AgentRoute>
                  <AppointmentsList />
                </AgentRoute>
              }
            />

            <Route
              path="/agent-dashboard/appointments-dashboard"
              element={
                <AgentRoute>
                  <AppointmentsDashboard />
                </AgentRoute>
              }
            />

            <Route
              path="/agent-dashboard/appointments/new"
              element={
                <AgentRoute>
                  <AppointmentForm />
                </AgentRoute>
              }
            />

            <Route
              path="/agent-dashboard/appointments/:id"
              element={
                <AgentRoute>
                  <AppointmentDetails />
                </AgentRoute>
              }
            />

            <Route
              path="/agent-dashboard/rendezvous/:id"
              element={
                <AgentRoute>
                  <AppointmentDetails />
                </AgentRoute>
              }
            />

            <Route
              path="/agent-dashboard/appointments/edit/:id"
              element={
                <AgentRoute>
                  <AppointmentForm />
                </AgentRoute>
              }
            />

            <Route
              path="/agent-dashboard/visitors"
              element={
                <AgentRoute>
                  <VisitorsList />
                </AgentRoute>
              }
            />
          </Route>

          {/* Redirection pour les routes inconnues */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App