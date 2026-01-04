import React, { useState, useEffect } from 'react';
import { Modal, Spinner, Table } from 'react-bootstrap';
import Button from '../common/Button';
import { productService } from '../../services/productService';
import { useToast } from '../../contexts/ToastContext';
import { FaUserSlash, FaUnlock } from 'react-icons/fa';

const BannedListModal = ({ show, onHide, productId }) => {
    const [bannedUsers, setBannedUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [unbanningId, setUnbanningId] = useState(null);
    const { showToast } = useToast();

    const fetchBannedUsers = async () => {
        if (!productId || !show) return;

        setLoading(true);
        try {
            const data = await productService.getBannedBidders(productId);
            setBannedUsers(data || []);
        } catch (error) {
            console.error('Error fetching banned users:', error);
            showToast('Failed to load banned list', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBannedUsers();
    }, [show, productId]);

    const handleUnban = async (userId) => {
        setUnbanningId(userId);
        try {
            await productService.unbanBidder(productId, userId);
            showToast('User unbanned successfully', 'success');
            // Remove from local state
            setBannedUsers(prev => prev.filter(b => b.user.id !== userId));
        } catch (error) {
            console.error('Error unbanning user:', error);
            showToast('Failed to unban user', 'error');
        } finally {
            setUnbanningId(null);
        }
    };

    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
            backdrop="static"
            dialogClassName="modal-dark-glass"
            contentClassName="glass-panel-dark border-0"
        >
            <div className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-4 border-bottom border-secondary border-opacity-25 pb-3">
                    <h4 className="text-white fw-bold m-0 d-flex align-items-center gap-2">
                        <FaUserSlash className="text-danger" />
                        Banned Bidders
                    </h4>
                    <Button variant="link" onClick={onHide} className="text-white-50 text-decoration-none fs-4">&times;</Button>
                </div>

                {loading ? (
                    <div className="d-flex justify-content-center my-4">
                        <Spinner animation="border" variant="warning" />
                    </div>
                ) : bannedUsers.length > 0 ? (
                    <div className="table-responsive">
                        <Table hover className="table-dark-glass align-middle mb-0">
                            <thead>
                                <tr>
                                    <th className="text-white-50">Bidder Name</th>
                                    <th className="text-white-50">Email</th>
                                    <th className="text-end text-white-50">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bannedUsers.map(banned => (
                                    <tr key={banned.user.id}>
                                        <td className="fw-bold">{banned.user.name}</td>
                                        <td className="text-white-50">{banned.user.email}</td>
                                        <td className="text-end">
                                            <Button
                                                className="btn-sm btn-outline-success d-flex align-items-center gap-1 ms-auto"
                                                onClick={() => handleUnban(banned.user.id)}
                                                disabled={unbanningId === banned.user.id}
                                            >
                                                {unbanningId === banned.user.id ? (
                                                    <Spinner animation="border" size="sm" />
                                                ) : (
                                                    <>
                                                        <FaUnlock /> Unban
                                                    </>
                                                )}
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                ) : (
                    <div className="text-center py-4 text-white-50">
                        <FaUserSlash className="display-4 mb-3 opacity-25" />
                        <p className="mb-0">No banned bidders for this product.</p>
                    </div>
                )}
            </div>

            <style>
                {`
                    .table-dark-glass {
                         --bs-table-bg: transparent;
                         --bs-table-color: #fff;
                         --bs-table-hover-bg: rgba(255, 255, 255, 0.05);
                         --bs-table-border-color: rgba(255, 255, 255, 0.1);
                    }
                `}
            </style>
        </Modal>
    );
};

export default BannedListModal;
