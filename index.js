const express = require("express");
const app = express();
require("dotenv").config();
const path = require("path")
const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})

const cors = require("cors");
app.use(cors());
app.use(express.json());

const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("DB Connected");
})

app.use("/media", express.static(path.join(__dirname, 'media')));

const usersRoutes = require("./routes/users.routes");
app.use("/api/users", usersRoutes);

const httpStatusText = require("./utils/httpStatusText");

app.use("*", (req, res) => {
    res.status(404).json({status: httpStatusText.ERROR, data: null, message: "This url is not found"});
})
// Errors Middleware
app.use((error, req, res, next) => {
    res.status(error.statusCode || 500).json({status: error.statusText || httpStatusText.ERROR, data: error.data || error.errors || null, message: error.message})
})