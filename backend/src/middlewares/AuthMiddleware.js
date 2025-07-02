import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
            return res.status(401).json({ message: "Token Expired" });
        }
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};

export default authMiddleware;