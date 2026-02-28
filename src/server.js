require('dotenv').config();
const dns = require('dns');
if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder('ipv4first');
}
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/apiRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS — allow frontend origins
const allowedOrigins = [
    'http://localhost:8080',
    'http://localhost:3000',
    'http://localhost:5173',
    process.env.FRONTEND_URL, // injected in Vercel env vars
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (e.g. curl, Postman) and known origins
        if (!origin || allowedOrigins.includes(origin) || /\.vercel\.app$/.test(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json()); // Built-in parsing for JSON body

// Routes
app.use('/api', apiRoutes);

// Health Check
app.get('/', (req, res) => {
    res.json({ message: 'NPTC Feedback Backend is running ✅' });
});

// Start Server (only in local dev — Vercel uses the exported app)
if (process.env.NODE_ENV !== 'production' || process.env.VERCEL !== '1') {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log('Using MVC structure with controllers and models connected to Supabase');
    });
}

// CRITICAL: Export for Vercel serverless
module.exports = app;
