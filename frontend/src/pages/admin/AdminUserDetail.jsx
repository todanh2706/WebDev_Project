
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Badge, Spinner, Table } from 'react-bootstrap';
import { adminService } from '../../services/adminService';
import { useToast } from '../../contexts/ToastContext';
import Button from '../../components/common/Button';
import { FaArrowLeft, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaGavel, FaBoxOpen } from 'react-icons/fa';
import { formatDate, formatCurrency } from '../../utils/formatters';
import EditUserModal from '../../components/admin/EditUserModal';

const AdminUserDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await adminService.getUserDetails(id);
                setData(response);
            } catch (error) {
                console.error("Error fetching user:", error);
                showToast("Failed to load user details", "error");
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [id, showToast]);

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
            <Spinner animation="border" variant="warning" />
        </div>
    );

    if (!data || !data.user) return (
        <div className="text-center text-white mt-5">
            <h3>User not found</h3>
            <Button onClick={() => navigate('/admin/edit/users')}>Back to Users</Button>
        </div>
    );


    const { user, stats } = data;


    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            try {
                await adminService.deleteUser(user.id);
                showToast('User deleted successfully', 'success');
                navigate('/admin/edit/users');
            } catch (error) {
                console.error("Error deleting user:", error);
                showToast(error.response?.data?.message || "Failed to delete user", "error");
            }
        }
    };

    const handleUpdate = async (userId, updateData) => {
        try {
            await adminService.updateUser(userId, updateData);
            showToast('User updated successfully', 'success');
            // Refresh data
            const updatedResponse = await adminService.getUserDetails(id);
            setData(updatedResponse);
        } catch (error) {
            console.error("Error updating user:", error);
            showToast(error.response?.data?.message || "Failed to update user", "error");
            throw error; // Re-throw to be caught by modal
        }
    };

    return (
        <div className="animate-fade-in text-white">
            <div className="d-flex align-items-center justify-content-between mb-4">
                <div className="d-flex align-items-center">
                    <Button variant="outline-light" className="me-3" onClick={() => navigate('/admin/edit/users')}>
                        <FaArrowLeft />
                    </Button>
                    <h2 className="mb-0">User Details</h2>
                </div>
                <div className="d-flex gap-2">
                    <Button variant="warning" onClick={() => setShowEditModal(true)}>
                        <FaGavel className="me-2" /> Edit User
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        <FaGavel className="me-2" /> Delete User
                    </Button>
                </div>
            </div>

            <Row>
                <Col lg={4}>
                    <div className="glass-panel-highlight p-4 rounded mb-4">
                        <div className="text-center mb-4">
                            <div className="bg-warning rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '80px', height: '80px' }}>
                                <FaUser size={40} className="text-black" />
                            </div>
                            <h3 className="text-white">{user.name}</h3>
                            <Badge bg={user.role === 1 ? 'warning' : 'info'} text={user.role === 1 ? 'dark' : 'white'} className="me-2">
                                {user.role === 1 ? 'Seller' : user.role === 2 ? 'Admin' : 'Bidder'}
                            </Badge>
                            <Badge bg={user.status === 'active' ? 'success' : 'danger'}>
                                {user.status.toUpperCase()}
                            </Badge>
                        </div>

                        <div className="mb-3">
                            <small className="text-white-50 d-block">Email</small>
                            <div className="d-flex align-items-center gap-2">
                                <FaEnvelope className="text-auction-primary" />
                                <span>{user.email}</span>
                            </div>
                        </div>

                        {user.phone && (
                            <div className="mb-3">
                                <small className="text-white-50 d-block">Phone</small>
                                <div className="d-flex align-items-center gap-2">
                                    <FaPhone className="text-auction-primary" />
                                    <span>{user.phone}</span>
                                </div>
                            </div>
                        )}

                        {user.address && (
                            <div className="mb-3">
                                <small className="text-white-50 d-block">Address</small>
                                <div className="d-flex align-items-center gap-2">
                                    <FaMapMarkerAlt className="text-auction-primary" />
                                    <span>{user.address}</span>
                                </div>
                            </div>
                        )}

                        <div className="mb-3">
                            <small className="text-white-50 d-block">Total Products</small>
                            <div className="d-flex align-items-center gap-2">
                                <FaBoxOpen className="text-auction-primary" />
                                <span>{stats.totalProducts}</span>
                            </div>
                        </div>
                    </div>
                </Col>

                <Col lg={8}>
                    {/* Recent Products */}
                    <div className="glass-panel p-4 rounded mb-4">
                        <h4 className="text-auction-primary mb-3">Recent Products</h4>
                        {user.products && user.products.length > 0 ? (
                            <Table hover variant="dark" className="bg-transparent mb-0">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Price</th>
                                        <th>Status</th>
                                        <th>Created</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {user.products.map(p => (
                                        <tr key={p.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/admin/products/${p.id}`)}>
                                            <td>{p.name}</td>
                                            <td>{formatCurrency(p.current_price)}</td>
                                            <td><Badge bg={p.status === 'active' ? 'success' : 'secondary'}>{p.status}</Badge></td>
                                            <td>{formatDate(p.createdAt)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        ) : (
                            <p className="text-white-50">No products uploaded.</p>
                        )}
                    </div>

                    {/* Recent Bids */}
                    <div className="glass-panel p-4 rounded mb-4">
                        <h4 className="text-auction-primary mb-3">Recent Bids</h4>
                        {user.bids && user.bids.length > 0 ? (
                            <Table hover variant="dark" className="bg-transparent mb-0">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Bid Amount</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {user.bids.map(b => (
                                        <tr key={b.bid_id}>
                                            <td>{b.product?.name || 'Unknown'}</td>
                                            <td>{formatCurrency(b.bid_amount)}</td>
                                            <td>{formatDate(b.bid_time)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        ) : (
                            <p className="text-white-50">No bids placed.</p>
                        )}
                    </div>

                    {/* Recent Reviews (Received) */}
                    <div className="glass-panel p-4 rounded mb-4">
                        <h4 className="text-auction-primary mb-3">Recent Reviews (Received)</h4>
                        {user.target_user_reviews && user.target_user_reviews.length > 0 ? (
                            <div className="d-flex flex-column gap-3">
                                {user.target_user_reviews.map(r => (
                                    <div key={r.id} className="border border-secondary p-3 rounded bg-dark bg-opacity-25">
                                        <div className="d-flex justify-content-between">
                                            <span className="fw-bold text-auction-primary text-decoration-none">
                                                {r.reviewer?.name || 'Unknown User'}
                                            </span>
                                            <small className="text-muted">{formatDate(r.createdAt)}</small>
                                        </div>
                                        <div className="mt-1">
                                            <Badge bg={r.rating === 1 ? 'success' : 'danger'} className="me-2">
                                                {r.rating === 1 ? 'Positive' : 'Negative'}
                                            </Badge>
                                            <span className="text-white-50">{r.comment}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-white-50">No reviews received.</p>
                        )}
                    </div>

                </Col>
            </Row>

            <EditUserModal
                show={showEditModal}
                onHide={() => setShowEditModal(false)}
                user={user}
                onSave={handleUpdate}
            />
        </div>
    );
};

export default AdminUserDetail;
