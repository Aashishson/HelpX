const jwt = require("jsonwebtoken");
const { use } = require("react");
const ACCESS_TOKEN_SECRET = process.env.ACCESS_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_SECRET;

exports.generateAccessToken = (user) => {
    return jwt.sign({
        id: user._id,
        role: user.role
    },
    ACCESS_TOKEN_SECRET,
    {
        expiresIn: "15m"
    }
    )}

exports.generateRefreshToken = (user) => {
    return jwt.sign({
        id: user._id,
        role: user.role
    },
    REFRESH_TOKEN_SECRET,
    {
        expiresIn: "7d"
    }
)}