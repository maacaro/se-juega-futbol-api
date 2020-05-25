const { selectLocations, create } = require("./locations");

module.exports = {
  getLocations,
  postLocations
};

async function getLocations(req, res) {
  try {
    const result = await selectLocations();
    return res.status(200).send({ locations: result });
  } catch (err) {
    return res.status(500).send({});
  }
}

async function postLocations(req, res) {
  const {
    body: { name, latitude, longitude, address }
  } = req;
  if (!name) {
    return res.status(400).send({});
  }
  if (!latitude) {
    return res.status(400).send({});
  }
  if (!longitude) {
    return res.status(400).send({});
  }
  if (!address) {
    return res.status(400).send({});
  }

  try {
    await create({ name, latitude, longitude, address });
    return res.status(201).send({});
  } catch (err) {
    console.log(err);
    return res.status(500).send({});
  }
}
