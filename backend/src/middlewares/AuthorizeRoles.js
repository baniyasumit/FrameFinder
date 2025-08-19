const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.user?.role;

        if (!userRole || !allowedRoles.includes(userRole)) {
            return res.status(403).json({ message: "Access denied: Insufficient permissions" });
        }

        next(); // Role is authorized, proceed
    };
};

export default authorizeRoles;