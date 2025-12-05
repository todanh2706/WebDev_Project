import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ error: 'Access denied! Token missing.' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET || 'access_secret');
        req.user = verified; // Attach the whole payload (id, email) to req.user
        next();
    } catch (err) {
        console.error("Token verification failed:", err.message);
        res.status(401).json({ error: 'Invalid token!' });
    }
};
