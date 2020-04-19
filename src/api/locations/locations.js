const Pool = require("pg").Pool;
const { connectionString } = require("../../config");
const pool = new Pool({
  connectionString: connectionString
});

module.exports = {
  selectLocations
};

function selectLocations() {
  return pool
    .query("SELECT * FROM locations")
    .then(({ rows }) => {
      return rows;
    })
    .catch(error => error);
}
