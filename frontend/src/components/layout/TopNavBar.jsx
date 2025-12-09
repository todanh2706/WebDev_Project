import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, NavDropdown, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Button from '../common/Button';
import { categoriesService } from '../../services/categoriesService';
import {
    FaUserCircle, FaGavel, FaSignOutAlt, FaUser, FaChevronRight,
    FaMobileAlt, FaLaptop, FaHeadphones, FaCamera, FaHome, FaGamepad, FaTshirt, FaSearch
} from 'react-icons/fa';

const TopNavBar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showMegaMenu, setShowMegaMenu] = useState(false);
    const [activeCategory, setActiveCategory] = useState(null);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await categoriesService.getCategories();
                setCategories(data);
                if (data.length > 0) {
                    setActiveCategory(data[0].id);
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, []);

    const getCategoryIcon = (name) => {
        switch (name) {
            case 'Electronics': return <FaMobileAlt />;
            case 'Laptops & PC': return <FaLaptop />;
            case 'Cameras & Photo': return <FaCamera />;
            case 'Home & Garden': return <FaHome />;
            case 'Fashion': return <FaTshirt />;
            case 'Gaming': return <FaGamepad />;
            default: return <FaChevronRight />;
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e) => {
        console.log('Search event triggered:', e.type, e.key);
        if (e.key === 'Enter' || e.type === 'click') {
            console.log('Search query:', searchQuery);
            if (searchQuery.trim()) {
                console.log('Navigating to:', `/search?q=${encodeURIComponent(searchQuery.trim())}`);
                navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            }
        }
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
                    <Nav className="me-auto ms-3">
                        <div
                            className="nav-item dropdown position-relative"
                            onMouseEnter={() => setShowMegaMenu(true)}
                            onMouseLeave={() => setShowMegaMenu(false)}
                        >
                            <Link
                                to="/products"
                                className={`nav-link nav-link-auction mx-2 ${showMegaMenu ? 'active' : ''}`}
                                role="button"
                            >
                                Category
                            </Link>

                            {showMegaMenu && (
                                <div className="dropdown-menu show mega-menu-container animate-fade-in">
                                    <Row className="g-0">
                                        <Col md={4} className="mega-menu-sidebar">
                                            {categories.map(category => (
                                                <div
                                                    key={category.id}
                                                    className={`mega-menu-item ${activeCategory === category.id ? 'active' : ''}`}
                                                    onMouseEnter={() => setActiveCategory(category.id)}
                                                >
                                                    <div className="d-flex align-items-center gap-2">
                                                        {getCategoryIcon(category.name)}
                                                        <span>{category.name}</span>
                                                    </div>
                                                    {activeCategory === category.id && <FaChevronRight size={12} />}
                                                </div>
                                            ))}
                                        </Col>
                                        <Col md={8} className="mega-menu-content">
                                            <Row>
                                                {categories.find(c => c.id === activeCategory)?.subcategories.map((sub, idx) => (
                                                    <Col md={6} key={idx} className="mb-4 subcategory-group">
                                                        <h6>{sub.name}</h6>
                                                        {/* Placeholder for sub-items as they are not in the current data model */}
                                                        <Link to={`/category/${sub.id}`} className="subcategory-link">
                                                            View All {sub.name}
                                                        </Link>
                                                    </Col>
                                                ))}
                                            </Row>
                                        </Col>
                                    </Row>
                                </div>
                            )}
                        </div>

                        <Nav.Link as={Link} to="/my-products" className="nav-link-auction mx-2">My Products</Nav.Link>
                    </Nav>

                    <div className="d-flex align-items-center mx-3 flex-grow-1" style={{ maxWidth: '400px' }}>
                        <div className="input-group glass-search-group">
                            <span
                                className="input-group-text bg-transparent border-end-0 text-auction-primary cursor-pointer"
                                onClick={handleSearch}
                            >
                                <FaSearch />
                            </span>
                            <input
                                type="text"
                                className="form-control bg-transparent border-start-0 text-white placeholder-white-50"
                                placeholder="Search for products..."
                                aria-label="Search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleSearch}
                            />
                        </div>
                    </div>

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
                                <Button
                                    variant="outline-light"
                                    onClick={() => navigate('/register')}
                                >
                                    Register
                                </Button>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default TopNavBar;
