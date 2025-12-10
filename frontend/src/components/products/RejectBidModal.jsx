import React from 'react';
import { Modal, Spinner } from 'react-bootstrap';
import Button from '../common/Button';
import { FaExclamationTriangle } from 'react-icons/fa';

const RejectBidModal = ({ show, onHide, onConfirm, loading }) => {
    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
            backdrop="static"
            dialogClassName="modal-dark-glass"
            contentClassName="glass-panel-dark border-0"
        >
            <div className="p-4 text-center">
                <div className="mb-4">
                    <FaExclamationTriangle className="text-auction-primary" size={50} />
                </div>
                <h4 className="text-white fw-bold mb-3">Reject Bid?</h4>
                <p className="text-white-50 mb-4">
                    Are you sure you want to reject this bid? This action cannot be undone and the bidder will be removed from the history.
                </p>

                <div className="d-flex justify-content-center gap-3">
                    <Button variant="outline-light" onClick={onHide} disabled={loading} className="px-4 rounded-pill">
                        Cancel
                    </Button>
                    <Button
                        variant="danger"
                        onClick={onConfirm}
                        disabled={loading}
                        className="px-4 rounded-pill d-flex align-items-center gap-2"
                    >
                        {loading ? <Spinner size="sm" animation="border" className="me-2" /> : null}
                        Reject Bid
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default RejectBidModal;
