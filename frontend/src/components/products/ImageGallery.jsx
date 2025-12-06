import React from 'react';
import { Image, Badge } from 'react-bootstrap';
import { FaClock } from 'react-icons/fa';
import { formatTimeLeft } from '../../utils/formatters';

const ImageGallery = ({ images, selectedImage, setSelectedImage, productName, endDate }) => {
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
                <div className="d-flex gap-3 mt-3 overflow-auto pb-2">
                    {images.map((img, idx) => (
                        <div
                            key={idx}
                            className={`cursor-pointer rounded-3 overflow-hidden border ${selectedImage === img.image_url ? 'border-auction-primary' : 'border-transparent'}`}
                            style={{ width: '100px', height: '100px', minWidth: '100px' }}
                            onClick={() => setSelectedImage(img.image_url)}
                        >
                            <Image
                                src={img.image_url}
                                className="w-100 h-100 object-fit-cover"
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ImageGallery;
