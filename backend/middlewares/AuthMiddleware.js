const jwt = require("jsonwebtoken");
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const JWT_SECRET = process.env.JWT_SECRET;

exports.verifyUserToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "No access token found!",
      });
    }

    const token = authHeader.split(" ")[1];

    const verified = jwt.verify(token, JWT_SECRET);

    req.user = verified; // attach user info to request

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token has expired, please login again!",
      });
    }

    return res.status(400).json({
      message: "Invalid token!",
    });
  }
};
