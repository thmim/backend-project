const express = require("express");
const authControler = require("../controlers/auth.controler")
const router = express.Router();

router.post('/register',authControler.registerUser)

module.exports = router;