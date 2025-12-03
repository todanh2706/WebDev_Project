import React, { useState, useEffect } from 'react';
import TopNavBar from '../components/TopNavBar';
import { Container, Row, Col } from 'react-bootstrap';
import Button from '../components/Button';
import { Link } from 'react-router-dom';
import ProductCarousel from '../components/ProductCarousel';

export default function Home() {
    const [latestBidded, setLatestBidded] = useState([]);
    const [mostBidded, setMostBidded] = useState([]);
    const [highestPrice, setHighestPrice] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const [latestRes, mostRes, highestRes] = await Promise.all([
                    fetch(`${import.meta.env.VITE_API_BASE_URL}/products/latest-bidded`),
                    fetch(`${import.meta.env.VITE_API_BASE_URL}/products/most-bidded`),
                    fetch(`${import.meta.env.VITE_API_BASE_URL}/products/highest-price`)
                ]);

                const latestData = await latestRes.json();
                const mostData = await mostRes.json();
                const highestData = await highestRes.json();

                setLatestBidded(latestData);
                setMostBidded(mostData);
                setHighestPrice(highestData);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="position-relative min-vh-100 overflow-hidden">
            {/* Background Overlay */}
            <div className="position-absolute top-0 start-0 w-100 h-100"
                style={{
                    background: 'radial-gradient(circle at center, rgba(218, 165, 32, 0.15) 0%, rgba(18, 18, 18, 0.95) 70%)',
                    zIndex: -1,
                    position: 'fixed' // Ensure background stays fixed while scrolling
                }}
            ></div>

            <div className="auction-bg-pattern position-absolute top-0 start-0 w-100 h-100"
                style={{
                    zIndex: -2,
                    position: 'fixed' // Ensure pattern stays fixed while scrolling
                }}
            ></div>

            <TopNavBar />

            {/* Hero Section */}
            <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
                <Container className="text-center position-relative z-1 animate-fade-in">
                    <Row className="justify-content-center">
                        <Col lg={8}>
                            <h1 className="display-3 fw-bold mb-4 text-white">
                                Discover Rare & <span className="text-auction-primary">Premium</span> Items
                            </h1>
                            <p className="lead text-white-50 mb-5">
                                Join the world's most exclusive online auction platform.
                                Bid on luxury watches, vintage cars, fine art, and more.
                            </p>
                            <div className="d-flex justify-content-center gap-3">
                                <Link to="/auctions" className="text-decoration-none">
                                    <Button className="px-5 py-3 rounded-pill fw-bold">
                                        Start Bidding
                                    </Button>
                                </Link>
                                <Link to="/about" className="text-decoration-none">
                                    <button className="btn btn-outline-light px-5 py-3 rounded-pill fw-bold">
                                        Learn More
                                    </button>
                                </Link>
                            </div>

                            {/* Temporary Seed Button
                            <div className="mt-5">
                                <button onClick={async () => {
                                    try {
                                        await fetch(`${import.meta.env.VITE_API_BASE_URL}/seed`, { method: 'POST' });
                                        window.location.reload();
                                    } catch (error) {
                                        console.error("Error seeding:", error);
                                    }
                                }} className="btn btn-sm btn-outline-secondary opacity-50">
                                    Seed Database (Dev Only)
                                </button>
                            </div> */}
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* Product Sections */}
            <Container className="py-5">
                {loading ? (
                    <div className="text-center text-white py-5">Loading auctions...</div>
                ) : (
                    <>
                        <ProductCarousel title="Latest Bids" products={latestBidded} />
                        <ProductCarousel title="Most Popular" products={mostBidded} />
                        <ProductCarousel title="High Value Items" products={highestPrice} />
                    </>
                )}
            </Container>
        </div >
    );
}