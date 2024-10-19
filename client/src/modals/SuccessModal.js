import React, { useEffect } from 'react';
import Modal from 'react-modal';

const SuccessModal = ({ isOpen, onRequestClose, message  }) => {
  useEffect(() => {
    let timeout;
    if (isOpen) {
      timeout = setTimeout(() => {
        onRequestClose();
      }, 3500);
    }

    return () => clearTimeout(timeout);
  }, [isOpen, onRequestClose]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="success-modal"
      overlayClassName="success-modal-overlay"
      ariaHideApp={false}
    >
      <div>{message}</div>
    </Modal>
  );
};

export default SuccessModal;
