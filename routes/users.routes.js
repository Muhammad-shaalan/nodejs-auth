const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users.controller");
const registerValidationSchema = require("../validations/register.validation");
const loginValidationSchema = require("../validations/login.validation");

router.route("/")
    .get(usersController.getAllUsers)
router.route("/register")
    .post(registerValidationSchema(), usersController.createUser)
router.route("/login")
    .post(loginValidationSchema(), usersController.login)
    
module.exports = router;