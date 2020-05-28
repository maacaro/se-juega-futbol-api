const { selectPlayers } = require("./players");
module.exports = {
  getPlayers
};

async function getPlayers(req, res) {
  try {
    const results = await selectPlayers();
    const players = results.map(user => ({
      name: `${user["name"]} ${user["last_name"]}`,
      id: user["user_id"]
    }));
    return res.status(200).send({ players });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err });
  }
}
