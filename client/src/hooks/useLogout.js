import { useAuthContext } from "./useAuthContext"


export const  useLogout = () => {
    const { dispatch } = useAuthContext()

    const logout = () => {

        // remove user / invalidate token
        localStorage.removeItem('user')

        // dispatch logout function to invalidate user / token
        // returns the logout to null (inside the AuthContext.js)
        dispatch({type: 'LOGOUT'})
    }

    return { logout }
}