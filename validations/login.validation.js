const { body} = require("express-validator");

const loginValidationSchema = () => {
    return [
        body('email').notEmpty().withMessage("Email field is required")
        .isEmail().withMessage("Email is not valid"),
        body('password').notEmpty().withMessage("Password field is required")
        .isLength({min: 3}).withMessage("Password length must be more than 3 chars"),
    ]
}

module.exports = loginValidationSchema;