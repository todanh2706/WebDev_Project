import React from 'react';
import { Modal } from 'react-bootstrap';
import Button from '../common/Button';
import { FaExclamationTriangle } from 'react-icons/fa';

const SessionExpiredModal = ({ show, onConfirm, onCancel }) => {
    return (
        <Modal
            show={show}
            onHide={onCancel}
            centered
            className="modal-dark-glass"
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header className="modal-header-glass">
                <Modal.Title className="modal-title-glass">
                    <FaExclamationTriangle className="text-warning" />
                    Session Expired
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-body-glass">
                <p className="mb-0 fs-5">
                    Your login session has expired. Would you like to login again?
                </p>
                <p className="text-auction-muted mt-2 mb-0 small">
                    Click "OK" to go to the login page.<br />
                    Click "Cancel" to stay on the current page (you will be logged out).
                </p>
            </Modal.Body>
            <Modal.Footer className="modal-footer-glass">
                <Button
                    variant="outline-light"
                    onClick={onCancel}
                >
                    Cancel
                </Button>
                <Button
                    onClick={onConfirm}
                >
                    OK
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default SessionExpiredModal;
