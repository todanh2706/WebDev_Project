
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Badge, Spinner } from 'react-bootstrap';
import { productService } from '../../services/productService';
import { useToast } from '../../contexts/ToastContext';
import Button from '../../components/common/Button';
import { FaArrowLeft, FaGavel, FaClock, FaTag, FaUser } from 'react-icons/fa';
import { formatDate, formatCurrency } from '../../utils/formatters';

const AdminProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await productService.getProductById(id);
                setProduct(data);
            } catch (error) {
                console.error("Error fetching product:", error);
                showToast("Failed to load product details", "error");
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id, showToast]);

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
            <Spinner animation="border" variant="warning" />
        </div>
    );

    if (!product) return (
        <div className="text-center text-white mt-5">
            <h3>Product not found</h3>
            <Button onClick={() => navigate('/admin/edit/products')}>Back to Products</Button>
        </div>
    );

    return (
        <div className="animate-fade-in text-white">
            <div className="d-flex align-items-center mb-4">
                <Button variant="outline-light" className="me-3" onClick={() => navigate('/admin/edit/products')}>
                    <FaArrowLeft />
                </Button>
                <h2 className="mb-0">Product Details</h2>
            </div>

            <Row>
                <Col lg={8}>
                    <div className="glass-panel p-4 rounded mb-4">
                        <h3 className="text-auction-primary mb-3">{product.name}</h3>

                        <div className="mb-4">
                            {product.images && product.images.length > 0 ? (
                                <img
                                    src={product.images[0].image_url}
                                    alt={product.name}
                                    className="img-fluid rounded border border-light"
                                    style={{ maxHeight: '400px', width: '100%', objectFit: 'cover' }}
                                />
                            ) : (
                                <div className="bg-dark p-5 text-center rounded">No Image</div>
                            )}
                        </div>

                        <h5 className="text-white-50">Description</h5>
                        <div className="mb-4 text-light">
                            {product.description}
                        </div>
                    </div>
                </Col>

                <Col lg={4}>
                    <div className="glass-panel-highlight p-4 rounded mb-4">
                        <h4 className="text-auction-primary mb-3">Info</h4>

                        <div className="mb-3">
                            <small className="text-white-50 d-block">Status</small>
                            <Badge bg={product.status === 'active' ? 'success' : product.status === 'sold' ? 'warning' : 'secondary'}>
                                {product.status.toUpperCase()}
                            </Badge>
                        </div>

                        <div className="mb-3">
                            <small className="text-white-50 d-block">Category</small>
                            <div className="d-flex align-items-center gap-2">
                                <FaTag className="text-auction-primary" />
                                <span>{product.category?.name || 'N/A'}</span>
                            </div>
                        </div>

                        <div className="mb-3">
                            <small className="text-white-50 d-block">Seller</small>
                            <div className="d-flex align-items-center gap-2">
                                <FaUser className="text-auction-primary" />
                                <span>{product.seller?.name || 'Unknown'} (ID: {product.seller?.id})</span>
                            </div>
                        </div>

                        <hr className="border-light" />

                        <div className="mb-3">
                            <small className="text-white-50 d-block">Current Price</small>
                            <span className="fs-4 fw-bold text-success">{formatCurrency(product.current_price)}</span>
                        </div>

                        <div className="mb-3">
                            <small className="text-white-50 d-block">Starting Price</small>
                            <span>{formatCurrency(product.starting_price)}</span>
                        </div>

                        {product.buy_now_price && (
                            <div className="mb-3">
                                <small className="text-white-50 d-block">Buy Now Price</small>
                                <span>{formatCurrency(product.buy_now_price)}</span>
                            </div>
                        )}

                        <hr className="border-light" />

                        <div className="mb-3">
                            <small className="text-white-50 d-block">End Date</small>
                            <div className="d-flex align-items-center gap-2">
                                <FaClock className="text-auction-primary" />
                                <span>{formatDate(product.end_date)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Bids Section could be added here if valid */}
                </Col>
            </Row>
        </div>
    );
};

export default AdminProductDetail;
