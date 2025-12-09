import React, { useState, useEffect } from 'react';
import { Form, Spinner } from 'react-bootstrap';
import { productService } from '../../services/productService';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../contexts/ToastContext';
import Button from '../common/Button';
import { FaComments, FaPaperPlane, FaUserCircle, FaReply } from 'react-icons/fa';
import { formatDate } from '../../utils/formatters';

const CommentItem = ({ comment, onReply, replyingTo, onSubmitReply, submitting }) => {
    const [replyContent, setReplyContent] = useState('');

    const handleReplySubmit = (e) => {
        e.preventDefault();
        onSubmitReply(comment.id, replyContent);
        setReplyContent('');
    };

    return (
        <>
            <div className="comment-item p-3 mb-3 rounded-3 animate-fade-in">
                {/* Header: User Info & Reply Button */}
                <div className="d-flex justify-content-between align-items-start mb-2">
                    <div className="d-flex align-items-center gap-2">
                        <FaUserCircle className="text-secondary fs-4" />
                        <div>
                            <span className="text-white fw-bold d-block lh-1">{comment.user?.name || 'Unknown User'}</span>
                            <small className="text-white-50 comment-time">{formatDate(comment.createdAt)}</small>
                        </div>
                    </div>
                    {/* Reply Button Logic */}
                    <Button
                        variant="link"
                        className="ps-1 pe-1 text-decoration-none hover-text-warning d-flex align-items-center gap-1 comment-reply-btn"
                        onClick={() => onReply(comment.id)}
                    >
                        <FaReply /> Reply
                    </Button>
                </div>

                {/* Comment Content */}
                <div className="text-white-50 ps-1 comment-content">
                    {comment.content}
                </div>

                {/* Reply Input */}
                {replyingTo === comment.id && (
                    <div className="mt-3 animate-fade-in">
                        <Form onSubmit={handleReplySubmit}>
                            <Form.Group className="position-relative">
                                <Form.Control
                                    as="textarea"
                                    rows={2}
                                    placeholder={`Replying to ${comment.user?.name}...`}
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                    className="comment-input-glass"
                                    autoFocus
                                    disabled={submitting}
                                />
                                <div className="d-flex justify-content-end gap-2 mt-2">
                                    <Button
                                        variant="outline-light"
                                        size="sm"
                                        className="btn-sm rounded-pill px-3 border-opacity-25"
                                        onClick={() => onReply(null)} // Cancel reply
                                        disabled={submitting}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={submitting || !replyContent.trim()}
                                        className="btn-sm rounded-pill px-3 d-flex align-items-center gap-2"
                                    >
                                        {submitting ? <Spinner size="sm" /> : <FaPaperPlane />}
                                        Reply
                                    </Button>
                                </div>
                            </Form.Group>
                        </Form>
                    </div>
                )}
            </div>

            {/* Nested Replies - Rendered OUTSIDE the parent card */}
            {comment.replies && comment.replies.length > 0 && (
                <div className="ms-5">
                    {comment.replies.map(reply => (
                        <CommentItem
                            key={reply.id}
                            comment={reply}
                            onReply={onReply}
                            replyingTo={replyingTo}
                            onSubmitReply={onSubmitReply}
                            submitting={submitting}
                        />
                    ))}
                </div>
            )}
        </>
    );
};

const CommentSection = ({ productId }) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [replyingTo, setReplyingTo] = useState(null); // ID of comment being replied to
    const { user } = useAuth();
    const { showToast } = useToast();

    useEffect(() => {
        fetchComments();
    }, [productId]);

    const fetchComments = async () => {
        try {
            const data = await productService.getComments(productId);
            // Build tree
            const tree = buildCommentTree(data);
            setComments(tree);
        } catch (error) {
            console.error('Error fetching comments:', error);
        } finally {
            setLoading(false);
        }
    };

    const buildCommentTree = (flatComments) => {
        const commentMap = {};
        const roots = [];

        // Sort by date ASC (Oldest first) generally for discussions, or Newest for top level. 
        // Let's sort flat list first by createdAt ASC so replies appear in order.
        flatComments.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

        flatComments.forEach(comment => {
            comment.replies = [];
            commentMap[comment.id] = comment;
        });

        flatComments.forEach(comment => {
            if (comment.parent_id) {
                if (commentMap[comment.parent_id]) {
                    commentMap[comment.parent_id].replies.push(comment);
                }
            } else {
                roots.push(comment);
            }
        });

        // For top level root comments, usually newest first is better for "New Activity".
        // Replies are usually oldest first (chronological).
        roots.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        return roots;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        submitComment(newComment);
    };

    const submitComment = async (content, parentId = null) => {
        if (!user) {
            showToast('Please login to participate', 'warning');
            return;
        }

        setSubmitting(true);
        try {
            await productService.addComment(productId, content, parentId);
            await fetchComments(); // Re-fetch to rebuild tree cleanly
            setNewComment('');
            setReplyingTo(null);
            showToast('Comment posted successfully', 'success');
        } catch (error) {
            showToast('Failed to post comment', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="glass-panel p-4 rounded-4 mt-4">
            <h5 className="text-white fw-bold mb-4 d-flex align-items-center gap-2">
                <FaComments className="text-auction-primary" />
                Discussion
            </h5>

            {/* Main Comment Input */}
            {user ? (
                <Form onSubmit={handleSubmit} className="mb-4">
                    <Form.Group className="position-relative">
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Ask a question or share your thoughts..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="comment-input-glass"
                            disabled={submitting}
                        />
                        <Button
                            type="submit"
                            disabled={submitting || !newComment.trim()}
                            className="position-absolute bottom-0 end-0 m-2 btn-sm rounded-pill px-3 d-flex align-items-center gap-2 post-button-overlay"
                        >
                            {submitting ? <Spinner size="sm" /> : <FaPaperPlane />}
                            Post
                        </Button>
                    </Form.Group>
                </Form>
            ) : (
                <div className="p-3 mb-4 rounded border border-secondary border-opacity-25 bg-black bg-opacity-25 text-center">
                    <p className="text-white-50 mb-0">Please <span className="text-auction-primary fw-bold">login</span> to join the discussion.</p>
                </div>
            )}

            {/* Comments List */}
            {loading ? (
                <div className="text-center py-4">
                    <Spinner variant="warning" size="sm" />
                </div>
            ) : comments.length > 0 ? (
                <div className="comment-list">
                    {comments.map((comment) => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            onReply={setReplyingTo}
                            replyingTo={replyingTo}
                            onSubmitReply={(parentId, content) => submitComment(content, parentId)}
                            submitting={submitting}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-4 text-white-50 fst-italic">
                    No comments yet. Be the first to start the conversation!
                </div>
            )}
        </div>
    );
};

export default CommentSection;
