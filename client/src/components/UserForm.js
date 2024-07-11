import { useState } from 'react'
import { useDetailsContext } from '../hooks/useDetailsContext'
import { useAuthContext } from '../hooks/useAuthContext'

const UserForm = () => {
    const { dispatch } = useDetailsContext()
    const { user } = useAuthContext()


    // set each value's state to null / empty
    const [fullName, setFullName] = useState('')
    const [dob, setDob] = useState('')
    const [aboutMe, setAboutMe] = useState('')
    const [error, setError] = useState(null)
    const [emptyFields, setEmptyFields] = useState([])



    const handleSubmit = async (e) => {
        // prevent auto page refresh
        e.preventDefault()

        // if check for logged in user
        if(!user) {
            setError('You must be logged in')
            return
        }

        // object containing values
        const detail = {fullName, dob, aboutMe}

        // send POST req - with app.use route from server.js (/api/details)
        const response = await fetch('/api/details', {
            method: 'POST',
            body: JSON.stringify(detail),
            headers: {
                'Content-Type': 'application/json',
                // add auth header from auth hook
                'Authorization': `Bearer ${user.token}`
            }
        })

        // backend expects json
        const json = await response.json()


        // set error - controller for POST has an error property
        if(!response.ok) {
            setError(json.error)
            setEmptyFields(json.emptyFields)
        }

        // reset state of form values if ok
        if(response.ok) {
            setError(null)
            setFullName('')
            setDob('')
            setAboutMe('')
            console.log('New user added', json)
            dispatch({type: 'CREATE_DETAILS', payload: json})
        }
    }

    return (
        <form className="create" onSubmit={handleSubmit}>

            <h2>Create Profile</h2>

            <label>Full Name:</label>
            <input
                type="text"
                onChange={(e) => setFullName(e.target.value)}
                value={fullName}
                className={emptyFields.includes('Full Name') ? 'error' : ''}
            />  
            <label>Date of Birth:</label>
            <input
                type="date"
                onChange={(e) => setDob(e.target.value)}
                value={dob}
                className={emptyFields.includes('Date of Birth') ? 'error' : ''}
            />
            <label>Role:</label>
            <input
                type="text"
                onChange={(e) => setAboutMe(e.target.value)}
                value={aboutMe}
                className={emptyFields.includes('Role') ? 'error' : ''}
            />

            <button>Create Profile</button>
            {error && <div className="error">{error}</div>}

        </form>
    )
}

export default UserForm