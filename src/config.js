require("dotenv").config();
const { connectionString } = getDatabaseConectionData();
const secret = process.env.secret;

module.exports = { connectionString, secret };

function getDatabaseConectionData() {
  if (process.env.NODE_ENV === "test") {
    return {
      connectionString: process.env.HEROKU_POSTGRESQL_COPPER_URL
    };
  }
  return {
    connectionString: process.env.DATABASE_URL
  };
}
