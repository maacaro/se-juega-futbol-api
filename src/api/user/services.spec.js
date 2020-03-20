process.env.NODE_ENV = "test";

const expect = require("chai").expect;
const Pool = require("pg").Pool;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const { registerUSer, login } = require("./services");

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
    expect(response.token).to.equal(expectedToken);
  });
});
describe("SERVICE Login", () => {
  beforeEach(async function() {
    try {
      await pool.query("TRUNCATE TABLE users CASCADE");
      await pool.query("ALTER SEQUENCE users_user_id_seq RESTART WITH 1");
    } catch (error) {
      console.log(error);
    }
  });
  it("return a message of user not found", async () => {
    const email = "me@sejuegafutbol.com";
    const password = "123";

    const serviceResponse = await login({ email, password });

    expect(JSON.stringify(serviceResponse)).to.equal(
      JSON.stringify({
        status: 404,
        message: "User Not Found"
      })
    );
  });
  it("faild auth with no valid password", async () => {
    const email = "me@sejuegafutbol.com";
    const password = "321";
    await registerUSer({
      email,
      name: "Manuel",
      lastName: "Castro",
      password: "123",
      confirmPassword: "123"
    });

    const loginResponse = await login({ email, password });
    expect(JSON.stringify(loginResponse)).to.equal(
      JSON.stringify({ auth: false, token: null })
    );
  });
  it("faild auth with no valid email passsword combination", async () => {
    const email = "me@sejuegafutbol.com";
    const password = "987";
    await registerUSer({
      email,
      name: "Manuel",
      lastName: "Castro",
      password: "123",
      confirmPassword: "123"
    });

    await registerUSer({
      email: "another@sejuegafutbol.com",
      name: "Manuel",
      lastName: "Castro",
      password,
      confirmPassword: password
    });

    const loginResponse = await login({ email, password });
    expect(JSON.stringify(loginResponse)).to.equal(
      JSON.stringify({ auth: false, token: null })
    );
  });
  it("return a valid token a trully auth flag ", async () => {
    const email = "me@sejuegafutbol.com";
    const password = "123";
    await registerUSer({
      email,
      name: "Manuel",
      lastName: "Castro",
      password: "123",
      confirmPassword: "123"
    });

    const loginResponse = await login({ email, password });
    const token = jwt.sign({ id: 1 }, secret, { expiresIn: 86400 });
    expect(loginResponse).to.deep.equal({ auth: true, token });
  });
});
