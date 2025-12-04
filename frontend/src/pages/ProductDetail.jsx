import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Image, Badge, Spinner } from 'react-bootstrap';
import Button from '../components/Button';
import { useToast } from '../contexts/ToastContext';
import { FaClock, FaGavel, FaUser, FaTag, FaShieldAlt, FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const { showToast } = useToast();
    const { user } = useAuth();

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/products/${id}`);
                if (!response.ok) throw new Error('Failed to fetch product');
                const data = await response.json();
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

        if (id) {
            fetchProduct();
        }
    }, [id, showToast]);

    const formatTimeLeft = (endTime) => {
        const total = Date.parse(endTime) - Date.parse(new Date());
        if (total <= 0) return 'Ended';
        const days = Math.floor(total / (1000 * 60 * 60 * 24));
        const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
        return `${days}d ${hours}h left`;
    };

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
                        <div className="glass-panel p-3 rounded-4 mb-4">
                            <div className="position-relative rounded-3 overflow-hidden" style={{ height: '500px' }}>
                                <Image
                                    src={selectedImage || 'https://placehold.co/800x600?text=No+Image'}
                                    className="w-100 h-100 object-fit-cover"
                                    alt={product.name}
                                />
                                <div className="position-absolute top-0 end-0 p-3">
                                    <Badge bg="black" className="bg-opacity-75 fs-6 py-2 px-3 rounded-pill border border-secondary border-opacity-25">
                                        <FaClock className="me-2 text-auction-primary" />
                                        {formatTimeLeft(product.end_date)}
                                    </Badge>
                                </div>
                            </div>
                            {product.images && product.images.length > 1 && (
                                <div className="d-flex gap-3 mt-3 overflow-auto pb-2">
                                    {product.images.map((img, idx) => (
                                        <div
                                            key={idx}
                                            className={`cursor-pointer rounded-3 overflow-hidden border ${selectedImage === img.image_url ? 'border-auction-primary' : 'border-transparent'}`}
                                            style={{ width: '100px', height: '100px', minWidth: '100px' }}
                                            onClick={() => setSelectedImage(img.image_url)}
                                        >
                                            <Image
                                                src={img.image_url}
                                                className="w-100 h-100 object-fit-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="glass-panel p-4 rounded-4">
                            <h4 className="text-white fw-bold mb-3">Description</h4>
                            <p className="text-white-50 mb-0" style={{ lineHeight: '1.8' }}>
                                {product.description}
                            </p>
                        </div>
                    </Col>

                    {/* Product Info & Bidding */}
                    <Col lg={5}>
                        <div className="glass-panel p-4 rounded-4 mb-4">
                            <div className="d-flex align-items-center gap-2 mb-3">
                                <Badge bg="warning" text="dark" className="px-3 py-2 rounded-pill fw-bold">
                                    Lot #{product.id}
                                </Badge>
                                {product.category && (
                                    <Badge bg="secondary" className="bg-opacity-50 px-3 py-2 rounded-pill">
                                        <FaTag className="me-2" />
                                        {product.category.name}
                                    </Badge>
                                )}
                            </div>

                            <h1 className="text-white fw-bold mb-2">{product.name}</h1>

                            {product.seller && (
                                <div className="d-flex align-items-center gap-2 mb-4 text-white-50">
                                    <FaUser className="text-auction-primary" />
                                    <span>Seller: <span className="text-white">{product.seller.name}</span></span>
                                    <span className="mx-2">•</span>
                                    <FaShieldAlt className="text-success" />
                                    <span>Verified Seller</span>
                                </div>
                            )}

                            <div className="p-4 rounded-4 bg-black bg-opacity-25 border border-white border-opacity-10 mb-4">
                                <div className="row g-4">
                                    <div className="col-6">
                                        <small className="text-white-50 d-block mb-1 text-uppercase ls-1">Current Price</small>
                                        <span className="h2 text-auction-primary fw-bold mb-0">
                                            ${parseFloat(product.current_price).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="col-6 border-start border-white border-opacity-10 ps-4">
                                        <small className="text-white-50 d-block mb-1 text-uppercase ls-1">Total Bids</small>
                                        <span className="h2 text-white fw-bold mb-0">
                                            {product.bid_count || 0}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="d-grid gap-3">
                                <Button className="py-3 fs-5 fw-bold rounded-pill shadow-lg d-flex align-items-center justify-content-center gap-2">
                                    <FaGavel /> Place Bid
                                </Button>
                                {product.buy_now_price && (
                                    <Button variant="outline-light" className="py-3 fw-bold rounded-pill border-opacity-25">
                                        Buy Now for ${parseFloat(product.buy_now_price).toLocaleString()}
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div className="glass-panel p-4 rounded-4">
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
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default ProductDetail;
