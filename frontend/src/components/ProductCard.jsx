import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Button from './Button';
import { useWatchlist } from '../contexts/WatchlistContext';
import { FaEye, FaClock, FaHeart, FaRegHeart } from 'react-icons/fa';

const ProductCard = ({ product, onWatchlistChange }) => {
    const { name, current_price, images, end_date, bid_count, current_winner, buy_now_price, post_date, id } = product;
    const imageUrl = images && images.length > 0 ? images[0].image_url : 'https://placehold.co/600x400?text=No+Image';

    const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
    const isWatched = isInWatchlist(id);

    const handleWatchlistClick = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        let success;
        if (isWatched) {
            success = await removeFromWatchlist(id);
        } else {
            success = await addToWatchlist(id);
        }

        if (success && onWatchlistChange) {
            onWatchlistChange();
        }
    };

    const formatTimeLeft = (endTime) => {
        const total = Date.parse(endTime) - Date.parse(new Date());
        if (total <= 0) return 'Expired';
        const days = Math.floor(total / (1000 * 60 * 60 * 24));
        const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
        if (days > 0) return `${days}d ${hours}h left`;
        return `${hours}h left`;
    };

    const maskName = (name) => {
        if (!name) return 'No Bids';
        if (name.length <= 4) return '****';
        return `****${name.slice(-4)}`;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const isNew = (dateString) => {
        const postDate = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - postDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 2;
    };

    return (
        <Card className={`h-100 border-0 glass-panel-dark text-white overflow-hidden shadow-sm hover-scale ${isNew(post_date) ? 'card-new' : ''}`}>
            <div className="position-relative" style={{ height: '220px' }}>
                <Card.Img
                    variant="top"
                    src={imageUrl}
                    className="w-100 h-100 object-fit-cover"
                />

                {/* New Badge */}
                {isNew(post_date) && (
                    <div className="position-absolute top-0 start-0 p-2">
                        <span className="badge badge-new shadow-sm">
                            NEW
                        </span>
                    </div>
                )}

                {/* Watchlist Button */}
                <div className="position-absolute top-0 end-0 p-2 z-2">
                    <button
                        className="btn btn-icon rounded-circle bg-black bg-opacity-50 text-white backdrop-blur shadow-sm d-flex align-items-center justify-content-center watchlist-btn"
                        style={{ width: '50px', height: '50px', border: '1px solid #ffc107' }}
                        onClick={handleWatchlistClick}
                        title={isWatched ? "Remove from Watchlist" : "Add to Watchlist"}
                    >
                        {isWatched ? <FaHeart className="text-danger" /> : <FaRegHeart />}
                    </button>
                    <style>
                        {`
                            .watchlist-btn:hover {
                                background-color: #ffc107 !important;
                                border-color: #343a40 !important;
                                color: #343a40 !important;
                            }
                            .watchlist-btn:hover svg {
                                color: #343a40 !important;
                            }
                        `}
                    </style>
                </div>

                {/* Status Badge */}
                <div className="position-absolute bottom-0 end-0 p-2">
                    <span className="badge bg-black bg-opacity-75 backdrop-blur border border-secondary border-opacity-25 py-2 px-3 rounded-pill">
                        <FaClock className="me-2 text-auction-primary" />
                        {formatTimeLeft(end_date)}
                    </span>
                </div>
            </div>

            <Card.Body className="d-flex flex-column p-3">
                {/* 1. Product Name */}
                <Card.Title className="h6 mb-3 text-truncate fw-bold" title={name}>
                    {name}
                </Card.Title>

                <div className="d-flex flex-column gap-2 mb-3">
                    {/* 2. Current Price */}
                    <div className="d-flex justify-content-between align-items-center">
                        <small className="text-white-50">Current Price:</small>
                        <span className="text-auction-primary fw-bold">
                            ${parseFloat(current_price).toLocaleString()}
                        </span>
                    </div>

                    {/* 3. Highest Bidder */}
                    <div className="d-flex justify-content-between align-items-center">
                        <small className="text-white-50">Highest Bidder:</small>
                        <span className="fw-medium text-light">
                            {current_winner ? maskName(current_winner.name) : 'No Bids'}
                        </span>
                    </div>

                    {/* 4. Buy Now Price (if available) */}
                    {buy_now_price && (
                        <div className="d-flex justify-content-between align-items-center">
                            <small className="text-white-50">Buy Now:</small>
                            <span className="text-success fw-bold">
                                ${parseFloat(buy_now_price).toLocaleString()}
                            </span>
                        </div>
                    )}

                    {/* 5. Post Date */}
                    <div className="d-flex justify-content-between align-items-center">
                        <small className="text-white-50">Posted:</small>
                        <span className="text-light small">
                            {formatDate(post_date)}
                        </span>
                    </div>
                </div>

                <div className="mt-auto pt-3 border-top border-secondary border-opacity-25">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <small className="text-white-50">Bids:</small>
                        <span className="badge bg-secondary bg-opacity-25 text-white">
                            {bid_count || 0}
                        </span>
                    </div>

                    <Link to={`/product/${product.id}`} className="text-decoration-none">
                        <Button className="w-100 py-2 d-flex align-items-center justify-content-center gap-2 rounded-pill shadow-sm btn-sm">
                            <FaEye /> View Details
                        </Button>
                    </Link>
                </div>
            </Card.Body>
        </Card>
    );
};

export default ProductCard;
