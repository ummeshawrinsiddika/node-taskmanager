const express = require("express");
const { login, registration } = require("../controllars/authController");
const router = express.Router();

router.get('/test', (req, res) => {     
  res.send({ message: "Server is working!" })
})

// router.post('/login', login)
router.post('/registration', registration)    
module.exports = router;