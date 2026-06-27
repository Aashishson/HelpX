const router = require("express").Router();
const authController = require("../controllers/AuthController");
const userController = require("../controllers/UserController"); // ✅ add this
const { verifyUserToken } = require("../middlewares/AuthMiddleware"); // ✅ fix destructuring
const {isAdmin} = require("../middlewares/RoleMiddleware");

router.post("/signup", (...args) => authController.Register(...args));
router.post("/login", (...args) => authController.LocalLogin(...args));
router.get("/verify/:token", (...args) => authController.VerifyEmail(...args));
router.post("/send-otp", (...args) => authController.SendOTP(...args));
router.post("/verify-otp", (...args) => authController.VerifyOtp(...args));
router.post("/reset-password", (...args) =>
  authController.ResetPassword(...args),
);
router.post("/logOut", (...args) => authController.logOutUser(...args));

// ✅ user management routes pointing to userController
router.get("/all-users", verifyUserToken, isAdmin, (...args) =>
  userController.GetAllUsers(...args),
);
router.patch("/toggle-role/:id", verifyUserToken, isAdmin, (...args) =>
  userController.ToggleUserRole(...args),
);

router.get("/profile", verifyUserToken, (...args) =>
  userController.GetProfile(...args));
router.put("/profile", verifyUserToken, (...args) =>
  userController.UpdateProfile(...args));

module.exports = router;
