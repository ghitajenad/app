import { createSlice } from "@reduxjs/toolkit"

// Initialiser l'état à partir du localStorage si disponible
const loadState = () => {
  try {
    const serializedUser = localStorage.getItem("user")
    const serializedToken = localStorage.getItem("token")
    return {
      user: serializedUser ? JSON.parse(serializedUser) : null,
      token: serializedToken || null,
      isAuthenticated: !!serializedToken,
      isLoading: false,
      error: null,
    }
  } catch (err) {
    console.error("Erreur lors du chargement de l'état:", err)
    return {
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    }
  }
}

const initialState = loadState()

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    loginSuccess: (state, action) => {
      state.isLoading = false
      state.isAuthenticated = true
      state.user = action.payload.user
      state.token = action.payload.token
      state.error = null

      // Sauvegarder dans localStorage
      localStorage.setItem("user", JSON.stringify(action.payload.user))
      localStorage.setItem("token", action.payload.token)

      // Log pour déboguer
      console.log("Token sauvegardé dans localStorage:", action.payload.token)
    },
    loginFailure: (state, action) => {
      state.isLoading = false
      state.error = action.payload
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.error = null

      // Supprimer du localStorage
      localStorage.removeItem("user")
      localStorage.removeItem("token")
    },
    clearError: (state) => {
      state.error = null
    },
  },
})

export const { loginStart, loginSuccess, loginFailure, logout, clearError } = authSlice.actions

// Sélecteurs
export const selectUser = (state) => state.auth.user
export const selectToken = (state) => state.auth.token
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated
export const selectIsAdmin = (state) => state.auth.user?.role === "admin"
export const selectIsAgent = (state) => state.auth.user?.role === "agent"
export const selectAuthError = (state) => state.auth.error
export const selectIsLoading = (state) => state.auth.isLoading

export default authSlice.reducer

