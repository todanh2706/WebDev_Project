import { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Form } from 'react-bootstrap';
import ProductCard from '../components/ProductCard';
import { useToast } from '../contexts/ToastContext';
import Pagination from '../components/Pagination';

const AllProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortBy, setSortBy] = useState('default');
    const { showToast } = useToast();

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/products?page=${currentPage}&limit=12&sort=${sortBy}`);
                if (!response.ok) throw new Error('Failed to fetch products');
                const data = await response.json();

                if (Array.isArray(data)) {
                    setProducts(data);
                    setTotalPages(1);
                } else {
                    setProducts(data.products);
                    setTotalPages(data.totalPages);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
                showToast('Failed to load products', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [currentPage, sortBy, showToast]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-vh-100 auction-bg-pattern py-5">
            <Container>
                <div className="glass-panel p-4 mb-5 rounded-4 animate-fade-in mt-5 d-flex justify-content-between align-items-center flex-wrap gap-3">
                    <div>
                        <h2 className="text-white fw-bold mb-0">
                            <span className="text-auction-primary me-2">All Products</span>
                        </h2>
                        <p className="text-white-50 mb-0 mt-2">
                            Found {products.length} items on this page
                        </p>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                        <span className="text-white-50">Sort by:</span>
                        <Form.Select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-black text-white border-secondary"
                            style={{ width: 'auto', minWidth: '200px' }}
                        >
                            <option value="default">Newest First</option>
                            <option value="price_asc">Price: Low to High</option>
                            <option value="time_desc">End Date: Furthest First</option>
                        </Form.Select>
                    </div>
                </div>

                {loading ? (
                    <div className="d-flex justify-content-center py-5">
                        <Spinner animation="border" variant="warning" />
                    </div>
                ) : products.length > 0 ? (
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
                ) : (
                    <div className="text-center py-5 glass-panel rounded-4">
                        <h3 className="text-white-50">No products found.</h3>
                        <p className="text-white-50">Check back later for new listings!</p>
                    </div>
                )}
            </Container>
        </div>
    );
};

export default AllProducts;
