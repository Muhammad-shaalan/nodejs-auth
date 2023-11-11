const { body } = require('express-validator');

const registerValidationSchema = () => {
    return [
        body('name').notEmpty().withMessage("Name field is required")
        .isLength({min: 2}).withMessage("Name length must be at least 2 chars"),
        body('email').notEmpty().withMessage("Email field is required")
        .isEmail().withMessage("Email is not valid"),
        body('password').notEmpty().withMessage("Password field is required")
        .isLength({min: 3}).withMessage("Password length must be more than 3 chars"),
    ]
}

module.exports = registerValidationSchema;