const { create, select } = require("./matches");
const { getLocationById } = require("../locations/locations");
const { getPlayerById } = require("../players/players");

module.exports = {
  getMatches,
  postMatches
};
async function getMatches(req, res) {
  const playerId = req.query.playerId;
  const embed = req.query.embed || null;
  const matches = await select({ playerId, embed });
  return res.status(200).send(matches);
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

  try {
    const result = await create({
      matchName,
      matchDate,
      matchTime,
      players,
      location
    });
    const match = result.reduce(
      (acum, { rows }) => ({
        ...acum,
        matchId: rows[0]["match_id"],
        players: [...acum["players"], { playerId: rows[0]["player_id"] }]
      }),
      { matchId: null, players: [] }
    );
    return res.status(201).send({ match });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "error creating the match" });
  }
}
