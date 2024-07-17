import { useDetailsContext } from '../hooks/useDetailsContext';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import format from 'date-fns/format';
import { useAuthContext } from '../hooks/useAuthContext';
import { useState } from 'react';
import ConfirmationModal from '../modals/ConfirmationModal';
import NotificationModal from '../modals/NotificationModal';


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

    const handleFileChange = (e) => {
        setProfilePicFile(e.target.files[0]);
        setProfilePicUrl(URL.createObjectURL(e.target.files[0]));
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

        const response = await fetch('api/details/' + detail._id, {
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


        const response = await fetch('api/details/' + detail._id, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${user.token}`
            },
            body: formData
        });

        const json = await response.json();

        if (response.ok) {
            dispatch({ type: 'UPDATE_DETAILS', payload: json });
            setIsEditing(false);
            setNotificationMessage('Profile updated successfully.');
            setShowNotificationModal(true);
        }
    }


    const formattedDob = detail.dob ? format(new Date(detail.dob), 'MMMM do, yyyy') : '';

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
                            accept="image/*"
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
                    <button type="submit">Save</button>
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
                <p className="profile-detail"><br /><strong>Profile Created: &nbsp;</strong>{formatDistanceToNow(new Date(detail.createdAt), { addSuffix: true })}</p>
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