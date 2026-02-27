const route = require("express").Router();
const authController = require("../controllers/AuthController");
const authRoutes = require("./authRoutes");

route.use("/auth". authRoutes);

module.exports = route;