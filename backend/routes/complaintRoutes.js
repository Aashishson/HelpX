const ComplaintController = require("../controllers/ComplaintController");
const router = require("express").Router();
const { verifyUserToken } = require("../middlewares/AuthMiddleware");
const upload = require("../middlewares/upload");

// Pass the function directly. Express will handle the arguments.
 router.post("/create-complaint", verifyUserToken, upload.single("complaint-Image") , (...args) =>
   ComplaintController.CreateComplaint(...args),
 );

 router.delete("/delete-complaint/:id", verifyUserToken ,(...args) => ComplaintController.DeleteComplaint(...args));

 router.get("/complaint-details", verifyUserToken , (...args) => ComplaintController.GetComplaintDetails(...args));

 router.get("/all-complaints" , (...args) => ComplaintController.GetAllComplaintsForAdmin(...args));

 router.get("/user-complaints" , verifyUserToken , (...args) => ComplaintController.GetUserComplaints(...args));

 router.patch("/update-status", verifyUserToken , (...args) => ComplaintController.UpdateComplaintStatus(...args));

 router.get("/user-recent-complaints" , verifyUserToken , (...args) =>
ComplaintController.GetUserRecentComplaints(...args));

module.exports = router;
