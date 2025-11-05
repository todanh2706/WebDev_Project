import AuthController from '../controllers/authControllers.js'

export default (app) => {
    app.post('/register', AuthController.signUp);

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