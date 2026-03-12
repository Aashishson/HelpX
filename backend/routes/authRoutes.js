const router = require("express").Router();
const authController = require("../controllers/AuthController");


//Do not use the authMiddleware as the user gets authenticated first and if he cant even be authenticated he wont be able to use the functionalities.

router.post("/signup", (...args) => authController.Register(...args)); //(...args) => collects all the arguments for function into an array it is basically (req,res,next)

router.post("/login", (...args) => authController.LocalLogin(...args));
router.get("/verify/:token", (...args) => authController.VerifyEmail(...args));
router.post("/send-otp",(...args) => authController.SendOTP(...args));
router.post("/verify-otp",(...args) => authController.VerifyOtp(...args));
router.post("/reset-password" , (...args) => authController.ResetPassword(...args));
router.post("/logOut", (...args) => authController.logOutUser(...args));
router.post("/refresh-token", (...args) => authController(...args));



module.exports = router;
