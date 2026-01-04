import AuthController from '../controllers/authControllers.js'
import ProductController from '../controllers/productController.js'
import CategoryController from '../controllers/categoryController.js'; // Added import for CategoryController
import UserController from '../controllers/userController.js';
import FeedbackController from '../controllers/feedbackController.js';
import { authenticateToken, isAdmin, isSeller } from '../middleware/authMiddleware.js';
import AdminController from '../controllers/adminController.js';
import SystemController from '../controllers/systemController.js';
import CommentController from '../controllers/commentController.js';
import upload from '../middleware/upload.js';

export default (app) => {
    app.post('/api/register', AuthController.register);
    app.post('/api/login', AuthController.logIn);
    app.post('/api/refresh', AuthController.refreshToken);
    app.post('/api/logout', AuthController.logout);
    app.post('/api/verify-otp', AuthController.verifyOTP);

    // Product Routes
    app.post('/api/products', authenticateToken, isSeller, upload.array('images', 10), ProductController.createProduct);
    app.get('/api/products', ProductController.getAll);
    app.get('/api/products/latest-bidded', ProductController.getLatestBidded);
    app.get('/api/products/most-bidded', ProductController.getMostBidded);
    app.get('/api/products/highest-price', ProductController.getHighestPrice);
    app.get('/api/products/category/:id', ProductController.getByCategory);
    app.get('/api/products/search', ProductController.search);
    app.get('/api/products/:id', ProductController.getById);
    app.get('/api/products/:id/bids', ProductController.getProductBids);
    app.post('/api/products/:id/bid', authenticateToken, ProductController.placeBid);
    app.post('/api/products/:id/description', authenticateToken, isSeller, ProductController.appendDescription);
    app.delete('/api/products/:productId/bids/:bidId', authenticateToken, ProductController.rejectBid); // Seller reject bid
    app.post('/api/products/:id/cancel-transaction', authenticateToken, ProductController.cancelTransaction); // Seller cancel transaction
    app.get('/api/products/:id/banned-bidders', authenticateToken, ProductController.getBannedBidders);
    app.delete('/api/products/:id/banned-bidders/:userId', authenticateToken, ProductController.unbanBidder);
    app.post('/api/products/:id/bid-request', authenticateToken, ProductController.requestBidPermission);
    app.get('/api/products/:id/bid-permission', authenticateToken, ProductController.checkBidPermission);
    app.get('/api/seller/bid-requests', authenticateToken, ProductController.getSellerBidRequests);
    app.put('/api/seller/bid-requests/:requestId', authenticateToken, ProductController.handleBidRequest);
    // Category Routes
    app.get('/api/categories', CategoryController.getAll);
    app.get('/api/categories/:id', CategoryController.getById);

    // User Routes
    app.get('/api/user/profile', authenticateToken, UserController.getProfile);
    app.put('/api/user/profile', authenticateToken, UserController.updateProfile);
    app.get('/api/user/watchlist', authenticateToken, UserController.getWatchlist);
    app.post('/api/user/watchlist', authenticateToken, UserController.addToWatchlist);
    app.delete('/api/user/watchlist/:productId', authenticateToken, UserController.removeFromWatchlist);
    app.get('/api/user/participating', authenticateToken, UserController.getParticipatingAuctions);
    app.get('/api/user/won', authenticateToken, UserController.getWonAuctions);
    app.get('/api/user/ratings', authenticateToken, UserController.getRatings);
    app.post('/api/user/upgrade-request', authenticateToken, UserController.requestUpgrade);
    app.get('/api/user/upgrade-request', authenticateToken, UserController.getUpgradeRequest);
    app.get('/api/user/my-products', authenticateToken, ProductController.getMyProducts);

    // Feedback Routes
    app.post('/api/feedbacks', authenticateToken, FeedbackController.create);

    // Comment Routes
    app.get('/api/products/:id/comments', CommentController.getComments);
    app.post('/api/products/:id/comments', authenticateToken, CommentController.addComment);

    // Admin Routes
    app.get('/api/admin/users', authenticateToken, isAdmin, AdminController.getUsers);
    app.get('/api/admin/users/:id', authenticateToken, isAdmin, AdminController.getUserDetails);
    app.put('/api/admin/users/:id', authenticateToken, isAdmin, AdminController.updateUser);
    app.delete('/api/admin/users/:id', authenticateToken, isAdmin, AdminController.deleteUser);

    app.get('/api/admin/upgrade-requests', authenticateToken, isAdmin, AdminController.getUpgradeRequests);
    app.post('/api/admin/upgrade-requests/:requestId/approve', authenticateToken, isAdmin, AdminController.approveUpgradeRequest);
    app.post('/api/admin/upgrade-requests/:requestId/reject', authenticateToken, isAdmin, AdminController.rejectUpgradeRequest);
    app.delete('/api/admin/products/:id', authenticateToken, isAdmin, AdminController.deleteProduct);

    // Category Admin Routes
    app.put('/api/admin/categories/:id', authenticateToken, isAdmin, CategoryController.update);
    app.delete('/api/admin/categories/:id', authenticateToken, isAdmin, CategoryController.delete);

    // System Settings Routes
    app.get('/api/admin/settings', authenticateToken, isAdmin, SystemController.getSettings);
    app.put('/api/admin/settings', authenticateToken, isAdmin, SystemController.updateSettings);

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