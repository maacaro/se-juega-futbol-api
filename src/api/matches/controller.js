const { create } = require("./matches");
const { getLocationById } = require("../locations/locations");
const { getPlayerById } = require("../players/players");

module.exports = {
  getMatches,
  postMatches
};
async function getMatches(rwq, res) {
  return null;
}
async function postMatches(req, res) {
  const {
    body: { matchName, matchDate, matchTime, players, location }
  } = req;
  let doesLocationExists;
  let doesAllPlayerExists;
  if (!matchName) {
    return res.status(400).send({});
  }
  if (!matchDate) {
    return res.status(400).send({});
  }
  if (!matchTime) {
    return res.status(400).send({});
  }
  if (!players) {
    return res.status(400).send({});
  }
  if (players.length === 0) {
    return res.status(400).send({});
  }
  if (!location) {
    return res.status(400).send({});
  }
  try {
    doesLocationExists = (await getLocationById(location)).length !== 0;
  } catch (err) {
    return res.status(500).send({ message: "error finding the location" });
  }
  if (doesLocationExists === false) {
    return res.status(400).send({
      message:
        "it appers that the location selected it's not avaible please go to location screen and select a new location"
    });
  }
  try {
    doesAllPlayerExists =
      (await Promise.all(
        players.map(playerId => getPlayerById(playerId))
      )).filter(result => result.length === 0).length === 0;
  } catch (err) {
    return res.status(500).send({ message: "error finding the location" });
  }

  if (doesAllPlayerExists === false) {
    return res.status(400).send({
      message:
        "it appers that there's a player that no longer exist, please go to players screen and select a new player"
    });
  }

  // try{
  //   await create({matchName, matchDate, matchTime, players, location})
  // }
  // return null;
}
