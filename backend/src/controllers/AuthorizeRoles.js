const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.user?.role; // assuming req.user is set by authentication middleware

        if (!userRole || !allowedRoles.includes(userRole)) {
            return res.status(403).json({ message: "Access denied: Insufficient permissions" });
        }

        next(); // Role is authorized, proceed
    };
};

export default authorizeRoles;