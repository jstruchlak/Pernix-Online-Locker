import { useAuthContext } from "./useAuthContext"
import { useDetailsContext } from "../hooks/useDetailsContext"


export const  useLogout = () => {
    const { dispatch } = useAuthContext()
    // cannot call dispatch twice from different components 
    // destructure as a different name - dispatch: (after colon rename to something)
    const { dispatch: dispatchDetails } = useDetailsContext()


    const logout = () => {

        // remove user / invalidate token
        localStorage.removeItem('user')

        // dispatch logout function to invalidate user / token
        // returns the logout to null (inside the AuthContext.js)
        dispatch({type: 'LOGOUT'})
        // clearing state on logout 
        dispatchDetails({type: 'SET_DETAILS', payload: null})
    }

    return { logout }
}