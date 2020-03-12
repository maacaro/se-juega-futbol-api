const express = require("express");
const { postUser } = require("./api/user/controllers");
const router = express.Router();

router.post("/user", postUser);

module.exports = router;
