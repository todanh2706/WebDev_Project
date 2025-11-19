import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ error: 'Access denied!' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = verified.userId;
        next();
    } catch (err) {
        res.status(401).json({ err: 'Invalid token!' });
    }
};
