const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserModel = require("../models/UserModel");
const JWT_SECRET = process.env.JWT_SECRET;
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../helpers/token");
const cookies = require("cookie-parser");
const verifyUserTokenMiddleware = require("../middlewares/AuthMiddleware");

exports.Register = async (req, res) => {
  let { Username, Email, Password } = req.body;
  let checkUserExists = await UserModel.findOne({
    Email: Email.toLowerCase(),
  });
  if (checkUserExists) {
    res.status(400).json({
      message: "User already Exists! Please try another Email.",
    });
  }
  let verifyUserToken = randomBytes(20).toString("hex");//is a temperory token for email-verification which i will sent to email via link so when the user clicks the link user's email will be verified.
  let newUser = await new UserModel({
    Email: Email,
    Password: await bcrypt.hash(Password, 12),
    Username: Username,
    Tokens: [
      {
        Active: True,
        type: "Email-verification",
        token: verifyUserToken,
      },
    ],
  });

  await Promise.all([newUser.save()]);

  res.status(200).json({
    message: "Account successfully registered!",
  });
};

exports.LocalLogin = async (req, res) => {
  try {
    let { UserEmail, Password } = req.body;
    UserEmail = UserEmail.toLowerCase();
    let User = await UserModel.findOne({ UserEmail });
    if (!User) {
      res.status(404).json({
        message: "User Not Found!",
      });
    }

    let checkPassword = await bcrypt.compare(Password, User.Password);

    if (!checkPassword) {
      res.status(400).json({
        message: "Invalid Credentials!",
      });
    }

    //Generate Tokens:
    const accessToken = generateAccessToken(User);
    const refreshToken = generateRefreshToken(User);

    req.cookie("nd_Refresh", refreshToken, {
      samesite: "none",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    const resObj = {
      status: 201,
      accessToken,
      role: User.role,
    };

    res.json(resObj);
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error!",
    });
  }
};
