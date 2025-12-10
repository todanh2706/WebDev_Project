
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Badge, Spinner, Table } from 'react-bootstrap';
import { productService } from '../../services/productService';
import { useToast } from '../../contexts/ToastContext';
import Button from '../../components/common/Button';
import { FaArrowLeft, FaFolder, FaTag } from 'react-icons/fa';
import { formatDate, formatCurrency } from '../../utils/formatters';

const AdminCategoryDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const data = await productService.getCategoryById(id);
                setCategory(data);
            } catch (error) {
                console.error("Error fetching category:", error);
                showToast("Failed to load category details", "error");
            } finally {
                setLoading(false);
            }
        };
        fetchCategory();
    }, [id, showToast]);

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
            <Spinner animation="border" variant="warning" />
        </div>
    );

    if (!category) return (
        <div className="text-center text-white mt-5">
            <h3>Category not found</h3>
            <Button onClick={() => navigate('/admin/categories')}>Back to Categories</Button>
        </div>
    );

    return (
        <div className="animate-fade-in text-white">
            <div className="d-flex align-items-center mb-4">
                <Button variant="outline-light" className="me-3" onClick={() => navigate('/admin/categories')}>
                    <FaArrowLeft />
                </Button>
                <h2 className="mb-0">Category Details</h2>
            </div>

            <div className="glass-panel p-4 rounded mb-4">
                <div className="d-flex align-items-center gap-3 mb-3">
                    <div className="bg-warning bg-opacity-10 p-3 rounded-circle text-auction-primary">
                        <FaFolder size={30} />
                    </div>
                    <h3 className="mb-0 text-auction-primary">{category.name}</h3>
                </div>
            </div>

            <Row>
                <Col lg={4}>
                    <div className="glass-panel-highlight p-4 rounded mb-4">
                        <h4 className="text-auction-primary mb-3">Subcategories</h4>
                        {category.subcategories && category.subcategories.length > 0 ? (
                            <ul className="list-unstyled">
                                {category.subcategories.map(sub => (
                                    <li key={sub.id} className="mb-2 p-2 border border-secondary rounded bg-dark bg-opacity-25 d-flex align-items-center gap-2">
                                        <FaTag className="text-white-50" />
                                        <span>{sub.name}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-white-50">No subcategories.</p>
                        )}
                    </div>
                </Col>

                <Col lg={8}>
                    <div className="glass-panel p-4 rounded mb-4">
                        <h4 className="text-auction-primary mb-3">Products ({category.products?.length || 0})</h4>
                        {category.products && category.products.length > 0 ? (
                            <Table hover variant="dark" className="bg-transparent mb-0">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Price</th>
                                        <th>Status</th>
                                        <th>End Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {category.products.map(p => (
                                        <tr key={p.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/admin/products/${p.id}`)}>
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    {p.images && p.images.length > 0 && (
                                                        <img src={p.images[0].image_url} alt="" style={{ width: 30, height: 30, objectFit: 'cover', borderRadius: 4 }} />
                                                    )}
                                                    {p.name}
                                                </div>
                                            </td>
                                            <td>{formatCurrency(p.current_price)}</td>
                                            <td><Badge bg={p.status === 'active' ? 'success' : p.status === 'sold' ? 'warning' : 'secondary'}>{p.status}</Badge></td>
                                            <td>{formatDate(p.end_date)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        ) : (
                            <p className="text-white-50">No products directly in this category.</p>
                        )}
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default AdminCategoryDetail;
