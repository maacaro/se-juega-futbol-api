var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

const { createUser } = require("./queries");
const { secret } = require("../../config");

module.exports = {
  registerUSer
};

async function registerUSer({ email, name, lastName, password }) {
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

    return { auth: true, token };
  } catch (error) {
    throw error;
  }
}
