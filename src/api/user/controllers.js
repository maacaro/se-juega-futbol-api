const { registerUSer, login } = require("./services");

module.exports = {
  postUser,
  loginUser
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

async function loginUser(req, res) {
  const {
    body: { email, password }
  } = req;
  try {
    const { status, message } = await login({ email, password });
    return res.status(status).send({ message });
  } catch (error) {
    return res.status(500).send(error);
  }
}
