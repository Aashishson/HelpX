const ComplaintController = require("../controllers/ComplaintController");
const router = require("express").Router();
const { verifyUserToken } = require("../middlewares/AuthMiddleware");

// Pass the function directly. Express will handle the arguments.
router.post("/create-complaint", verifyUserToken, (...args) =>
  ComplaintController.CreateComplaint(...args),
);

module.exports = router;
