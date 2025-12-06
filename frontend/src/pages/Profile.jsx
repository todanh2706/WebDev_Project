import { useState } from 'react';
import { Container, Row, Col, Tab, Nav, Spinner } from 'react-bootstrap';
import { FaUser, FaStar, FaHeart, FaGavel, FaTrophy } from 'react-icons/fa';
import { useProfile } from '../hooks/useProfile';
import AccountInfo from '../components/profile/AccountInfo';
import ChangePassword from '../components/profile/ChangePassword';
import MyRatings from '../components/profile/MyRatings';
import ProductGrid from '../components/profile/ProductGrid';

const Profile = () => {
    const [activeTab, setActiveTab] = useState('account');
    const {
        loading,
        profile,
        watchlist,
        participating,
        won,
        ratings,
        updateProfile,
        changePassword,
        refreshData
    } = useProfile();

    if (loading) {
        return (
            <div className="min-vh-100 d-flex justify-content-center align-items-center auction-bg-pattern">
                <Spinner animation="border" variant="warning" />
            </div>
        );
    }

    return (
        <div className="min-vh-100 auction-bg-pattern py-5">
            <Container className="mt-5">
                <div className="glass-panel p-4 rounded-4 animate-fade-in">
                    <h2 className="text-white fw-bold mb-4">
                        <span className="text-auction-primary me-2">My Profile</span>
                    </h2>

                    <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
                        <Row>
                            <Col md={3} className="mb-4 mb-md-0">
                                <Nav variant="pills" className="flex-column gap-2 profile-nav">
                                    <Nav.Item>
                                        <Nav.Link eventKey="account" className="text-white d-flex align-items-center gap-2">
                                            <FaUser /> Account Info
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="ratings" className="text-white d-flex align-items-center gap-2">
                                            <FaStar /> My Ratings
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="watchlist" className="text-white d-flex align-items-center gap-2">
                                            <FaHeart /> Watchlist
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="participating" className="text-white d-flex align-items-center gap-2">
                                            <FaGavel /> Participating
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="won" className="text-white d-flex align-items-center gap-2">
                                            <FaTrophy /> Won Auctions
                                        </Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </Col>
                            <Col md={9}>
                                <Tab.Content className="glass-panel-active-tab p-3 rounded-3">
                                    <Tab.Pane eventKey="account">
                                        <AccountInfo profile={profile} onUpdate={updateProfile} />
                                        <ChangePassword onChangePassword={changePassword} />
                                    </Tab.Pane>

                                    <Tab.Pane eventKey="ratings">
                                        <MyRatings ratings={ratings} />
                                    </Tab.Pane>

                                    <Tab.Pane eventKey="watchlist">
                                        <ProductGrid products={watchlist} emptyMessage="Your watchlist is empty." onWatchlistChange={refreshData} />
                                    </Tab.Pane>

                                    <Tab.Pane eventKey="participating">
                                        <ProductGrid products={participating} emptyMessage="You are not participating in any auctions." />
                                    </Tab.Pane>

                                    <Tab.Pane eventKey="won">
                                        <ProductGrid products={won} emptyMessage="You haven't won any auctions yet." />
                                    </Tab.Pane>
                                </Tab.Content>
                            </Col>
                        </Row>
                    </Tab.Container>
                </div>
            </Container>
        </div>
    );
};

export default Profile;
