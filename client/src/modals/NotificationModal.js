import React, { useEffect } from 'react';
import Modal from 'react-modal';

const NotificationModal = ({ isOpen, onRequestClose, message }) => {
    useEffect(() => {
        let timeout;
        if (isOpen) {
            // Set a timeout to close the modal after 3 seconds
            timeout = setTimeout(() => {
                onRequestClose();
            }, 2500); 
        }
        
        
        return () => clearTimeout(timeout);
    }, [isOpen, onRequestClose]);

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className="notification-modal"
            overlayClassName="notification-modal-overlay"
            ariaHideApp={false}
        >
            <div className="notification-content">
                <p>{message}</p>
            </div>
        </Modal>
    );
};

export default NotificationModal;