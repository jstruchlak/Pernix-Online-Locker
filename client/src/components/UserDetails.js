import { useDetailsContext } from '../hooks/useDetailsContext'
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import format from 'date-fns/format';
import { useAuthContext } from '../hooks/useAuthContext';
import { useState } from 'react';

const UserDetails = ({ detail }) => {
    const { dispatch } = useDetailsContext()
    const { user } = useAuthContext()
    const [isEditing, setIsEditing] = useState(false);
    const [fullName, setFullName] = useState(detail.fullName);
    // correct date format using split method
    const [dob, setDob] = useState(detail.dob ? detail.dob.split('T')[0] : '');
    const [aboutMe, setAboutMe] = useState(detail.aboutMe);


    const handleClick = async () => {
        // if check for logged in user
        if (!user) {
            return
        }
        const confirmDelete = window.confirm("Are you sure you want to delete this profile?");
        if (!confirmDelete) {
            return;
        }
        const response = await fetch('api/details/' + detail._id, {
            method: 'DELETE',
            // add auth check for valid token 
            headers: { 'Authorization': `Bearer ${user.token}` }
        });

        const json = await response.json()
        if (response.ok) {
            dispatch({ type: 'DELETE_DETAILS', payload: json });
        }
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
        const updatedDetail = { fullName, dob, aboutMe };
        // await fetch - wait for response before moving on
        const response = await fetch('api/details/' + detail._id, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify(updatedDetail)
        });
        const json = await response.json();
        if (response.ok) {
            dispatch({ type: 'UPDATE_DETAILS', payload: json });
            setIsEditing(false);
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
                        />
                    </label>
                    <label>
                        Date of Birth:
                        <input
                            type="date"
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                        />
                    </label>
                    <label>
                        Role:
                        <input
                            type="text"
                            value={aboutMe}
                            onChange={(e) => setAboutMe(e.target.value)}
                        />
                    </label>
                    <button type="submit">Save</button>
                    <button type="button" onClick={handleCancelClick}>Cancel</button>
                </form>
            ) : (
                // show details when not in editing mode - isEditing(false)
                <>
                    <h2>{detail.fullName.toUpperCase()}</h2>
                    <p><strong>Date Of Birth: &nbsp;</strong>{formattedDob}</p>
                    <p><strong>Role: &nbsp;</strong>{detail.aboutMe}</p>
                    <p><br /><strong>Profile Created: &nbsp;</strong>{formatDistanceToNow(new Date(detail.createdAt), { addSuffix: true })}</p>
                    <div className="icon-container">
                        <span onClick={handleClick} className="material-symbols-outlined">delete</span>
                        <span onClick={handleEditClick} className="material-symbols-outlined">edit</span>
                    </div>
                </>
            )}
        </div>
    )
}
export default UserDetails