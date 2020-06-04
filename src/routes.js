const express = require("express");
const jwt = require("jsonwebtoken");
const { secret } = require("./config");

const { postUser, loginUser } = require("./api/user/controllers");
const { getLocations, postLocations } = require("./api/locations/controllers");
const { getMatches, postMatches } = require("./api/matches/controller");
const { getPlayers } = require("./api/players/controller");
const router = express.Router();

router.post("/user", postUser);
router.post("/login", loginUser);
router.get("/locations", verifyToken, getLocations);
router.post("/locations", verifyToken, postLocations);
router.get("/matches", verifyToken, getMatches);
router.post("/matches", verifyToken, postMatches);
router.get("/players", verifyToken, getPlayers);

async function verifyToken(req, res, next) {
  const token = req.headers["x-access-token"];
  if (!token) {
    return res.status(401).send({ auth: false, message: "No token provided." });
  }
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res
        .status(500)
        .send({ auth: false, message: "Failed to authenticate token." });
    }
    next();
  });
}

module.exports = router;
