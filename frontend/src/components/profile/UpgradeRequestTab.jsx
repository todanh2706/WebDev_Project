import React, { useState } from 'react';
import { Form, Button, Badge, Spinner } from 'react-bootstrap';
import { FaArrowUp } from 'react-icons/fa';

const UpgradeRequestTab = ({ upgradeRequest, submitUpgradeRequest }) => {
    const [upgradeReason, setUpgradeReason] = useState('');
    const [submittingUpgrade, setSubmittingUpgrade] = useState(false);

    return (
        <div className="glass-panel p-4 rounded-3 h-100">
            <h3 className="text-white mb-4">Upgrade Account Request</h3>

            {upgradeRequest ? (
                <div className="text-center py-5 animate-fade-in">
                    <div className="mb-4">
                        <FaArrowUp className="text-auction-primary" size={48} />
                    </div>
                    <h4 className="text-white mb-3">Request Status</h4>
                    <Badge
                        bg={
                            upgradeRequest.status === 'approved' ? 'success' :
                                upgradeRequest.status === 'rejected' ? 'danger' : 'warning'
                        }
                        className="fs-6 px-4 py-2 mb-4"
                    >
                        {upgradeRequest.status.charAt(0).toUpperCase() + upgradeRequest.status.slice(1)}
                    </Badge>

                    <div className="text-white-50 mx-auto" style={{ maxWidth: '500px' }}>
                        <p className="mb-2">Request submitted on: {new Date(upgradeRequest.createdAt).toLocaleDateString()}</p>
                        <p>Reason: "{upgradeRequest.reason}"</p>

                        {upgradeRequest.status === 'pending' && (
                            <div className="mt-3 p-3 bg-dark bg-opacity-50 rounded text-warning border border-warning">
                                Your request is currently under review by our administrators.
                                We will notify you once a decision has been made.
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="animate-fade-in">
                    <p className="text-white-50 mb-4">
                        Want to become a seller or access premium features?
                        Submit a request to our administration team explaining why you'd like to upgrade your account.
                    </p>

                    <Form onSubmit={async (e) => {
                        e.preventDefault();
                        if (!upgradeReason.trim()) return;

                        setSubmittingUpgrade(true);
                        const success = await submitUpgradeRequest(upgradeReason);
                        setSubmittingUpgrade(false);
                        if (success) {
                            setUpgradeReason('');
                        }
                    }}>
                        <Form.Group className="mb-4">
                            <Form.Label className="text-white">Reason for Upgrade</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={5}
                                value={upgradeReason}
                                onChange={(e) => setUpgradeReason(e.target.value)}
                                placeholder="Please explain why you want to upgrade your account..."
                                className="bg-transparent text-white border-secondary upgrade-request-textarea"
                                required
                            />
                        </Form.Group>

                        <div className="d-flex justify-content-end">
                            <Button
                                type="submit"
                                variant="warning"
                                disabled={submittingUpgrade || !upgradeReason.trim()}
                                className="px-4 py-2 fw-bold"
                            >
                                {submittingUpgrade ? (
                                    <>
                                        <Spinner size="sm" className="me-2" />
                                        Sending...
                                    </>
                                ) : 'Send Request'}
                            </Button>
                        </div>
                    </Form>
                </div>
            )}
        </div>
    );
};

export default UpgradeRequestTab;
