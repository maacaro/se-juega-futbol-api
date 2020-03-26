const express = require("express");
const { postUser, loginUser } = require("./api/user/controllers");
const router = express.Router();

router.post("/user", postUser);
router.post("/login", loginUser);

module.exports = router;
