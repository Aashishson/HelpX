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
const {randomBytes} = require("crypto");
const { sendMailwithGmail } = require("../helpers/VerifyEmail");

exports.Register = async (req, res) => {
  const { Username, Email, Password } = req.body;
  const checkUserExists = await UserModel.findOne({
    Email
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
  console.log("USER OBJECT:", newUser);
   await sendMailwithGmail(newUser, verifyUserToken);
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
     return res.status(404).json({
        message: "User Not Found!"
      });
    }

    const checkPassword = await bcrypt.compare(Password, User.Password);

    if (!checkPassword) {
     return res.status(400).json({
        message: "Invalid Credentials!"
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

    return res.json(resObj);
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error!",
    });
  }
};

exports.VerifyEmail = async (req , res) => {
    
  const{token} = req.params;
  const user = await UserModel.findOne({
    "Tokens.token": token

  })
  if(!user){
    return res.status(402).json({
      message: "There was a problem following the verification process.Please try again!"
    })
  }

  user.Verified = true;
  await user.save();

  return res.send("Email Verified successfully!")
      


}
