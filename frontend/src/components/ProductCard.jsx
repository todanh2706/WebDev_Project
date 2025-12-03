import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Button from './Button';
import { FaEye, FaClock } from 'react-icons/fa';

const ProductCard = ({ product }) => {
    const { name, current_price, images, end_date, bid_count } = product;
    const imageUrl = images && images.length > 0 ? images[0].image_url : 'https://placehold.co/600x400?text=No+Image';

    const formatTimeLeft = (endTime) => {
        const total = Date.parse(endTime) - Date.parse(new Date());
        const days = Math.floor(total / (1000 * 60 * 60 * 24));
        return `${days} days left`;
    };

    return (
        <Card className="h-100 border-0 glass-panel-dark text-white overflow-hidden">
            <div className="position-relative" style={{ height: '220px' }}>
                <Card.Img
                    variant="top"
                    src={imageUrl}
                    className="w-100 h-100 object-fit-cover"
                    style={{ transition: 'transform 0.5s ease' }}
                />
                <div className="position-absolute top-0 end-0 p-3">
                    <span className="badge bg-black bg-opacity-75 backdrop-blur border border-secondary border-opacity-25 py-2 px-3 rounded-md">
                        <FaClock className="me-2 text-auction-primary" />
                        {formatTimeLeft(end_date)}
                    </span>
                </div>
                {/* Gradient Overlay */}
                <div className="position-absolute bottom-0 start-0 w-100"
                    style={{ height: '50%', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}>
                </div>
            </div>
            <Card.Body className="d-flex flex-column p-4">
                <Card.Title className="h5 mb-1 text-truncate fw-bold" title={name}>
                    {name}
                </Card.Title>
                <div className="mb-4">
                    <small className="text-white-50">Lot #10{product.id}</small>
                </div>

                <div className="mt-auto">
                    <div className="d-flex justify-content-between align-items-end mb-4 p-3 rounded-md bg-black bg-opacity-25 border border-white border-opacity-10">
                        <div>
                            <small className="text-white-50 d-block mb-1 text-uppercase" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>Current Bid</small>
                            <span className="h3 text-auction-primary mb-0 fw-bold">
                                ${parseFloat(current_price).toLocaleString()}
                            </span>
                        </div>
                        {bid_count !== undefined && (
                            <div className="text-end">
                                <small className="text-white-50 d-block mb-1 text-uppercase" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>Bids</small>
                                <span className="fw-bold fs-5">{bid_count}</span>
                            </div>
                        )}
                    </div>

                    <Link to={`/product/${product.id}`} className="text-decoration-none">
                        <Button className="w-100 py-2 d-flex align-items-center justify-content-center gap-2 rounded-pill shadow-sm">
                            <FaEye /> More Details
                        </Button>
                    </Link>
                </div>
            </Card.Body>
        </Card>
    );
};

export default ProductCard;
