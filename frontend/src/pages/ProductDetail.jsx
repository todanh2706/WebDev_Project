import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import Button from '../components/common/Button';
import { productService } from '../services/productService';
import { userService } from '../services/userService';
import { useToast } from '../contexts/ToastContext';
import { FaShieldAlt, FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import ImageGallery from '../components/products/ImageGallery';
import ProductInfo from '../components/products/ProductInfo';
import BidModal from '../components/products/BidModal';
import BidHistory from '../components/products/BidHistory';
import CommentSection from '../components/products/CommentSection';
import RejectBidModal from '../components/products/RejectBidModal';
import BannedListModal from '../components/products/BannedListModal';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [showBidModal, setShowBidModal] = useState(false);
    const [bidAmount, setBidAmount] = useState('');
    const [userRatingScore, setUserRatingScore] = useState(null);
    const [isEligible, setIsEligible] = useState(true);
    const [permissionStatus, setPermissionStatus] = useState(null);

    const [placingBid, setPlacingBid] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [bidToReject, setBidToReject] = useState(null);
    const [rejectingBid, setRejectingBid] = useState(false);
    const [showBannedListModal, setShowBannedListModal] = useState(false);
    const { showToast } = useToast();
    const { user } = useAuth();

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const data = await productService.getProductById(id);
                setProduct(data);
                if (data.images && data.images.length > 0) {
                    setSelectedImage(data.images[0].image_url);
                }
            } catch (error) {
                console.error('Error fetching product:', error);
                showToast('Failed to load product details', 'error');
            } finally {
                setLoading(false);
            }
        };

        const fetchUserEligibility = async () => {
            if (user) {
                try {
                    const ratings = await userService.getRatings();
                    const totalRatings = ratings.length;

                    let score = 100;
                    if (totalRatings > 0) {
                        const goodRatings = ratings.filter(r => r.rating === 'good').length;
                        score = (goodRatings / totalRatings) * 100;
                    }
                    setUserRatingScore(score);

                    // Rule: Eligible if totalRatings >= 5 AND score >= 80
                    const eligible = totalRatings >= 5 && score >= 80;
                    setIsEligible(eligible);

                    if (!eligible) {
                        const permission = await productService.checkBidPermission(id);
                        setPermissionStatus(permission.status);
                    }
                } catch (error) {
                    console.error('Error fetching eligibility:', error);
                }
            }
        };

        fetchProduct();
        fetchUserEligibility();
    }, [id, showToast, user]);

    const handlePlaceBidClick = () => {
        if (!user) {
            showToast('Please login to place a bid', 'warning');
            navigate('/login');
            return;
        }

        if (!isEligible && permissionStatus !== 'approved') {
            showToast('You are not eligible to bid on this product.', 'error');
            return;
        }

        setBidAmount('');
        setShowBidModal(true);
    };

    const handleRequestPermission = async () => {
        try {
            await productService.requestBidPermission(id);
            setPermissionStatus('pending');
            showToast('Permission request sent successfully', 'success');
        } catch (error) {
            showToast(error.response?.data?.message || 'Failed to send request', 'error');
        }
    };

    const handleBidSuccess = (newAmount) => {
        setProduct(prev => ({
            ...prev,
            current_price: newAmount,
            current_winner_id: user.id
        }));
        showToast('Bid placed successfully!', 'success');
    };

    const handleRejectConfirm = async () => {
        if (!bidToReject) return;

        setRejectingBid(true);
        try {
            await productService.rejectBid(product.id, bidToReject);
            showToast('Bid rejected successfully', 'success');

            // Refresh product data
            const updatedProduct = await productService.getProductById(id);
            setProduct(updatedProduct);

            setShowRejectModal(false);
            setBidToReject(null);
        } catch (error) {
            showToast('Failed to reject bid', 'error');
        } finally {
            setRejectingBid(false);
        }
    };

    const handleBidSubmit = async (e) => {
        e.preventDefault();
        if (!bidAmount || isNaN(bidAmount) || parseFloat(bidAmount) <= parseFloat(product.current_price)) {
            showToast('Bid amount must be greater than current price', 'error');
            return;
        }

        setPlacingBid(true);
        try {
            await productService.placeBid(product.id, parseFloat(bidAmount));
            showToast('Bid placed successfully!', 'success');
            setShowBidModal(false);
            // Refresh product data
            const updatedProduct = await productService.getProductById(id);
            setProduct(updatedProduct);
        } catch (error) {
            showToast(error.response?.data?.message || 'Failed to place bid', 'error');
        } finally {
            setPlacingBid(false);
        }
    };

    useEffect(() => {
        if (product && user) {
            const isEnded = new Date(product.end_date) < new Date();
            // Redirect Winner or Seller to Order Completion logic
            // Note: We check if status implies end or date is passed
            if (isEnded || product.status === 'sold' || product.status === 'completed') {
                if (product.current_winner_id === user.id || product.seller_id === user.id) {
                    navigate(`/order-completion/${product.id}`);
                }
            }
        }
    }, [product, user, navigate]);

    if (loading) {
        return (
            <div className="min-vh-100 auction-bg-pattern d-flex justify-content-center align-items-center">
                <Spinner animation="border" variant="warning" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-vh-100 auction-bg-pattern d-flex justify-content-center align-items-center">
                <div className="glass-panel p-5 rounded-4 text-center">
                    <h2 className="text-white mb-3">Product Not Found</h2>
                    <Link to="/home">
                        <Button className="rounded-pill px-4">Return Home</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const isEnded = new Date(product.end_date) < new Date();

    return (
        <div className="min-vh-100 auction-bg-pattern py-5">
            <Container className="mt-5">
                <Button
                    onClick={() => navigate(-1)}
                    className="mb-4 rounded-pill px-4 d-flex align-items-center gap-2 bg-transparent border-secondary border-opacity-25 text-white-50 hover-text-white"
                >
                    <FaArrowLeft /> Go Back
                </Button>
                <Row className="g-5">
                    {/* Image Gallery */}
                    <Col lg={7}>
                        <ImageGallery
                            images={product.images}
                            selectedImage={selectedImage}
                            setSelectedImage={setSelectedImage}
                            productName={product.name}
                            endDate={product.end_date}
                        />

                        <div className="glass-panel p-4 rounded-4 mt-4">
                            <h4 className="text-white fw-bold mb-3">Description</h4>
                            <div
                                className="text-white-50 mb-0 description-container"
                                dangerouslySetInnerHTML={{ __html: product.description }}
                            />
                        </div>

                        {/* Bid History Panel */}
                        <BidHistory
                            productId={product.id}
                            isSeller={user && user.id === product.seller_id}
                            isAuctionActive={product.status === 'active' && !isEnded}
                            onRejectBid={(bidId) => {
                                setBidToReject(bidId);
                                setShowRejectModal(true);
                            }}
                            refreshTrigger={product}
                        />
                    </Col>

                    {/* Product Info & Bidding */}
                    <Col lg={5}>
                        {isEnded ? (
                            <div className="glass-panel p-4 rounded-4 text-center mb-4">
                                <h2 className="text-danger fw-bold mb-3">PRODUCT HAS ENDED</h2>
                                <p className="text-white-50">This auction has concluded.</p>
                                {product.current_winner ? (
                                    <div className="text-success fs-5">
                                        Winner: <span className="fw-bold">{product.current_winner.name}</span>
                                    </div>
                                ) : (
                                    <div className="text-white-50">No winner declared.</div>
                                )}
                            </div>
                        ) : (
                            <ProductInfo
                                product={product}
                                onPlaceBid={handlePlaceBidClick}
                                isEligible={isEligible}
                                permissionStatus={permissionStatus}
                                onRequestPermission={handleRequestPermission}
                                isOwner={user && user.id === product.seller_id}
                                onShowBannedList={() => setShowBannedListModal(true)}
                            />
                        )}

                        <div className="glass-panel p-4 rounded-4 mt-4">
                            <h5 className="text-white fw-bold mb-3">Bidding Safety</h5>
                            <ul className="list-unstyled text-white-50 mb-0 d-flex flex-column gap-2">
                                <li className="d-flex align-items-center gap-2">
                                    <FaShieldAlt className="text-auction-primary" />
                                    All sellers are identity verified
                                </li>
                                <li className="d-flex align-items-center gap-2">
                                    <FaShieldAlt className="text-auction-primary" />
                                    Secure payment processing
                                </li>
                                <li className="d-flex align-items-center gap-2">
                                    <FaShieldAlt className="text-auction-primary" />
                                    Buyer protection guarantee
                                </li>
                            </ul>
                        </div>

                        {/* Comment Section */}
                        <CommentSection productId={product.id} />
                    </Col>
                </Row>
            </Container>

            {/* Bid Modal */}
            <BidModal
                show={showBidModal}
                onHide={() => setShowBidModal(false)}
                product={product}
                onSubmit={handleBidSubmit}
                bidAmount={bidAmount}
                setBidAmount={setBidAmount}
                placingBid={placingBid}
            />

            <RejectBidModal
                show={showRejectModal}
                onHide={() => setShowRejectModal(false)}
                onConfirm={handleRejectConfirm}
                loading={rejectingBid}
            />

            <BannedListModal
                show={showBannedListModal}
                onHide={() => setShowBannedListModal(false)}
                productId={product?.id}
            />
        </div>
    );
};


export default ProductDetail;
