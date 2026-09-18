import axios from 'axios'
import { useMutation } from '@tanstack/react-query'

interface RegisterData {
  username: string
  email: string
  password: string
}

const handleRegister = async (RegisterData: RegisterData) => {
  const response = await axios.post('/api/register', RegisterData)
  return response.data
}

const useRegister = () => {
  const mutation = useMutation(handleRegister, {
    onSuccess: (data) => {
      console.log('User registered successfully:', data)
    },
    onError: (error) => {
      console.error('Error registering user:', error)
    },
  })

  return mutation
}

export { useRegister }
