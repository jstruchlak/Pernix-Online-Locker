import { useState } from 'react'
import { useAuthContext } from '../hooks/useAuthContext'

export const useSignup = () => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    // grab the dispatch from AuthContext
    const { dispatch } = useAuthContext()

    const signup = async (username, email, password) => {
        setIsLoading(true)
        setError(null)

        // POST req - straight to proxy in package.json
        const response = await fetch('/api/user/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // return JSON - pass in objects {}
            body: JSON.stringify({ username, email, password })
        })

        // response include JSON web token and email
        const json = await response.json()

        if (!response.ok) {
            setIsLoading(false)
            setError(json.error)
        }

        if (response.ok) {
            // stored user email and token in json format
            localStorage.setItem('user', JSON.stringify(json))
        }

        //update AuthContext 
        dispatch({ type: 'LOGIN', payload: json })
        
        setIsLoading(false)

    }

    return { signup, isLoading, error }

}