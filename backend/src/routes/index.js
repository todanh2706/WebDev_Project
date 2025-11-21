import AuthController from '../controllers/authControllers.js'
import { authenticateToken } from '../middleware/authMiddleware.js';

export default (app) => {
    app.post('/api/register', AuthController.register);
    app.post('/api/login', AuthController.logIn);

    app.get('/', (req, res) => {
        res.send('Backend is running!');
    });

    // Create a catch-all route for testing the installation.
    app.use((req, res, next) => {
        res.status(404).send({
            message: "Sorry, can't find that!"
        });
    });
}