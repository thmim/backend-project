const userModel = require("../models/user.models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
async function registerUser(req, res) {
    const { username, email, password, role = "user" } = req.body;

    const isUserAlreadyExist = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    })

    if (isUserAlreadyExist) {
        return res.status(409).send({
            message: "User already exist"
        })
    }
    const hash = await bcrypt.hash(password, 10)

    const user = await userModel.create({
        username, email, password:hash, role
    })

    const token = jwt.sign({
        id: user._id,
        role: user.role
    }, process.env.JWT_SECRET_KEY)

    // save token in the cookies
    res.cookie("token", token)

    res.status(201).send({
        message: "User created Successfully",
        user: {
            username: user.username,
            email: user.email,
            password: user.password,
            id: user._id,
            role: user.role,
        }
    })
}

module.exports = {registerUser};