 const express = require("express");
const { createProject } = require("../controllers/projectController");
 const { authmiddleware } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/create", authmiddleware, createProject);

module.exports = router;