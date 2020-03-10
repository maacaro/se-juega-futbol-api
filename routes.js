var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { createUser } = require("./queries");
const { secret } = require("./config");

module.exports = {
  postUser
};

async function postUser(req, res) {
  const {
    body: { name, email, lastName, password }
  } = req;

  const hashedPassword = bcrypt.hashSync(password, 8);

  try {
    const results = await createUser({
      name,
      email,
      lastName,
      password: hashedPassword
    });
    const token = jwt.sign({ id: results.rows[0].user_id }, secret, {
      expiresIn: 86400
    });
    return res.status(201).send({ auth: true, token });
  } catch (error) {
    return res.status(500).send(error);
  }
}
