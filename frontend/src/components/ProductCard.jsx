import React from 'react';
import { Card } from 'react-bootstrap';
import Button from './Button';
import { FaGavel, FaClock } from 'react-icons/fa';

const ProductCard = ({ product }) => {
    const { name, currentPrice, imageUrl, endTime, bidCount } = product;

    const formatTimeLeft = (endTime) => {
        const total = Date.parse(endTime) - Date.parse(new Date());
        const days = Math.floor(total / (1000 * 60 * 60 * 24));
        return `${days} days left`;
    };

    return (
        <Card className="h-100 border-0 glass-panel text-white overflow-hidden">
            <div className="position-relative" style={{ height: '200px' }}>
                <Card.Img
                    variant="top"
                    src={imageUrl}
                    className="w-100 h-100 object-fit-cover"
                />
                <div className="position-absolute top-0 end-0 p-2">
                    <span className="badge bg-dark bg-opacity-75 backdrop-blur">
                        <FaClock className="me-1 text-auction-primary" />
                        {formatTimeLeft(endTime)}
                    </span>
                </div>
            </div>
            <Card.Body className="d-flex flex-column">
                <Card.Title className="h5 mb-3 text-truncate" title={name}>
                    {name}
                </Card.Title>

                <div className="mt-auto">
                    <div className="d-flex justify-content-between align-items-end mb-3">
                        <div>
                            <small className="text-white-50 d-block mb-1">Current Bid</small>
                            <span className="h4 text-auction-primary mb-0">
                                ${parseFloat(currentPrice).toLocaleString()}
                            </span>
                        </div>
                        {bidCount !== undefined && (
                            <div className="text-end">
                                <small className="text-white-50 d-block mb-1">Bids</small>
                                <span className="fw-bold">{bidCount}</span>
                            </div>
                        )}
                    </div>

                    <Button className="w-100 d-flex align-items-center justify-content-center gap-2">
                        <FaGavel /> Bid Now
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
};

export default ProductCard;
