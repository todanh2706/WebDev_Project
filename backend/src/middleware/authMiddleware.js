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

export const isAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check for 'ADMIN' string or role ID 2
    const isAdminRole = req.user.role === 2;

    if (!isAdminRole) {
        return res.status(403).json({ error: 'Access denied! Admin only.' });
    }

    next();
};

export const isSeller = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check for 'SELLER' (role ID 1) or 'ADMIN' (role ID 2)
    const isSellerOrAdmin = req.user.role === 1 || req.user.role === 2;

    if (!isSellerOrAdmin) {
        return res.status(403).json({ error: 'Access denied! Seller rights required.' });
    }

    next();
};
