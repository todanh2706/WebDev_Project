import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FaSignOutAlt, FaUserCircle } from 'react-icons/fa';

const AdminNavBar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname.includes(path);

    return (
        <Navbar expand="lg" className="navbar-auction sticky-top" variant="dark">
            <Container>
                <Navbar.Brand as={Link} to="/admin/edit/products" className="d-flex align-items-center gap-2">
                    <img
                        alt="Online Auction Logo"
                        src="/OA_logo.png"
                        width="32"
                        height="32"
                        className="d-inline-block align-top"
                    />
                    <span className="fw-bold text-auction-primary tracking-wider">Admin Portal</span>
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="admin-navbar-nav" className="border-0 text-auction-primary" />

                <Navbar.Collapse id="admin-navbar-nav">
                    <Nav className="me-auto ms-3 gap-3">
                        <Nav.Link
                            as={Link}
                            to="/admin/edit/products"
                            className={`nav-link-auction ${isActive('/admin/edit/products') ? 'active' : ''}`}
                        >
                            Products
                        </Nav.Link>
                        <Nav.Link
                            as={Link}
                            to="/admin/edit/users"
                            className={`nav-link-auction ${isActive('/admin/edit/users') ? 'active' : ''}`}
                        >
                            Users
                        </Nav.Link>
                        <Nav.Link
                            as={Link}
                            to="/admin/manage/upgraderequests"
                            className={`nav-link-auction ${isActive('/admin/manage/upgraderequests') ? 'active' : ''}`}
                        >
                            Upgrade Requests
                        </Nav.Link>
                    </Nav>

                    <Nav className="align-items-center gap-3">
                        {user && (
                            <div className="d-flex align-items-center text-light gap-2">
                                <FaUserCircle className="text-auction-primary" size={20} />
                                <span className="fw-medium">{user.name || user.email}</span>
                            </div>
                        )}
                        <Button
                            variant="outline-danger"
                            size="sm"
                            className="d-flex align-items-center gap-2 rounded-pill px-3"
                            onClick={handleLogout}
                        >
                            <FaSignOutAlt />
                            <span>Logout</span>
                        </Button>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default AdminNavBar;
