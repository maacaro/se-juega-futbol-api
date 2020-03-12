process.env.NODE_ENV = "test";

const expect = require("chai").expect;
const Pool = require("pg").Pool;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const { registerUSer } = require("./services");

const {
  user,
  host,
  database,
  password,
  port,
  secret
} = require("../../config");

const pool = new Pool({
  user,
  host,
  database,
  password,
  port,
  min: 1,
  max: 1
});

describe("Service registerUser", () => {
  beforeEach(async function() {
    try {
      await pool.query("TRUNCATE TABLE users CASCADE");
      await pool.query("ALTER SEQUENCE users_user_id_seq RESTART WITH 1");
    } catch (error) {
      console.log(error);
    }
  });
  it("should save the user with a hashed password", async () => {
    await registerUSer({
      email: "me@sejuegafutbol.com",
      name: "Manuel",
      lastName: "Castro",
      password: "123",
      confirmPassword: "123"
    });

    const results = await pool.query("SELECT password from users");
    var passwordIsHashed = bcrypt.compareSync("123", results.rows[0].password);

    expect(passwordIsHashed).to.equal(true);
  });
  it("should return a object with a token", async () => {
    const response = await registerUSer({
      email: "me@sejuegafutbol.com",
      name: "Manuel",
      lastName: "Castro",
      password: "123",
      confirmPassword: "123"
    });
    const expectedToken = jwt.sign({ id: 1 }, secret, { expiresIn: 86400 });
    expect(response).to.have.property("token");
  });
});
