import React, { useState } from 'react';
import { Navbar, Nav, Container, NavDropdown, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from './Button';
import {
    FaUserCircle, FaGavel, FaSignOutAlt, FaUser, FaChevronRight,
    FaMobileAlt, FaLaptop, FaHeadphones, FaCamera, FaHome, FaGamepad, FaTshirt
} from 'react-icons/fa';

const TopNavBar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showMegaMenu, setShowMegaMenu] = useState(false);
    const [activeCategory, setActiveCategory] = useState('electronics');

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const categories = [
        {
            id: 'electronics',
            name: 'Electronics',
            icon: <FaMobileAlt />,
            subcategories: [
                {
                    title: 'Phones & Tablets',
                    items: ['iPhone', 'Samsung Galaxy', 'iPad', 'Android Tablets', 'Accessories']
                },
                {
                    title: 'Computers',
                    items: ['Laptops', 'Desktops', 'Monitors', 'PC Components', 'Networking']
                },
                {
                    title: 'Audio',
                    items: ['Headphones', 'Speakers', 'Home Theater', 'Microphones']
                }
            ]
        },
        {
            id: 'computers',
            name: 'Laptops & PC',
            icon: <FaLaptop />,
            subcategories: [
                {
                    title: 'Laptops',
                    items: ['Gaming Laptops', 'Ultrabooks', 'MacBook', 'Chromebooks']
                },
                {
                    title: 'Components',
                    items: ['Graphics Cards', 'Processors', 'Motherboards', 'Storage']
                }
            ]
        },
        {
            id: 'cameras',
            name: 'Cameras & Photo',
            icon: <FaCamera />,
            subcategories: [
                {
                    title: 'Cameras',
                    items: ['DSLR', 'Mirrorless', 'Point & Shoot', 'Instant Cameras']
                },
                {
                    title: 'Lenses',
                    items: ['Zoom Lenses', 'Prime Lenses', 'Wide Angle', 'Macro']
                }
            ]
        },
        {
            id: 'home',
            name: 'Home & Garden',
            icon: <FaHome />,
            subcategories: [
                {
                    title: 'Furniture',
                    items: ['Living Room', 'Bedroom', 'Office', 'Outdoor']
                },
                {
                    title: 'Decor',
                    items: ['Lighting', 'Rugs', 'Wall Art', 'Mirrors']
                }
            ]
        },
        {
            id: 'fashion',
            name: 'Fashion',
            icon: <FaTshirt />,
            subcategories: [
                {
                    title: 'Men',
                    items: ['Clothing', 'Shoes', 'Accessories', 'Watches']
                },
                {
                    title: 'Women',
                    items: ['Clothing', 'Shoes', 'Jewelry', 'Handbags']
                }
            ]
        },
        {
            id: 'gaming',
            name: 'Gaming',
            icon: <FaGamepad />,
            subcategories: [
                {
                    title: 'Consoles',
                    items: ['PlayStation 5', 'Xbox Series X', 'Nintendo Switch', 'Retro']
                },
                {
                    title: 'Video Games',
                    items: ['Action', 'RPG', 'Sports', 'Strategy']
                }
            ]
        }
    ];

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
                                to="#"
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
                                                        {category.icon}
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
                                                        <h6>{sub.title}</h6>
                                                        {sub.items.map((item, itemIdx) => (
                                                            <Link key={itemIdx} to={`/category/${item.toLowerCase().replace(/\s+/g, '-')}`} className="subcategory-link">
                                                                {item}
                                                                {['iPhone 17', 'PlayStation 5'].includes(item) && <span className="hot-badge">HOT</span>}
                                                            </Link>
                                                        ))}
                                                    </Col>
                                                ))}
                                            </Row>
                                        </Col>
                                    </Row>
                                </div>
                            )}
                        </div>

                        <Nav.Link as={Link} to="/myauctions" className="nav-link-auction mx-2">My Auctions</Nav.Link>
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
