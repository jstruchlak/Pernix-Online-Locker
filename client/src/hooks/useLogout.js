import { useAuthContext } from "./useAuthContext"
import { useDetailsContext } from "../hooks/useDetailsContext"


export const useLogout = () => {
    const { dispatch } = useAuthContext()
    // rename to avoid duplicate dispatch in one file
    const { dispatch: dispatchDetails } = useDetailsContext()


    const logout = () => {
        // remove user / invalidate token
        localStorage.removeItem('user')
        dispatch({ type: 'LOGOUT' })
        dispatchDetails({ type: 'SET_DETAILS', payload: null })
    }

    return { logout }
}