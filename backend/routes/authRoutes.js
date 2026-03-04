const route = require("express").Router();
const authController = require("../controllers/AuthController");

//Do not use the authMiddleware as the user gets authenticated first and if he cant even be authenticated he wont be able to use the functionalities.


route.post("/signup" ,(...args) => authController.Register(...args));//(...args) => collects all the arguments for function into an array it is basically (req,res,next)

route.post("/login",(...args) => authController.LocalLogin(...args));
route.get("/verify/:token",(...args) => authController.VerifyEmail(...args));

module.exports = route;