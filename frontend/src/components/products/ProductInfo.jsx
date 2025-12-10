import React from 'react';
import { Badge } from 'react-bootstrap';
import Button from '../common/Button';
import { FaTag, FaUser, FaShieldAlt, FaGavel, FaTrophy, FaClock } from 'react-icons/fa';

const ProductInfo = ({ product, onPlaceBid, isEligible, permissionStatus, onRequestPermission, isOwner }) => {
    if (!product) return null;

    return (
        <div className="glass-panel p-4 rounded-4 mb-4">
            <div className="d-flex align-items-center gap-2 mb-3">
                <Badge bg="warning" text="dark" className="px-3 py-2 rounded-pill fw-bold">
                    Lot #{product.id}
                </Badge>
                {product.category && (
                    <Badge bg="secondary" className="bg-opacity-50 px-3 py-2 rounded-pill">
                        <FaTag className="me-2" />
                        {product.category.name}
                    </Badge>
                )}
                {product.status === 'sold' && (
                    <Badge bg="success" className="px-3 py-2 rounded-pill fw-bold">
                        SOLD
                    </Badge>
                )}
                {product.status === 'expired' && (
                    <Badge bg="danger" className="px-3 py-2 rounded-pill fw-bold">
                        EXPIRED
                    </Badge>
                )}
            </div>

            <h1 className="text-white fw-bold mb-2">{product.name}</h1>

            {product.seller && (
                <div className="d-flex align-items-center gap-2 mb-4 text-white-50">
                    <FaUser className="text-auction-primary" />
                    <span>Seller: <span className="text-white">{product.seller.name}</span></span>
                    <span className="mx-2">•</span>
                    <FaShieldAlt className="text-success" />
                    <span>Verified Seller</span>
                </div>
            )}

            <div className="p-4 rounded-4 bg-black bg-opacity-25 border border-white border-opacity-10 mb-4">
                <div className="row g-4">
                    <div className="col-6">
                        <small className="text-white-50 d-block mb-1 text-uppercase ls-1">
                            {product.status === 'sold' ? 'Winning Price' : 'Current Price'}
                        </small>
                        <span className="h2 text-auction-primary fw-bold mb-0">
                            ${parseFloat(product.current_price).toLocaleString()}
                        </span>
                    </div>
                    <div className="col-6 border-start border-white border-opacity-10 ps-4">
                        <small className="text-white-50 d-block mb-1 text-uppercase ls-1">Step Price</small>
                        <span className="h4 text-white fw-bold mb-0">
                            +${parseFloat(product.step_price).toLocaleString()}
                        </span>
                    </div>
                </div>
            </div>

            <div className="d-grid gap-3">
                {product.status === 'sold' ? (
                    <div className="p-4 rounded-4 bg-success bg-opacity-10 border border-success text-center">
                        <FaTrophy className="text-warning mb-3" size={40} />
                        <h4 className="text-white fw-bold mb-2">Auction Won!</h4>
                        <p className="text-white-50 mb-0">
                            Winner: <span className="text-white fw-bold">{product.current_winner?.name || 'Unknown'}</span>
                        </p>
                    </div>
                ) : product.status === 'expired' ? (
                    <div className="p-4 rounded-4 bg-danger bg-opacity-10 border border-danger text-center">
                        <FaClock className="text-danger mb-3" size={40} />
                        <h4 className="text-white fw-bold mb-2">Auction Expired</h4>
                        <p className="text-white-50 mb-0">
                            This auction has ended with no bids.
                        </p>
                    </div>
                ) : isOwner ? (
                    <div className="p-3 rounded-4 bg-warning bg-opacity-10 border border-warning text-center">
                        <FaShieldAlt className="text-warning mb-2 fs-4" />
                        <h5 className="text-white fw-bold">You are the seller</h5>
                        <p className="text-white-50 mb-0 small">
                            You cannot place bids on your own product.
                            <br />
                            Manage this product from "My Products".
                        </p>
                    </div>
                ) : isEligible || permissionStatus === 'approved' ? (
                    <Button
                        className="py-3 fs-5 fw-bold rounded-pill shadow-lg d-flex align-items-center justify-content-center gap-2"
                        onClick={onPlaceBid}
                    >
                        <FaGavel /> Place Bid
                    </Button>
                ) : permissionStatus === 'pending' ? (
                    <Button
                        className="py-3 fs-5 fw-bold rounded-pill shadow-lg d-flex align-items-center justify-content-center gap-2 bg-warning text-dark border-warning"
                        disabled
                    >
                        <FaShieldAlt /> Request Pending
                    </Button>
                ) : permissionStatus === 'rejected' ? (
                    <Button
                        className="py-3 fs-5 fw-bold rounded-pill shadow-lg d-flex align-items-center justify-content-center gap-2 bg-secondary text-white border-secondary bg-opacity-50"
                        disabled
                    >
                        <FaShieldAlt /> You were rejected to bid
                    </Button>
                ) : (
                    <>
                        <Button
                            className="py-3 fs-5 fw-bold rounded-pill shadow-lg d-flex align-items-center justify-content-center gap-2"
                            onClick={onRequestPermission}
                        >
                            <FaShieldAlt /> Request Permission
                        </Button>
                        {product.buy_now_price && (
                            <Button variant="outline-light" className="py-3 fw-bold rounded-pill border-opacity-25">
                                Buy Now for ${parseFloat(product.buy_now_price).toLocaleString()}
                            </Button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ProductInfo;
