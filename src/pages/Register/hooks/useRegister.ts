import { useMutation, type UseMutationOptions } from '@tanstack/react-query'
import {
  registerUser,
  type RegisterUserRequest,
  type RegisterUserResponse,
  type RegistrationApiError,
} from '../../../services/api/RegistrationService'

type UseRegisterOptions = Omit<
  UseMutationOptions<RegisterUserResponse, RegistrationApiError, RegisterUserRequest>,
  'mutationFn' | 'mutationKey'
>

export function useRegister(options?: UseRegisterOptions) {
  return useMutation<RegisterUserResponse, RegistrationApiError, RegisterUserRequest>({
    ...options,
    mutationKey: ['auth', 'register'],
    mutationFn: registerUser,
  })
}
