const ComplaintModel = require("../models/ComplaintModel");
const multer = require("../middlewares/upload");


exports.CreateComplaint = async (req, res) => {
  try {
    const { Title, Description } = req.body;

    
    const newComplaint = new ComplaintModel({
      title: Title,
      description: Description,
      userID: req.user._id,
      image: req.file ? `/uploads/${req.file.filename}` : null,
    });

    
   await newComplaint.save();
  //  console.log("Request Body:", req.body);
  //  console.log("User Info:", req.user);
  //  console.log(newComplaint);

   return res.status(200).json({
     message: "Complaint Successfully created",
   });
  } catch (error) {
    return res.status(500).json({
      message: console.error(error),
    });
  }
};
