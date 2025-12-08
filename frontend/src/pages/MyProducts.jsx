import { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaPlus, FaBoxOpen } from 'react-icons/fa';
import { productService } from '../services/productService';
import ProductCard from '../components/products/ProductCard';
import { useToast } from '../contexts/ToastContext';
import Pagination from '../components/common/Pagination';

const MyProducts = () => {
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const { showToast } = useToast();

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const data = await productService.getMyProducts(currentPage);
                setProducts(data.products || []);
                setTotalPages(data.totalPages || 1);
            } catch (error) {
                console.error('Error fetching my products:', error);
                showToast('Failed to load your products', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [currentPage, showToast]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) {
        return (
            <div className="min-vh-100 d-flex justify-content-center align-items-center auction-bg-pattern">
                <Spinner animation="border" variant="warning" />
            </div>
        );
    }

    return (
        <div className="min-vh-100 auction-bg-pattern py-5">
            <Container className="mt-5">
                <div className="glass-panel p-4 rounded-4 animate-fade-in">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="text-white fw-bold m-0">
                            <span className="text-auction-primary me-2">My Products</span>
                        </h2>
                        <Link to="/products/new" className="text-decoration-none">
                            <Button variant="warning" className="fw-bold d-flex align-items-center gap-2">
                                <FaPlus /> Add Product
                            </Button>
                        </Link>
                    </div>

                    {products.length === 0 ? (
                        <div className="text-center py-5">
                            <div className="mb-4 text-white-50">
                                <FaBoxOpen size={64} />
                            </div>
                            <h4 className="text-white mb-3">No Products Yet</h4>
                            <p className="text-white-50 mb-4">
                                You haven't listed any products for auction yet.
                                Start selling today!
                            </p>
                            <Link to="/products/new" className="text-decoration-none">
                                <Button variant="outline-warning" className="px-4">
                                    Create Your First Listing
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <>
                            <Row xs={1} md={2} lg={3} xl={4} className="g-4">
                                {products.map(product => (
                                    <Col key={product.id}>
                                        <ProductCard product={product} />
                                    </Col>
                                ))}
                            </Row>

                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </>
                    )}
                </div>
            </Container>
        </div>
    );
};

export default MyProducts;
