const {Schema , model} = require("mongoose");
const USER_TOKEN_TYPES = process.env.USER_TOKEN_TYPES;

const UserSchema = new Schema({
    Email:{
        unique: true,
        type: String,
        required: true,
    },
    UserName: {
        type: String,
    },
    Password: {
        type: String
    },
    role: {
        type: String,
        enum:["Admin","user"],
        default: "user"
    },
    Tokens: [{
        Active: {
            type: Boolean
        },
        Expires: {
            type: Date
        },
        token: {
            type: String
        },
        OTP: {
            type: Number
        },
        Types:[{type: String, enum: USER_TOKEN_TYPES}]
        //userTokenTypes: Email Verification , Reset Password
    }],
    Verified: {
        default: false,
        type: Boolean    
    },
    CreatedAt: {
        type: Date,
        default: Date.now()
    }
})

const UserModel = model("User" , UserSchema);
module.exports = UserModel;

