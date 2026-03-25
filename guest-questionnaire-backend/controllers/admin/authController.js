const pool = require('../../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password.' });
        }

        const [admins] = await pool.query('SELECT * FROM admins WHERE email = ?', [email]);
        
        if (admins.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const admin = admins[0];

        // Ensure password hashing was used. If plain text for testing, match it
        const isMatch = await bcrypt.compare(password, admin.password_hash);
        
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const payload = {
            id: admin.id,
            email: admin.email
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || '24h'
        });

        res.status(200).json({
            message: 'Login successful',
            token,
            admin: {
                id: admin.id,
                name: admin.name,
                email: admin.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};
