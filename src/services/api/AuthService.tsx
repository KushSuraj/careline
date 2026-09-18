import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import httpClient from './httpClient'

export interface LoginCredentials {
  email: string
  password: string
}

export type UserData = Record<string, unknown>

interface ApiErrorResponse {
  message?: string
  error?: string
}

const getLoginErrorMessage = (error: unknown): string => {
  if (!axios.isAxiosError<ApiErrorResponse | string>(error)) {
    return error instanceof Error ? error.message : 'Login failed. Please try again.'
  }

  const responseData = error.response?.data

  if (typeof responseData === 'string') {
    return responseData
  }

  return responseData?.message ?? responseData?.error ?? error.message ?? 'Login failed. Please try again.'
}

export const login = async <TUserData = UserData>(
  email: string,
  password: string,
): Promise<TUserData> => {
  try {
    const response = await httpClient.post<TUserData>('/auth/login', { email, password })
    return response.data
  } catch (error) {
    throw new Error(getLoginErrorMessage(error), { cause: error })
  }
}

export const useLogin = <TUserData = UserData>() =>
  useMutation<TUserData, Error, LoginCredentials>({
    mutationFn: ({ email, password }) => login<TUserData>(email, password),
  })
