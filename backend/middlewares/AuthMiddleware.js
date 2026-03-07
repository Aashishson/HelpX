const jwt = require("jsonwebtoken");
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

exports.verifyUserToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(404).json({
        message: "No access token found!",
      });
    }

    const token = authHeader.split(" ")[1];
    const verified = jwt.verify(token, ACCESS_TOKEN_SECRET);
    req.user = verified;//attaches the user info to the request object and sends it to the controllers/api 

    if (!verified) {
      res.status(400).json({
        message: "Token Expired Error,Please Login Again",
      });
    }

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      res.status(401).json({
        message: "Token has expired,Please Login Again!",
      });
    }

    return res.status(400).json({
      message: "Invalid Token!",
    });
  }
};
