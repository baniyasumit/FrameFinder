import jwt from 'jwtwebtoken'

const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next(); // User is authenticated
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};