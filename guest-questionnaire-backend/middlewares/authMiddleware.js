const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authorization denied. No token provided.' });
        }

        const token = authHeader.split(' ')[1];
        
        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not defined in environment variables.');
            return res.status(500).json({ message: 'Server configuration error.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Token is not valid.' });
    }
};

module.exports = authMiddleware;
