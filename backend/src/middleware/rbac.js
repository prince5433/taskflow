/**
 * Role-Based Access Control Middleware
 * Creates a middleware that restricts access to specified roles
 *
 * @param  {...string} roles - Allowed roles (e.g., 'admin', 'user')
 * @returns {Function} Express middleware
 *
 * Usage: authorize('admin') — only admins can access
 *        authorize('admin', 'user') — both roles can access
 */
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized — please authenticate first',
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Forbidden — role '${req.user.role}' does not have access to this resource`,
            });
        }

        next();
    };
};

module.exports = { authorize };
