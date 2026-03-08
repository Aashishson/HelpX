const passport = require("passport");
const jwt = require("jsonwebtoken");

const SECRET_JWT = process.env.JWT_SECRET;
const CLIENT_URI = process.env.CLIENT_URI;

const {verifyUserToken} = require("../middlewares/AuthMiddleware.js");

const router = require("express").Router();

// Step 1: Redirect user to Google login
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
);

// Step 2: Google callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    try {
      const token = jwt.sign(
        {
          id: req.user._id,
          email: req.user.email,
        },
        SECRET_JWT,
        {
          expiresIn: "7d",
        },
      );

      res.redirect(`${CLIENT_URI}/auth-success?token=${token}`);
    } catch (error) {
      console.error("Google login error", error);

      res.redirect(`${CLIENT_URI}/login?error=google_failed`);
    }
  },
);

// Step 3: Get current user
router.get("/me", verifyUserToken , (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

module.exports = router;
