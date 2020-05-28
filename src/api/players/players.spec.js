process.env.NODE_ENV = "test";
let chai = require("chai");
let chaiHttp = require("chai-http");
const expect = require("chai").expect;
const Pool = require("pg").Pool;
let server = require("../../server");

const { connectionString } = require("../../config");

const pool = new Pool({
  connectionString: connectionString
});

chai.use(chaiHttp);

describe("GET /api/players", () => {
  before(async () => {
    await chai
      .request(server)
      .post("/api/user")
      .send({
        email: "manuel@sejuegafutbol.com",
        name: "Manuel",
        lastName: "Castro",
        password: "123",
        confirmPassword: "123"
      });
    await chai
      .request(server)
      .post("/api/user")
      .send({
        email: "heberth@sejuegafutbol.com",
        name: "Heberth",
        lastName: "Strube",
        password: "123",
        confirmPassword: "123"
      });
    await chai
      .request(server)
      .post("/api/user")
      .send({
        email: "javier@sejuegafutbol.com",
        name: "Javier",
        lastName: "Malpica",
        password: "123",
        confirmPassword: "123"
      });
  });
  after(async function() {
    try {
      await pool.query("TRUNCATE TABLE users CASCADE");
      await pool.query("ALTER SEQUENCE users_user_id_seq RESTART WITH 1");
    } catch (error) {
      console.log(error);
    }
  });
  it("response with 401 when is no token", async () => {
    const response = await chai.request(server).get("/api/players");

    expect(response).to.have.status(401);
  });
  it("response with auth false  when is no token", async () => {
    const response = await chai.request(server).get("/api/players");

    expect(response.body.auth).to.equal(false);
  });
  it("response with 500 when the token can not be decoded", async () => {
    const response = await chai
      .request(server)
      .get("/api/players")
      .set("x-access-token", "foo");

    expect(response).to.have.status(500);
  });
  it("response with `Failed to authenticate token.` message when the token can not be decoded", async () => {
    const {
      body: { message }
    } = await chai
      .request(server)
      .get("/api/players")
      .set("x-access-token", "foo");
    expect(message).to.equal("Failed to authenticate token.");
  });
  it("response with 200 status and the list of players", async () => {
    const {
      body: { token }
    } = await chai
      .request(server)
      .post("/api/login")
      .send({
        email: "manuel@sejuegafutbol.com",
        name: "Manuel",
        lastName: "Castro",
        password: "123"
      });
    const response = await chai
      .request(server)
      .get("/api/players")
      .set("x-access-token", token);
    const { body } = response;
    expect(response).to.have.status(200);
    expect(body).to.deep.equal({
      players: [
        {
          name: "Manuel Castro",
          id: 1
        },
        {
          name: "Heberth Strube",
          id: 2
        },
        {
          name: "Javier Malpica",
          id: 3
        }
      ]
    });
  });
});
