import React from 'react';
import { Carousel, Row, Col } from 'react-bootstrap';
import ProductCard from './ProductCard';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const ProductCarousel = ({ title, products }) => {
    // Helper to chunk products into groups of 3
    const chunkProducts = (arr, size) => {
        const chunks = [];
        for (let i = 0; i < arr.length; i += size) {
            chunks.push(arr.slice(i, i + size));
        }
        return chunks;
    };

    const productChunks = chunkProducts(products, 3);

    return (
        <div className="mb-5 animate-fade-in">
            <div className="d-flex align-items-center mb-4">
                <h2 className="h3 fw-bold text-white mb-0 border-start border-4 border-warning ps-3">
                    {title}
                </h2>
                <div className="flex-grow-1 ms-3 border-bottom border-secondary opacity-25"></div>
            </div>

            {products.length > 0 ? (
                <Carousel
                    indicators={false}
                    interval={5000}
                    className="product-carousel"
                    prevIcon={
                        <span className="carousel-control-custom">
                            <FaChevronLeft size={24} />
                        </span>
                    }
                    nextIcon={
                        <span className="carousel-control-custom">
                            <FaChevronRight size={24} />
                        </span>
                    }
                >
                    {productChunks.map((chunk, index) => (
                        <Carousel.Item key={index}>
                            <Row className="g-4">
                                {chunk.map((product) => (
                                    <Col key={product.id} md={4}>
                                        <ProductCard product={product} />
                                    </Col>
                                ))}
                            </Row>
                        </Carousel.Item>
                    ))}
                </Carousel>
            ) : (
                <div className="text-center py-5 text-white-50 glass-panel rounded">
                    <p className="mb-0">No products available in this category.</p>
                </div>
            )}
        </div>
    );
};

export default ProductCarousel;
