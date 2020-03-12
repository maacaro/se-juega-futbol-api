require("dotenv").config();
const { user, host, database, password, port } = getDatabaseConectionData();
const secret = process.env.secret;

module.exports = { user, host, database, password, port, secret };

function getDatabaseConectionData() {
  if (process.env.NODE_ENV === "test") {
    return {
      user: process.env.testUser,
      host: process.env.testHost,
      database: process.env.testDatabase,
      password: process.env.testPassword,
      port: process.env.testPort
    };
  }
  return {
    user: process.env.user,
    host: process.env.host,
    database: process.env.database,
    password: process.env.password,
    port: process.env.port
  };
}
