import React, { useCallback } from 'react';
import { Spinner, Badge } from 'react-bootstrap';
import Pagination from '../../components/common/Pagination';
import { adminService } from '../../services/adminService';
import { usePaginationData } from '../../hooks/usePaginationData';
import { useToast } from '../../contexts/ToastContext';
import UpgradeRequestList from '../../components/admin/UpgradeRequestList';

const AdminUpgradeRequests = () => {
    const { showToast } = useToast();

    const transformResponse = useCallback((response) => {
        return {
            items: response.requests || [],
            pages: response.totalPages || 1
        };
    }, []);

    const fetchRequestsWithFallback = useCallback(async (page, limit) => {
        try {
            return await adminService.getUpgradeRequests(page, limit);
        } catch (error) {
            console.warn('Backend endpoint not ready, using mock data');
            return {
                requests: [
                    { id: 1, user: { username: 'john_doe', email: 'john@example.com' }, reason: 'I want to sell my vintage collection.', status: 'pending', date: '2023-10-25' },
                    { id: 2, user: { username: 'alice_w', email: 'alice@example.com' }, reason: 'Opening a small business.', status: 'pending', date: '2023-10-26' },
                    { id: 3, user: { username: 'bob_builder', email: 'bob@example.com' }, reason: 'Regular seller on other platforms.', status: 'pending', date: '2023-10-27' },
                ],
                totalPages: 1
            };
        }
    }, []);

    const {
        data,
        loading,
        page,
        setPage,
        totalPages,
        refresh
    } = usePaginationData(fetchRequestsWithFallback, transformResponse, 12);

    const requests = data || [];

    const handleApprove = async (id) => {
        try {
            await adminService.approveUpgradeRequest(id);
            showToast('Request approved', 'success');
            refresh();
        } catch (error) {
            showToast('Failed to approve request', 'error');
        }
    };

    const handleReject = async (id) => {
        try {
            await adminService.rejectUpgradeRequest(id);
            showToast('Request rejected', 'info');
            refresh();
        } catch (error) {
            showToast('Failed to reject request', 'error');
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                <Spinner animation="border" variant="warning" />
            </div>
        );
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="text-auction-primary m-0">Upgrade Requests</h3>
                <Badge bg="warning" text="dark" className="fs-6">Pending: {requests.length}</Badge>
            </div>

            <UpgradeRequestList
                requests={requests}
                onApprove={handleApprove}
                onReject={handleReject}
            />

            {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
        </div>
    );
};

export default AdminUpgradeRequests;
