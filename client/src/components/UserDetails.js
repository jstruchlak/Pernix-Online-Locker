import { useDetailsContext } from '../hooks/useDetailsContext';
import { formatDistanceToNow } from 'date-fns';
import { useAuthContext } from '../hooks/useAuthContext';
import { useState } from 'react';
import ConfirmationModal from '../modals/ConfirmationModal';
import NotificationModal from '../modals/NotificationModal';
import React from 'react';
import { format } from 'date-fns';
import config from '../config';


const UserDetails = ({ detail }) => {
    const { dispatch } = useDetailsContext();
    const { user } = useAuthContext();
    const [isEditing, setIsEditing] = useState(false);
    const [fullName, setFullName] = useState(detail.fullName);
    const [dob, setDob] = useState(detail.dob ? detail.dob.split('T')[0] : '');
    const [aboutMe, setAboutMe] = useState(detail.aboutMe);
    const [profilePicFile, setProfilePicFile] = useState(null);
    const [profilePicUrl, setProfilePicUrl] = useState(detail.profilePic);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showNotificationModal, setShowNotificationModal] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [error, setError] = useState('');

    // profile pic validation
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const allowedTypes = ['image/jpeg', 'image/png'];
        const maxSize = 5 * 1024 * 1024;
        if (file) {
            if (!allowedTypes.includes(file.type)) {
                setProfilePicFile(null);
                setProfilePicUrl('');
                setError('Invalid file type. Only JPEG, JPG, and PNG files are allowed.');
            } else if (file.size > maxSize) {
                setProfilePicFile(null);
                setProfilePicUrl('');
                setError('File size too large. The maximum allowed size is 5 MB.');
            } else {
                setProfilePicFile(file);
                setProfilePicUrl(URL.createObjectURL(file));
                setError('');
            }
        }
    };

    // State for showing delete confirmation modal
    const handleDeleteClick = () => {
        setShowDeleteModal(true);
    }
    const handleConfirmDelete = async () => {
        setShowDeleteModal(false);
        if (!user) {
            return;
        }
        
        const response = await fetch(`${config.apiServer}/api/details/${detail._id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${user.token}` }
        });
        
        const json = await response.json()
        if (response.ok) {
            dispatch({ type: 'DELETE_DETAILS', payload: json });
        }
    }

    
    const handleCancelDelete = () => {
        setShowDeleteModal(false);
    }
    // edit icon will set View Mode to Edit Mode
    const handleEditClick = () => {
        setIsEditing(true);
    }
    // default set is editing to false - View Mode
    const handleCancelClick = () => {
        setIsEditing(false);
    }

    const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
        return;
    }
    const formData = new FormData();
    formData.append('fullName', fullName);
    formData.append('dob', dob);
    formData.append('aboutMe', aboutMe);
    if (profilePicFile) {
        formData.append('profilePic', profilePicFile);
    }

    try {
        const response = await fetch(`${config.apiServer}/api/details/${detail._id}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${user.token}`
                // Do not set Content-Type header when using FormData
            },
            body: formData
        });

        if (response.ok) {
            const json = await response.json();
            dispatch({ type: 'UPDATE_DETAILS', payload: json });
            setIsEditing(false);
            setNotificationMessage('Profile updated successfully.');
            setShowNotificationModal(true);
        } else {
            const error = await response.json();
            setNotificationMessage(`Error: ${error.message}`);
            setShowNotificationModal(true);
        }
    } catch (error) {
        setNotificationMessage(`An error occurred: ${error.message}`);
        setShowNotificationModal(true);
    }
}


    const formattedDob = detail.dob ? format(new Date(detail.dob), 'MMMM do, yyyy') : '';
    const profileCreated = detail.createdAt ? formatDistanceToNow(new Date(detail.createdAt), { addSuffix: true }) : 'Date not available';
    return (
        <div className="user-details">
            {isEditing ? (
                <form onSubmit={handleSubmit}>
                    <label>
                        Full Name:
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required={true}
                        />
                    </label>
                    <label>
                        Date of Birth:
                        <input
                            type="date"
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                            required={true}
                        />
                    </label>
                    <label>
                        Role:
                        <input
                            type="text"
                            value={aboutMe}
                            onChange={(e) => setAboutMe(e.target.value)}
                            required={true}
                        />
                    </label>
                    <label>
                        Profile Picture:
                        <input
                            type="file"
                            onChange={handleFileChange}
                            accept=".jpeg,.jpg,.png"
                        />
                        {profilePicUrl && (
                            <img
                                src={profilePicUrl}
                                alt="Profile"
                                className="profile-pic"
                                style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '50%' }}
                            />
                        )}
                    </label>
                    {error && <div className="error">{error}</div>}
                    <button type="submit" disabled={!!error}>Save</button>
                    <button type="button" onClick={handleCancelClick}>Cancel</button>
                </form>
            ) : (
                // show details when not in editing mode - isEditing(false)
                <><div className="user-profile">
                    <h2 className="profile-name">{detail.fullName.toUpperCase()}</h2>
                    {detail.profilePic && (
                        <img
                            src={typeof detail.profilePic === 'string' ? detail.profilePic : URL.createObjectURL(detail.profilePic)}
                            alt="Profile"
                            className="profile-pic"
                        />
                    )}
                    <p className="profile-detail"><strong>Date Of Birth: &nbsp;</strong>{formattedDob}</p>
                    <p className="profile-detail"><strong>Role: &nbsp;</strong>{detail.aboutMe}</p>
                    <p className="profile-detail"><br /><strong>Profile Created: &nbsp;</strong>{profileCreated}</p>
                    <div className="icon-container">
                        <span onClick={handleDeleteClick} className="icon material-symbols-outlined">delete</span>
                        <span onClick={handleEditClick} className="icon material-symbols-outlined">edit</span>
                    </div>
                </div>
                </>
            )}

            {/* Display Modals */}
            <ConfirmationModal
                isOpen={showDeleteModal}
                onRequestClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                message="Are you sure you want to delete this profile?"
            />
            <NotificationModal
                isOpen={showNotificationModal}
                onRequestClose={() => setShowNotificationModal(false)}
                message={notificationMessage}
            />
        </div>
    );
}
export default UserDetails;