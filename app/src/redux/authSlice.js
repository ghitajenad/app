import { createSlice } from "@reduxjs/toolkit"

// Initialize state from localStorage if available
const loadState = () => {
  try {
    const serializedUser = localStorage.getItem("user")
    const serializedToken = localStorage.getItem("token")
    return {
      user: serializedUser ? JSON.parse(serializedUser) : null,
      token: serializedToken || null,
    }
  } catch (err) {
    return {
      user: null,
      token: null,
    }
  }
}

const initialState = loadState()

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
      localStorage.setItem("user", JSON.stringify(action.payload))
    },
    setCredentials: (state, action) => {
      const { user, token } = action.payload
      state.user = user
      state.token = token

      // Save to localStorage for persistence
      localStorage.setItem("user", JSON.stringify(user))
      localStorage.setItem("token", token)
    },
    clearCredentials: (state) => {
      state.user = null
      state.token = null

      // Clear from localStorage
      localStorage.removeItem("user")
      localStorage.removeItem("token")
    },
  },
})

export const { setUser, setCredentials, clearCredentials } = authSlice.actions
export default authSlice.reducer

// Selectors
export const selectCurrentUser = (state) => state.auth.user
export const selectToken = (state) => state.auth.token
export const selectIsAuthenticated = (state) => Boolean(state.auth.token)

