import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://127.0.0.1:8004/api/",
    prepareHeaders: (headers, { getState }) => {
      // Get the token from the state
      const token = getState().auth.token

      // If we have a token, add it to the headers
      if (token) {
        headers.set("Authorization", `Bearer ${token}`)
      }

      return headers
    },
  }),
  endpoints: (builder) => ({
    getUser: builder.query({
      query: () => "user",
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (userData) => {
        console.log("Données envoyées à l'API:", userData)
        return {
          url: "/register",
          method: "POST",
          body: userData,
        }
      },
    }),
    logout: builder.mutation({
      query: () => ({
        url: "logout",
        method: "POST",
      }),
    }),
  }),
})

export const { useGetUserQuery, useLoginMutation, useRegisterMutation, useLogoutMutation } = apiSlice

export default apiSlice

