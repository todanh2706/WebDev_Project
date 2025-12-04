import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import ProductCard from '../components/ProductCard';
import { useToast } from '../contexts/ToastContext';

const CategoryProducts = () => {
    const { id } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categoryName, setCategoryName] = useState('Category');
    const { showToast } = useToast();

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // Fetch products by category
                const productsResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/products/category/${id}`);
                if (!productsResponse.ok) throw new Error('Failed to fetch products');
                const productsData = await productsResponse.json();
                setProducts(productsData);

                // Fetch category details
                const categoryResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/categories/${id}`);
                if (categoryResponse.ok) {
                    const categoryData = await categoryResponse.json();
                    setCategoryName(categoryData.name);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                showToast('Failed to load data', 'error');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProducts();
        }
    }, [id, showToast]);

    return (
        <div className="min-vh-100 auction-bg-pattern py-5">
            <Container>
                <div className="glass-panel p-4 mb-5 rounded-4 animate-fade-in mt-5">
                    <h2 className="text-white fw-bold mb-0">
                        <span className="text-auction-primary me-2">Category:</span>
                        {categoryName}
                    </h2>
                    <p className="text-white-50 mb-0 mt-2">
                        Found {products.length} items in this category
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
                        <h3 className="text-white-50">No products found in this category.</h3>
                        <p className="text-white-50">Check back later for new listings!</p>
                    </div>
                )}
            </Container>
        </div>
    );
};

export default CategoryProducts;
