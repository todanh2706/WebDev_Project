import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/authContext';
import { Container, Row, Col, Spinner, Badge, Alert } from 'react-bootstrap';
import { productService } from '../services/productService';
import ProductCard from '../components/products/ProductCard';
import Pagination from '../components/common/Pagination';
import { FaBoxOpen, FaPlus } from 'react-icons/fa';
import Button from '../components/common/Button';
import AddProductModal from '../components/products/AddProductModal';
import AppendDescriptionModal from '../components/products/AppendDescriptionModal';

const MyProducts = () => {
    const { user } = useContext(AuthContext);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showAddModal, setShowAddModal] = useState(false);

    const isSeller = user && (user.role === 1 || user.role === 2); // 1: Seller, 2: Admin

    const fetchMyProducts = async (page) => {
        setLoading(true);
        try {
            const data = await productService.getMyProducts(page);
            setProducts(data.products || []);
            setTotalPages(data.totalPages || 1);
            setCurrentPage(data.currentPage || 1);
        } catch (error) {
            console.error('Error fetching my products:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyProducts(currentPage);
    }, [currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleProductAdded = () => {
        fetchMyProducts(currentPage); // Refresh list
    };

    const [showUpdateDescModal, setShowUpdateDescModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const handleUpdateDescription = (product) => {
        setSelectedProduct(product);
        setShowUpdateDescModal(true);
    };

    return (
        <div className="min-vh-100 auction-bg-pattern py-5">
            <Container className="mt-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="text-white fw-bold m-0 d-flex align-items-center gap-3">
                        <FaBoxOpen className="text-auction-primary" />
                        My Products
                    </h2>
                    {isSeller && (
                        <Button
                            onClick={() => setShowAddModal(true)}
                            className="py-2 px-4 rounded-pill fs-6 d-flex align-items-center gap-2"
                        >
                            <FaPlus /> Add Product
                        </Button>
                    )}
                </div>

                {loading ? (
                    <div className="d-flex justify-content-center my-5">
                        <Spinner animation="border" variant="warning" />
                    </div>
                ) : products.length > 0 ? (
                    <>
                        <Row xs={1} md={2} lg={3} className="g-4 mb-5">
                            {products.map(product => (
                                <Col key={product.id}>
                                    <ProductCard
                                        product={product}
                                        isOwner={true}
                                        onUpdateDescription={handleUpdateDescription}
                                    />
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
                    <div className="glass-panel p-5 rounded-4 text-center">
                        <FaBoxOpen className="text-white-50 display-1 mb-3" />
                        <h3 className="text-white mb-3">No Products Listed</h3>
                        <p className="text-white-50 mb-4">You haven't listed any products for auction yet.</p>
                    </div>
                )}
            </Container>

            <AddProductModal
                show={showAddModal}
                onHide={() => setShowAddModal(false)}
                onProductAdded={handleProductAdded}
            />

            <AppendDescriptionModal
                show={showUpdateDescModal}
                onHide={() => setShowUpdateDescModal(false)}
                product={selectedProduct}
                onSuccess={handleProductAdded}
            />
        </div>
    );
};

export default MyProducts;
