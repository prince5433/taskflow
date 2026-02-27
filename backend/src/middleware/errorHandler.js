/**
 * Global Error Handler Middleware
 * Catches all errors and returns a structured JSON response
 */
const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
    let errors = null;

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        statusCode = 400;
        message = `Resource not found with id: ${err.value}`;
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        statusCode = 409;
        const field = Object.keys(err.keyValue)[0];
        message = `Duplicate value for '${field}' — this ${field} already exists`;
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        statusCode = 400;
        errors = Object.values(err.errors).map((e) => ({
            field: e.path,
            message: e.message,
        }));
        message = 'Validation failed';
    }

    // Log error in development
    if (process.env.NODE_ENV === 'development') {
        console.error(`❌ [${statusCode}] ${message}`, err.stack);
    }

    res.status(statusCode).json({
        success: false,
        message,
        ...(errors && { errors }),
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

module.exports = errorHandler;
