const mongoose = require("mongoose");
require("dotenv").config();

const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected Successfully ✅");
  } catch (error) {
    console.error("Full error:", error); // changed this line
    process.exit(1);
  }
};
module.exports = connectMongoDB;
