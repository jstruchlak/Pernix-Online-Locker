import { useState } from 'react'
import { useAuthContext } from '../hooks/useAuthContext'
import config from '../config/config';

export const useLogin = () => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(null)

    const { dispatch } = useAuthContext()

    const login = async (username, email, password) => {
        setIsLoading(true)
        setError(null)

        const response = await fetch(`${config.apiServer}/api/user/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        })

        const json = await response.json()

        if (!response.ok) {
            setIsLoading(false)
            setError(json.error)
        }

        if (response.ok) {
            // save to local storage as 'user'
            localStorage.setItem('user', JSON.stringify(json))
            dispatch({ type: 'LOGIN', payload: json })
            setIsLoading(false)
        }
    }

    return { login, isLoading, error }

}