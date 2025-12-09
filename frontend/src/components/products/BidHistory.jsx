import React, { useState, useEffect } from 'react';
import { Table, Spinner } from 'react-bootstrap';
import { productService } from '../../services/productService';
import { formatDate } from '../../utils/formatters';
import { FaHistory, FaUser, FaTag, FaCalendarAlt } from 'react-icons/fa';

const BidHistory = ({ productId }) => {
    const [bids, setBids] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBids = async () => {
            try {
                const data = await productService.getProductBids(productId);
                setBids(data);
            } catch (error) {
                console.error('Error fetching bids:', error);
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            fetchBids();
        }
    }, [productId]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center py-4">
                <Spinner variant="warning" size="sm" />
            </div>
        );
    }

    if (bids.length === 0) {
        return (
            <div className="glass-panel p-4 rounded-4 mt-4 text-center">
                <h5 className="text-white fw-bold mb-3 d-flex align-items-center gap-2">
                    <FaHistory className="text-auction-primary" />
                    Bid History
                </h5>
                <div className="p-4 rounded border border-secondary border-opacity-25 bg-black bg-opacity-25">
                    <p className="text-white-50 mb-0 fst-italic">No bids have been placed yet.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="glass-panel p-4 rounded-4 mt-4">
            <h5 className="text-white fw-bold mb-3 d-flex align-items-center gap-2">
                <FaHistory className="text-auction-primary" />
                Bid History
            </h5>

            <div className="table-responsive rounded border border-secondary border-opacity-25">
                <Table hover className="mb-0 text-white bg-transparent">
                    <thead className="bg-black bg-opacity-50">
                        <tr>
                            <th className="py-3 px-4 border-secondary border-opacity-25 text-auction-primary bg-transparent fw-bold" style={{ width: '35%' }}>
                                <FaCalendarAlt className="me-2" />
                                Date Time
                            </th>
                            <th className="py-3 px-4 border-secondary border-opacity-25 text-auction-primary bg-transparent fw-bold" style={{ width: '35%' }}>
                                <FaUser className="me-2" />
                                Bidder
                            </th>
                            <th className="py-3 px-4 border-secondary border-opacity-25 text-auction-primary bg-transparent fw-bold text-end" style={{ width: '30%' }}>
                                <FaTag className="me-2" />
                                Price
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {bids.map((bid) => (
                            <tr key={bid.bid_id} className="align-middle">
                                <td className="py-3 px-4 border-secondary border-opacity-10 bg-transparent text-white-50">
                                    {formatDate(bid.bid_time)}
                                </td>
                                <td className="py-3 px-4 border-secondary border-opacity-10 bg-transparent text-white">
                                    {bid.bidder ? bid.bidder.name : 'Unknown'}
                                </td>
                                <td className="py-3 px-4 border-secondary border-opacity-10 bg-transparent text-white fw-bold text-end">
                                    ${parseFloat(bid.amount).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </div>
    );
};

export default BidHistory;
