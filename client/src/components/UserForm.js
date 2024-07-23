import { useState } from 'react'
import { useDetailsContext } from '../hooks/useDetailsContext'
import { useAuthContext } from '../hooks/useAuthContext'
import SuccessModal from '../modals/NotificationModal';
import React from 'react';

const UserForm = () => {
    const { dispatch } = useDetailsContext()
    const { user } = useAuthContext()
    
    // set each value's state to null / empty
    const [fullName, setFullName] = useState('')
    const [dob, setDob] = useState('')
    const [aboutMe, setAboutMe] = useState('')
    const [profilePic, setProfilePic] = useState(null);
    const [error, setError] = useState(null)
    const [emptyFields, setEmptyFields] = useState([])
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [notificationMessage, setNotificationMessage] = useState('')
    
    const handleSubmit = async (e) => {
        // prevent auto page refresh
        e.preventDefault()
        // if check for logged in user
        if (!user) {
            setError('You must be logged in')
            return
        }
        
        if (profilePic) {
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            const maxSize = 10 * 1024 * 1024; // 10 MB
    
            if (!allowedTypes.includes(profilePic.type)) {
                setError('Invalid file type. Only JPEG, JPG, and PNG files are allowed.');
                return;
            }
    
            if (profilePic.size > maxSize) {
                setError('File size exceeds 10 MB.');
                return;
            }
        }
        const formData = new FormData();
        formData.append('fullName', fullName);
        formData.append('dob', dob);
        formData.append('aboutMe', aboutMe);
        if (profilePic) {
            formData.append('profilePic', profilePic);
        }
        // send POST req - with app.use route from server.js (/api/details)
        const response = await fetch('/api/details', {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
        // backend expects json
        const json = await response.json()

        // set error - controller for POST has an error property
        if (!response.ok) {
            setError(json.error)
            setEmptyFields(json.emptyFields)
        }
        // reset state of form values if ok
        if (response.ok) {
            setError(null)
            setFullName('')
            setDob('')
            setAboutMe('')
            setProfilePic(null)
            e.target.reset();
            console.log('New user added', json)
            dispatch({ type: 'CREATE_DETAILS', payload: json })
            setShowSuccessModal(true)
            setNotificationMessage('Profile created successfully.')
        }
    }
    const getMaxDate = () => {
        const today = new Date();
        today.setFullYear(today.getFullYear() - 18);
        return today.toISOString().split('T')[0];
    }
    return (
        <form className="create" onSubmit={handleSubmit}>
            <h2>CREATE PROFILE</h2>
            <label htmlFor="fullName">Full Name:</label>
            <input
                id="fullName"
                type="text"
                onChange={(e) => setFullName(e.target.value)}
                value={fullName}
                className={emptyFields.includes('Full Name') ? 'error' : ''}
            />
            <label htmlFor="dob">Date of Birth:</label>
            <input
                id="dob"
                type="date"
                onChange={(e) => setDob(e.target.value)}
                value={dob}
                max={getMaxDate()}
                className={emptyFields.includes('Date of Birth') ? 'error' : ''}
            />
            <label htmlFor="aboutMe">Role:</label>
            <input
                id="aboutMe"
                type="text"
                onChange={(e) => setAboutMe(e.target.value)}
                value={aboutMe}
                className={emptyFields.includes('Role') ? 'error' : ''}
            />
             <label htmlFor="profilePic">Profile Picture:</label>
            <input
                id="profilePic"
                type="file"
                accept="image/*"
                onChange={(e) => setProfilePic(e.target.files[0])}
                className={emptyFields.includes('Profile Picture') ? 'error' : ''}
            />
            <button>Create Profile</button>
            {error && <div className="error">{error}</div>}

            {/* Invoke modal */}
            <SuccessModal
                isOpen={showSuccessModal}
                onRequestClose={() => setShowSuccessModal(false)}
                message={notificationMessage}
            />
        </form>
    )
}
export default UserForm
