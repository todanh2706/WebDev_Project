import AuthController from '../controllers/authControllers.js'
import ProductController from '../controllers/productController.js'
import CategoryController from '../controllers/categoryController.js'; // Added import for CategoryController
import UserController from '../controllers/userController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

export default (app) => {
    app.post('/api/register', AuthController.register);
    app.post('/api/login', AuthController.logIn);
    app.post('/api/refresh', AuthController.refreshToken);
    app.post('/api/verify-otp', AuthController.verifyOTP);

    // Product Routes
    app.get('/api/products', ProductController.getAll);
    app.get('/api/products/latest-bidded', ProductController.getLatestBidded);
    app.get('/api/products/most-bidded', ProductController.getMostBidded);
    app.get('/api/products/highest-price', ProductController.getHighestPrice);
    app.get('/api/products/category/:id', ProductController.getByCategory);
    app.get('/api/products/search', ProductController.search);
    app.get('/api/products/:id', ProductController.getById);
    // Category Routes
    app.get('/api/categories', CategoryController.getAll); // Added new route for categories
    app.get('/api/categories/:id', CategoryController.getById);

    // User Routes
    app.get('/api/user/profile', authenticateToken, UserController.getProfile);
    app.put('/api/user/profile', authenticateToken, UserController.updateProfile);
    app.get('/api/user/watchlist', authenticateToken, UserController.getWatchlist);
    app.get('/api/user/participating', authenticateToken, UserController.getParticipatingAuctions);
    app.get('/api/user/won', authenticateToken, UserController.getWonAuctions);
    app.get('/api/user/ratings', authenticateToken, UserController.getRatings);

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