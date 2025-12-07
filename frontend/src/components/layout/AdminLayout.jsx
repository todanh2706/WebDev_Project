import React from 'react';
import { Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import AdminNavBar from '../admin/AdminNavBar';

const AdminLayout = () => {
    return (
        <div className="min-vh-100 d-flex flex-column" style={{
            background: 'radial-gradient(circle at top right, #1a2c38 0%, #0f172a 100%)',
            backgroundImage: `
                radial-gradient(circle at top right, #1a2c38 0%, #0f172a 100%),
                url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fbbf24' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
            `
        }}>
            <AdminNavBar />
            <Container fluid className="flex-grow-1 py-4">
                <div className="glass-panel p-4 rounded h-100">
                    <Outlet />
                </div>
            </Container>
        </div>
    );
};

export default AdminLayout;
