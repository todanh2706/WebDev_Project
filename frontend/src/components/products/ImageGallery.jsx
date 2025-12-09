import React from 'react';
import { Image, Badge } from 'react-bootstrap';
import { FaClock } from 'react-icons/fa';
import { formatTimeLeft } from '../../utils/formatters';

const ImageGallery = ({ images, selectedImage, setSelectedImage, productName, endDate }) => {
    const scrollContainerRef = React.useRef(null);

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const scrollAmount = 120; // Width of thumbnail + gap
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="glass-panel p-3 rounded-4 mb-4">
            <div className="position-relative rounded-3 overflow-hidden" style={{ height: '500px' }}>
                <Image
                    src={selectedImage || 'https://placehold.co/800x600?text=No+Image'}
                    className="w-100 h-100 object-fit-cover"
                    alt={productName}
                />
                <div className="position-absolute top-0 end-0 p-3">
                    <Badge bg="black" className="bg-opacity-75 fs-6 py-2 px-3 rounded-pill border border-secondary border-opacity-25">
                        <FaClock className="me-2 text-auction-primary" />
                        {formatTimeLeft(endDate)}
                    </Badge>
                </div>
            </div>

            {images && images.length > 1 && (
                <div className="position-relative mt-3">
                    <div
                        className="gallery-scroll-btn position-absolute top-50 start-0 translate-middle-y ms-1"
                        onClick={() => scroll('left')}
                    >
                        &lt;
                    </div>

                    <div
                        className="d-flex gap-3 overflow-auto px-4 gallery-thumbnails-container"
                        ref={scrollContainerRef}
                    >
                        {images.map((img, idx) => (
                            <div
                                key={idx}
                                className={`cursor-pointer rounded-3 overflow-hidden border border-2 flex-shrink-0 ${selectedImage === img.image_url ? 'border-auction-primary' : 'border-transparent'}`}
                                style={{ width: '100px', height: '100px' }}
                                onClick={() => setSelectedImage(img.image_url)}
                            >
                                <Image
                                    src={img.image_url}
                                    className="w-100 h-100 object-fit-cover"
                                />
                            </div>
                        ))}
                    </div>

                    <div
                        className="gallery-scroll-btn position-absolute top-50 end-0 translate-middle-y me-1"
                        onClick={() => scroll('right')}
                    >
                        &gt;
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageGallery;
