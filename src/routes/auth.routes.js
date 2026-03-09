const express = require("express");
const authControler = require("../controlers/auth.controler")
const router = express.Router();
// register api
router.post('/register',authControler.registerUser)

// login api
router.post('/login',authControler.loginUser)

module.exports = router;