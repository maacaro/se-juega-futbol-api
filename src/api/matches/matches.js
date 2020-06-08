const Pool = require("pg").Pool;
const { connectionString } = require("../../config");
const pool = new Pool({
  connectionString: connectionString
});

module.exports = {
  create,
  select
};

function create({ matchName = null, matchDate, matchTime, players, location }) {
  return pool
    .query(
      "INSERT INTO matches (name_matches,match_date,match_time,location_id) VALUES($1,$2,$3,$4) RETURNING match_id",
      [matchName, matchDate, matchTime, location]
    )
    .then(({ rows: [first] }) => {
      const { match_id: matchId } = first;
      return Promise.all(
        players.map(playerId =>
          pool.query(
            "INSERT INTO players_matches (player_id,match_id) VALUES($1,$2) RETURNING match_id,player_id",
            [playerId, matchId]
          )
        )
      );
    });
}

function select({ playerId }) {
  if (playerId) {
    return pool
      .query(
        `SELECT * FROM matches JOIN players_matches ON matches.match_id=players_matches.match_id WHERE players_matches.player_id =${playerId}`
      )
      .then(({ rows }) => rows);
  }
  return pool.query("SELECT * FROM matches").then(({ rows }) => rows);
}
