import { useMutation } from '@tanstack/react-query'
import { login, type LoginCredentials, type UserData } from '../../../services/api/AuthService'

export function useLogin() {
  return useMutation<UserData, Error, LoginCredentials>({
    mutationKey: ['auth', 'login'],
    mutationFn: ({ email, password }) => login(email, password),
  })
}
