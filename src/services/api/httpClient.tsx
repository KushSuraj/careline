import axios from 'axios'
import { API_BASE_URL } from '../config'

// Create Axios instance
const httpClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

// request interceptor to add auth token
httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// response interceptor to handle errors
httpClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
)

export default httpClient
