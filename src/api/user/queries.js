const Pool = require("pg").Pool;
const { user, host, database, password, port } = require("../../config");

module.exports = {
  createUser
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
