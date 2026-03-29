const {Schema , model} = require("mongoose");
const mongoose = require("mongoose");


const ComplaintSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
  },
  image: {
    type: String,
  },
  status: {
    type: String,
    enum: ["pending", "in-progress", "resolved", "rejected"],
    default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const ComplaintModel = model("Complaint" , ComplaintSchema);
module.exports = ComplaintModel;