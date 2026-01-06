import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Badge, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../contexts/ToastContext';
import { orderService } from '../services/orderService';
import { productService } from '../services/productService';
import OrderChat from '../components/orders/OrderChat';
import { FaCheckCircle, FaTruck, FaBoxOpen, FaStar, FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa';

const OrderCompletion = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { showToast } = useToast();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    // Form States
    const [address, setAddress] = useState('');
    const [paymentProof, setPaymentProof] = useState(''); // Text for now
    const [shippingProof, setShippingProof] = useState(''); // Text for now

    // Feedback States
    const [rating, setRating] = useState('good');
    const [comment, setComment] = useState('');
    const [existingFeedback, setExistingFeedback] = useState(null);

    useEffect(() => {
        fetchOrder();
    }, [productId]);

    const fetchOrder = async () => {
        try {
            const data = await orderService.getOrderByProduct(productId);
            setOrder(data);
            if (data.myFeedback) {
                setExistingFeedback(data.myFeedback);
                setRating(data.myFeedback.rating);
                setComment(data.myFeedback.comment);
            }
            if (data.status === 'cancelled') {
                showToast('This order has been cancelled', 'info');
            }
        } catch (error) {
            console.error('Error fetching order:', error);
            showToast('Failed to load order details', 'error');
            navigate('/home'); // Fallback
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStep = async (status) => {
        if (!window.confirm(`Are you sure you want to mark this as ${status}?`)) return;

        setProcessing(true);
        try {
            const data = { status };
            if (status === 'paid') {
                data.shipping_address = address;
                data.payment_receipt = paymentProof;
            } else if (status === 'shipped') {
                data.shipping_receipt = shippingProof;
            }

            const updatedOrder = await orderService.updateOrderStep(order.order_id, data);
            setOrder(updatedOrder);
            showToast(`Order status updated to ${status}`, 'success');
        } catch (error) {
            console.error(error);
            showToast(error.response?.data?.message || 'Failed to update order', 'error');
        } finally {
            setProcessing(false);
        }
    };

    const handleFeedbackSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        try {
            if (existingFeedback) {
                await productService.updateFeedback(existingFeedback.feedback_id, { rating, comment });
                showToast('Feedback updated successfully', 'success');
            } else {
                const res = await productService.submitFeedback({
                    product_id: order.product_id,
                    rating,
                    comment
                });
                setExistingFeedback(res.feedback);
                showToast('Feedback submitted successfully', 'success');
            }
        } catch (error) {
            console.error(error);
            showToast(error.response?.data?.message || 'Failed to submit feedback', 'error');
        } finally {
            setProcessing(false);
        }
    };

    const isWinner = user?.id === order?.winner_id;
    const isSeller = user?.id === order?.seller_id;

    if (loading) {
        return (
            <div className="min-vh-100 auction-bg-pattern d-flex justify-content-center align-items-center">
                <Spinner animation="border" variant="warning" />
            </div>
        );
    }

    if (!order) return null;

    const renderStep = (stepNumber, title, icon, isActive, isCompleted) => {
        let badgeClass = 'bg-secondary text-white-50';
        let textClass = 'text-white-50';

        if (isActive) {
            badgeClass = 'bg-auction-primary text-black shadow-lg'; // Yellow background, black text
            textClass = 'text-white fw-bold';
        } else if (isCompleted) {
            badgeClass = 'bg-success text-white'; // Keep success green for completed checks, or use yellow? User said "blue/white -> yellow/black". Green is usually acceptible for checks, but maybe yellow is better for consistency? 
            // Let's stick to yellow for active, but green for completed is standard. 
            // However, user said "buttons blue/white to yellow/black". 
            // Let's make active step clearly yellow. Completed can stay green or be yellow with check. 
            // Let's use yellow for active, and maybe a dimmer yellow or green for done.
            // Actually, let's keep green for done as it indicates success, but active "Primary" blue MUST go.
        }

        return (
            <div className={`d-flex align-items-center mb-3 ${textClass}`}>
                <Badge className={`rounded-circle me-3 p-0 d-flex align-items-center justify-content-center border-0 ${badgeClass}`} style={{ width: 50, height: 50, fontSize: '1.5rem' }}>
                    {isCompleted ? <FaCheckCircle /> : icon}
                </Badge>
                <div>
                    <div>Step {stepNumber}</div>
                    <div className="fs-5">{title}</div>
                </div>
            </div>
        );
    };

    const renderActionArea = () => {
        if (order.status === 'cancelled') {
            return (
                <Alert variant="danger">
                    <FaExclamationTriangle className="me-2" />
                    This transaction has been cancelled by the seller.
                </Alert>
            );
        }

        if (order.status === 'pending') {
            if (isWinner) {
                return (
                    <div>
                        <h5 className="text-auction-primary fw-bold mb-3">Complete Payment</h5>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label className="text-white-50">Shipping Address</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={address}
                                    onChange={e => setAddress(e.target.value)}
                                    placeholder="Enter your full address"
                                    className="form-control-glass text-white"
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label className="text-white-50">Payment Receipt URL (Proof)</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={paymentProof}
                                    onChange={e => setPaymentProof(e.target.value)}
                                    placeholder="Link to image/screenshot"
                                    className="form-control-glass text-white"
                                />
                            </Form.Group>
                            <Button
                                className="btn-auction w-100"
                                onClick={() => handleUpdateStep('paid')}
                                disabled={!address || !paymentProof || processing}
                            >
                                {processing ? 'Processing...' : 'Confirm Payment'}
                            </Button>
                        </Form>
                    </div>
                );
            } else {
                return <div className="text-white-50 fst-italic">Waiting for buyer to complete payment...</div>;
            }
        }

        if (order.status === 'paid') {
            if (isSeller) {
                return (
                    <div>
                        <h5 className="text-auction-primary fw-bold mb-3">Confirm Shipment</h5>
                        <div className="mb-3 p-3 bg-dark bg-opacity-50 rounded">
                            <small className="text-white-50 d-block mb-1">Shipping To:</small>
                            <div className="text-white">{order.shipping_address}</div>
                        </div>
                        <div className="mb-3 p-3 bg-dark bg-opacity-50 rounded">
                            <small className="text-white-50 d-block mb-1">Payment Proof:</small>
                            <a href={order.payment_receipt} target="_blank" rel="noreferrer" className="text-auction-primary">View Receipt</a>
                        </div>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-white-50">Shipping Receipt URL (Waybill/Tracking)</Form.Label>
                            <Form.Control
                                type="text"
                                value={shippingProof}
                                onChange={e => setShippingProof(e.target.value)}
                                placeholder="Tracking link or image URL"
                                className="form-control-glass text-white"
                            />
                        </Form.Group>
                        <Button
                            className="btn-auction w-100"
                            onClick={() => handleUpdateStep('shipped')}
                            disabled={!shippingProof || processing}
                        >
                            {processing ? 'Processing...' : 'Confirm Shipment'}
                        </Button>
                    </div>
                );
            } else {
                return <div className="text-white-50 fst-italic">Seller is verifying payment and preparing shipment...</div>;
            }
        }

        if (order.status === 'shipped') {
            if (isWinner) {
                return (
                    <div>
                        <h5 className="text-auction-primary fw-bold mb-3">Confirm Receipt</h5>
                        <div className="mb-3 p-3 bg-dark bg-opacity-50 rounded">
                            <small className="text-white-50 d-block mb-1">Shipment Proof:</small>
                            <a href={order.shipping_receipt} target="_blank" rel="noreferrer" className="text-auction-primary">View Shipment Details</a>
                        </div>
                        <Button
                            className="btn-auction w-100"
                            onClick={() => handleUpdateStep('completed')}
                            disabled={processing}
                        >
                            {processing ? 'Processing...' : 'I have received the product'}
                        </Button>
                    </div>
                );
            } else {
                return <div className="text-white-50 fst-italic">Waiting for buyer to confirm receipt...</div>;
            }
        }

        if (order.status === 'completed') {
            return (
                <div>
                    <h5 className="text-success mb-3"><FaCheckCircle className="me-2" />Order Completed</h5>
                    <div className="glass-panel p-3 rounded">
                        <h6 className="text-white mt-2 mb-3">Rate your experience</h6>
                        <Form onSubmit={handleFeedbackSubmit}>
                            <div className="d-flex gap-4 mb-3">
                                <Form.Check
                                    type="radio"
                                    id="rating-good"
                                    label={<span className="text-success fw-bold">Good (+1)</span>}
                                    name="rating"
                                    checked={rating === 'good'}
                                    onChange={() => setRating('good')}
                                />
                                <Form.Check
                                    type="radio"
                                    id="rating-bad"
                                    label={<span className="text-danger fw-bold">Bad (-1)</span>}
                                    name="rating"
                                    checked={rating === 'bad'}
                                    onChange={() => setRating('bad')}
                                />
                            </div>
                            <Form.Group className="mb-3">
                                <Form.Control
                                    as="textarea"
                                    rows={2}
                                    placeholder="Write a short review..."
                                    value={comment}
                                    onChange={e => setComment(e.target.value)}
                                    className="form-control-glass text-white"
                                />
                            </Form.Group>
                            <Button type="submit" variant="outline-warning" disabled={processing}>
                                {existingFeedback ? 'Update Feedback' : 'Submit Feedback'}
                            </Button>
                        </Form>
                    </div>
                </div>
            );
        }
    };

    return (
        <div className="min-vh-100 auction-bg-pattern py-5">
            <Container className="mt-5">
                <Button onClick={() => navigate('/home')} className="mb-4 bg-transparent border-0 text-white-50 d-flex align-items-center gap-2 hover-text-white ps-0">
                    <FaArrowLeft /> Back to Home
                </Button>

                <Row className="g-4">
                    {/* Left Column: Product Info & Steps */}
                    <Col lg={3}>
                        <div className="glass-panel text-white border-0 p-3 mb-4 rounded-4">
                            <div className="d-flex gap-3 align-items-center mb-3">
                                {/* Thumbnail if available logic omitted for brevity, using placeholder or title */}
                                <div className="flex-grow-1">
                                    <h5 className="fw-bold mb-1">{order.product?.name}</h5>
                                    <div className="text-auction-primary fw-bold">${parseFloat(order.product?.current_price).toLocaleString()}</div>
                                </div>
                            </div>
                            <hr className="border-secondary op-25" />
                            <div className="d-flex justify-content-between text-white-50">
                                <span>Winner:</span>
                                <span className="text-auction-primary fw-bold">{order.winner?.name}</span>
                            </div>
                            <div className="d-flex justify-content-between text-white-50">
                                <span>Seller:</span>
                                <span className="text-auction-primary fw-bold">{order.seller?.name}</span>
                            </div>
                        </div>

                        <div className="px-2">
                            {renderStep(1, 'Payment', <FaStar />, ['pending'].includes(order.status), ['paid', 'shipped', 'completed'].includes(order.status))}
                            <div className="border-start border-secondary ms-4 h-25 opacity-25" style={{ height: 30 }}></div>
                            {renderStep(2, 'Shipping', <FaTruck />, order.status === 'paid', ['shipped', 'completed'].includes(order.status))}
                            <div className="border-start border-secondary ms-4 h-25 opacity-25" style={{ height: 30 }}></div>
                            {renderStep(3, 'Receiving', <FaBoxOpen />, order.status === 'shipped', ['completed'].includes(order.status))}
                            <div className="border-start border-secondary ms-4 h-25 opacity-25" style={{ height: 30 }}></div>
                            {renderStep(4, 'Feedback', <FaStar />, order.status === 'completed', false)}
                        </div>
                    </Col>

                    {/* Middle Column: Active Step Action */}
                    <Col lg={5}>
                        <div className="glass-panel text-white border-0 h-100 rounded-4 d-flex flex-column">
                            <div className="bg-transparent border-bottom border-secondary border-opacity-25 py-3 px-3">
                                <div className="d-flex justify-content-between align-items-center">
                                    <h5 className="mb-0 text-auction-primary fw-bold">Current Action</h5>
                                    {isSeller && order.status !== 'completed' && order.status !== 'cancelled' && (
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleUpdateStep('cancelled')}
                                            disabled={processing}
                                        >
                                            Cancel Transaction
                                        </Button>
                                    )}
                                </div>
                            </div>
                            <div className="p-3 flex-grow-1">
                                {renderActionArea()}
                            </div>
                        </div>
                    </Col>

                    {/* Right Column: Chat */}
                    <Col lg={4}>
                        <OrderChat orderId={order.order_id} />
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default OrderCompletion;
