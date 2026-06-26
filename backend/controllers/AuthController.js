const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserModel = require("../models/UserModel");
const JWT_SECRET = process.env.JWT_SECRET;
const crypto = require("crypto");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../helpers/token");
const cookies = require("cookie-parser");
const verifyUserTokenMiddleware = require("../middlewares/AuthMiddleware");
const { randomBytes } = require("crypto");
const {
  sendMailwithGmail,
  sendMailwithGmailVerify,
} = require("../helpers/VerifyEmail");
const { SendResetPasswordMail } = require("../helpers/ForgotPassword.js");

exports.RefreshToken = async (req, res) => {
  const refreshToken = req.cookies.nd_refresh;
  if (!refreshToken)
    return res.status(401).send("Access Denied: No Refresh Token Provided!");
  try {
    const verified = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const accessToken = Token.generateAccessToken(verified);
    return res.json({ accessToken });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Refresh token has expired",
        command: "force_logout",
      });
    }
    return res.status(400).send("Invalid Token");
  }
};

exports.Register = async (req, res) => {
  const { Username, Email, Password } = req.body;
  const checkUserExists = await UserModel.findOne({
    Email,
  });
  if (checkUserExists) {
    return res.status(400).json({
      message: "User already Exists! Please try another Email.",
    });
  }
  let verifyUserToken = randomBytes(20).toString("hex");
  const newUser = new UserModel({
    Email: Email,
    Password: await bcrypt.hash(Password, 12),
    Username: Username,
    Tokens: [
      {
        Active: true,
        Types: ["EMAIL_VERIFICATION"],
        token: verifyUserToken,
      },
    ],
  });

  await Promise.all([newUser.save()]);

  await sendMailwithGmailVerify(newUser, verifyUserToken);

  return res.status(200).json({
    message: "Account successfully registered!",
  });
};

exports.LocalLogin = async (req, res) => {
  try {
    let { Email, Password } = req.body;
    const User = await UserModel.findOne({ Email });
    if (!User) {
      return res.status(401).json({
        message: "User Not Found!",
      });
    }

    const checkPassword = await bcrypt.compare(Password, User.Password); // ✅ fixed

    if (!checkPassword) {
      return res.status(401).json({
        message: "Wrong Password, Please try again!",
      });
    }

    const accessToken = generateAccessToken(User);
    const refreshToken = generateRefreshToken(User);

    res.cookie("nd_Refresh", refreshToken, {
      sameSite: "none",
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    const resObj = {
      status: 201,
      accessToken,
      role: User.role,
    };

    User.isLoggedIn = true;
    await User.save();
    return res.json(resObj);
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error!",
    });
  }
};

exports.VerifyEmail = async (req, res) => {
  const token = req.params.token;
  const user = await UserModel.findOne({
    "Tokens.token": token,
  });

  if (!user) {
    return res.status(402).json({
      message: "Invalid Token!",
    });
  }

  user.Verified = true;
  await user.save();

  return res.send("Email Verified successfully!");
};

exports.SendOTP = async (req, res) => {
  try {
    const { Email } = req.body;
    const user = await UserModel.findOne({ Email });

    if (!user) {
      return res.status(402).json({
        message: "No such email found!",
      });
    }
    user.Tokens.forEach((t) => {
      if (t.Types.includes("RESET_PASSWORD")) {
        t.Active = false;
      }
    });

    const resetToken = randomBytes(20).toString("hex");
    const randomOtp = crypto.randomInt(100000, 999999);
    const token = {
      Active: true,
      Expires: new Date(Date.now() + 10 * 60 * 1000),
      Types: ["RESET_PASSWORD"],
      token: resetToken,
      OTP: randomOtp,
    };

    user.markModified("Tokens");
    user.Tokens.push(token);

    await SendResetPasswordMail(randomOtp, user.Email, user.UserName);
    await user.save();

    res.status(202).json({
      message: "OTP sent successfully!",
    });
  } catch (error) {
    console.error("SendOTP error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.VerifyOtp = async (req, res) => {
  try {
    const { Email, Otp } = req.body;
    const user = await UserModel.findOne({ Email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const token = user.Tokens.find(
      (t) =>
        t.OTP === Number(Otp) &&
        t.Types.includes("RESET_PASSWORD") &&
        t.Active === true,
    );

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (new Date() > token.Expires) {
      return res.status(400).json({
        message: "OTP expired",
      });
    }

    return res.status(200).json({
      message: "OTP verified successfully",
      success: true,
      resetToken: token.token,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
    });
  }
};

exports.ResetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await UserModel.findOne({
      "Tokens.token": token,
      "Tokens.Types": "RESET_PASSWORD",
      "Tokens.Active": true,
    });

    if (!user) {
      return res.status(404).json({
        message: "Invalid or expired token",
      });
    }

    const tokenData = user.Tokens.find(
      (t) =>
        t.token === token &&
        t.Types.includes("RESET_PASSWORD") &&
        t.Active === true,
    );

    if (!tokenData) {
      return res.status(400).json({
        message: "Invalid token",
      });
    }

    if (new Date() > tokenData.Expires) {
      return res.status(400).json({
        message: "Token expired",
      });
    }

    user.Password = await bcrypt.hash(newPassword, 12);
    tokenData.Active = false;
    await user.save();

    return res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: console.error(error),
      message: "Internal Server Error",
    });
  }
};

exports.logOutUser = async (req, res) => {
  try {
    res.clearCookie("nd_Refresh");
    return res.status(200).json({
      message: "Successfully Logged Out!",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error!",
    });
  }
};


