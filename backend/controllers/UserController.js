const UserModel = require("../models/UserModel");

// GET all users
exports.GetAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find()
      .select("-Password -Tokens") // don't expose sensitive fields
      .sort({ CreatedAt: -1 });

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("GetAllUsers Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// PATCH toggle user role
exports.ToggleUserRole = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await UserModel.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // toggle between Admin and user
    user.role = user.role === "Admin" ? "user" : "Admin";
    await user.save();

    return res.status(200).json({
      success: true,
      message: `Role updated to ${user.role}`,
      user: {
        _id: user._id,
        Email: user.Email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("ToggleUserRole Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
