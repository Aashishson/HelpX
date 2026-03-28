const route = require("express").Router();
const authRoutes = require("./authRoutes");
const googelRoute = require("./googleRoute");
const complaintRoutes = require("./complaintRoutes");


route.use("/auth", authRoutes);
route.use("/authGoogle", googelRoute);
route.use("/complaint", complaintRoutes);

module.exports = route;