import React, { useState } from 'react';
import { Modal, Form } from 'react-bootstrap';
import { X, ThumbsUp, ThumbsDown } from 'lucide-react';
import Button from './Button';

const FeedbackModal = ({ isOpen, onClose, onSubmit, productName, existingFeedback }) => {
    const [rating, setRating] = useState('good');
    const [comment, setComment] = useState('');

    // Initialize state with existing feedback if available
    React.useEffect(() => {
        if (existingFeedback) {
            setRating(existingFeedback.rating);
            setComment(existingFeedback.comment);
        } else {
            setRating('good');
            setComment('');
        }
    }, [existingFeedback, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (existingFeedback) return; // Prevent submission if already exists
        onSubmit({ rating, comment });
        setRating('good');
        setComment('');
    };

    return (
        <>
            <Modal
                show={isOpen}
                onHide={onClose}
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
                            <span className="text-auction-primary">{existingFeedback ? 'Your Feedback' : 'Rate Seller'}</span>
                        </h4>
                    </div>

                    <Form onSubmit={handleSubmit}>
                        {/* Product Info */}
                        <div className="bg-black bg-opacity-25 p-3 rounded-3 border border-secondary border-opacity-25 mb-4">
                            <small className="text-white-50 d-block mb-1 text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>Assessing seller for</small>
                            <div className="text-white fw-bold fs-5">{productName}</div>
                        </div>

                        {/* Rating Selection */}
                        <div className="mb-4">
                            <label className="text-white-50 mb-2 text-uppercase fw-bold" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>Rating</label>
                            <div className="d-flex gap-3">
                                <div
                                    className={`rating-option flex-grow-1 p-3 rounded-3 d-flex flex-column align-items-center justify-content-center ${rating === 'good' ? 'selected-good' : 'text-white-50'}`}
                                    onClick={() => !existingFeedback && setRating('good')}
                                    style={{ cursor: existingFeedback ? 'default' : 'pointer', opacity: existingFeedback && rating !== 'good' ? 0.5 : 1 }}
                                >
                                    <ThumbsUp size={28} className="mb-2" />
                                    <span className="fw-bold">Good</span>
                                </div>

                                <div
                                    className={`rating-option flex-grow-1 p-3 rounded-3 d-flex flex-column align-items-center justify-content-center ${rating === 'bad' ? 'selected-bad' : 'text-white-50'}`}
                                    onClick={() => !existingFeedback && setRating('bad')}
                                    style={{ cursor: existingFeedback ? 'default' : 'pointer', opacity: existingFeedback && rating !== 'bad' ? 0.5 : 1 }}
                                >
                                    <ThumbsDown size={28} className="mb-2" />
                                    <span className="fw-bold">Bad</span>
                                </div>
                            </div>
                        </div>

                        {/* Comment Input */}
                        <div className="mb-4">
                            <label htmlFor="comment" className="text-white-50 mb-2 text-uppercase fw-bold" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>
                                Comment
                            </label>
                            <Form.Control
                                as="textarea"
                                id="comment"
                                rows={4}
                                className="bg-black bg-opacity-25 border-secondary border-opacity-25 text-white shadow-none feedback-comment-input"
                                placeholder="Share your experience with this seller..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                required
                                disabled={!!existingFeedback}
                                style={{ resize: 'none' }}
                            />
                        </div>

                        {/* Actions */}
                        <div className="d-flex justify-content-end gap-2 pt-2">
                            <Button
                                onClick={onClose}
                                className="bg-transparent border border-secondary border-opacity-50 fw-bold text-danger hover:text-danger hover:bg-white hover:bg-opacity-10"
                            >
                                {existingFeedback ? 'Close' : 'Cancel'}
                            </Button>
                            {!existingFeedback && (
                                <Button
                                    type="submit"
                                    className="btn-auction text-black fw-bold px-4"
                                >
                                    Submit Feedback
                                </Button>
                            )}
                        </div>
                    </Form>
                </div>
            </Modal>
        </>
    );
};

export default FeedbackModal;
