const Pool = require("pg").Pool;
const { connectionString } = require("../../config");
const pool = new Pool({
  connectionString: connectionString
});

module.exports = {
  selectLocations,
  create
};

function selectLocations() {
  return pool
    .query("SELECT * FROM locations")
    .then(({ rows }) => {
      return rows;
    })
    .catch(error => error);
}

function create({ name, latitude, longitude, address }) {
  return pool
    .query(
      "INSERT INTO locations (location_name,latitude,longitude,address) VALUES($1,$2,$3,$4) RETURNING location_id",
      [name, latitude, longitude, address]
    )
    .then(results => {
      return results;
    });
}
