const { GoogleGenAI } = require("@google/genai");
const ComplaintModel = require("../models/ComplaintModel");
require("dotenv").config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

exports.CreateComplaint = async (req, res) => {
  try {
    const { Title, Description } = req.body;

    const newComplaint = new ComplaintModel({
      title: Title,
      description: Description,
      userID: req.user._id,
      image: req.file ? `/uploads/${req.file.filename}` : null,
      priority: "Medium",
    });

    
    const savedComplaint = await newComplaint.save();

    res.status(200).json({
      message: "Complaint created successfully",
      data: savedComplaint,
    });
    analyzeComplaint(newComplaint._id, Description);

   
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error,
    });
  }
};

async function analyzeComplaint(complaintId, description) {
  try {
    const prompt = `
Analyze the complaint and return STRICT JSON ONLY.

Format:
{"priority": "High" | "Medium" | "Low"}

Complaint: "${description}"
`;

    // ✅ NEW API CALL
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let text = response.text;

    text = text.replace(/```json|```/g, "").trim();

    let analysis;

    try {
      analysis = JSON.parse(text);
    } catch {
      console.warn("Invalid JSON from Gemini:", text);
      analysis = { priority: "Medium" };
    }

    await ComplaintModel.findByIdAndUpdate(complaintId, {
      priority: analysis.priority || "Medium",
    });

    console.log("AI Analysis Done:", analysis);
  } catch (err) {
    console.error("Gemini Analysis Failed:", err);
    
  }
}
// controllers/ComplaintController.js

exports.DeleteComplaint = async (req, res) => {
  try {
    // 1. Get the MongoDB _id from the URL parameters
    const complaintId = req.params.id;
    const currentUserId = req.user._id; // From your verifyUserToken middleware

    // 2. Find the complaint first to check ownership
   
    const complaint = await ComplaintModel.findById(complaintId);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // 3. Security: Ensure the user deleting it is the one who created it
    if (complaint.userID.toString() !== currentUserId.toString()) {
      return res.status(403).json({
        message: "Action denied. You can only delete your own complaints.",
      });
    }

    // 4. Perform the deletion using the ._id
    await ComplaintModel.findByIdAndDelete(complaintId);

    return res.status(200).json({
      message: "Complaint successfully deleted from your dashboard",
    });
  } catch (error) {
    console.error("Delete Error:", error);
    return res.status(500).json({
      message: "Server error occurred while deleting the complaint",
    });
  }
};

// controllers/ComplaintController.js

exports.GetComplaintDetails = async (req, res) => {
  try {
    const { id } = req.params; // Get the ._id from the URL

    // Find the complaint and 'populate' the userID to get user details
    const complaint = await ComplaintModel.findById(id).populate(
      "userID",
      "name email",
    );

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found",
      });
    }

    // Security: Optional - if you want ONLY the owner or an Admin to see it
    // if (complaint.userID._id.toString() !== req.user._id.toString()) {
    //   return res.status(403).json({ message: "Access denied" });
    // }

    return res.status(200).json({
      message: "Complaint details retrieved successfully",
      complaint,
    });
  } catch (error) {
    console.error("Fetch Details Error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// controllers/ComplaintController.js

exports.GetRecentComplaints = async (req, res) => {
  try {
    // 1. Fetch complaints sorted by newest first
    // 2. Limit to the 5 most recent ones
    // 3. Populate user info so we know who filed them
    const recentComplaints = await ComplaintModel.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("userID", "name email");

    if (!recentComplaints || recentComplaints.length === 0) {
      return res.status(200).json({
        message: "No complaints found",
        complaints: [],
      });
    }

    return res.status(200).json({
      success: true,
      count: recentComplaints.length,
      complaints: recentComplaints,
    });
  } catch (error) {
    console.error("Recent Complaints Error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// controllers/ComplaintController.js

exports.GetAllComplaintsForAdmin = async (req, res) => {
  try {
    // 1. Fetch all complaints from the collection
    // 2. Sort by 'createdAt' descending (newest first)
    // 3. Populate 'userID' to get the name and email of the complainant
    const allComplaints = await ComplaintModel.find()
      .sort({ createdAt: -1 })
      .populate("userID", "name email");

    if (!allComplaints || allComplaints.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No complaints found in the system.",
        complaints: [],
      });
    }

    return res.status(200).json({
      success: true,
      count: allComplaints.length,
      complaints: allComplaints,
    });
  } catch (error) {
    console.error("Admin Fetch Error:", error);
    return res.status(500).json({
      message: "Internal Server Error occurred while fetching all complaints.",
    });
  }
};

exports.GetUserComplaints = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Define Pagination Parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    // 2. Get Total Count for this specific user
    const totalCount = await ComplaintModel.countDocuments({ userID: userId });

    // 3. Fetch Sliced Data
    const complaints = await ComplaintModel.find({ userID: userId }).sort({
      createdAt: -1,
    });

    // 4. Get Status Counts for the Stats Cards
    const [pending, inProgress, resolved, rejected] = await Promise.all([
      ComplaintModel.countDocuments({ userID: userId, status: "pending" }),
      ComplaintModel.countDocuments({ userID: userId, status: "in-progress" }),
      ComplaintModel.countDocuments({ userID: userId, status: "resolved" }),
      ComplaintModel.countDocuments({ userID: userId, status: "rejected" }),
    ]);

    res.status(200).json({
      success: true,
      complaints,
      counts: {
        total: totalCount,
        pending,
        inProgress,
        resolved,
      },
    });
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ message: "Error fetching user complaints" });
  }
};

// controllers/ComplaintController.js

exports.UpdateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // 1. Define allowed statuses to prevent database corruption
    const validStatuses = ["pending", "in-progress", "resolved", "rejected"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    // 2. Update the document
    const updatedComplaint = await ComplaintModel.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }, // 'new' returns the updated doc, 'runValidators' checks Schema rules
    );

    if (!updatedComplaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Status updated to ${status}`,
      complaint: updatedComplaint,
    });
  } catch (error) {
    console.error("Update Status Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
