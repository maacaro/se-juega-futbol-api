const Pool = require("pg").Pool;
const { user, host, database, password, port } = require("../../config");

module.exports = {
  createUser,
  findUserByEmail
};

const pool = new Pool({
  user,
  host,
  database,
  password,
  port
});

function createUser({ name, email, lastName, password }) {
  if (!name === true) {
    throw new Error("name should have a value");
  }
  if (!lastName === true) {
    throw new Error("last name should have a value");
  }
  if (!email === true) {
    throw new Error("email should have a value");
  }
  if (!password === true) {
    throw new Error("password should have a value");
  }
  return pool
    .query(
      "INSERT INTO users (name,email,last_name,password) VALUES($1,$2,$3,$4) RETURNING user_id",
      [name, email, lastName, password]
    )
    .then(results => {
      return results;
    })
    .catch(error => error);
}

function findUserByEmail(email) {
  if (!email === true) {
    throw new Error(`email should have a value ${email}`);
  }
  return pool
    .query(`SELECT user_id, password FROM users where email ='${email}'`)
    .then(results => {
      if (results.rows.length <= 0) {
        return null;
      }
      return {
        userID: results.rows[0].user_id,
        password: results.rows[0].password
      };
    })
    .catch(error => error);
}
