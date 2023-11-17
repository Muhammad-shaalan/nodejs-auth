const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");

const verifyToken = (req, res, next) => {
    const authHeader = req.headers["Authorization"] || req.headers["authorization"];
    if(!authHeader) {
        const error = AppError.create("You are not authorized to access this page", 401);
        return next(error);
    }
    const token = authHeader?.split(" ")[1];
    try {
        jwt.verify(token, process.env.JWT_SECRET_KEY);
        next();
    } catch(err) {
        const error = AppError.create("Your session is expired, pleas login again", 401);
        return next(error);
    }
}

module.exports = verifyToken;