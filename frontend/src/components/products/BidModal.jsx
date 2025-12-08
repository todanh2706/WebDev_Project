import React from 'react';
import { Modal, Form, Spinner } from 'react-bootstrap';
import Button from '../common/Button';

const BidModal = ({ show, onHide, product, onSubmit, bidAmount, setBidAmount, placingBid }) => {
    if (!product) return null;

    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
            backdrop="static"
            keyboard={false}
            dialogClassName="modal-dark-glass"
            contentClassName="glass-panel-dark border-0"
        >
            <div className="p-4">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4 border-bottom border-secondary border-opacity-25 pb-3">
                    <h4 className="text-white fw-bold m-0 d-flex align-items-center gap-2">
                        <span className="text-auction-primary">Place Bid</span>
                    </h4>
                </div>

                <Form onSubmit={onSubmit}>
                    <div className="mb-4">
                        <p className="text-white-50 mb-2">Current Price: <span className="text-auction-primary fw-bold">${parseFloat(product.current_price).toLocaleString()}</span></p>
                        <p className="text-white-50 mb-2">Step Price: <span className="text-light fw-bold">+${parseFloat(product.step_price).toLocaleString()}</span></p>
                        <p className="text-white-50 mb-2">Minimum Bid: <span className="text-success fw-bold">${(parseFloat(product.current_price) + parseFloat(product.step_price)).toLocaleString()}</span></p>
                        <Form.Group>
                            <Form.Label className="text-auction-primary">Your Bid Amount ($)</Form.Label>
                            <Form.Control
                                type="number"
                                step="0.01"
                                min={parseFloat(product.current_price) + 0.01}
                                value={bidAmount}
                                onChange={(e) => setBidAmount(e.target.value)}
                                className="bg-black bg-opacity-50 border-secondary text-white no-spinners placeholder-yellow"
                                placeholder="Enter amount..."
                                required
                                autoFocus
                            />
                        </Form.Group>
                    </div>
                    <div className="d-flex justify-content-end gap-2 pt-2">
                        <Button
                            onClick={onHide}
                            className="btn-auction text-black fw-bold px-4 text-danger"
                        >
                            Cancel
                        </Button>
                        <Button type="submit" className="btn-auction text-black fw-bold px-4 text-success" disabled={placingBid}>
                            {placingBid ? <Spinner size="sm" animation="border" /> : 'Confirm Bid'}
                        </Button>
                    </div>
                </Form>
            </div>
        </Modal>
    );
};

export default BidModal;
