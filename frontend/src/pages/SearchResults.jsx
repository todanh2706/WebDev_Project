import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import ProductCard from '../components/ProductCard';
import { useToast } from '../contexts/ToastContext';

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!query) return;

            setLoading(true);
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/products/search?q=${encodeURIComponent(query)}`);
                if (!response.ok) throw new Error('Failed to fetch search results');
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error('Error searching products:', error);
                showToast('Failed to load search results', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [query, showToast]);

    return (
        <div className="min-vh-100 auction-bg-pattern py-5">
            <Container>
                <div className="glass-panel p-4 mb-5 rounded-4 animate-fade-in mt-5">
                    <h2 className="text-white fw-bold mb-0">
                        <span className="text-auction-primary me-2">Search Results for:</span>
                        "{query}"
                    </h2>
                    <p className="text-white-50 mb-0 mt-2">
                        Found {products.length} items
                    </p>
                </div>

                {loading ? (
                    <div className="d-flex justify-content-center py-5">
                        <Spinner animation="border" variant="warning" />
                    </div>
                ) : products.length > 0 ? (
                    <Row xs={1} md={2} lg={3} xl={4} className="g-4">
                        {products.map(product => (
                            <Col key={product.id}>
                                <ProductCard product={product} />
                            </Col>
                        ))}
                    </Row>
                ) : (
                    <div className="text-center py-5 glass-panel rounded-4">
                        <h3 className="text-white-50">No products found matching "{query}".</h3>
                        <p className="text-white-50">Try checking your spelling or using different keywords.</p>
                    </div>
                )}
            </Container>
        </div>
    );
};

export default SearchResults;
