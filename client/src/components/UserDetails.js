import { useDetailsContext } from '../hooks/useDetailsContext'
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import format from 'date-fns/format';
import { useAuthContext } from '../hooks/useAuthContext';

const UserDetails = ({ detail }) => {
    const { dispatch } = useDetailsContext()
    const { user } = useAuthContext()

    const handleClick = async () => {
        // if check for logged in user
        if(!user) {
            return
        }
        const response = await fetch('api/details/' + detail._id, {
            method: 'DELETE',
            // add auth check for valid token 
            headers: {'Authorization': `Bearer ${user.token}`}
        });
    
        const json = await response.json()

        if(response.ok) {
            dispatch({ type: 'DELETE_DETAILS', payload: json });
        }
    }

    const formattedDob = detail.dob ? format(new Date(detail.dob), 'MMMM do, yyyy') : '';


    return (
        <div className="user-details">
            <h2>{detail.fullName.toUpperCase()}</h2>
            <p><strong>Date Of Birth: &nbsp;</strong>{formattedDob}</p>
            <p><strong>Role: &nbsp;</strong>{detail.aboutMe}</p>
            <p><br /><strong>Profile Created: &nbsp;</strong>{formatDistanceToNow(new Date(detail.createdAt), { addSuffix: true })}</p>
            <span onClick={handleClick} className="material-symbols-outlined">delete</span>
        </div>
    )
}

export default UserDetails