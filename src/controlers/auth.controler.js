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

// login function
async function loginUser(req,res) {
    const {username,email,password} = req.body;
    const user = await userModel.findOne({
        $or:[
            {username},
            {email}
        ]
    })
    if(!user){
        res.status(401).send({
            message:"Invalid credential"
        })
    }

    const isPasswordValid = await bcrypt.compare(password,user.password)
    if(!isPasswordValid){
        res.status(401).send({
            message:"Invalid credential"
        })
    }

    const token = jwt.sign({
        id:user._id,
        role:user.role
    },process.env.JWT_SECRET_KEY)

    res.cookie("token",token);

    res.status(200).send({
        message:"Login sucessfully",
        user: {
            username: user.username,
            email: user.email,
            password: user.password,
            id: user._id,
            role: user.role,
        }

    })
}

module.exports = {registerUser,loginUser};