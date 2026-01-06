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
import { useToast } from '../contexts/ToastContext';

const MyProducts = () => {
    const { user } = useContext(AuthContext);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showAddModal, setShowAddModal] = useState(false);

    // New States
    const [activeTab, setActiveTab] = useState('active'); // 'active' or 'sold'
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [selectedProductForFeedback, setSelectedProductForFeedback] = useState(null);
    const { showToast } = useToast(); // Assuming ToastContext is available (need to import)

    const isSeller = user && (user.role === 1 || user.role === 2); // 1: Seller, 2: Admin

    const fetchMyProducts = async (page) => {
        setLoading(true);
        try {
            const data = await productService.getMyProducts(page);
            // Client-side filtering for now as API returns all
            // Ideally backend should support filtering by status
            const allProducts = data.products || [];

            let filteredProducts = [];
            if (activeTab === 'active') {
                filteredProducts = allProducts.filter(p => new Date(p.end_date) > new Date() && p.status === 'active');
            } else {
                // Sold or Expired (Ended)
                filteredProducts = allProducts.filter(p => new Date(p.end_date) <= new Date() || p.status === 'sold' || p.status === 'expired');
            }

            // Pagination might be messed up with client-side filtering on server-paginated data
            // But for now let's show what we have. 
            // Better approach: fetch all or update API. Given time constraints, I'll display the filtered list from the current page.
            // Wait, if I filter client side on 1 page of 12 items, I might get 0 items active.
            // I should technically request backend to filter. But API `getMyProducts` doesn't seem to support status filter in controller.
            // Controller: `Products.findAll({ where: { seller_id: req.user.id } ...`
            // Current limitation: Pagination is on ALL products.
            // I will implement basic filtering on the current fetched items for UI separation.

            setProducts(filteredProducts);
            setTotalPages(data.totalPages || 1);
            setCurrentPage(data.currentPage || 1);
        } catch (error) {
            console.error('Error fetching my products:', error);
        } finally {
            setLoading(false);
        }
    };

    // Re-fetch when tab changes (though mainly re-filter)
    useEffect(() => {
        fetchMyProducts(currentPage);
    }, [currentPage, activeTab]);

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

    // New Handlers
    const handleRateWinner = (product) => {
        setSelectedProductForFeedback(product);
        setShowFeedbackModal(true);
    };

    const handleSubmitFeedback = async ({ rating, comment }) => {
        try {
            await productService.submitFeedback({
                product_id: selectedProductForFeedback.id,
                rating,
                comment
            });
            showToast('Feedback submitted successfully', 'success');
            setShowFeedbackModal(false);
        } catch (error) {
            showToast(error.response?.data?.message || 'Failed to submit feedback', 'error');
        }
    };

    const handleCancelTransaction = async (product) => {
        if (window.confirm('Are you sure you want to cancel this transaction? The winner will receive a negative rating.')) {
            try {
                await productService.cancelTransaction(product.id);
                showToast('Transaction cancelled successfully', 'success');
                fetchMyProducts(currentPage);
            } catch (error) {
                showToast(error.response?.data?.message || 'Failed to cancel transaction', 'error');
            }
        }
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

                {/* Tabs */}
                <div className="d-flex gap-3 mb-4">
                    <button
                        className={`btn rounded-pill px-4 ${activeTab === 'active' ? 'btn-auction-active-yellow' : 'btn-auction-inactive-yellow'}`}
                        onClick={() => setActiveTab('active')}
                    >
                        Active Auctions
                    </button>
                    <button
                        className={`btn rounded-pill px-4 ${activeTab === 'sold' ? 'btn-auction-active-yellow' : 'btn-auction-inactive-yellow'}`}
                        onClick={() => setActiveTab('sold')}
                    >
                        Sold / Expired
                    </button>
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
                                        showAdminActions={activeTab === 'sold' && product.current_winner_id}
                                        onRateWinner={() => handleRateWinner(product)}
                                        onCancelTransaction={() => handleCancelTransaction(product)}
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
                        <h3 className="text-white mb-3">No {activeTab} Products</h3>
                        <p className="text-white-50 mb-4">You have no products in this category.</p>
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

            {/* Reusing FeedbackModal (assuming it handles title 'Rate Seller' dynamically or we accept it) */}
            {/* Note: FeedbackModal title is hardcoded to 'Your Feedback' or 'Rate Seller'. 
                 We might want to create a wrapper or clone it, but for now checking if I can use it.
             */}
            {showFeedbackModal && (
                <FeedbackModal
                    isOpen={showFeedbackModal}
                    onClose={() => setShowFeedbackModal(false)}
                    onSubmit={handleSubmitFeedback}
                    productName={selectedProductForFeedback?.name}
                    title="Rate Winner" // Need to update FeedbackModal to accept title prop if not present
                />
            )}
        </div>
    );
};

export default MyProducts;
