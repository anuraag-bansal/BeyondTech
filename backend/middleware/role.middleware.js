/** Role based authentication middleware
 * @param {Array} roles - The roles to check against
 * @returns {Function} - The middleware function
 */

const roleAuthMiddleware = (roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({message: "Access denied"});
    }
    next();
};

module.exports = {roleAuthMiddleware};
