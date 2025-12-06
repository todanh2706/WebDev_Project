import { Row, Col } from 'react-bootstrap';
import ProductCard from '../../components/ProductCard';

const ProductGrid = ({ products, emptyMessage, onWatchlistChange, onRateSeller }) => {
    return (
        <Row xs={1} md={2} lg={3} className="g-4">
            {products.length > 0 ? products.map(product => (
                <Col key={product.id}>
                    <ProductCard product={product} onWatchlistChange={onWatchlistChange} onRateSeller={onRateSeller} />
                </Col>
            )) : <p className="text-white-50">{emptyMessage}</p>}
        </Row>
    );
};

export default ProductGrid;
