const ComplaintController = require("../controllers/ComplaintController");
const router = require("express").Router();
const { verifyUserToken } = require("../middlewares/AuthMiddleware");
const upload = require("../middlewares/upload");

// Pass the function directly. Express will handle the arguments.
 router.post("/create-complaint", verifyUserToken, upload(single) , (...args) =>
   ComplaintController.CreateComplaint(...args),
 );

module.exports = router;
