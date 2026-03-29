const ComplaintController = require("../controllers/ComplaintController");
const router = require("express").Router();
const { verifyUserToken } = require("../middlewares/AuthMiddleware");
const upload = require("../middlewares/upload");

// Pass the function directly. Express will handle the arguments.
 router.post("/create-complaint", verifyUserToken, upload.single("complaint-Image") , (...args) =>
   ComplaintController.CreateComplaint(...args),
 );

 router.post("/delete-complaint/:id", verifyUserToken ,(...args) => ComplaintController.DeleteComplaint(...args));

 router.get("/complaint-details", verifyUserToken , (...args) => ComplaintController.GetComplaintDetails(...args));

 router.get("/all-complaints" , (...args) => ComplaintController.GetAllComplaintsForAdmin(...args));

 router.get("/user-complaints" , verifyUserToken , (...args) => ComplaintController.GetUserComplaints(...args));

module.exports = router;
