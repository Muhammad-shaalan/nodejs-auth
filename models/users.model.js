const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: [8, "Password should be at least 8 characters long"],
    },
    token: String
});

module.exports = mongoose.model("User", usersSchema);