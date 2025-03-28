import "./App.css"
import { Inscription } from "./components/Inscription"
import { Login } from "./components/Login"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Navbar } from "./components/Navbar"
import { Footer } from "./components/Footer"
import { Dashboard } from "./components/Dashboard"
import { ProtectedRoute } from "./components/ProtectedRoute"

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Login />} />
          <Route path="/Inscription" element={<Inscription />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            {/* Add more protected routes here */}
          </Route>
        </Routes>
        <Footer />
      </Router>
    </div>
  )
}

export default App

