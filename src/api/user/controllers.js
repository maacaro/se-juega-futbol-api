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
    if (response.status === 409) {
      return res.status(409).send({ message: response.message });
    }
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
    const { status, message, auth, token } = await login({ email, password });
    if (status === 404) {
      return res.status(status).send({ message });
    }
    if (auth === false) {
      return res.status(401).send({ auth, token });
    }
    return res.status(200).send({ auth, token });
  } catch (error) {
    return res.status(500).send(error);
  }
}
