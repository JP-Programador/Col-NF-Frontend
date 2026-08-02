import axios from "axios";

import { supabase } from "./supabaseClient";

const apiBaseUrl = (import.meta.env.VITE_API_URL || "http://localhost:8000").trim();

export const api = axios.create({
  baseURL: apiBaseUrl,
});

api.interceptors.request.use(async (config) => {
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      supabase.auth.signOut();
    }
    return Promise.reject(error);
  }
);
