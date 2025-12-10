
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Spinner, Card } from 'react-bootstrap';
import { productService } from '../../services/productService';
import { useToast } from '../../contexts/ToastContext';
import { FaFolder, FaChevronRight } from 'react-icons/fa';

const AdminCategories = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await productService.getCategories();
                setCategories(data);
            } catch (error) {
                console.error("Error fetching categories:", error);
                showToast("Failed to load categories", "error");
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, [showToast]);

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
            <Spinner animation="border" variant="warning" />
        </div>
    );

    return (
        <div className="animate-fade-in text-white">
            <h2 className="mb-4">Manage Categories</h2>

            <Row>
                {categories.map(cat => (
                    <Col md={4} key={cat.id} className="mb-4">
                        <div
                            className="glass-panel p-4 rounded d-flex justify-content-between align-items-center h-100"
                            style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                            onClick={() => navigate(`/admin/categories/${cat.id}`)}
                            onMouseEnter={(e) => e.currentTarget.classList.add('glass-panel-hover')}
                            onMouseLeave={(e) => e.currentTarget.classList.remove('glass-panel-hover')}
                        >
                            <div className="d-flex align-items-center gap-3">
                                <div className="bg-warning bg-opacity-10 p-3 rounded-circle text-auction-primary">
                                    <FaFolder size={24} />
                                </div>
                                <div>
                                    <h5 className="mb-1">{cat.name}</h5>
                                    <small className="text-white-50">{cat.subcategories?.length || 0} Subcategories</small>
                                </div>
                            </div>
                            <FaChevronRight className="text-white-50" />
                        </div>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default AdminCategories;
