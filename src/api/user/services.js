var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

const { createUser, findUserByEmail } = require("./queries");
const { secret } = require("../../config");

module.exports = {
  registerUSer,
  login
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

async function login({ email, password }) {
  const result = await findUserByEmail(email);
  if (!result) {
    return { status: 404, message: "User not Found" };
  }

  const { userID, password: passwordSaved } = result;
  const passwordIsValid = bcrypt.compareSync(password, passwordSaved);

  if (passwordIsValid === false) {
    return { auth: false, token: null };
  }

  const token = jwt.sign({ id: userID }, secret, {
    expiresIn: 86400
  });

  return { auth: true, token };
}
