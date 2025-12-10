
import React, { useState } from 'react';
import { Modal, Form } from 'react-bootstrap';
import Button from '../common/Button';

const EditCategoryModal = ({ show, onHide, category, onSave }) => {
    const [name, setName] = useState(category?.name || '');
    const [loading, setLoading] = useState(false);

    React.useEffect(() => {
        if (category) {
            setName(category.name);
        }
    }, [category]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSave(category.id, { name });
            onHide();
        } catch (error) {
            console.error("Failed to update category", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered className="modal-dark-glass">
            <Modal.Header className="border-secondary">
                <Modal.Title className="text-white">Edit Category</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label className="text-white">Category Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="bg-dark text-white border-secondary"
                            required
                        />
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

export default EditCategoryModal;
