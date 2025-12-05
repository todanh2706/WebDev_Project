import React from 'react';

const MyRatings = ({ ratings }) => {
    return (
        <div className="glass-panel-dark p-4 rounded-3">
            <h4 className="text-auction-primary mb-4">My Ratings</h4>
            {ratings.length > 0 ? (
                <div className="d-flex flex-column gap-3">
                    {ratings.map((rating) => (
                        <div key={rating.feedback_id} className="p-3 border border-secondary rounded bg-black bg-opacity-50">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                    <span className={`badge ${rating.rating === 'good' ? 'bg-success' : 'bg-danger'} me-2`}>
                                        {rating.rating.toUpperCase()}
                                    </span>
                                    <span className="text-white fw-bold">From: {rating.reviewer?.name || 'Unknown'}</span>
                                </div>
                                <small className="text-white-50">Product: {rating.product?.name || 'Unknown'}</small>
                            </div>
                            <p className="text-white-50 mb-0">"{rating.comment}"</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-white-50">No ratings yet.</p>
            )}
        </div>
    );
};

export default MyRatings;
