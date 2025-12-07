import React from 'react';
import { Row, Col, Button, Badge } from 'react-bootstrap';
import { BiUser, BiCheck, BiX } from 'react-icons/bi';

const UpgradeRequestList = ({ requests, onApprove, onReject }) => {
    return (
        <Row className="g-4">
            {requests.map((request) => (
                <Col key={request.id} md={6} lg={4} xl={3}>
                    <div className="glass-panel-dark p-3 h-100 d-flex flex-column rounded position-relative overflow-hidden">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                            <div className="d-flex align-items-center gap-2">
                                <div className="bg-secondary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                    <BiUser className="text-white fs-5" />
                                </div>
                                <div>
                                    <h6 className="m-0 text-white">{request.user?.name}</h6>
                                    <small className="text-muted">{request.date}</small>
                                </div>
                            </div>
                            <Badge bg="info">{request.status}</Badge>
                        </div>

                        <div className="mb-3 flex-grow-1">
                            <small className="text-auction-primary d-block mb-1">Reason:</small>
                            <p className="text-light small m-0 lh-sm">
                                {request.reason}
                            </p>
                        </div>

                        <div className="d-flex gap-2 mt-auto pt-3 border-top border-secondary">
                            <Button
                                variant="success"
                                size="sm"
                                className="flex-grow-1"
                                onClick={() => onApprove(request.id)}
                            >
                                <BiCheck className="me-1" /> Approve
                            </Button>
                            <Button
                                variant="danger"
                                size="sm"
                                className="flex-grow-1"
                                onClick={() => onReject(request.id)}
                            >
                                <BiX className="me-1" /> Reject
                            </Button>
                        </div>
                    </div>
                </Col>
            ))}
        </Row>
    );
};

export default UpgradeRequestList;
