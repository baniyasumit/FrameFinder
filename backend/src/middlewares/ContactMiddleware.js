import rateLimit from "express-rate-limit";

const contactMiddleware = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        message: "Too many contact requests. Please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export default contactMiddleware;