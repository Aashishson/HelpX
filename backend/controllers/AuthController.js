const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UserModel = require("../models/UserModel");


exports.Register = async(req , res) => {
    let {Username,Email,Password} = req.body;
    let checkUserExists = await UserModel.findOne({
        Email: Email.toLowerCase()
    })
    if(checkUserExists){
        res.status(400).json({
            message: "User already Exists! Please try another Email."
        })
    }

    let newUser = new UserModel({
        Email: Email,
        Password: await bcrypt.hash(Password , 12),
        Username: Username,
        Tokens:[{
            Active : True,
            type: "Email-verification",
            token: verifyUserToken
        }]
    });

    await Promise.all([newUser.save()]);

    res.status(200).json({
        message: "Account successfully registered!"
    })
}

exports.Login = async(req,res) => {
    let [UserEmail , Password] = req.body;
    UserEmail = UserEmail.toLowerCase();
    let User = UserModel.findOne({UserEmail});
    if(!User){
        res.status(404).json({
            message: "User Not Found!"
        })
    }

    let checkPassword = bcrypt.compare(Password,User.Password);

    if(!checkPassword){
        res.status(400).json({
            message: "Invalid Credentials!"
        })
    }

    //Generate Tokens: 
    


}