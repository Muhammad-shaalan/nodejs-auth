const User = require("../models/users.model");
const { validationResult } = require('express-validator');
const asyncWrapper = require("../middleware/asyncWrapper");
const httpStatusText = require("../utils/httpStatusText");
const AppError = require("../utils/AppError");
const bcrypt = require('bcrypt');
const generateJWT = require("../utils/generateJWT");


const getAllUsers = asyncWrapper(
    async (req, res) => {
        const users = await User.find({}, {__v: false, password: false})
        res.status(200).json({status: httpStatusText.SUCCESS, statusCode: 200, data: {users}})
    }
)

const checkEmailExisted = async (email) => {
    const user = await User.findOne({email});
    return user;
}

const createUser = asyncWrapper(
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = AppError.create("Validation Failed", 400, httpStatusText.FAIL, errors.array());
            return next(error);
        }


        const {name, email, password} = req.body;
        const oldUser = await checkEmailExisted(email);
        if(oldUser) {
            const error = AppError.create("This email is existed", 400, httpStatusText.FAIL);
            return next(error);
        }


        const hashedPassword = await bcrypt.hash(password, 8)
        const data = new User({
            name, 
            email, 
            password: hashedPassword,
            avatar: req.file.filename
            
        });
        const token = await generateJWT({user: data.email, id: data._id});
        data.token = token
        await data.save();

        return res.status(201).json({status: httpStatusText.SUCCESS, statusCode: 201, data})
    }
)

const login = asyncWrapper(
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = AppError.create("Validation Failed", 400, httpStatusText.FAIL, errors.array());
            return next(error);
        }


        const {email, password} = req.body;
        const user = await User.findOne({email}, {__v: false})
        if(!user) {
            const error = AppError.create("This email is not existed", 404, httpStatusText.FAIL, user);
            next(error);
        }


        const matchedPassword = await bcrypt.compare(password, user.password)
        if(user && matchedPassword) {
            const token = await generateJWT({user: user.email, id: user._id});
            const userResponse = {
                name: user.name,
                email: user.email,
                token
            };
            return res.status(201).json({status: httpStatusText.SUCCESS, statusCode: 201, data: {...userResponse}})
        } else {
            const error = AppError.create("email or password is wrong", 400, httpStatusText.FAIL);
            next(error);
        }
    }
)


module.exports = {
    getAllUsers,
    createUser,
    login
}