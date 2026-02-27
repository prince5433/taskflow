const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const swaggerSpec = require('../swagger');

// Import routes
const authRoutes = require('./routes/v1/authRoutes');
const taskRoutes = require('./routes/v1/taskRoutes');

// Initialize Express
const app = express();

// ─────────────────────────────────────────────
// Security Middleware
// ─────────────────────────────────────────────
app.use(helmet()); // Security headers

// CORS configuration
app.use(
    cors({
        origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);

// Rate limiting (100 requests per 15 minutes per IP)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        message: 'Too many requests, please try again later',
    },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', limiter);

// ─────────────────────────────────────────────
// Body Parsing & Logging
// ─────────────────────────────────────────────
app.use(express.json({ limit: '10kb' })); // Body limit for security
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// ─────────────────────────────────────────────
// API Routes (Versioned)
// ─────────────────────────────────────────────
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tasks', taskRoutes);

// ─────────────────────────────────────────────
// API Documentation (Swagger)
// ─────────────────────────────────────────────
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'TaskFlow API Documentation',
}));

// ─────────────────────────────────────────────
// Health Check
// ─────────────────────────────────────────────
app.get('/api/v1/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'TaskFlow API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
    });
});

// ─────────────────────────────────────────────
// 404 Handler (Express 5 compatible)
// ─────────────────────────────────────────────
app.all('/{*splat}', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
    });
});

// ─────────────────────────────────────────────
// Global Error Handler
// ─────────────────────────────────────────────
app.use(errorHandler);

// ─────────────────────────────────────────────
// Start Server
// ─────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`\n🚀 TaskFlow API Server running on port ${PORT}`);
            console.log(`📚 API Docs: http://localhost:${PORT}/api-docs`);
            console.log(`💚 Health: http://localhost:${PORT}/api/v1/health`);
            console.log(`🌍 Environment: ${process.env.NODE_ENV}\n`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error.message);
        console.error('💡 Make sure MongoDB is running on the URI specified in .env');
        process.exit(1);
    }
};

startServer();
