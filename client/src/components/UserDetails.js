import { useDetailsContext } from '../hooks/useDetailsContext';
import { formatDistanceToNow } from 'date-fns';
import { useAuthContext } from '../hooks/useAuthContext';
import { useState, useEffect } from 'react';
import ConfirmationModal from '../modals/ConfirmationModal';
import NotificationModal from '../modals/NotificationModal';
import { format } from 'date-fns';
import config from '../config';

const DEFAULT_PROFILE_PIC_URL = '/defaultPic.png';

const UserDetails = ({ detail }) => {
    const { dispatch } = useDetailsContext();
    const { user } = useAuthContext();
    const [isEditing, setIsEditing] = useState(false);
    const [fullName, setFullName] = useState(detail.fullName);
    const [dob, setDob] = useState(detail.dob ? detail.dob.split('T')[0] : '');
    const [aboutMe, setAboutMe] = useState(detail.aboutMe);
    const [profilePicFile, setProfilePicFile] = useState(null);
    const [profilePicUrl, setProfilePicUrl] = useState(detail.profilePic || DEFAULT_PROFILE_PIC_URL);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showNotificationModal, setShowNotificationModal] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (!profilePicUrl || profilePicUrl === '/undefined') {
            setProfilePicUrl(DEFAULT_PROFILE_PIC_URL);
        }
    }, [profilePicUrl]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const allowedTypes = ['image/jpeg', 'image/png'];
        const maxSize = 5 * 1024 * 1024;
        if (file) {
            if (!allowedTypes.includes(file.type)) {
                setProfilePicFile(null);
                setProfilePicUrl(DEFAULT_PROFILE_PIC_URL);
                setError('Invalid file type. Only JPEG, JPG, and PNG files are allowed.');
            } else if (file.size > maxSize) {
                setProfilePicFile(null);
                setProfilePicUrl(DEFAULT_PROFILE_PIC_URL);
                setError('File size too large. The maximum allowed size is 5 MB.');
            } else {
                setProfilePicFile(file);
                setProfilePicUrl(URL.createObjectURL(file));
                setError('');
            }
        }
    };

    const handleDeleteClick = () => {
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        setShowDeleteModal(false);
        if (!user) {
            return;
        }

        try {
            const response = await fetch(`${config.apiServer}/api/details/${detail._id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${user.token}` }
            });

            if (response.ok) {
                dispatch({ type: 'DELETE_DETAILS', payload: await response.json() });
            } else {
                const error = await response.json();
                setNotificationMessage(`Error: ${error.message}`);
                setShowNotificationModal(true);
            }
        } catch (error) {
            setNotificationMessage(`An error occurred: ${error.message}`);
            setShowNotificationModal(true);
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelClick = () => {
        setIsEditing(false);
    };

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
                },
                body: formData
            });

            if (response.ok) {
                const json = await response.json();
                dispatch({ type: 'UPDATE_DETAILS', payload: json });
                setProfilePicUrl(json.profilePic || DEFAULT_PROFILE_PIC_URL);
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
    };

    const formattedDob = detail.dob ? format(new Date(detail.dob), 'MMMM do, yyyy') : '';
    const profileCreated = detail.createdAt ? formatDistanceToNow(new Date(detail.createdAt), { addSuffix: true }) : 'Date not available';

    const handleImageError = () => {
        setProfilePicUrl(DEFAULT_PROFILE_PIC_URL);
    };

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
                            required
                        />
                    </label>
                    <label>
                        Date of Birth:
                        <input
                            type="date"
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Role:
                        <input
                            type="text"
                            value={aboutMe}
                            onChange={(e) => setAboutMe(e.target.value)}
                            required
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
                                onError={handleImageError}
                            />
                        )}
                    </label>
                    {error && <div className="error">{error}</div>}
                    <button type="submit" disabled={!!error}>Save</button>
                    <button type="button" onClick={handleCancelClick}>Cancel</button>
                </form>
            ) : (
                <div className="user-profile">
                    <h2 className="profile-name">{detail.fullName.toUpperCase()}</h2>
                    <img
                        src={profilePicUrl}
                        alt="Profile"
                        className="profile-pic"
                        onError={handleImageError}
                        style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '50%' }}
                    />
                    <p className="profile-detail"><strong>Date Of Birth: &nbsp;</strong>{formattedDob}</p>
                    <p className="profile-detail"><strong>Role: &nbsp;</strong>{detail.aboutMe}</p>
                    <p className="profile-detail"><br /><strong>Profile Created: &nbsp;</strong>{profileCreated}</p>
                    <div className="icon-container">
                        <span onClick={handleDeleteClick} className="icon material-symbols-outlined">delete</span>
                        <span onClick={handleEditClick} className="icon material-symbols-outlined">edit</span>
                    </div>
                </div>
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
};

export default UserDetails;
