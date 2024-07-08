import { useState } from 'react'
import { useDetailsContext } from '../hooks/useDetailsContext'

const UserForm = () => {
    const { dispatch } = useDetailsContext()


    // set each value's state to null / empty
    const [fullName, setFullName] = useState('')
    const [dob, setDob] = useState('')
    const [aboutMe, setAboutMe] = useState('')
    const [error, setError] = useState(null)



    const handleSubmit = async (e) => {
        // prevent auto page refresh
        e.preventDefault()

        // object containing values
        const detail = {fullName, dob, aboutMe}

        // send POST req - with app.use route from server.js (/api/details)
        const response = await fetch('/api/details', {
            method: 'POST',
            body: JSON.stringify(detail),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        // backend expects json
        const json = await response.json()


        // set error - controller for POST has an error property
        if(!response.ok) {
            setError(json.error)
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

            <label>Full Name:</label>
            <input
                type="text"
                onChange={(e) => setFullName(e.target.value)}
                value={fullName}
            />  
            <label>Date of Birth:</label>
            <input
                type="date"
                onChange={(e) => setDob(e.target.value)}
                value={dob}
            />
            <label>Role:</label>
            <input
                type="text"
                onChange={(e) => setAboutMe(e.target.value)}
                value={aboutMe}
            />

            <button>Create Profile</button>
            {error && <div className="error">{error}</div>}

        </form>
    )
}

export default UserForm