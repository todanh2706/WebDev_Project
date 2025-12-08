import React from 'react';
import { Modal, Form, Spinner } from 'react-bootstrap';
import Button from '../common/Button';
import { Editor } from '@tinymce/tinymce-react';
import { FaTag, FaDollarSign, FaImage } from 'react-icons/fa';
import useAddProductForm from '../../hooks/useAddProductForm';

const AddProductModal = ({ show, onHide, onProductAdded }) => {
    const {
        formData,
        categories,
        loading,
        images,
        imagePreviews,
        editorRef,
        handleChange,
        handleEditorChange,
        handleImageChange,
        removeImage,
        handleSubmit
    } = useAddProductForm(show, onProductAdded, onHide);

    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            centered
            backdrop="static"
            dialogClassName="modal-dark-glass"
            contentClassName="glass-panel-dark border-0"
        >
            <div className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-4 border-bottom border-secondary border-opacity-25 pb-3">
                    <h4 className="text-white fw-bold m-0">Add New Product</h4>
                    <Button variant="link" onClick={onHide} className="text-white-50 text-decoration-none fs-4">&times;</Button>
                </div>

                <Form onSubmit={handleSubmit}>
                    <div className="row g-3">
                        {/* Name */}
                        <div className="col-12">
                            <Form.Group>
                                <Form.Label className="text-auction-primary">Product Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="form-control-glass"
                                    placeholder="Enter product name..."
                                    required
                                />
                            </Form.Group>
                        </div>

                        {/* Category */}
                        <div className="col-md-6">
                            <Form.Group>
                                <Form.Label className="text-auction-primary"><FaTag className="me-2" />Category</Form.Label>
                                <Form.Select
                                    name="category_id"
                                    value={formData.category_id}
                                    onChange={handleChange}
                                    className="form-select-glass"
                                    required
                                >
                                    <option value="">Select Category...</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </div>

                        {/* Prices */}
                        <div className="col-md-6">
                            <Form.Group>
                                <Form.Label className="text-auction-primary"><FaDollarSign className="me-2" />Starting Price</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="starting_price"
                                    value={formData.starting_price}
                                    onChange={handleChange}
                                    className="form-control-glass no-spinners"
                                    min="0"
                                    required
                                />
                            </Form.Group>
                        </div>

                        <div className="col-md-6">
                            <Form.Group>
                                <Form.Label className="text-auction-primary"><FaDollarSign className="me-2" />Step Price</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="step_price"
                                    value={formData.step_price}
                                    onChange={handleChange}
                                    className="form-control-glass no-spinners"
                                    min="0"
                                    required
                                />
                            </Form.Group>
                        </div>

                        <div className="col-md-6">
                            <Form.Group>
                                <Form.Label className="text-auction-primary"><FaDollarSign className="me-2" />Buy Now Price (Optional)</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="buy_now_price"
                                    value={formData.buy_now_price}
                                    onChange={handleChange}
                                    className="form-control-glass no-spinners"
                                    min="0"
                                />
                            </Form.Group>
                        </div>

                        {/* Images */}
                        <div className="col-12">
                            <Form.Group>
                                <Form.Label className="text-auction-primary"><FaImage className="me-2" />Photos (Min 3)</Form.Label>
                                <Form.Control
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="form-control-glass"
                                />
                                <div className="mt-2 d-flex gap-2 overflow-auto" style={{ maxHeight: '100px' }}>
                                    {imagePreviews.map((src, index) => (
                                        <div key={index} className="position-relative">
                                            <img src={src} alt={`preview-${index}`} style={{ height: '80px', borderRadius: '8px' }} />
                                            <button
                                                type="button"
                                                className="btn btn-danger btn-sm position-absolute top-0 end-0 p-0 rounded-circle"
                                                style={{ width: '20px', height: '20px', lineHeight: '1' }}
                                                onClick={() => removeImage(index)}
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </Form.Group>
                        </div>

                        {/* Description (TinyMCE) */}
                        <div className="col-12">
                            <Form.Group>
                                <Form.Label className="text-auction-primary">Description</Form.Label>
                                <div className="bg-white rounded text-dark overflow-hidden">
                                    <Editor
                                        apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                                        onInit={(evt, editor) => editorRef.current = editor}
                                        value={formData.description}
                                        onEditorChange={handleEditorChange}
                                        init={{
                                            height: 200,
                                            menubar: false,
                                            plugins: [
                                                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                                'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                                            ],
                                            toolbar: 'undo redo | blocks | ' +
                                                'bold italic forecolor | alignleft aligncenter ' +
                                                'alignright alignjustify | bullist numlist outdent indent | ' +
                                                'removeformat | help',
                                            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                                        }}
                                    />
                                </div>
                            </Form.Group>
                        </div>

                        {/* Auto Extend */}
                        <div className="col-12 mt-5">
                            <Form.Check
                                type="switch"
                                id="auto-extend-switch"
                                label="Auto Extend Auction (if bid in last 5 mins)"
                                name="is_auto_extend"
                                checked={formData.is_auto_extend}
                                onChange={handleChange}
                                className="text-white"
                            />
                        </div>
                    </div>

                    <div className="d-flex justify-content-end gap-3 mt-4">
                        <Button variant="outline-light" onClick={onHide} disabled={loading}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" disabled={loading}>
                            {loading ? <Spinner size="sm" animation="border" className="me-2" /> : null}
                            Create Product
                        </Button>
                    </div>
                </Form>
            </div>
        </Modal>
    );
};

export default AddProductModal;
