
import React, { useState } from 'react';
import { Modal, Form, Badge } from 'react-bootstrap';
import Button from '../common/Button';

const EditUserModal = ({ show, onHide, user, onSave }) => {
    const [role, setRole] = useState(user?.role || 0);
    const [status, setStatus] = useState(user?.status || 'active');
    const [loading, setLoading] = useState(false);

    // Update state when user prop changes
    React.useEffect(() => {
        if (user) {
            setRole(user.role);
            setStatus(user.status);
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSave(user.id, { role: parseInt(role), status });
            onHide();
        } catch (error) {
            console.error("Failed to update user", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered className="modal-dark-glass">
            <Modal.Header className="border-secondary">
                <Modal.Title className="text-white">Edit User: {user?.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label className="text-white">Role</Form.Label>
                        <Form.Select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="bg-dark text-white border-secondary"
                        >
                            <option value="0">Bidder</option>
                            <option value="1">Seller</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="text-white">Status</Form.Label>
                        <Form.Select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="bg-dark text-white border-secondary"
                        >
                            <option value="active">Active</option>
                            <option value="banned">Banned</option>
                            <option value="inactive">Inactive</option>
                        </Form.Select>
                    </Form.Group>

                    <div className="d-flex justify-content-end gap-2 mt-4">
                        <Button variant="outline-light" onClick={onHide} disabled={loading}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="warning" isLoading={loading}>
                            Save Changes
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default EditUserModal;
