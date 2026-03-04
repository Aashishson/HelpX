const express = require("express");
const connectMongoDB = require("./config/ConnnectMongoDB");
const dotenv = require("dotenv").config();
const routes = require("./routes");


const PORT = process.env.PORT;


const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/api", routes);
// app.use("/api", require("./routes"));
connectMongoDB();

app.listen(PORT, () =>{
    console.log("Server is running at port " + PORT);
})



