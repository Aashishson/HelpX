const { GoogleGenerativeAI } = require("@google/generative-ai");
const ComplaintModel = require("../models/ComplaintModel")
require("dotenv").config();

// Initialize Gemini (Ensure your API Key is in .env)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });

exports.CreateComplaint = async (req, res) => {
  try {
    const { Title, Description } = req.body;

    // 1. Create and Save the initial complaint
    const newComplaint = new ComplaintModel({
      title: Title,
      description: Description,
      userID: req.user._id,
      image: req.file ? `/uploads/${req.file.filename}` : null,
      // priority defaults to 'Medium' or 'Pending' in your schema
    });

    const savedComplaint = await newComplaint.save();

    // 2. Trigger Gemini Analysis (Asynchronous)
    // We don't necessarily need to 'await' this if we want to send the response to the user faster,
    // but for reliability, we'll do it here.
    try {
     

      const prompt = `
        Analyze the following user complaint and determine its priority (High, Medium, or Low).
        Return ONLY a JSON object: {"priority": "High/Medium/Low", "reason": "short explanation"}.
        Complaint: "${Description}"
      `;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      console.log(responseText);
      
      const cleanJson = responseText.replace(/```json|```/g, "").trim();
      const analysis = JSON.parse(cleanJson);

      // 3. Update the saved complaint with AI results
      savedComplaint.priority = analysis.priority;
      console.log(analysis.priority);
      // savedComplaint.analysisReason = analysis.reason;
      await savedComplaint.save();
    } catch (aiError) {
      console.error("Gemini Analysis Failed:", aiError);
      // We don't fail the whole request if AI fails, just log it.
    }

    return res.status(200).json({
      message: "Complaint Successfully created and analyzed",
      data: savedComplaint,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

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
        message: "Action denied. You can only delete your own complaints." 
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
    const complaint = await ComplaintModel.findById(id).populate("userID", "name email");

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
        complaints: []
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
        complaints: []
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
    const complaints = await ComplaintModel.find({ userID: userId })
      .sort({ createdAt: -1 })
      

    // 4. Get Status Counts for the Stats Cards
    const [pending, inProgress, resolved, rejected] = await Promise.all([
      ComplaintModel.countDocuments({ userID: userId, status: "pending" }),
      ComplaintModel.countDocuments({ userID: userId, status: "in-progress" }),
      ComplaintModel.countDocuments({ userID: userId, status: "resolved" }),
      ComplaintModel.countDocuments({ userID: userId, status: "rejected"})
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