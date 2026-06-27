const ComplaintController = require("../controllers/ComplaintController");
const router = require("express").Router();
const { verifyUserToken } = require("../middlewares/AuthMiddleware");
const upload = require("../middlewares/upload");
const {isAdmin} = require("../middlewares/RoleMiddleware");

// Create complaint
router.post(
  "/create-complaint",
  verifyUserToken,
  upload.single("complaint-Image"),
  ComplaintController.CreateComplaint,
);

// Delete complaint
router.delete(
  "/delete-complaint/:id",
  verifyUserToken,
  ComplaintController.DeleteComplaint,
);

// Get single complaint details — fixed: added /:id param
router.get(
  "/details/:id",
  verifyUserToken,
  ComplaintController.GetComplaintDetails,
);

// Get all complaints (admin)
router.get("/all-complaints",verifyUserToken,isAdmin, ComplaintController.GetAllComplaintsForAdmin);

// Get logged-in user's complaints
router.get(
  "/user-complaints",
  verifyUserToken,
  ComplaintController.GetUserComplaints,
);

// Update complaint status (admin) — fixed: added /:id param
router.patch(
  "/update-status/:id",
  verifyUserToken,
  isAdmin,
  ComplaintController.UpdateComplaintStatus,
);

// Get user's recent complaints
router.get(
  "/user-recent-complaints",
  verifyUserToken,
  ComplaintController.GetUserRecentComplaints,
);

// Edit complaint — fixed: changed POST to PUT
router.put("/edit/:id", verifyUserToken, ComplaintController.EditComplaint);

module.exports = router;
