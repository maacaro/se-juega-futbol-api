const { registerUSer } = require("./services");

module.exports = {
  postUser
};

async function postUser(req, res) {
  const {
    body: { name, email, lastName, password }
  } = req;

  try {
    const response = await registerUSer({ name, email, lastName, password });

    return res.status(201).send({ ...response });
  } catch (error) {
    return res.status(500).send(error);
  }
}
