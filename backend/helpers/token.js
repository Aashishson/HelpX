const jwt = require("jsonwebtoken");
const { use } = require("react");
const ACCESS_TOKEN_SECRET = process.env.ACCESS_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_SECRET;

exports.generateAccessToken = async(user) => {

    delete user.iat;
    delete user.ex;
    return jwt.sign({
        id: user._id,
        role: user.role
    },
    ACCESS_TOKEN_SECRET,
    {
        expiresIn: "15m"
    }
    
)

}

exports.generateRefreshToken = async(user) => {

    delete user.iat;
    delete user.ex;
    return jwt.sign({
        id: user._id,
        role: user.role
    },
    REFRESH_TOKEN_SECRET,
    {
        expiresIn: "7d"
    }
)
}