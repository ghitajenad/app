import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { logout } from "./authSlice"

// Fonction pour gérer les erreurs d'authentification
const baseQueryWithReauth = fetchBaseQuery({
  baseUrl: "http://127.0.0.1:8004/api/",
  prepareHeaders: (headers, { getState }) => {
    // Récupérer le token depuis l'état
    const token = getState().auth.token

    // Récupérer également depuis localStorage comme fallback
    const localToken = localStorage.getItem("token")
    const finalToken = token || localToken

    // Log pour débogage
    console.log("Token utilisé pour la requête:", finalToken ? `${finalToken.substring(0, 10)}...` : "Aucun token")

    // Si nous avons un token, l'ajouter aux en-têtes
    if (finalToken) {
      headers.set("Authorization", `Bearer ${finalToken}`)
      console.log("Authorization header set")
    } else {
      console.warn("Aucun token disponible pour l'authentification")
    }

    // Ajouter les en-têtes CORS et Content-Type
    headers.set("Accept", "application/json")
    headers.set("Content-Type", "application/json")

    return headers
  },
  credentials: "include", // Inclure les cookies
})

// Wrapper pour gérer les erreurs d'authentification
const customBaseQuery = async (args, api, extraOptions) => {
  let result = await baseQueryWithReauth(args, api, extraOptions)

  // Log de la réponse pour débogage
  console.log("API Response:", result)

  if (result.error && result.error.status === 401) {
    console.log("Erreur d'authentification 401 détectée")

    // Essayer de rafraîchir le token
    const refreshResult = await baseQueryWithReauth({ url: "refresh", method: "POST" }, api, extraOptions)

    console.log("Résultat du rafraîchissement:", refreshResult)

    if (refreshResult.data) {
      // Stocker le nouveau token
      const user = api.getState().auth.user
      api.dispatch({
        type: "auth/loginSuccess",
        payload: {
          user: user,
          token: refreshResult.data.token,
        },
      })

      // Réessayer la requête originale
      result = await baseQueryWithReauth(args, api, extraOptions)
    } else {
      // Si le rafraîchissement échoue, déconnecter l'utilisateur
      api.dispatch(logout())
    }
  }

  return result
}

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "login",
        method: "POST",
        body: credentials,
      }),
      // Ajouter un transformResponse pour déboguer
      transformResponse: (response) => {
        console.log("Login response:", response)
        return response
      },
      // Ajouter un transformErrorResponse pour déboguer
      transformErrorResponse: (error) => {
        console.error("Login error:", error)
        return error
      },
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: "register",
        method: "POST",
        body: userData,
      }),
    }),
    getUser: builder.query({
      query: () => "user",
    }),
    logout: builder.mutation({
      query: () => ({
        url: "logout",
        method: "POST",
      }),
    }),
    // Ajouter un endpoint de test d'authentification
    testAuth: builder.query({
      query: () => "auth-test",
    }),
    // Ajouter un endpoint pour les rendez-vous du jour
    getTodayAppointments: builder.query({
      query: () => "appointments/today",
    }),
  }),
})

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetUserQuery,
  useLogoutMutation,
  useTestAuthQuery,
  useGetTodayAppointmentsQuery,
} = apiSlice

