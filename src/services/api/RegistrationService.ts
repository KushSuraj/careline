import axios from 'axios'
import httpClient from './httpClient'

const REGISTER_ENDPOINT = '/api/register'

export interface RegisterUserRequest {
  username: string
  email: string
  phone: string
  password: string
}

export interface RegisteredUser {
  id?: string | number
  username?: string
  name?: string
  email: string
  phone?: string
}

export interface RegisterUserResponse {
  message?: string
  token?: string
  user?: RegisteredUser
}

export type RegistrationFieldErrors = Record<string, string>

interface RegistrationErrorResponse {
  message?: string
  error?: string
  errors?: Record<string, string | string[] | undefined>
}

export class RegistrationApiError extends Error {
  readonly fieldErrors: RegistrationFieldErrors

  constructor(message: string, fieldErrors: RegistrationFieldErrors = {}, cause?: unknown) {
    super(message, { cause })
    this.name = 'RegistrationApiError'
    this.fieldErrors = fieldErrors
  }
}

function normalizeFieldErrors(
  errors?: RegistrationErrorResponse['errors'],
): RegistrationFieldErrors {
  if (!errors) return {}

  return Object.fromEntries(
    Object.entries(errors).flatMap(([field, value]) => {
      const message = Array.isArray(value) ? value[0] : value
      return message ? [[field, message]] : []
    }),
  )
}

function toRegistrationError(error: unknown): RegistrationApiError {
  if (!axios.isAxiosError<RegistrationErrorResponse | string>(error)) {
    return new RegistrationApiError(
      error instanceof Error ? error.message : String(error),
      {},
      error,
    )
  }

  const responseData = error.response?.data
  if (responseData === undefined) {
    return new RegistrationApiError(error.message, {}, error)
  }

  const message =
    typeof responseData === 'string'
      ? responseData
      : (responseData.message ?? responseData.error ?? JSON.stringify(responseData))
  const fieldErrors =
    typeof responseData === 'string' ? {} : normalizeFieldErrors(responseData.errors)

  return new RegistrationApiError(message, fieldErrors, error)
}

export async function registerUser(payload: RegisterUserRequest): Promise<RegisterUserResponse> {
  try {
    const response = await httpClient.post<RegisterUserResponse>(REGISTER_ENDPOINT, payload)
    return response.data
  } catch (error) {
    throw toRegistrationError(error)
  }
}
