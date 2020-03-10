process.env.NODE_ENV = "test";

let chai = require("chai");
let chaiHttp = require("chai-http");
const expect = require("chai").expect;
const Pool = require("pg").Pool;
var jwt = require("jsonwebtoken");
let server = require("../server");

const { user, host, database, password, port, secret } = require("../config");

const pool = new Pool({
  user,
  host,
  database,
  password,
  port,
  min: 1,
  max: 1
});

chai.use(chaiHttp);

describe("/user Post Request", () => {
  afterEach(async function() {
    try {
      await pool.query("TRUNCATE TABLE users CASCADE");
      await pool.query("ALTER SEQUENCE users_user_id_seq RESTART WITH 1");
    } catch (error) {
      console.log(error);
    }
  });

  it("return a 201 status code", async () => {
    const response = await chai
      .request(server)
      .post("/user")
      .send({
        email: "me@sejuegafutbol.com",
        name: "Manuel",
        lastName: "Castro",
        password: "123",
        confirmPassword: "123"
      });
    expect(response).to.have.status(201);
  });
  it("return auth: true and a valid token", async () => {
    const response = await chai
      .request(server)
      .post("/user")
      .send({
        email: "me@sejuegafutbol.com",
        name: "Manuel",
        lastName: "Castro",
        password: "123",
        confirmPassword: "123"
      });
    const expectedToken = jwt.sign({ id: 1 }, secret, { expiresIn: 86400 });
    expect(response.body).to.have.property("auth");
    expect(response.body).to.have.property("token");
    expect(response.body.token).to.equal(expectedToken);
  });
});
