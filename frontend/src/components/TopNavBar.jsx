import React from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from './Button';
import { FaUserCircle, FaGavel, FaSignOutAlt, FaUser } from 'react-icons/fa';

const TopNavBar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Navbar expand="lg" className="navbar-auction fixed-top" variant="dark">
            <Container>
                <Navbar.Brand as={Link} to="/home" className="d-flex align-items-center gap-2">
                    <img
                        alt="Online Auction Logo"
                        src="/OA_logo.png"
                        width="32"
                        height="32"
                        className="d-inline-block align-top"
                    />
                    <span className="fw-bold text-auction-primary tracking-wider">Online Auction</span>
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0 text-auction-primary" />

                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mx-auto">
                        <Nav.Link as={Link} to="/home" className="nav-link-auction mx-2">Home</Nav.Link>
                        <Nav.Link as={Link} to="/auctions" className="nav-link-auction mx-2">Auctions</Nav.Link>
                        <Nav.Link as={Link} to="/about" className="nav-link-auction mx-2">About</Nav.Link>
                    </Nav>

                    <Nav className="align-items-center gap-3">
                        {user ? (
                            <NavDropdown
                                title={
                                    <div className="d-flex align-items-center gap-2 text-light">
                                        <FaUserCircle size={24} className="text-auction-primary" />
                                        <span>{user.name || 'User'}</span>
                                    </div>
                                }
                                id="user-dropdown"
                                align="end"
                                className="user-dropdown"
                            >
                                <NavDropdown.Item as={Link} to="/profile" className="dropdown-item-auction">
                                    <FaUser className="me-2 text-auction-primary" /> My Profile
                                </NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/my-bids" className="dropdown-item-auction">
                                    <FaGavel className="me-2 text-auction-primary" /> My Bids
                                </NavDropdown.Item>
                                <NavDropdown.Divider className="bg-secondary opacity-25" />
                                <NavDropdown.Item onClick={handleLogout} className="dropdown-item-auction text-danger">
                                    <FaSignOutAlt className="me-2" /> Logout
                                </NavDropdown.Item>
                            </NavDropdown>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/login" className="text-light fw-medium px-3">
                                    Log In
                                </Nav.Link>
                                <Link to="/register" className="text-decoration-none">
                                    <Button className="btn-sm px-4 rounded-pill">
                                        Register
                                    </Button>
                                </Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default TopNavBar;
