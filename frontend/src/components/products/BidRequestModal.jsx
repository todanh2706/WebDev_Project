import React, { useState, useEffect } from 'react';
import { Modal, Button, ListGroup, Spinner, Badge } from 'react-bootstrap';
import { productService } from '../../services/productService';
import { useToast } from '../../contexts/ToastContext';
import { FaCheck, FaTimes, FaUser } from 'react-icons/fa';

const BidRequestModal = ({ show, onHide, productId, productName }) => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const data = await productService.getBidRequests(productId);
            // Filter only pending requests for action, or show all? 
            // User asked for a queue, usually implies pending. Let's show all but highlight pending.
            setRequests(data);
        } catch (error) {
            console.error(error);
            showToast('Failed to load bid requests', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (show && productId) {
            fetchRequests();
        }
    }, [show, productId]);

    const handleAction = async (requestId, status) => {
        try {
            await productService.handleBidRequest(requestId, status);
            showToast(`Request ${status} successfully`, 'success');
            fetchRequests(); // Refresh list
        } catch (error) {
            console.error(error);
            showToast(`Failed to ${status} request`, 'error');
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered size="lg" contentClassName="bg-dark text-white border-secondary">
            <Modal.Header closeButton closeVariant="white" className="border-secondary">
                <Modal.Title>
                    Bid Requests for <span className="text-auction-primary">{productName}</span>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4">
                {loading ? (
                    <div className="text-center py-4">
                        <Spinner animation="border" variant="warning" />
                    </div>
                ) : requests.length === 0 ? (
                    <div className="text-center py-5 text-white-50">
                        <p className="mb-0">No bid requests found.</p>
                    </div>
                ) : (
                    <ListGroup variant="flush">
                        {requests.map(request => (
                            <ListGroup.Item
                                key={request.id}
                                className="bg-transparent text-white border-secondary border-opacity-25 d-flex justify-content-between align-items-center py-3"
                            >
                                <div className="d-flex align-items-center gap-3">
                                    <div className="bg-secondary bg-opacity-25 p-3 rounded-circle">
                                        <FaUser className="text-white-50" />
                                    </div>
                                    <div>
                                        <h6 className="mb-1 fw-bold">{request.user?.name || 'Unknown User'}</h6>
                                        <small className="text-white-50">{request.user?.email}</small>
                                        <div className="mt-1">
                                            <Badge
                                                bg={
                                                    request.status === 'approved' ? 'success' :
                                                        request.status === 'rejected' ? 'danger' : 'warning'
                                                }
                                                text={request.status === 'pending' ? 'dark' : 'white'}
                                            >
                                                {request.status.toUpperCase()}
                                            </Badge>
                                            <small className="ms-2 text-white-50">
                                                {new Date(request.createdAt).toLocaleDateString()}
                                            </small>
                                        </div>
                                    </div>
                                </div>

                                {request.status === 'pending' && (
                                    <div className="d-flex gap-2">
                                        <Button
                                            variant="success"
                                            size="sm"
                                            className="d-flex align-items-center gap-1"
                                            onClick={() => handleAction(request.id, 'approved')}
                                        >
                                            <FaCheck /> Approve
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            className="d-flex align-items-center gap-1"
                                            onClick={() => handleAction(request.id, 'rejected')}
                                        >
                                            <FaTimes /> Reject
                                        </Button>
                                    </div>
                                )}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default BidRequestModal;
