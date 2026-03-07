const route = require("express").Router();
const authController = require("../controllers/AuthController");
const authRoutes = require("./authRoutes");
const googelRoute = require("./googleRoute");


route.use("/auth", authRoutes);
route.use("/authGoogle", googelRoute);

module.exports = route;