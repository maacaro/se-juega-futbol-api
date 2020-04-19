const { selectLocations } = require("./locations");

module.exports = {
  getLocations
};

async function getLocations(req, res) {
  try {
    const result = await selectLocations();
    return res.status(200).send({ locations: result });
  } catch (err) {
    return res.status(500).send({});
  }
}
