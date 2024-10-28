import { useEffect, useState } from 'react';
import { useDetailsContext } from '../hooks/useDetailsContext';
import { useAuthContext } from '../hooks/useAuthContext';
import { useLocation } from 'react-router-dom';
// import config from '../config';
import NotificationModal from '../modals/NotificationModal';

// components
import UserDetails from '../components/UserDetails';
import UserForm from "../components/UserForm";


const Home = () => {

    const { details, dispatch } = useDetailsContext()
    const { user } = useAuthContext()
    const [showNotificationModal, setShowNotificationModal] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');

    const location = useLocation();

    useEffect(() => {
        const fetchDetails = async () => {
            const response = await fetch('/api/details', {
                headers: { 'Authorization': `Bearer ${user.token}` },
            })
            const json = await response.json()

            if (response.ok) {
                dispatch({ type: 'SET_DETAILS', payload: json })
            }
        }

        if (user) {
            fetchDetails()
        }

    }, [dispatch, user]);


    useEffect(() => {
        if (location.state?.notification) {
            setNotificationMessage(location.state.notification);
            setShowNotificationModal(true);
        }
    }, [location]);

    return (
        <div className="home">
            <div className="details">
                {details &&
                    details.map((detail) => (
                        <UserDetails key={detail._id} detail={detail} />
                    ))}
            </div>
            {details && details.length === 0 && <UserForm />}

            {/* Notification Modal */}
            <NotificationModal
                isOpen={showNotificationModal}
                onRequestClose={() => setShowNotificationModal(false)}
                message={notificationMessage}
            />
        </div>
    );
};

export default Home;