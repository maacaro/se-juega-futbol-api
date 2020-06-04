const Pool = require("pg").Pool;
const { connectionString } = require("../../config");
const pool = new Pool({
  connectionString: connectionString
});

module.exports = {
  selectPlayers,
  getPlayerById
};

function selectPlayers() {
  return pool
    .query("SELECT user_id, name, last_name FROM users")
    .then(({ rows }) => rows)
    .catch(error => error);
}

function getPlayerById(id) {
  return pool
    .query(`SELECT user_id, name, last_name FROM users WHERE user_id =${id}`)
    .then(({ rows }) => rows)
    .catch(error => error);
}
