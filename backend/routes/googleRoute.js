const passport = require("passport");
const jwt = require("jsonwebtoken");
const { verifyUserToken } = require("../middlewares/AuthMiddleware.js");
const router = require("express").Router();
const CLIENT_URI = process.env.CLIENT_URI;

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    try {
      const token = jwt.sign(
        {
          id: req.user._id,
          role: req.user.role, // ✅ include role
        },
        process.env.ACCESS_SECRET, // ✅ match middleware
        { expiresIn: "7d" },
      );

      res.redirect(`${CLIENT_URI}/auth-success?token=${token}`);
    } catch (error) {
      console.error("Google login error", error);
      res.redirect(`${CLIENT_URI}/login?error=google_failed`);
    }
  },
);

router.get("/me", verifyUserToken, (req, res) => {
  res.json({ success: true, user: req.user });
});

module.exports = router;
