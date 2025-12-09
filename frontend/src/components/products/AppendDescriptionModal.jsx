import React, { useState } from 'react';
import { Modal, Form, Spinner } from 'react-bootstrap';
import Button from '../common/Button';
import { Editor } from '@tinymce/tinymce-react';
import { productService } from '../../services/productService';
import { useToast } from '../../contexts/ToastContext';
import { FaPen } from 'react-icons/fa';

const AppendDescriptionModal = ({ show, onHide, product, onSuccess }) => {
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!description.trim()) return;

        setLoading(true);
        try {
            await productService.appendDescription(product.id, description);
            showToast('Description updated successfully', 'success');
            setDescription('');
            onSuccess();
            onHide();
        } catch (error) {
            console.error(error);
            showToast(error.response?.data?.message || 'Failed to update description', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered className="modal-dark-glass">
            <Modal.Header closeButton className="border-secondary">
                <Modal.Title className="text-white">
                    <FaPen className="text-auction-primary me-2" />
                    Update Description
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-4">
                    <h6 className="text-white-50 mb-2">Current Description:</h6>
                    <div
                        className="bg-black bg-opacity-25 p-3 rounded border border-secondary border-opacity-25 text-white"
                        style={{ maxHeight: '200px', overflowY: 'auto' }}
                        dangerouslySetInnerHTML={{ __html: product?.description || 'No description' }}
                    />
                </div>

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label className="text-white">New Information</Form.Label>
                        <div className="rounded overflow-hidden border border-secondary border-opacity-25">
                            <Editor
                                apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                                value={description}
                                onEditorChange={(content) => setDescription(content)}
                                init={{
                                    height: 200,
                                    menubar: false,
                                    skin: "oxide-dark",
                                    content_css: "dark",
                                    plugins: [
                                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                                    ],
                                    toolbar: 'undo redo | blocks | ' +
                                        'bold italic forecolor | alignleft aligncenter ' +
                                        'alignright alignjustify | bullist numlist outdent indent | ' +
                                        'removeformat | help',
                                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px; background-color: #2c2c2c; color: #fff; }' // Slight lighter BG for distinction
                                }}
                            />
                        </div>
                        <Form.Text className="text-white-50">
                            This text will be appended to the existing description with a timestamp.
                        </Form.Text>
                    </Form.Group>

                    <div className="d-flex justify-content-end gap-2">
                        <Button variant="outline-light" onClick={onHide} disabled={loading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading || !description.trim()}>
                            {loading ? <Spinner size="sm" animation="border" /> : 'Append Update'}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AppendDescriptionModal;
