require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route
app.get('/', (req, res) => {
    res.send('Guest Questionnaire System API is running');
});

// Import Routes
const authRoutes = require('./routes/admin/authRoutes');
const masterRoutes = require('./routes/admin/masterRoutes');
const formBuilderRoutes = require('./routes/admin/formBuilderRoutes');
const guestRoutes = require('./routes/guest/guestRoutes');

app.use('/api/v1/admin/auth', authRoutes);
app.use('/api/v1/admin/masters', masterRoutes);
app.use('/api/v1/admin/forms', formBuilderRoutes);
app.use('/api/v1/guest', guestRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
