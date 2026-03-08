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
  //is a temperory token for email-verification which i will send to email via link so when the user clicks the link user's email will be verified.
  const newUser = new UserModel({
    Email: Email,
    Password: await bcrypt.hash(Password, 12),
    Username: Username,
    Tokens: [
      {
        Active: true,
        type: "EMAIL_VERIFICATION",
        token: verifyUserToken,
      },
    ],
  });

  await Promise.all([newUser.save()]);

  await sendMailwithGmailVerify(newUser, verifyUserToken);
  // console.log(Email,Password);

  return res.status(200).json({
    message: "Account successfully registered!",
  });
};

exports.LocalLogin = async (req, res) => {
  try {
    let { Email, Password } = req.body;
    const User = await UserModel.findOne({ Email });
    // console.log(req.body);
    if (!User) {
      return res.status(401).json({
        message: "User Not Found!",
      });
    }

    const checkPassword = await bcrypt.compare(Password, User.Password);

    if (!checkPassword) {
      return res.status(401).json({
        message: "Wrong Password,Please try again!",
      });
    }

    //Generate Tokens:
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
  const { token } = req.params.token;
  const user = await UserModel.findOne({
    verifyUserToken: token,
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

exports.ResetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "No such email found!",
      });
    }
    const resetToken = randomBytes(20).toString("hex");

    const randomOtp = crypto.randomInt(100000, 999999);
    const token = {
      Active: true,
      Expires: new Date(new Date().setDate(new Date().getDate() + 10)),
      Type: "reset_password",
      Token: resetToken,
      Otp: randomOtp,
    };

    user.Tokens.push(token);

    await UserModel.updateOne({ email }, { $set: { "Tokens.OTP": randomOtp } });
    await user.save();

    // Write the email function:-
    

    res.status(202).json({
      message: "OTP sent successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
