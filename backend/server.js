const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
app.use(cors());
app.use(express.json());

const seedAdmin = require('./seeder');

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB connected successfully');
        seedAdmin(); // Run seeder
    })
    .catch(err => console.error('MongoDB connection error:', err));

// Import Routes
const authRoutes = require('./routes/auth');
const submissionRoutes = require('./routes/submissions');
const reviewRoutes = require('./routes/reviews');
const assignmentRoutes = require('./routes/assignments');

app.use('/api/auth', authRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/uploads', express.static('uploads'));

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
    // Serve static files from the React build
    app.use(express.static(path.join(__dirname, '../frontend/dist')));

    // For any route that is NOT an API route, serve the React app
    app.get(/\/(.*)/, (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html'));
    });
} else {
    app.get('/', (req, res) => {
        res.send('OACRS API is running');
    });
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
