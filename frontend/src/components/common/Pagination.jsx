import React from 'react';
import { Button } from 'react-bootstrap';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    };

    return (
        <div className="d-flex justify-content-center align-items-center gap-2 mt-5">
            <Button
                variant="outline-warning"
                className="btn-auction-outline d-flex align-items-center justify-content-center"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={{ width: '40px', height: '40px', padding: 0 }}
            >
                <FaChevronLeft size={14} />
            </Button>

            {getPageNumbers().map(page => (
                <Button
                    key={page}
                    variant={currentPage === page ? "warning" : "outline-warning"}
                    className={`btn-auction-outline ${currentPage === page ? 'bg-auction-primary text-black border-auction-primary' : 'text-auction-primary'}`}
                    onClick={() => onPageChange(page)}
                    style={{ width: '40px', height: '40px', padding: 0 }}
                >
                    {page}
                </Button>
            ))}

            <Button
                variant="outline-warning"
                className="btn-auction-outline d-flex align-items-center justify-content-center"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={{ width: '40px', height: '40px', padding: 0 }}
            >
                <FaChevronRight size={14} />
            </Button>
        </div>
    );
};

export default Pagination;
