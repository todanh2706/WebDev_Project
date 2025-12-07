import React, { useCallback } from 'react';
import { Pagination, Spinner, Button } from 'react-bootstrap';
import { adminService } from '../../services/adminService';
import { usePaginationData } from '../../hooks/usePaginationData';
import UserTable from '../../components/admin/UserTable';
import { BiUserPlus } from 'react-icons/bi';

const AdminUsers = () => {
    const transformResponse = useCallback((response) => {
        return {
            items: response.users || [],
            pages: response.totalPages || 1
        };
    }, []);

    const fetchUsersWithFallback = useCallback(async (page, limit) => {
        try {
            return await adminService.getAllUsers(page, limit);
        } catch (error) {
            console.warn('Backend endpoint not ready, using mock data');
            return {
                users: [
                    { id: 1, username: 'john_doe', email: 'john@example.com', role: 'USER', status: 'active' },
                    { id: 2, username: 'jane_smith', email: 'jane@example.com', role: 'SELLER', status: 'active' },
                    { id: 3, username: 'admin_user', email: 'admin@example.com', role: 'ADMIN', status: 'active' },
                ],
                totalPages: 1
            };
        }
    }, []);

    const {
        data: users,
        loading,
        page,
        setPage,
        totalPages
    } = usePaginationData(fetchUsersWithFallback, transformResponse, 12);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await adminService.deleteUser(userId);
                fetchData(); // Refresh list
            } catch (error) {
                console.error("Error deleting user:", error);
            }
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
                <h3 className="text-auction-primary m-0">Manage Users</h3>
                <Button variant="outline-warning" className="btn-sm">
                    <BiUserPlus className="me-2" />Add User
                </Button>
            </div>

            {users && users.length > 0 ? (
                <UserTable users={users} onDeleteUser={handleDeleteUser} />
            ) : (
                <p className="text-center">No users found.</p>
            )}

            {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                    <Pagination>
                        <Pagination.First onClick={() => handlePageChange(1)} disabled={page === 1} />
                        <Pagination.Prev onClick={() => handlePageChange(page - 1)} disabled={page === 1} />

                        {[...Array(totalPages)].map((_, idx) => (
                            <Pagination.Item
                                key={idx + 1}
                                active={idx + 1 === page}
                                onClick={() => handlePageChange(idx + 1)}
                            >
                                {idx + 1}
                            </Pagination.Item>
                        ))}

                        <Pagination.Next onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} />
                        <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={page === totalPages} />
                    </Pagination >
                </div >
            )}
        </div >
    );
};

export default AdminUsers;
