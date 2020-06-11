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

async function select({ playerId, embed }) {
  let players = [];
  let locations = [];
  let hasEmbededPlayers =
    (embed !== null && embed.includes("players")) || false;
  let hasEmbededLocation =
    (embed !== null && embed.includes("location")) || false;

  if (hasEmbededPlayers) {
    const { rows } = await pool.query(
      `SELECT name, last_name , players_matches.match_id FROM users JOIN players_matches ON users.user_id=players_matches.player_id`
    );
    players = [...rows];
  }
  if (hasEmbededLocation) {
    const { rows } = await pool.query("SELECT * FROM locations");
    locations = [...rows];
  }
  if (playerId) {
    const { rows: matches } = await pool.query(
      `SELECT * FROM matches JOIN players_matches ON matches.match_id=players_matches.match_id WHERE players_matches.player_id =${playerId}`
    );

    return Promise.resolve(
      matches.map(
        ({ match_id, name_matches, match_date, match_time, location_id }) => {
          const {
            location_id: id,
            location_name: name,
            longitude,
            latitude,
            address
          } = locations.find(location => location.location_id === location_id);
          if (hasEmbededPlayers & hasEmbededLocation) {
            return {
              id: match_id,
              title: name_matches,
              date: match_date,
              time: match_time,
              players: players
                .filter(player => player["match_id"] === match_id)
                .map(({ name, last_name }) => ({ name, lastName: last_name })),
              location: {
                id,
                name,
                longitude,
                latitude,
                address
              }
            };
          }
          return {
            id: match_id,
            title: name_matches,
            date: match_date,
            time: match_time,
            locationId: location_id
          };
        }
      )
    );
  }
  return pool.query("SELECT * FROM matches").then(({ rows }) => rows);
}
