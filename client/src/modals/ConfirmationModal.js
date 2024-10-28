import Modal from 'react-modal';
import React from 'react';

const ConfirmationModal = ({ isOpen, onRequestClose, onConfirm, message }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className="delete-modal"
            overlayClassName="delete-modal-overlay"
            ariaHideApp={false} >

            <img
                src="/pv1.png"
                alt="auth"
                style={{ width: '139px', height: '78px', marginBottom: '-25px' }}
            />

            <h2>CONFIRM DELETION</h2>
            <p>{message}</p>
            <div className="modal-buttons">
                <button onClick={onConfirm} className="delete-button">DELETE</button>
                <button onClick={onRequestClose} className="cancel-button">Cancel</button>
            </div>
        </Modal>
    );
};

export default ConfirmationModal;
