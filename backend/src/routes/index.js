import AuthController from '../controllers/authControllers.js'
import ProductController from '../controllers/productController.js'
import { authenticateToken } from '../middleware/authMiddleware.js';

export default (app) => {
    app.post('/api/register', AuthController.register);
    app.post('/api/login', AuthController.logIn);
    app.post('/api/refresh', AuthController.refreshToken);

    // Product Routes
    app.get('/api/products/latest-bidded', ProductController.getLatestBidded);
    app.get('/api/products/most-bidded', ProductController.getMostBidded);
    app.get('/api/products/highest-price', ProductController.getHighestPrice);
    app.post('/api/seed', ProductController.seedProducts);

    app.get('/', (req, res) => {
        res.send('Backend is running!');
    });

    // Create a catch-all route for testing the installation.
    app.use((req, res, next) => {
        res.status(404).send({
            message: "Not found!"
        });
    });
}