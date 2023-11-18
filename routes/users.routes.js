const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users.controller");


const registerValidationSchema = require("../validations/register.validation");
const loginValidationSchema = require("../validations/login.validation");
const verifyToken = require("../middleware/verifyToken");

const AppError = require("../utils/AppError");


const multer  = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'media')
    },
    filename: function (req, file, cb) {
        const ext = file.mimetype.split("/")[1];
        const uniqueName = `user-${file.fieldname}-${Date.now()}.${ext}`;
        cb(null, uniqueName)

    },
})

const fileFilter = (req, file, cb) => {
    const mimetype = file.mimetype.split("/")[0];
    if(mimetype == "image") {
        return cb(null, true);
    } else {
        return cb(AppError.create("The file must be an image", 400), false)
    }
}

const upload = multer({ storage, fileFilter })

router.route("/")
    .get(verifyToken, usersController.getAllUsers)
router.route("/register")
    .post(upload.single("avatar"), registerValidationSchema(), usersController.createUser) //registerValidationSchema()
router.route("/login")
    .post(upload.single(), loginValidationSchema(), usersController.login)
    
module.exports = router;