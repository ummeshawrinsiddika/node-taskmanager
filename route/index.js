const express = require("express");
const router = express.Router();
const authRoute = require("./authRoute");
const projectRoute = require("./projectRoute");
const { authmiddleware } = require("../middleware/authMiddleware");

router.get("/", (req, res)=> {
    res.status(200).send("hello from server")
})

router.use("/auth", authRoute);
router.use("/project", authmiddleware, projectRoute);

module.exports = router;